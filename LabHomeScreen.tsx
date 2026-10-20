import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';
import { SvgXml } from 'react-native-svg';

// SVG assets downloaded from Figma node 79:391 (file q4OVzpZDgUgZoTikqnYWoh)
const HEART_PULSE_SVG = `<svg overflow="visible" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="heart-pulse">
<path id="Vector" d="M3.35315 13.5424H9.89532L10.4162 12.5007L12.4997 17.1883L14.5832 9.89651L16.1458 13.5424H21.6358M2.0825 9.89605C2.08252 8.73687 2.43419 7.60497 3.09105 6.64983C3.74791 5.6947 4.67907 4.96127 5.76154 4.54641C6.84401 4.13156 8.02687 4.05479 9.15389 4.32625C10.2809 4.59771 11.2991 5.20463 12.0739 6.06684C12.1285 6.12519 12.1944 6.17171 12.2677 6.20351C12.341 6.23532 12.4201 6.25173 12.5 6.25173C12.5799 6.25173 12.6589 6.23532 12.7322 6.20351C12.8055 6.17171 12.8715 6.12519 12.926 6.06684C13.6984 5.19902 14.7168 4.58701 15.8457 4.31225C16.9745 4.03749 18.1603 4.11302 19.2451 4.52879C20.33 4.94456 21.2625 5.68085 21.9185 6.63966C22.5745 7.59847 22.923 8.73433 22.9174 9.89605C22.9174 12.2815 21.3548 14.0628 19.7922 15.6253L14.0709 21.1597C13.8768 21.3826 13.6375 21.5617 13.3688 21.685C13.1002 21.8083 12.8084 21.8731 12.5128 21.875C12.2172 21.8768 11.9246 21.8158 11.6544 21.6959C11.3842 21.576 11.1426 21.3999 10.9457 21.1795L5.20774 15.6253C3.64512 14.0628 2.0825 12.2919 2.0825 9.89605Z" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const PIN_SVG = `<svg overflow="visible" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="map-pin">
<path id="Vector" d="M6.30047 10.9C7.23038 10.0969 9.9996 7.4967 9.9996 4.99997C9.9996 3.93901 9.57822 2.9215 8.82814 2.17128C8.07807 1.42107 7.06076 0.9996 6 0.9996C4.93924 0.9996 3.92193 1.42107 3.17186 2.17128C2.42179 2.9215 2.0004 3.93901 2.0004 4.99997C2.0004 7.4967 4.76962 10.0969 5.69953 10.9C5.78616 10.9652 5.89161 11.0004 6 11.0004C6.10839 11.0004 6.21384 10.9652 6.30047 10.9Z" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const CHEVRON_DOWN_SVG = `<svg overflow="visible" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="chevron-down">
<path id="Vector" d="M3 4.5L6 7.5L9 4.5" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const SEARCH_SVG = `<svg overflow="visible" viewBox="0 0 16.8887 16.8887" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Icon" d="M8.44434 0.849609C12.6386 0.849609 16.039 4.2501 16.0391 8.44434C16.0391 12.6386 12.6386 16.0391 8.44434 16.0391C4.2501 16.039 0.849609 12.6386 0.849609 8.44434C0.849628 4.25011 4.25011 0.849628 8.44434 0.849609Z" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</svg>`;

const KIT_SVG = `<svg overflow="visible" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Home collection kit">
<rect id="House" x="9" y="24" width="42" height="30" rx="3" fill="#FCFAFF"/>
<rect id="Window" x="13" y="31" width="8" height="9" rx="2" fill="#9DCBCB"/>
<rect id="Door" x="23" y="34" width="12" height="20" rx="2" fill="#D7CAEE"/>
<path id="Roof" d="M3 28L27 9C29 7.66667 31 7.66667 33 9L57 28L53 34L30 16L7 34L3 28Z" fill="#9B7BCA"/>
<rect id="Collection kit" x="34" y="36" width="25" height="23" rx="4" fill="#F4B267"/>
<rect id="Medical cross" x="40" y="45" width="13" height="5" rx="1" fill="white"/>
<rect id="Medical cross_2" x="44" y="41" width="5" height="13" rx="1" fill="white"/>
</g>
</svg>`;

const ARROW_RIGHT_SVG = `<svg overflow="visible" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="arrow-right">
<path id="Vector" d="M3.3328 8H12.6672M8 12.6672L12.6672 8L8 3.3328" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const FLASK_SVG = `<svg overflow="visible" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Icon" d="M19.8711 16.4502L22.9297 20.9277H22.9307C23.087 21.1564 23.1543 21.3954 23.1494 21.623C23.1445 21.851 23.0661 22.0908 22.8975 22.3184C22.7271 22.5481 22.4685 22.7587 22.1318 22.9121C21.7954 23.0653 21.4047 23.1504 21 23.1504H3C2.59526 23.1504 2.20461 23.0653 1.86816 22.9121C1.53148 22.7587 1.27291 22.5481 1.10254 22.3184C0.933901 22.0908 0.855507 21.851 0.850586 21.623C0.845682 21.3954 0.912967 21.1564 1.06934 20.9277H1.07031L4.12891 16.4502H19.8711ZM14.1494 0.849609V7.19922C14.1491 7.78383 14.3337 8.34585 14.665 8.83105L18.709 14.75H5.29102L9.33496 8.83105C9.6248 8.4066 9.80215 7.92362 9.8418 7.41797L9.85059 7.19922V0.849609H14.1494Z" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</svg>`;

const CALENDAR_SVG = `<svg overflow="visible" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="calendar-days">
<path id="Vector" d="M8 1.9992V5.99952M16 1.9992V5.99952M3 9.99984H21M8 14.0002H8.01M12 14.0002H12.01M16 14.0002H16.01M8 18.0005H8.01M12 18.0005H12.01M16 18.0005H16.01M5 3.99936H19C20.1046 3.99936 21 4.89486 21 5.99952V20.0006C21 21.1053 20.1046 22.0008 19 22.0008H5C3.89543 22.0008 3 21.1053 3 20.0006V5.99952C3 4.89486 3.89543 3.99936 5 3.99936Z" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const FILE_HEART_SVG = `<svg overflow="visible" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="file-heart">
<path id="Vector" d="M13 22.0006H17.9994C18.5298 22.0006 19.0384 21.7899 19.4135 21.4148C19.7885 21.0397 19.9992 20.5309 19.9992 20.0005V7.99962M19.9992 7.99962C20 7.68271 19.938 7.36878 19.8168 7.07595C19.6957 6.78312 19.5177 6.51719 19.2933 6.29351L15.7057 2.70526C15.482 2.48076 15.2161 2.30279 14.9234 2.1816C14.6306 2.06042 14.3167 1.99843 13.9999 1.99921M19.9992 7.99962L14.9997 7.99962C14.7346 7.99962 14.4802 7.89425 14.2927 7.7067C14.1052 7.51915 13.9999 7.26478 13.9999 6.99955V1.99921M13.9999 1.99921H6.00073C5.47035 1.99921 4.9617 2.20994 4.58667 2.58503C4.21164 2.96013 4.00095 3.46888 4.00095 3.99935V10.9998M3.62131 18.8C3.41096 18.5807 3.24721 18.321 3.13996 18.0366C3.03271 17.7522 2.98418 17.449 2.9973 17.1453C3.01041 16.8417 3.0849 16.5438 3.21626 16.2697C3.34763 15.9957 3.53315 15.751 3.76164 15.5506C3.99012 15.3502 4.25683 15.1982 4.54567 15.1037C4.83451 15.0093 5.13949 14.9743 5.44221 15.001C5.74494 15.0276 6.03912 15.1153 6.30702 15.2588C6.57492 15.4023 6.81097 15.5986 7.00094 15.8358C7.19183 15.6011 7.42809 15.4072 7.69561 15.2659C7.96312 15.1246 8.25639 15.0386 8.55786 15.0133C8.85934 14.9879 9.16283 15.0237 9.45018 15.1183C9.73754 15.213 10.0028 15.3646 10.2303 15.5642C10.4577 15.7638 10.6425 16.0072 10.7736 16.2799C10.9048 16.5526 10.9797 16.8489 10.9937 17.1512C11.0077 17.4534 10.9607 17.7554 10.8553 18.0391C10.75 18.3227 10.5885 18.5822 10.3806 18.802L7.75486 21.6582C7.66101 21.7658 7.54521 21.852 7.41525 21.9111C7.2853 21.9702 7.1442 22.0008 7.00144 22.0008C6.85869 22.0008 6.71759 21.9702 6.58763 21.9111C6.45768 21.852 6.34188 21.7658 6.24803 21.6582L3.62131 18.8Z" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const SYMBOL_CBC_SVG = `<svg overflow="visible" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Test symbol">
<rect width="36" height="40" rx="10" fill="#FFE8E2"/>
<path id="Icon" d="M13.4834 25.25V28.25C13.4834 28.7232 13.2754 29.1976 12.8701 29.5625C12.4617 29.9301 11.8895 30.1504 11.2773 30.1504C10.6653 30.1503 10.0939 29.93 9.68555 29.5625C9.28026 29.1976 9.07227 28.7232 9.07227 28.25V25.25H13.4834ZM26.9277 25.25V28.25C26.9277 28.7232 26.7197 29.1976 26.3145 29.5625C25.9061 29.93 25.3347 30.1503 24.7227 30.1504C24.1105 30.1504 23.5383 29.9301 23.1299 29.5625C22.7246 29.1976 22.5166 28.7232 22.5166 28.25V25.25H26.9277ZM26.9277 9.84961V23.5498H22.5166V9.84961H26.9277ZM13.4834 9.84961V23.5498H9.07227V9.84961H13.4834Z" stroke="#CF7374" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const SYMBOL_THYROID_SVG = `<svg overflow="visible" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Test symbol">
<rect width="36" height="40" rx="10" fill="#F6F3FF"/>
<path id="Icon" d="M25.1787 24.1504L27.9609 28.2236C28.0965 28.4218 28.1535 28.6264 28.1494 28.8193C28.1452 29.0126 28.0791 29.2183 27.9326 29.416C27.7844 29.616 27.5579 29.8022 27.2588 29.9385C26.96 30.0746 26.6115 30.1504 26.25 30.1504H9.75C9.38848 30.1504 9.04005 30.0746 8.74121 29.9385C8.44213 29.8022 8.2156 29.616 8.06738 29.416C7.92088 29.2183 7.85476 29.0126 7.85059 28.8193C7.84751 28.6745 7.87887 28.5233 7.95215 28.373L8.03906 28.2236L10.8213 24.1504H25.1787ZM19.8994 9.84961V15.5996L19.9082 15.8047C19.9455 16.2816 20.1122 16.7367 20.3848 17.1357L24.0166 22.4502H11.9834L15.6152 17.1357C15.9266 16.6799 16.1009 16.1508 16.1006 15.5996V9.84961H19.8994Z" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const SHIELD_SVG = `<svg overflow="visible" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="shield-check">
<path id="Vector" d="M5.62519 7.4997L6.87506 8.74974L9.37481 6.24966M12.4995 8.125C12.4995 11.2501 10.3122 12.8127 7.71248 13.7189C7.57634 13.7651 7.42847 13.7629 7.29377 13.7127C4.68778 12.8127 2.5005 11.2501 2.5005 8.125V3.74986C2.5005 3.5841 2.56634 3.42512 2.68354 3.30791C2.80074 3.19069 2.95969 3.12484 3.12544 3.12484C4.37531 3.12484 5.93766 2.37482 7.02505 1.42479C7.15744 1.31166 7.32586 1.2495 7.5 1.2495C7.67414 1.2495 7.84256 1.31166 7.97495 1.42479C9.06859 2.38107 10.6247 3.12484 11.8746 3.12484C12.0403 3.12484 12.1993 3.19069 12.3165 3.30791C12.4337 3.42512 12.4995 3.5841 12.4995 3.74986V8.125Z" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const CATEGORIES = [
  { label: 'Blood tests', image: require('./assets/images/lab/art-blood.png') },
  { label: 'Thyroid', image: require('./assets/images/lab/cat-thyroid.png') },
  { label: 'Vitamins', image: require('./assets/images/lab/art-vitamins.png') },
];

const POPULAR = [
  { name: 'Complete Blood Count', sub: 'CBC \u2022 Blood sample', symbol: SYMBOL_CBC_SVG },
  { name: 'Thyroid Profile', sub: 'T3, T4, TSH \u2022 Blood sample', symbol: SYMBOL_THYROID_SVG },
];

export default function LabHomeScreen({
  onLabTests,
}: {
  onLabTests: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Header (Figma 79:392) */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top + 3 : 50 },
        ]}
      >
        <View style={styles.navRow}>
          <View style={styles.identity}>
            <SvgXml xml={HEART_PULSE_SVG} width={25} height={25} />
            <Text style={styles.headerTitle}>HOME</Text>
          </View>
          <View style={styles.locationBlock}>
            <Text style={styles.locationLabel}>Your Location:</Text>
            <View style={styles.locationRow}>
              <SvgXml xml={PIN_SVG} width={12} height={12} />
              <Text style={styles.locationText}>Barabanki 225003</Text>
              <SvgXml xml={CHEVRON_DOWN_SVG} width={12} height={12} />
            </View>
          </View>
        </View>
        <View style={styles.searchBar}>
          <SvgXml xml={SEARCH_SVG} width={19} height={19} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tests, profiles & packages"
            placeholderTextColor="#777382"
          />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>A little care, every day</Text>
          <Text style={styles.welcomeSub}>Your health check starts here.</Text>
        </View>

        {/* Home collection promotion */}
        <View style={styles.promo}>
          <View style={styles.promoInfo}>
            <View style={styles.promoCopy}>
              <Text style={styles.promoTitle}>Lab tests, from home</Text>
              <Text style={styles.promoSub}>
                Trusted testing. A sample collection that comes to you.
              </Text>
            </View>
            <SvgXml xml={KIT_SVG} width={60} height={60} />
          </View>
          <Pressable style={styles.promoButton} onPress={onLabTests}>
            <Text style={styles.promoButtonText}>Book a home collection</Text>
            <SvgXml xml={ARROW_RIGHT_SVG} width={16} height={16} />
          </Pressable>
        </View>

        {/* Quick services */}
        <View style={styles.servicesRow}>
          <Pressable style={styles.service} onPress={onLabTests}>
            <SvgXml xml={FLASK_SVG} width={24} height={24} />
            <Text style={styles.serviceLabel}>Lab tests</Text>
          </Pressable>
          <View style={styles.service}>
            <SvgXml xml={CALENDAR_SVG} width={24} height={24} />
            <Text style={styles.serviceLabel}>My bookings</Text>
          </View>
          <View style={styles.service}>
            <SvgXml xml={FILE_HEART_SVG} width={24} height={24} />
            <Text style={styles.serviceLabel}>My reports</Text>
          </View>
        </View>

        {/* Browse by category */}
        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionTitle}>Browse by category</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((item) => (
              <View key={item.label} style={styles.category}>
                <View style={styles.categoryCard}>
                  <Image source={item.image} style={styles.categoryImage} resizeMode="contain" />
                </View>
                <Text style={styles.categoryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Popular tests */}
        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionTitle}>Popular tests</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          <View style={styles.testList}>
            {POPULAR.map((t) => (
              <View key={t.name} style={styles.testCard}>
                <SvgXml xml={t.symbol} width={36} height={40} />
                <View style={styles.testInfo}>
                  <Text style={styles.testName}>{t.name}</Text>
                  <Text style={styles.testSub}>{t.sub}</Text>
                </View>
                <View style={styles.addButton}>
                  <Text style={styles.addText}>+ Add</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Care assurance */}
        <View style={styles.assurance}>
          <SvgXml xml={SHIELD_SVG} width={15} height={15} />
          <Text style={styles.assuranceText}>
            Safe collection. Care you can count on.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#efedff' },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#d8d0e8',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 22,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#6b52ae',
  },
  locationBlock: { gap: 2 },
  locationLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#999c9c',
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    color: '#1d1b26',
  },
  searchBar: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8d0e8',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 11,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#1d1b26',
    outlineWidth: 0,
  } as object,
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 20,
  },
  welcome: { gap: 5 },
  welcomeTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 21,
    color: '#1d1b26',
  },
  welcomeSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#6b5d83',
  },
  promo: {
    backgroundColor: '#e5def8',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  promoInfo: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  promoCopy: { flex: 1, gap: 6 },
  promoTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1d1b26',
  },
  promoSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    lineHeight: 17,
    color: '#6b5d83',
  },
  promoButton: {
    backgroundColor: '#6b52ae',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#ffffff',
  },
  servicesRow: { flexDirection: 'row', gap: 8 },
  service: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  serviceLabel: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12.5,
    color: '#1d1b26',
  },
  section: { gap: 13 },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 18,
    color: '#1d1b26',
  },
  viewAll: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    color: '#6b52ae',
  },
  categoryRow: { flexDirection: 'row', gap: 8 },
  category: { flex: 1, alignItems: 'center', gap: 7 },
  categoryCard: {
    width: 72,
    height: 72,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    shadowColor: 'rgba(53, 39, 93, 0.09)',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: { width: 64, height: 64 },
  categoryLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#1d1b26',
    textAlign: 'center',
  },
  testList: { gap: 8 },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testInfo: { flex: 1, gap: 4 },
  testName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13.5,
    color: '#1d1b26',
  },
  testSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#777382',
  },
  addButton: {
    backgroundColor: '#f6f3ff',
    borderWidth: 1,
    borderColor: '#d8d0e8',
    borderRadius: 8,
    height: 30,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#6b52ae',
  },
  assurance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  assuranceText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#6b5d83',
  },
});
