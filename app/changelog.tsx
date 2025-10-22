import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import GoBack from "@/components/GoBack";

export default function ChangelogScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: color.background }]}
      showsVerticalScrollIndicator={false}
    >
      <GoBack style={{ position: "absolute", left: 20, top: 60, zIndex: 1 }} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: `${color.primary}15`, paddingTop: 80 },
        ]}
      >
        <Text style={[styles.headerTitle, { color: color.text }]}>
          سجل التغييرات
        </Text>
        <Text style={[styles.headerSubtitle, { color: color.darkText }]}>
          آخر التحديثات والتحسينات
        </Text>
      </View>

      {/* Changelog Content */}
      <View style={styles.section}>
        {/* Version 0.5 Beta */}
        <View style={[styles.changelogCard, { backgroundColor: color.bg20 }]}>
          <View
            style={[
              styles.versionHeader,
              { borderBottomColor: color.primary + "30" },
            ]}
          >
            <Text style={[styles.versionNumber, { color: color.primary }]}>
              الإصدار 0.5 بيتا
            </Text>
            <Text style={[styles.versionSubtitle, { color: color.darkText }]}>
              نظام عداد الأذكار + تحسينات القرآن
            </Text>
          </View>
          {/* القرآن الكريم */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              القرآن الكريم
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • اضافة خاصية تغيير حجم الخط للقرآن
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين نظام التحميل التدريجي للقرآن
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إصلاح مشاكل الإشارات المرجعية
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحميل ذكي للآيات لزيادة سرعة التحميل
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • اضافة زر الذهاب للسورة فى صفحة المفضلة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين أداء التمرير والتنقل
            </Text>
          </View>
          {/* الأذكار */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              الأذكار
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة نظام عداد الأذكار مع حفظ التقدم
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إعادة تعيين تلقائي للعدادات كل يوم بعد منتصف الليل
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • شريط التقدم المرئي للأذكار
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • شفافية الكارد عند اكتمال العدد المطلوب
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • زر إعادة التعيين للعدادات
            </Text>
          </View>

          {/* واجهة المستخدم */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              واجهة المستخدم
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة نصائح تفاعلية للمستخدمين الجدد
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين واجهة الأذكار مع شريط التقدم
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • مكونات منفصلة قابلة لإعادة الاستخدام
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين تجربة المستخدم العامة
            </Text>
          </View>
        </View>

        {/* Version 0.4 */}
        <View style={[styles.changelogCard, { backgroundColor: color.bg20 }]}>
          <View
            style={[
              styles.versionHeader,
              { borderBottomColor: color.primary + "30" },
            ]}
          >
            <Text style={[styles.versionNumber, { color: color.primary }]}>
              الإصدار 0.4 بيتا
            </Text>
            <Text style={[styles.versionSubtitle, { color: color.darkText }]}>
              الأذكار + تحسينات الأداء والسرعة
            </Text>
          </View>

          {/* الأذكار */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              الأذكار
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة نظام الأذكار الكامل مع 8 فئات
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • نظام المفضلة المتقدم للأذكار
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة الأذكار للتسبيح مباشرة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين واجهة المستخدم مع أيقونات معبرة
            </Text>
          </View>

          {/* القرآن الكريم */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              القرآن الكريم
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين سرعة تحميل القرآن بشكل كبير
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة نظام التحميل التدريجي للقرآن
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين أداء صفحة السور
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة نظام المسارات الديناميكية للسور
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين التنقل بين السور مع الحفاظ على جميع الميزات
            </Text>
          </View>

          {/* الموقع والإشعارات */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              الموقع والإشعارات
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تعديل نظام طلب الموقع (طلب واحد فقط)
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إزالة الصوت المخصص لإشعارات الأذان
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إصلاح مشكلة الإشعارات التي تظهر رغم تعطيلها
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين منطق تعطيل الإشعارات للصلوات
            </Text>
          </View>

          {/* تحسينات عامة */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              تحسينات عامة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين إدارة الذاكرة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إصلاح مشاكل التحميل البطيء
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين تجربة المستخدم العامة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين شاشات التحميل والأداء
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة أنواع TypeScript للتنقل الديناميكي
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين هيكل المسارات في التطبيق
            </Text>
          </View>
        </View>

        {/* Version 0.3 Beta */}
        <View style={[styles.changelogCard, { backgroundColor: color.bg20 }]}>
          <View
            style={[
              styles.versionHeader,
              { borderBottomColor: color.primary + "30" },
            ]}
          >
            <Text style={[styles.versionNumber, { color: color.primary }]}>
              الإصدار 0.3 بيتا
            </Text>
            <Text style={[styles.versionSubtitle, { color: color.darkText }]}>
              تحسينات رئيسية في القرآن والإشعارات
            </Text>
          </View>

          {/* القرآن الكريم */}
          <View className="changelogCategory" style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              القرآن الكريم
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • استخدام بيانات القرآن محليًا بدون الحاجة للإنترنت
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة وضع قراءة متجاور (Inline) مع إمكانية التبديل مع وضع
              القائمة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تفعيل الأرقام العربية لرقم الآية والعدادات
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • حفظ تفضيل وضع القراءة واستعادته تلقائيًا
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تلميح أول زيارة يوضح زر التبديل للوضع
            </Text>
          </View>

          {/* المفضلة والإشارات */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              المفضلة والإشارات
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين حفظ الإشارة المرجعية وعرضها في الوضعين
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين عرض المفضلة مع نسخة مفصلة لكل سورة
            </Text>
          </View>

          {/* التنبيهات */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              التنبيهات
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة صوت تكبير عند إشعار الأذان
            </Text>
          </View>

          {/* عام */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              تحسينات عامة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إصلاح بقاء السورة المثبتة ظاهرة ضمن جميع السور
            </Text>
          </View>
        </View>

        {/* Version 0.2 Beta */}
        <View style={[styles.changelogCard, { backgroundColor: color.bg20 }]}>
          <View
            style={[
              styles.versionHeader,
              { borderBottomColor: color.primary + "30" },
            ]}
          >
            <Text style={[styles.versionNumber, { color: color.primary }]}>
              الإصدار 0.2 بيتا
            </Text>
            <Text style={[styles.versionSubtitle, { color: color.darkText }]}>
              تحسينات وتحديثات متعددة
            </Text>
          </View>

          {/* التسابيح */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              التسابيح
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إعادة تصميم كامل للـ UI لصفحة التسابيح
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة إحصائيات (مجموع التسابيح + أيام متتالية)
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة خاصية النسخ عند الضغط المطول في الآيات والأذكار
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • إضافة hotfix لمشكلة في تحديثات التسابيح
            </Text>
          </View>

          {/* تحسين تجربة المستخدم */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              تحسين تجربة المستخدم
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • عند إكمال الهدف يظهر تنبيه مميز وجملة خاصة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحضير الخط في التسابيح لتحسين المظهر
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • صفحة السورة: حذف البسملة من أول آية + إضافتها من فوق
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • صفحة السورة: تغيير الخط
            </Text>
          </View>

          {/* واجهات التطبيق */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              واجهات التطبيق
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تمييز قائمة الـ pin في صفحة الفرق
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين شكل شاشة التحميل وإصلاح الدخول على التطبيق
            </Text>
          </View>

          {/* مواعيد الصلاة */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              مواعيد الصلاة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تحسين شكل الشاشة وإصلاح بعض الأخطاء
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تعليم المستخدم على الصلاة التالية وطلب التقييم
            </Text>
          </View>

          {/* تحسينات عامة */}
          <View style={styles.changelogCategory}>
            <Text style={[styles.categoryTitle, { color: color.text }]}>
              تحسينات عامة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • تغيير أيقونات التنقل
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • حذف التنقل من الرئيسية وإضافته لأزرار مخصصة
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • حفظ بيانات الموقع بدون إنترنت (دائماً مواعيد الصلاة متوفرة)
            </Text>
            <Text style={[styles.changelogItem, { color: color.darkText }]}>
              • حل مشكلة طلب الموقع كل مرة
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: color.darkText }]}>
          نسعى دائماً لتحسين التطبيق وإضافة مميزات جديدة
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: FontFamily.medium,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  changelogCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  versionHeader: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  versionNumber: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },
  versionSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  changelogCategory: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    marginBottom: 8,
  },
  changelogItem: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    lineHeight: 22,
    marginBottom: 4,
  },
  footer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    textAlign: "center",
  },
  changesList: {
    paddingTop: 16,
  },
  changeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  changeBullet: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    marginRight: 12,
    marginTop: 2,
  },
  changeText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
  },
});
