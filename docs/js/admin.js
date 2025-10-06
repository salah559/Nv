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
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const allProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    
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

function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        authToken = 'admin-token-' + Date.now();
        localStorage.setItem('adminToken', authToken);
        showAdmin();
    } else {
        alert('بيانات الدخول غير صحيحة');
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

function loadOrders() {
    orders = JSON.parse(localStorage.getItem('orders') || '[]');
    displayOrders();
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

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        loadDashboard();
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
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
    document.getElementById('productModal').style.display = 'flex';
}

function saveProduct(e) {
    e.preventDefault();
    
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
