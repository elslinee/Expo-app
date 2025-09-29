# تصميم صفحة عرض جميع السور

## المميزات

### 1. صفحة قائمة السور (`app/surah-list.tsx`)

```typescript
// بيانات السور الكاملة
const surahs = [
  { number: 1, name: "الفاتحة", verses: 7, place: "مكية" },
  { number: 2, name: "البقرة", verses: 286, place: "مدنية" },
  // ... جميع السور الـ 114
];
```

**المميزات:**

- **114 سورة** مرتبة بالترتيب الصحيح
- **معلومات كاملة**: رقم السورة، الاسم، عدد الآيات، مكان النزول
- **تصميم جميل**: بطاقات منفصلة لكل سورة
- **تفاعل**: إمكانية الضغط على كل سورة

### 2. تصميم البطاقات

```typescript
const renderSurah = ({ item }) => (
  <TouchableOpacity style={styles.surahItem}>
    <View style={styles.surahNumber}>
      <Text>{item.number}</Text>
    </View>
    <View style={styles.surahInfo}>
      <Text>{item.name}</Text>
      <Text>{item.verses} آية • {item.place}</Text>
    </View>
    <View style={styles.surahIcon}>
      <Text>📖</Text>
    </View>
  </TouchableOpacity>
);
```

**المميزات:**

- **رقم السورة**: في دائرة منفصلة
- **اسم السورة**: بخط عربي جميل
- **التفاصيل**: عدد الآيات ومكان النزول
- **أيقونة**: رمز الكتاب
- **ظلال**: تأثيرات بصرية جميلة

### 3. Header مخصص

```typescript
<View style={styles.header}>
  <Text style={styles.headerTitle}>
    سور القرآن الكريم
  </Text>
  <Text style={styles.headerSubtitle}>
    114 سورة
  </Text>
</View>
```

**المميزات:**

- **عنوان واضح**: "سور القرآن الكريم"
- **عداد السور**: "114 سورة"
- **تصميم مركزي**: محاذاة في المنتصف

### 4. FlatList محسن

```typescript
<FlatList
  data={surahs}
  renderItem={renderSurah}
  keyExtractor={(item) => item.number.toString()}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.listContainer}
/>
```

**المميزات:**

- **أداء محسن**: FlatList للقوائم الطويلة
- **تمرير سلس**: بدون مؤشر التمرير
- **مفاتيح فريدة**: رقم السورة كمفتاح

## التصميم البصري

### 1. الألوان

```typescript
// يتطابق مع الـ theme
backgroundColor: color.background,
borderColor: color.border,
color: color.text,
color: color.primary,
```

### 2. الخطوط

```typescript
// خطوط عربية جميلة
fontFamily: FontFamily.bold,    // للعناوين
fontFamily: FontFamily.regular, // للنصوص
```

### 3. المسافات

```typescript
padding: 16,        // المسافات الداخلية
marginBottom: 12,   // المسافة بين البطاقات
borderRadius: 12,   // زوايا مدورة
```

### 4. الظلال

```typescript
shadowColor: "#000",
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 3,
elevation: 3,
```

## الانتقال من صفحة القرآن

### 1. زر الانتقال

```typescript
// في app/quran.tsx
<TouchableOpacity
  style={[styles.button, {
    backgroundColor: color.primary,
    borderColor: color.primary,
  }]}
  onPress={() => router.push("/surah-list")}
>
  <Text style={[styles.buttonText, { color: color.white }]}>
    عرض جميع السور
  </Text>
</TouchableOpacity>
```

### 2. إضافة الصفحة إلى Stack

```typescript
// في app/_layout.tsx
<Stack.Screen
  name="surah-list"
  options={{
    title: "سور القرآن الكريم",
    headerShown: true,
  }}
/>
```

## المميزات التقنية

### 1. البيانات

- **114 سورة** مع جميع المعلومات
- **ترتيب صحيح** حسب المصحف
- **معلومات دقيقة**: عدد الآيات ومكان النزول

### 2. الأداء

- **FlatList**: للقوائم الطويلة
- **مفاتيح فريدة**: لتحسين الأداء
- **تصميم محسن**: بدون تأخيرات

### 3. التفاعل

- **TouchableOpacity**: للضغط على السور
- **onPress**: إمكانية إضافة وظائف
- **console.log**: للتطوير والاختبار

## كيفية التطوير

### 1. إضافة وظائف للسور

```typescript
onPress={() => {
  // الانتقال لصفحة السورة
  router.push(`/surah/${item.number}`);

  // أو فتح قارئ القرآن
  // openQuranReader(item.number);
}}
```

### 2. إضافة البحث

```typescript
const [searchText, setSearchText] = useState("");
const filteredSurahs = surahs.filter((surah) =>
  surah.name.includes(searchText)
);
```

### 3. إضافة التصفية

```typescript
const [filter, setFilter] = useState("all");
const filteredSurahs = surahs.filter(
  (surah) => filter === "all" || surah.place === filter
);
```

## النتيجة النهائية

✅ **114 سورة** مرتبة بالترتيب الصحيح
✅ **تصميم جميل** مع بطاقات منفصلة
✅ **معلومات كاملة** لكل سورة
✅ **تفاعل سلس** مع المستخدم
✅ **أداء محسن** مع FlatList
✅ **تطابق مع الـ theme** في جميع الألوان

هذا التصميم يوفر تجربة مستخدم ممتازة لعرض جميع سور القرآن الكريم!
