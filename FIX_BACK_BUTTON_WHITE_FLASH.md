# حل مشكلة الخلفية البيضاء عند الضغط على زر الرجوع

## المشكلة

عند الضغط على زر الرجوع (الزر في الأعلى يمين)، تظهر خلفية بيضاء لفترة قصيرة قبل تحميل الألوان الصحيحة.

## الحلول المطبقة

### 1. CustomBackButton Component

```typescript
// components/CustomBackButton.tsx
export default function CustomBackButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const color = Colors[theme];

  const handleBack = () => {
    // تأخير صغير لضمان تحميل الألوان
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      }
    }, 50);
  };

  return (
    <TouchableOpacity
      onPress={handleBack}
      style={{
        backgroundColor: color.background,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: color.border,
      }}
    >
      <Text style={{ color: color.text, fontFamily: FontFamily.medium }}>
        ← رجوع
      </Text>
    </TouchableOpacity>
  );
}
```

**المميزات:**

- زر مخصص مع خلفية تطابق الـ theme
- تأخير 50ms قبل الرجوع
- تصميم عربي جميل

### 2. تطبيق CustomBackButton على الصفحات

```typescript
// app/_layout.tsx
<Stack.Screen
  name="quran"
  options={{
    title: "القرآن الكريم",
    headerShown: true,
    headerLeft: () => <CustomBackButton />,
  }}
/>
<Stack.Screen
  name="about"
  options={{
    title: "حول التطبيق",
    headerShown: true,
    headerLeft: () => <CustomBackButton />,
  }}
/>
```

### 3. تحسينات Stack Navigation

```typescript
screenOptions={{
  headerStyle: {
    backgroundColor: Colors[theme].background,
  },
  headerTintColor: Colors[theme].text,
  headerTitleStyle: {
    fontFamily: FontFamily.bold,
  },
  contentStyle: {
    backgroundColor: Colors[theme].background,
  },
  animation: "slide_from_right",
  animationDuration: 200,
  gestureEnabled: true,
  gestureDirection: "horizontal",
}}
```

**المميزات:**

- `gestureEnabled`: تفعيل الانتقال بالإيماء
- `gestureDirection`: اتجاه الانتقال أفقياً
- `animationDuration`: مدة انتقال قصيرة

### 4. تحسينات TransitionWrapper

```typescript
// إعادة تعيين الحالة عند تغيير الـ theme
useEffect(() => {
  setIsReady(false);
  const timer = setTimeout(() => {
    setIsReady(true);
  }, 50);

  return () => clearTimeout(timer);
}, [theme]);
```

**المميزات:**

- إعادة تعيين الحالة عند تغيير الـ theme
- تأخير 50ms لضمان تحميل الألوان
- منع ظهور الخلفية البيضاء

### 5. تحسينات Navigation Utils

```typescript
// دالة للعودة مع تحسينات
export const goBack = () => {
  setTimeout(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, 50);
};
```

## النتيجة

✅ **لا يوجد خلفية بيضاء عند الضغط على زر الرجوع**
✅ **زر رجوع مخصص مع تصميم عربي**
✅ **انتقال سلس في كلا الاتجاهين**
✅ **ألوان متسقة مع الـ theme**

## كيفية الاستخدام

### للصفحات الجديدة:

1. **إضافة CustomBackButton**:

```typescript
<Stack.Screen
  name="newPage"
  options={{
    title: "عنوان الصفحة",
    headerShown: true,
    headerLeft: () => <CustomBackButton />,
  }}
/>
```

2. **استخدام TransitionWrapper**:

```typescript
export default function NewPage() {
  return (
    <TransitionWrapper>
      <View style={styles.container}>
        {/* محتوى الصفحة */}
      </View>
    </TransitionWrapper>
  );
}
```

3. **استخدام Navigation Utils**:

```typescript
import { navigateToPage, goBack } from "@/utils/navigationUtils";

// للانتقال
navigateToPage("/newPage");

// للرجوع
goBack();
```

## نصائح إضافية

1. **استخدم CustomBackButton** لجميع الصفحات الجديدة
2. **تأكد من تطبيق TransitionWrapper** على جميع الصفحات
3. **اختبر الانتقال** في كلا الاتجاهين
4. **تحقق من الألوان** في الوضع الليلي والنهاري

## استكشاف الأخطاء

إذا استمر ظهور الخلفية البيضاء:

1. **تحقق من CustomBackButton**: تأكد من أن الزر يستخدم الألوان الصحيحة
2. **زيادة التأخير**: غير `50ms` إلى `100ms` في CustomBackButton
3. **فحص TransitionWrapper**: تأكد من أن التأخير كافي
4. **اختبار الأداء**: تحقق من أن التطبيق لا يعاني من بطء

هذه الحلول تضمن تجربة مستخدم سلسة بدون أي وميض أبيض في كلا الاتجاهين!
