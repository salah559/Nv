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
    if (!product) return;
    
    if (product.sizes || product.colors) {
        showSizeColorModal(product);
    } else {
        addToCart(product);
    }
}

function showSizeColorModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'sizeColorModal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content variant-selector">
            <span class="close" onclick="document.getElementById('sizeColorModal').remove()">&times;</span>
            <h2>${product.name[currentLang]}</h2>
            ${product.colors ? `
                <div class="option-group">
                    <label>${translations[currentLang].color || 'اللون'}:</label>
                    <div class="color-options">
                        ${product.colors.map(color => `
                            <button class="color-btn" data-color="${color}" onclick="selectColor('${color}')">
                                ${color}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${product.sizes ? `
                <div class="option-group">
                    <label>${translations[currentLang].size || 'المقاس'}:</label>
                    <div class="size-options">
                        ${product.sizes.map(size => `
                            <button class="size-btn" data-size="${size}" onclick="selectSize('${size}')">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            <button class="btn add-to-cart-btn" onclick="confirmAddToCart(${product.id})">${translations[currentLang].addToCart}</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectColor(color) {
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('selected'));
    const selectedBtn = document.querySelector(`.color-btn[data-color="${color}"]`);
    if (selectedBtn) selectedBtn.classList.add('selected');
}

function selectSize(size) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    const selectedBtn = document.querySelector(`.size-btn[data-size="${size}"]`);
    if (selectedBtn) selectedBtn.classList.add('selected');
}

function confirmAddToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const productToAdd = { ...product };
    
    if (product.colors) {
        const selectedColorBtn = document.querySelector('.color-btn.selected');
        if (!selectedColorBtn) {
            alert(translations[currentLang].selectColorFirst || 'الرجاء اختيار اللون');
            return;
        }
        productToAdd.selectedColor = selectedColorBtn.dataset.color;
    }
    
    if (product.sizes) {
        const selectedSizeBtn = document.querySelector('.size-btn.selected');
        if (!selectedSizeBtn) {
            alert(translations[currentLang].selectSizeFirst || 'الرجاء اختيار المقاس');
            return;
        }
        productToAdd.selectedSize = selectedSizeBtn.dataset.size;
    }
    
    addToCart(productToAdd);
    document.getElementById('sizeColorModal')?.remove();
}

function displayProducts(productsToShow = products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name[currentLang]}" loading="lazy">
            <h3>${product.name[currentLang]}</h3>
            <p class="product-description">${product.description[currentLang]}</p>
            ${product.sizes ? `<div class="product-sizes"><small>${translations[currentLang].sizes || 'المقاسات'}: ${product.sizes.join(', ')}</small></div>` : ''}
            ${product.colors ? `<div class="product-colors"><small>${translations[currentLang].colors || 'الألوان'}: ${product.colors.join(', ')}</small></div>` : ''}
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
