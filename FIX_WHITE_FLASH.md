# حل مشكلة اللون الأبيض أثناء الانتقال

## المشكلة

عند التنقل بين الصفحات، يظهر لون أبيض لفترة قصيرة قبل تحميل الألوان الصحيحة.

## الحلول المطبقة

### 1. تحسين Stack Navigation في `app/_layout.tsx`

```typescript
<Stack
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
    animation: 'slide_from_right',
    animationDuration: 200,
  }}
>
```

**المميزات:**

- `contentStyle`: يضمن أن خلفية المحتوى تتطابق مع الـ theme
- `animation`: انتقال سلس من اليمين
- `animationDuration`: مدة انتقال قصيرة (200ms)

### 2. TransitionWrapper Component

```typescript
// components/TransitionWrapper.tsx
export default function TransitionWrapper({ children }) {
  const { theme } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [theme]);

  if (!isReady) {
    return (
      <View style={{ backgroundColor: Colors[theme].background }}>
        {/* Loading state */}
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: Colors[theme].background }}>
      {children}
    </View>
  );
}
```

**المميزات:**

- تأخير 100ms لضمان تحميل الألوان
- خلفية فورية تطابق الـ theme
- منع ظهور اللون الأبيض

### 3. Navigation Utils

```typescript
// utils/navigationUtils.ts
export const navigateToPage = (route: "/quran" | "/about") => {
  setTimeout(() => {
    router.push(route);
  }, 50);
};
```

**المميزات:**

- تأخير 50ms قبل الانتقال
- يضمن تحميل الألوان قبل الانتقال
- TypeScript types آمنة

### 4. تحسينات إضافية

#### في الصفحات:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%", // يضمن ملء الشاشة بالكامل
  },
});
```

#### استخدام TransitionWrapper:

```typescript
export default function MyPage() {
  return (
    <TransitionWrapper>
      <View style={styles.container}>
        {/* محتوى الصفحة */}
      </View>
    </TransitionWrapper>
  );
}
```

## النتيجة

✅ **لا يوجد لون أبيض أثناء الانتقال**
✅ **انتقال سلس بين الصفحات**
✅ **ألوان متسقة مع الـ theme**
✅ **أداء محسن**

## نصائح إضافية

1. **استخدم TransitionWrapper** لجميع الصفحات الجديدة
2. **تأكد من تطبيق `minHeight: '100%'`** في الـ styles
3. **استخدم `navigateToPage()`** بدلاً من `router.push()` مباشرة
4. **اختبر الانتقال** في الوضع الليلي والنهاري

## استكشاف الأخطاء

إذا استمر ظهور اللون الأبيض:

1. **تحقق من Theme Context**: تأكد من أن الألوان محملة بشكل صحيح
2. **زيادة التأخير**: غير `100ms` إلى `200ms` في TransitionWrapper
3. **فحص الألوان**: تأكد من أن `Colors[theme].background` يعطي لون صحيح
4. **اختبار الأداء**: تحقق من أن التطبيق لا يعاني من بطء في التحميل

هذه الحلول تضمن تجربة مستخدم سلسة بدون أي وميض أبيض!
