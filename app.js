const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const queryString = require('querystring');

// Dummy data
const insurancePlans = [
    { id: 1, name: 'Single Coverage', price: 100 },
    { id: 2, name: 'Family Coverage (2 Adults + 2 Children)', price: 200 },
    { id: 3, name: 'Parental Coverage', price: 150 },
    { id: 4, name: 'Additional Coverage (Top-up)', price: 50 }
];

const checkupPlans = [
    { id: 1, name: 'Basic Health Check-up', price: 50 },
    { id: 2, name: 'Standard Health Check-up', price: 100 },
    { id: 3, name: 'Comprehensive Health Check-up', price: 150 },
    { id: 4, name: 'Advanced Health Check-up', price: 200 }
];

const drinks = [
    { id: 1, name: 'Green Tea', price: 10, description: 'Healthy and refreshing green tea.' },
    { id: 2, name: 'Protein Shake', price: 20, description: 'Nutrient-rich protein shake.' },
    { id: 3, name: 'Fruit Smoothie', price: 15, description: 'Delicious and healthy fruit smoothie.' },
    { id: 4, name: 'Herbal Drink', price: 12, description: 'Natural and healthy herbal drink.' }
];

let cart = [];

// Helper function to render HTML templates
function renderHtml(res, templatePath) {
    fs.readFile(templatePath, 'utf8', (err, template) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(template);
    });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/') {
        renderHtml(res, path.join(__dirname, 'public', 'index.html'));
    } else if (url.pathname === '/insurance') {
        renderHtml(res, path.join(__dirname, 'public', 'insurance.html'));
    } else if (url.pathname === '/health-checkups') {
        renderHtml(res, path.join(__dirname, 'public', 'health-checkup.html'));
    } else if (url.pathname === '/health-drinks') {
        renderHtml(res, path.join(__dirname, 'public', 'health-drinks.html'));
    } else if (url.pathname === '/cart') {
        renderHtml(res, path.join(__dirname, 'public', 'cart.html'));
    } else if (url.pathname === '/payment') {
        renderHtml(res, path.join(__dirname, 'public', 'payment.html'));
    } else if (url.pathname === '/success') {
        renderHtml(res, path.join(__dirname, 'public', 'success.html'));
    } else if (url.pathname.startsWith('/api/')) {
        handleApiRequests(req, res, url);
    } else if (url.pathname.startsWith('/css/')) {
        serveStaticFile(res, path.join(__dirname, 'public', url.pathname), 'text/css');
    } else if (url.pathname.startsWith('/images/')) {
        serveStaticFile(res, path.join(__dirname, 'public', url.pathname), 'image/x-icon');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
    }
});

// Helper function to serve static files
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
}

// Helper function to handle API requests
function handleApiRequests(req, res, url) {
    // Handling the '/api/insurance-plans' endpoint
    if (url.pathname === '/api/insurance-plans') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(insurancePlans));
    } 
    // Handling the '/api/health-checkups' endpoint
    else if (url.pathname === '/api/health-checkups') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(checkupPlans));
    } 
    // Handling the '/api/health-drinks' endpoint
    else if (url.pathname === '/api/health-drinks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(drinks));
    } 
    // Handling the '/api/cart' endpoint
    else if (url.pathname === '/api/cart') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cart));
    } 
    // Handling the '/api/add-to-cart' endpoint
    else if (url.pathname === '/api/add-to-cart' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const formData = queryString.parse(body);
            cart.push({
                id: formData.id,
                name: formData.name,
                price: formData.price
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item added to cart' }));
        });
    } 
    // Handling the '/api/process-payment' endpoint
    else if (url.pathname === '/api/process-payment' && req.method === 'POST') {
        // Simulate payment processing
        setTimeout(() => {
            cart = [];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Payment successful' }));
        }, 2000);
    } 
    else if (url.pathname === '/api/remove-from-cart' && req.method === 'DELETE') {
        const { id } = queryString.parse(url.search);
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item removed from cart' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Item not found in cart' }));
        }
    }
    // Default case for unknown API endpoints
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
