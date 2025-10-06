let cart = JSON.parse(localStorage.getItem('cart')) || [];
let algeriaData = null;

cart = cart.filter(item => item && item.name && typeof item.name === 'object' && item.price);
if (cart.length !== (JSON.parse(localStorage.getItem('cart')) || []).length) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function loadAlgeriaData() {
    const response = await fetch('./data/algeria-locations.json');
    algeriaData = await response.json();
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    showNotification(t('addToCart') + '!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getDeliveryPrice() {
    const wilayaSelect = document.getElementById('wilaya');
    if (!wilayaSelect || !wilayaSelect.value || !algeriaData) return 0;
    return algeriaData.shippingPrices[wilayaSelect.value] || 500;
}

function updateCartUI() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.setAttribute('data-count', cart.reduce((sum, item) => sum + item.quantity, 0));
    }
    
    const cartModal = document.getElementById('cartModal');
    if (cartModal && cartModal.style.display === 'flex') {
        showCart();
    }
}

function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const deliveryPriceEl = document.getElementById('deliveryPrice');
    const grandTotalEl = document.getElementById('grandTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">${t('emptyCart')}</p>`;
        cartTotal.textContent = '0';
        if (deliveryPriceEl) deliveryPriceEl.textContent = '0';
        if (grandTotalEl) grandTotalEl.textContent = '0';
    } else {
        const total = getCartTotal();
        const delivery = getDeliveryPrice();
        
        cartItems.innerHTML = cart.map(item => {
            const itemName = item.name && typeof item.name === 'object' ? item.name[currentLang] : (item.name || 'منتج');
            return `
            <div class="cart-item">
                <img src="${item.image || ''}" alt="${itemName}">
                <div class="cart-item-details">
                    <h4>${itemName}</h4>
                    <p>${item.price} ${t('currency')}</p>
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">${t('remove')}</button>
            </div>
        `}).join('');
        
        cartTotal.textContent = total;
        if (deliveryPriceEl) deliveryPriceEl.textContent = delivery;
        if (grandTotalEl) grandTotalEl.textContent = total + delivery;
    }
    
    modal.style.display = 'flex';
}

function hideCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function showCheckout() {
    hideCart();
    document.getElementById('checkoutModal').style.display = 'flex';
    populateWilayaSelect();
}

function hideCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function populateWilayaSelect() {
    const select = document.getElementById('wilaya');
    if (!algeriaData || !select) return;
    
    select.innerHTML = `<option value="">${t('selectWilaya')}</option>` + 
        algeriaData.wilayas.map(w => 
            `<option value="${w.code}">${w[currentLang === 'en' ? 'name' : currentLang + '_name']}</option>`
        ).join('');
    
    select.addEventListener('change', updateCheckoutSummary);
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const total = getCartTotal();
    const delivery = getDeliveryPrice();
    const grandTotal = total + delivery;
    
    const checkoutTotal = document.getElementById('checkoutTotal');
    const checkoutDelivery = document.getElementById('checkoutDelivery');
    const checkoutGrandTotal = document.getElementById('checkoutGrandTotal');
    
    if (checkoutTotal) checkoutTotal.textContent = total;
    if (checkoutDelivery) checkoutDelivery.textContent = delivery;
    if (checkoutGrandTotal) checkoutGrandTotal.textContent = grandTotal;
}

async function submitOrder(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            wilaya: formData.get('wilaya'),
            address: formData.get('address')
        },
        items: cart,
        total: getCartTotal(),
        deliveryPrice: getDeliveryPrice(),
        grandTotal: getCartTotal() + getDeliveryPrice()
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            cart = [];
            saveCart();
            updateCartUI();
            hideCheckout();
            showNotification(t('orderSuccess'), 'success');
            e.target.reset();
        }
    } catch (error) {
        showNotification('Error submitting order', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

loadAlgeriaData();
