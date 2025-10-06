const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const productValidation = [
    body('name.ar').trim().notEmpty().withMessage('الاسم بالعربية مطلوب'),
    body('name.fr').trim().notEmpty().withMessage('الاسم بالفرنسية مطلوب'),
    body('name.en').trim().notEmpty().withMessage('الاسم بالإنجليزية مطلوب'),
    body('description.ar').trim().notEmpty().withMessage('الوصف بالعربية مطلوب'),
    body('description.fr').trim().notEmpty().withMessage('الوصف بالفرنسية مطلوب'),
    body('description.en').trim().notEmpty().withMessage('الوصف بالإنجليزية مطلوب'),
    body('price').isInt({ min: 1 }).withMessage('السعر يجب أن يكون رقم موجب'),
    body('image').trim().notEmpty().withMessage('رابط الصورة مطلوب'),
    body('category').trim().notEmpty().withMessage('الفئة مطلوبة'),
    handleValidationErrors
];

const orderValidation = [
    body('customer.name').trim().notEmpty().withMessage('اسم العميل مطلوب'),
    body('customer.phone').trim().notEmpty().withMessage('رقم الهاتف مطلوب'),
    body('customer.email').optional().trim().isEmail().withMessage('البريد الإلكتروني غير صحيح'),
    body('customer.wilaya').trim().notEmpty().withMessage('الولاية مطلوبة'),
    body('customer.address').trim().notEmpty().withMessage('العنوان مطلوب'),
    body('items').isArray({ min: 1 }).withMessage('يجب أن يحتوي الطلب على منتج واحد على الأقل'),
    body('total').isInt({ min: 1 }).withMessage('المجموع غير صحيح'),
    body('deliveryPrice').isInt({ min: 0 }).withMessage('سعر التوصيل غير صحيح'),
    body('grandTotal').isInt({ min: 1 }).withMessage('المجموع الكلي غير صحيح'),
    handleValidationErrors
];

const loginValidation = [
    body('username').trim().notEmpty().withMessage('اسم المستخدم مطلوب'),
    body('password').trim().notEmpty().withMessage('كلمة المرور مطلوبة'),
    handleValidationErrors
];

const orderStatusValidation = [
    body('status').isIn(['pending', 'confirmed', 'delivered']).withMessage('حالة الطلب غير صحيحة'),
    handleValidationErrors
];

module.exports = {
    productValidation,
    orderValidation,
    loginValidation,
    orderStatusValidation
};
