# كيفية إضافة صفحات جديدة في التطبيق

## الطرق المختلفة لإضافة صفحات جديدة

### 1. صفحات خارج Navigation Tabs (Stack Navigation)

هذه هي الطريقة المستخدمة لإضافة صفحات مثل صفحة القرآن الكريم وصفحة حول التطبيق.

#### الخطوات:

1. **إنشاء ملف الصفحة في مجلد `app/`**

   ```typescript
   // app/newPage.tsx
   import React from 'react';
   import { View, Text } from 'react-native';
   import { useTheme } from '@/context/ThemeContext';
   import { Colors } from '@/constants/Colors';
   import { FontFamily } from '@/constants/FontFamily';

   export default function NewPage() {
     const { theme } = useTheme();
     const color = Colors[theme];

     return (
       <View style={{ flex: 1, backgroundColor: color.background }}>
         <Text style={{ color: color.text, fontFamily: FontFamily.bold }}>
           صفحة جديدة
         </Text>
       </View>
     );
   }
   ```

2. **إضافة الصفحة إلى Stack في `app/_layout.tsx`**

   ```typescript
   <Stack.Screen
     name="newPage"
     options={{
       title: "عنوان الصفحة",
       headerShown: true,
       headerStyle: {
         backgroundColor: Colors[theme].background,
       },
       headerTintColor: Colors[theme].text,
       headerTitleStyle: {
         fontFamily: FontFamily.bold,
       }
     }}
   />
   ```

3. **الانتقال إلى الصفحة**

   ```typescript
   import { useRouter } from "expo-router";

   const router = useRouter();

   // الانتقال إلى الصفحة
   router.push("/newPage");
   ```

### 2. صفحات داخل Navigation Tabs

لإضافة tab جديد إلى navigation:

1. **إنشاء ملف الصفحة في مجلد `app/(tabs)/`**
2. **إضافة Tab.Screen في `app/(tabs)/_layout.tsx`**

### 3. صفحات مع مجلدات فرعية

يمكن إنشاء صفحات في مجلدات فرعية:

```
app/
  features/
    quran/
      index.tsx      // /features/quran
      chapters/
        index.tsx    // /features/quran/chapters
        [id].tsx     // /features/quran/chapters/123
```

## أمثلة من التطبيق الحالي

### صفحة القرآن الكريم (`app/quran.tsx`)

- صفحة بسيطة مع عنوان ونص
- تستخدم theme context للألوان
- لها header مخصص

### صفحة حول التطبيق (`app/about.tsx`)

- صفحة مع ScrollView للمحتوى الطويل
- قائمة مميزات
- تصميم متجاوب

### الانتقال من الصفحات

- من الصفحة الرئيسية: زر القرآن الكريم
- من صفحة الإعدادات: زر حول التطبيق

## نصائح مهمة

1. **استخدم Theme Context**: دائماً استخدم `useTheme()` للحصول على الألوان المناسبة
2. **استخدم FontFamily**: استخدم الخطوط العربية المخصصة
3. **Header Options**: يمكن تخصيص header لكل صفحة
4. **Navigation**: استخدم `router.push()` للانتقال و `router.back()` للعودة
5. **TypeScript**: تأكد من كتابة types صحيحة للـ props

## أنواع الصفحات المختلفة

### 1. صفحات بسيطة

```typescript
export default function SimplePage() {
  return <View><Text>محتوى بسيط</Text></View>;
}
```

### 2. صفحات مع navigation

```typescript
export default function PageWithNav() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push('/otherPage')}>
      <Text>انتقل لصفحة أخرى</Text>
    </Pressable>
  );
}
```

### 3. صفحات مع state

```typescript
export default function PageWithState() {
  const [data, setData] = useState(null);
  // ... logic
  return <View>...</View>;
}
```

هذا الدليل يوضح كيفية إضافة أي نوع من الصفحات إلى التطبيق!
