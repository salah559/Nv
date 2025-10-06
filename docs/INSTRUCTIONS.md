# 📖 تعليمات النشر على GitHub Pages

## ✅ التحقق من الإعدادات:

### الخطوة 1: رفع المشروع
```bash
git add .
git commit -m "Ready for GitHub Pages"
git push origin main
```

### الخطوة 2: إعداد GitHub Pages
1. اذهب إلى مستودعك على GitHub
2. انقر على **Settings** (الإعدادات)
3. من القائمة الجانبية، انقر على **Pages**
4. تحت **Source**:
   - ✅ Branch: اختر **main** (أو master)
   - ✅ Folder: **اختر `/docs` وليس `/ (root)`** ⚠️ هذا مهم جداً!
5. انقر **Save**

### الخطوة 3: انتظر النشر
- ⏰ سيظهر رابط أخضر في الأعلى بعد 2-5 دقائق
- 🌐 الرابط: `https://YOUR-USERNAME.github.io/REPO-NAME/`

## 🔍 حل المشاكل:

### إذا لم يظهر الموقع:
1. ✅ تأكد من اختيار `/docs` وليس `/ (root)`
2. ✅ تأكد من وجود ملف `index.html` في مجلد `docs/`
3. ✅ انتظر 5 دقائق ثم حدّث الصفحة
4. ✅ امسح الـ cache: Ctrl + Shift + R (Windows) أو Cmd + Shift + R (Mac)

### إذا ظهرت صفحة فارغة:
1. افتح Developer Tools (F12)
2. انظر إلى Console للأخطاء
3. تحقق من علامة تبويب Network

## 🎯 الروابط بعد النشر:

- **الصفحة الرئيسية**: `https://YOUR-USERNAME.github.io/REPO-NAME/`
- **لوحة الإدارة**: `https://YOUR-USERNAME.github.io/REPO-NAME/admin.html`

## 🔐 بيانات لوحة الإدارة:
- **Username**: salah55
- **Password**: salaho55

---

## 📝 ملاحظات:
- ✅ جميع الملفات موجودة في `docs/`
- ✅ المسارات صحيحة ومُحدثة
- ✅ الموقع جاهز 100% للنشر
