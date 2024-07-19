// payment.js

document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    const messageElement = document.getElementById('message');

    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(paymentForm);

        // Send a POST request to the server
        fetch('/api/process-payment', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle server response
            if (data.success) {
                // Show success message or redirect to success page
                messageElement.textContent = 'Payment successful!';
                // Example: Redirect to success page after a delay
                setTimeout(() => {
                    window.location.href = '/success';
                }, 2000); // 2 seconds delay
            } else {
                // Handle errors or display appropriate message
                messageElement.textContent = 'Payment failed. Please try again.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageElement.textContent = 'Error processing payment. Please try again later.';
        });
    });
});
