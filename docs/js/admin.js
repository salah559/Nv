let authToken = localStorage.getItem('adminToken');
let products = [];
let orders = [];

const ADMIN_CREDENTIALS = {
    username: 'salah55',
    password: 'salaho55'
};

if (authToken) {
    showAdmin();
} else {
    showLogin();
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadDashboard();
    loadProducts();
    loadOrders();
}

function loadDashboard() {
    const stats = calculateStats();
    displayDashboard(stats);
}

function calculateStats() {
    const allOrders = orders || [];
    const allProducts = products || [];
    
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    
    const ordersByStatus = {
        pending: allOrders.filter(o => o.status === 'pending').length,
        confirmed: allOrders.filter(o => o.status === 'confirmed').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length
    };
    
    const recentOrders = allOrders.slice(-5).reverse();
    
    const productSales = {};
    allOrders.forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.id]) {
                productSales[item.id] = { ...item, orderCount: 0 };
            }
            productSales[item.id].orderCount += item.quantity;
        });
    });
    
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 5);
    
    return {
        totalProducts: allProducts.length,
        totalOrders: allOrders.length,
        totalRevenue,
        ordersByStatus,
        recentOrders,
        topProducts
    };
}

function displayDashboard(stats) {
    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('totalOrders').textContent = stats.totalOrders;
    document.getElementById('totalRevenue').textContent = stats.totalRevenue.toLocaleString() + ' دج';
    document.getElementById('pendingOrders').textContent = stats.ordersByStatus.pending;
    
    document.getElementById('statusPending').textContent = stats.ordersByStatus.pending;
    document.getElementById('statusConfirmed').textContent = stats.ordersByStatus.confirmed;
    document.getElementById('statusDelivered').textContent = stats.ordersByStatus.delivered;
    
    const recentOrdersHTML = stats.recentOrders.map(order => `
        <div class="recent-order-item">
            <span>طلب #${order.id}</span>
            <span>${order.customer.name}</span>
            <span class="status-${order.status}">${getStatusText(order.status)}</span>
            <span>${order.grandTotal} دج</span>
        </div>
    `).join('');
    document.getElementById('recentOrders').innerHTML = recentOrdersHTML || '<p>لا توجد طلبات</p>';
    
    const topProductsHTML = stats.topProducts.filter(p => p.orderCount > 0).map(product => `
        <div class="top-product-item">
            <img src="${product.image}" alt="${product.name.ar}">
            <div>
                <h4>${product.name.ar}</h4>
                <p>${product.orderCount} طلب</p>
            </div>
        </div>
    `).join('');
    document.getElementById('topProducts').innerHTML = topProductsHTML || '<p>لا توجد مبيعات بعد</p>';
}

async function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    try {
        const response = await fetch(getApiUrl('/api/admin/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            alert(error.error || 'بيانات الدخول غير صحيحة');
            return;
        }
        
        const data = await response.json();
        authToken = data.token;
        localStorage.setItem('adminToken', authToken);
        showAdmin();
    } catch (err) {
        console.error('خطأ في تسجيل الدخول:', err);
        alert('حدث خطأ في الاتصال بالخادم');
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    showLogin();
}

function loadProducts() {
    const storedProducts = localStorage.getItem('adminProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        fetch('./data/products.json')
            .then(res => res.json())
            .then(data => {
                products = data;
                localStorage.setItem('adminProducts', JSON.stringify(products));
                displayProducts();
            })
            .catch(err => {
                console.error('Error loading products:', err);
                products = [];
                displayProducts();
            });
        return;
    }
    displayProducts();
}

function displayProducts() {
    const list = document.getElementById('productsList');
    list.innerHTML = products.map(p => `
        <div class="product-item">
            <img src="${p.image}" alt="${p.name.ar}">
            <h3>${p.name.ar}</h3>
            <p>${p.description.ar}</p>
            <p class="price">${p.price} دج</p>
            <div class="actions">
                <button class="edit-btn" onclick="editProduct(${p.id})">تعديل</button>
                <button class="delete-btn" onclick="deleteProduct(${p.id})">حذف</button>
            </div>
        </div>
    `).join('');
}

async function loadOrders() {
    if (!authToken) {
        orders = [];
        displayOrders();
        return;
    }
    
    try {
        const response = await fetch(getApiUrl('/api/orders'), {
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }
        
        if (!response.ok) {
            throw new Error('فشل تحميل الطلبات');
        }
        
        orders = await response.json();
        displayOrders();
    } catch (err) {
        console.error('خطأ في تحميل الطلبات:', err);
        orders = [];
        displayOrders();
    }
}

function displayOrders() {
    const list = document.getElementById('ordersList');
    list.innerHTML = orders.map(o => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">طلب #${o.id}</span>
                <span class="order-status status-${o.status}">${getStatusText(o.status)}</span>
            </div>
            <div class="order-customer">
                <p><strong>العميل:</strong> ${o.customer.name}</p>
                <p><strong>الهاتف:</strong> ${o.customer.phone}</p>
                <p><strong>الولاية:</strong> ${o.customer.wilaya}</p>
                <p><strong>العنوان:</strong> ${o.customer.address}</p>
            </div>
            <div class="order-items">
                <strong>المنتجات:</strong>
                ${o.items.map(item => `
                    <div class="order-item-row">
                        <span>${item.name.ar} × ${item.quantity}</span>
                        <span>${item.price * item.quantity} دج</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                المجموع الكلي: ${o.grandTotal} دج
            </div>
            <div class="actions" style="margin-top: 15px;">
                <select onchange="updateOrderStatus(${o.id}, this.value)" style="padding: 10px; border-radius: 8px;">
                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                    <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>مؤكد</option>
                    <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>تم التوصيل</option>
                </select>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'confirmed': 'مؤكد',
        'delivered': 'تم التوصيل'
    };
    return statusMap[status] || status;
}

async function updateOrderStatus(orderId, newStatus) {
    if (!authToken) {
        alert('يجب تسجيل الدخول أولاً');
        return;
    }
    
    try {
        const response = await fetch(getApiUrl(`/api/orders/${orderId}`), {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }
        
        if (!response.ok) {
            throw new Error('فشل تحديث حالة الطلب');
        }
        
        await loadOrders();
        await loadDashboard();
    } catch (err) {
        console.error('خطأ في تحديث حالة الطلب:', err);
        alert('حدث خطأ في تحديث حالة الطلب');
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'delivery') {
        loadDeliveryPrices();
    }
}

function showAddProduct() {
    document.getElementById('productModalTitle').textContent = 'إضافة منتج جديد';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').style.display = 'flex';
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('productModalTitle').textContent = 'تعديل المنتج';
    document.getElementById('productId').value = product.id;
    document.getElementById('nameAr').value = product.name.ar;
    document.getElementById('nameFr').value = product.name.fr;
    document.getElementById('nameEn').value = product.name.en;
    document.getElementById('descAr').value = product.description.ar;
    document.getElementById('descFr').value = product.description.fr;
    document.getElementById('descEn').value = product.description.en;
    document.getElementById('price').value = product.price;
    document.getElementById('image').value = product.image;
    document.getElementById('category').value = product.category;
    document.getElementById('sizes').value = product.sizes ? product.sizes.join(', ') : '';
    document.getElementById('colors').value = product.colors ? product.colors.join(', ') : '';
    document.getElementById('productModal').style.display = 'flex';
}

function saveProduct(e) {
    e.preventDefault();
    
    const sizesInput = document.getElementById('sizes').value.trim();
    const colorsInput = document.getElementById('colors').value.trim();
    
    const productData = {
        name: {
            ar: document.getElementById('nameAr').value,
            fr: document.getElementById('nameFr').value,
            en: document.getElementById('nameEn').value
        },
        description: {
            ar: document.getElementById('descAr').value,
            fr: document.getElementById('descFr').value,
            en: document.getElementById('descEn').value
        },
        price: parseInt(document.getElementById('price').value),
        image: document.getElementById('image').value,
        category: document.getElementById('category').value
    };
    
    if (sizesInput) {
        productData.sizes = sizesInput.split(',').map(s => s.trim()).filter(s => s);
    }
    if (colorsInput) {
        productData.colors = colorsInput.split(',').map(c => c.trim()).filter(c => c);
    }
    
    const productId = document.getElementById('productId').value;
    
    if (productId) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...productData });
    }
    
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    fetch('./data/products.json')
        .then(res => res.json())
        .then(originalProducts => {
            const publicProducts = [...originalProducts];
            if (productId) {
                const index = publicProducts.findIndex(p => p.id === parseInt(productId));
                if (index !== -1) {
                    publicProducts[index] = { ...publicProducts[index], ...productData };
                }
            } else {
                const newId = publicProducts.length > 0 ? Math.max(...publicProducts.map(p => p.id)) + 1 : 1;
                publicProducts.push({ id: newId, ...productData });
            }
        });
    
    closeProductModal();
    loadProducts();
    loadDashboard();
    alert('تم حفظ المنتج بنجاح! ملاحظة: التعديلات محفوظة في المتصفح فقط');
}

function deleteProduct(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    products = products.filter(p => p.id !== id);
    localStorage.setItem('adminProducts', JSON.stringify(products));
    loadProducts();
    loadDashboard();
    alert('تم حذف المنتج! ملاحظة: التعديلات محفوظة في المتصفح فقط');
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function loadDeliveryPrices() {
    fetch('./data/algeria-locations.json')
        .then(res => res.json())
        .then(data => {
            displayDeliveryPrices(data);
        })
        .catch(err => {
            console.error('Error loading delivery prices:', err);
            document.getElementById('deliveryPricesList').innerHTML = '<p>حدث خطأ في تحميل البيانات</p>';
        });
}

function displayDeliveryPrices(data) {
    const list = document.getElementById('deliveryPricesList');
    const deliveryPrices = JSON.parse(localStorage.getItem('deliveryPrices') || '{}');
    const wilayas = data.wilayas || [];
    const defaultPrices = data.shippingPrices || {};
    
    list.innerHTML = `
        <div class="delivery-prices-grid">
            ${wilayas.map(loc => {
                const currentPrice = deliveryPrices[loc.code] || defaultPrices[loc.code] || 500;
                return `
                    <div class="delivery-item">
                        <div class="wilaya-info">
                            <strong>${loc.code} - ${loc.ar_name}</strong>
                        </div>
                        <div class="price-edit">
                            <input type="number" 
                                   id="delivery-${loc.code}" 
                                   value="${currentPrice}" 
                                   min="0" 
                                   step="50"
                                   onchange="updateDeliveryPrice('${loc.code}', this.value)"
                                   style="padding: 8px; border-radius: 5px; border: 1px solid #ddd; width: 120px;">
                            <span>دج</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px;">
            <p><strong>ملاحظة:</strong> التعديلات تُحفظ تلقائياً في المتصفح</p>
        </div>
    `;
}

function updateDeliveryPrice(wilayaCode, price) {
    const deliveryPrices = JSON.parse(localStorage.getItem('deliveryPrices') || '{}');
    deliveryPrices[wilayaCode] = parseInt(price);
    localStorage.setItem('deliveryPrices', JSON.stringify(deliveryPrices));
}
