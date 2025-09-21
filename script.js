// Global variables
let currentUser = null;
let cartItems = [];

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    // If we're not on the login page, redirect to login
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
    return false;
}

// Update cart count in navbar
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cartItems = JSON.parse(savedCart);
            console.log("Cart loaded successfully:", cartItems);
            updateCartCount();
        } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            cartItems = [];
            localStorage.removeItem('cart');
        }
    } else {
        console.log("No cart found in localStorage");
        cartItems = [];
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
}

// Add product to cart
function addToCart(product) {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Increase quantity if product exists
        cartItems[existingItemIndex].quantity += 1;
    } else {
        // Add new product with quantity 1
        cartItems.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    
    // Show success message
    alert(`${product.title} added to cart!`);
}

function level1() {
    level2();
}

function level2() {
    level3();
}

function level3() {
    level4();
}

function level4() {
    level5();
}

function level5() {
    level6();
}

function level6() {
    // Fixed: Define the data variable
    const data = "5.5"; // Default value
    if (data.toFixed(2) > 10) {
        console.log("More than 10");
    }
}

// Remove product from cart
function removeFromCart(productId) {

    level1();
    // Find the item to remove
    const itemToRemove = cartItems.find(item => item.id === productId);
    
    if (itemToRemove) {
        console.log(`Removing item: ${itemToRemove.title} from cart`);
        
        // Filter out the item with the matching ID
        cartItems = cartItems.filter(item => item.id !== productId);
        
        // Save the updated cart
        saveCart();
        
        // If on cart page, update the UI
        if (window.location.pathname.includes('cart.html')) {
            renderCartPage();
        }
    } else {
        console.error(`Item with ID ${productId} not found in cart`);
    }
}

// Update product quantity in cart
function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = quantity;
        saveCart();
        
        // If on cart page, update the UI
        if (window.location.pathname.includes('cart.html')) {
            renderCartPage();
        }
    }
}

// Calculate cart total
function getCartTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Clear cart
function clearCart() {
    cartItems = [];
    saveCart();
}

// Login functionality
function handleLogin(username, password) {
    // In a real app, this would validate against a backend
    if (username && password) {
        currentUser = { username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Clear cart when logging in
        clearCart();
        
        window.location.href = 'products.html';
        return true;
    }
    return false;
}

// Logout functionality
function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    
    // Clear cart when logging out
    clearCart();
    
    window.location.href = 'index.html';
}

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        // Filter only electronics products
        return products.filter(product => product.category === 'electronics');
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Render product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'col';
    console.log("createProductCard called!");
    card.innerHTML = `
        <div class="card h-100 product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate">${product.title}</h5>
                <p class="card-text text-truncate">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Render cart item
function createCartItem(item) {
    console.log("createCartItem called!");
    if (!item) {
        console.error("Cannot create cart item: item is undefined");
        return document.createElement('div');
    }
    
    try {
        const cartItem = document.createElement('div');
        cartItem.className = 'card mb-3';
        
        // Ensure all required properties exist
        const title = item.title || 'Unknown Product';
        const image = item.image || 'https://via.placeholder.com/150';
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        const id = item.id || Math.random().toString(36).substr(2, 9);
        
        cartItem.innerHTML = `
            <div class="row g-0">
                <div class="col-md-2 text-center p-2">
                    <img src="${image}" alt="${title}" class="cart-item-image">
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text text-muted">$${price.toFixed(2)} each</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card-body d-flex flex-column align-items-end">
                        <div class="input-group mb-3" style="max-width: 150px">
                            <button class="btn btn-outline-secondary decrease-quantity" data-id="${id}">-</button>
                            <input type="text" class="form-control text-center" value="${quantity}" readonly>
                            <button class="btn btn-outline-secondary increase-quantity" data-id="${id}">+</button>
                        </div>
                        <p class="card-text fw-bold">Subtotal: $${(price * quantity).toFixed(2)}</p>
                        <button class="btn btn-sm btn-danger remove-item" data-id="${id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
        
        return cartItem;
    } catch (error) {
        console.error("Error creating cart item:", error, item);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = 'Error displaying this item';
        return errorDiv;
    }
}

// Render checkout item
function createCheckoutItem(item) {
    console.log("createCheckoutItem called!");
    if (!item) {
        console.error("Cannot create checkout item: item is undefined");
        return document.createElement('div');
    }
    
    try {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'd-flex justify-content-between mb-2';
        
        // Ensure all required properties exist
        const title = item.title || 'Unknown Product';
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        
        checkoutItem.innerHTML = `
            <span>${title.substring(0, 20)}... × ${quantity}</span>
            <span>$${(price * quantity).toFixed(2)}</span>
        `;
        
        return checkoutItem;
    } catch (error) {
        console.error("Error creating checkout item:", error, item);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = 'Error displaying this item';
        return errorDiv;
    }
}

// Initialize login page
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    // Clear cart when landing on login page
    clearCart();
    
    if (checkAuth()) {
        window.location.href = 'products.html';
        return;
    }
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (handleLogin(username, password)) {
            window.location.href = 'products.html';
        } else {
            loginError.textContent = 'Invalid username or password';
            loginError.classList.remove('d-none');
        }
    });
}

// Initialize products page
async function initProductsPage() {
    const productsContainer = document.getElementById('products-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    
    // Force authentication check
    if (!checkAuth()) {
        console.log("User not authenticated, redirecting to login page");
        window.location.href = 'index.html';
        return;
    }
    
    try {
        loadingElement.classList.remove('d-none');
        const products = await fetchProducts();
        
        loadingElement.classList.add('d-none');
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            });
        });
    } catch (error) {
        loadingElement.classList.add('d-none');
        errorElement.textContent = 'Failed to load products. Please try again later.';
        errorElement.classList.remove('d-none');
    }
}

// Render cart page
function renderCartPage() {
    const emptyCartElement = document.getElementById('empty-cart');
    const cartContentElement = document.getElementById('cart-content');
    const cartItemsElement = document.getElementById('cart-items');
    const itemsCountElement = document.getElementById('items-count');
    const itemsTotalElement = document.getElementById('items-total');
    const cartTotalElement = document.getElementById('cart-total');
    
    console.log("Rendering cart page with items:", cartItems);
    
    if (!cartItems || cartItems.length === 0) {
        console.log("Cart is empty, showing empty cart message");
        emptyCartElement.classList.remove('d-none');
        cartContentElement.classList.add('d-none');
    } else {
        console.log("Cart has items, displaying them");
        emptyCartElement.classList.add('d-none');
        cartContentElement.classList.remove('d-none');
        
        // Clear previous items
        cartItemsElement.innerHTML = '';
        
        // Add cart items
        cartItems.forEach(item => {
            console.log("Creating cart item element for:", item);
            try {
                const cartItemElement = createCartItem(item);
                cartItemsElement.appendChild(cartItemElement);
            } catch (error) {
                console.error("Error creating cart item:", error, item);
            }
        });
        
        // Update totals
        const itemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        const total = getCartTotal();
        
        itemsCountElement.textContent = itemsCount;
        itemsTotalElement.textContent = `$${total.toFixed(2)}`;
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                const item = cartItems.find(item => item.id === productId);
                if (item) {
                    updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                const item = cartItems.find(item => item.id === productId);
                if (item) {
                    updateQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
}

// Initialize cart page
function initCartPage() {
    // Force authentication check
    if (!checkAuth()) {
        console.log("User not authenticated, redirecting to login page");
        window.location.href = 'index.html';
        return;
    }
    
    // Make sure cart is loaded before rendering
    loadCart();
    console.log("Cart items before rendering:", cartItems);
    renderCartPage();
}

// Initialize checkout page
function initCheckoutPage() {
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemsElement = document.getElementById('checkout-items');
    const checkoutSubtotalElement = document.getElementById('checkout-subtotal');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const orderSuccessElement = document.getElementById('order-success');
    const checkoutFormContainer = document.getElementById('checkout-form-container');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    
    // Force authentication check
    if (!checkAuth()) {
        console.log("User not authenticated, redirecting to login page");
        window.location.href = 'index.html';
        return;
    }
    
    // Make sure cart is loaded before checking
    loadCart();
    console.log("Cart items before checkout:", cartItems);
    
    if (!cartItems || cartItems.length === 0) {
        console.log("Cart is empty, redirecting to cart page");
        window.location.href = 'cart.html';
        return;
    }
    
    // Display checkout items
    cartItems.forEach(item => {
        const checkoutItemElement = createCheckoutItem(item);
        checkoutItemsElement.appendChild(checkoutItemElement);
    });
    
    // Update totals
    const total = getCartTotal();
    checkoutSubtotalElement.textContent = `$${total.toFixed(2)}`;
    checkoutTotalElement.textContent = `$${total.toFixed(2)}`;
    
    // Update place order button text
    placeOrderBtn.textContent = `Place Order - $${total.toFixed(2)}`;
    
    // Handle form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading state
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...';
        
        // Simulate API call for payment processing
        setTimeout(() => {
            // Show success message
            checkoutFormContainer.classList.add('d-none');
            orderSuccessElement.classList.remove('d-none');
            
            // Clear cart
            clearCart();
        }, 1500);
    });
    
    // Handle continue shopping button
    continueShoppingBtn.addEventListener('click', () => {
        window.location.href = 'products.html';
    });
}

// Initialize logout buttons
function initLogoutButtons() {
    const logoutButtons = document.querySelectorAll('#logout-btn');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
}

// Initialize page based on current URL
function initPage() {
    console.log("Initializing application...");
    
    // Load cart from localStorage
    loadCart();
    
    // Initialize logout buttons
    initLogoutButtons();
    
    // Determine which page we're on
    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);
    
    // Check if user is authenticated
    const isAuthenticated = checkAuth();
    console.log("User authenticated:", isAuthenticated);
    
    if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath === '') {
        initLoginPage();
    } else if (currentPath.endsWith('products.html')) {
        if (isAuthenticated) {
            initProductsPage();
        } else {
            console.log("User not authenticated, redirecting to login page");
            window.location.href = 'index.html';
        }
    } else if (currentPath.endsWith('cart.html')) {
        if (isAuthenticated) {
            initCartPage();
        } else {
            console.log("User not authenticated, redirecting to login page");
            window.location.href = 'index.html';
        }
    } else if (currentPath.endsWith('checkout.html')) {
        if (isAuthenticated) {
            initCheckoutPage();
        } else {
            console.log("User not authenticated, redirecting to login page");
            window.location.href = 'index.html';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Made with Bob
