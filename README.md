# Web Application

This is a web application with four pages:
- Login page
- Product details page (fetches electronics products from Fake Store API)
- Cart page
- Checkout page

The application includes an intentional crash when removing items from the cart and has Instana monitoring integrated.

## Features

- User authentication (simplified for demo)
- Product listing with API integration
- Shopping cart functionality
- Checkout process
- Instana monitoring
- CORS headers for cross-origin requests

## Running the Application

### Using the Node.js Server (Recommended)

1. Make sure you have Node.js installed
2. Navigate to the project directory:
   ```
   cd /Users/bincydaniel/Desktop/bob_web_app/WebApp
   ```
3. Start the server:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```
4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

### Opening Files Directly

Alternatively, you can open the HTML files directly in your browser:
```
open /Users/bincydaniel/Desktop/bob_web_app/WebApp/index.html
```

Note: When opening files directly, CORS headers won't be applied, which might affect API calls and external resources.

## Testing the Crash

1. Log in with any username and password
2. Browse products and add some to your cart
3. Go to the cart page
4. Click the "Remove" button for any product
5. The application will crash with a JavaScript error and attempt to close the browser window
6. Check the browser console to see the error stack trace

## Monitoring

The application is integrated with Instana monitoring. You can view the monitoring data in the Instana dashboard.