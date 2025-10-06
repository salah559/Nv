let products = [];
let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch('./data/products.json');
        const data = await response.json();
        allProducts = data;
        products = data;
        displayProducts(products);
        populateCategories();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function addProductToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        addToCart(product);
    }
}

function displayProducts(productsToShow = products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name[currentLang]}" loading="lazy">
            <h3>${product.name[currentLang]}</h3>
            <p class="product-description">${product.description[currentLang]}</p>
            <div class="product-price">${product.price} ${translations[currentLang].currency}</div>
            <div class="product-rating">
                ${getStarRating(product.rating || 0)}
                <span class="rating-count">(${product.ratingCount || 0})</span>
            </div>
            <div class="product-actions">
                <button onclick="addProductToCart(${product.id})" class="btn add-to-cart">${translations[currentLang].addToCart}</button>
                <button onclick="showRatingModal(${product.id}, '${product.name[currentLang]}')" class="btn-rate">${translations[currentLang].rateProduct}</button>
            </div>
        </div>
    `).join('');
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

function populateCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (categoryFilter) {
        categoryFilter.innerHTML = `<option value="">${translations[currentLang].allCategories}</option>`;
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const priceRange = document.getElementById('priceFilter')?.value || '';
    
    let filtered = allProducts.filter(product => {
        const matchesSearch = product.name[currentLang].toLowerCase().includes(searchTerm) ||
                            product.description[currentLang].toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        
        let matchesPrice = true;
        if (priceRange) {
            if (priceRange.includes('+')) {
                const minPrice = parseInt(priceRange.replace('+', ''));
                matchesPrice = product.price >= minPrice;
            } else {
                const [min, max] = priceRange.split('-').map(Number);
                matchesPrice = product.price >= min && product.price <= max;
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    displayProducts(filtered);
}


function showRatingModal(productId, productName) {
    document.getElementById('ratingProductId').value = productId;
    document.getElementById('ratingProductName').textContent = productName;
    document.getElementById('ratingModal').style.display = 'block';
}

function hideRatingModal() {
    document.getElementById('ratingModal').style.display = 'none';
    document.getElementById('ratingForm').reset();
}

async function submitRating(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const ratingData = {
        productId: formData.get('productId'),
        rating: formData.get('rating'),
        review: formData.get('review')
    };
    
    alert(translations[currentLang].ratingSuccess || 'تم إرسال تقييمك بنجاح!');
    hideRatingModal();
}

function submitContact(event) {
    event.preventDefault();
    alert(translations[currentLang].messageSent || 'تم إرسال رسالتك بنجاح!');
    event.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const lang = localStorage.getItem('language') || 'ar';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${lang}'`)) {
            btn.classList.add('active');
        }
    });
    
    loadProducts();
});
