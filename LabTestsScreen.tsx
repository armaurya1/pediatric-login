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

// SVG assets downloaded from Figma node 70:153 (file q4OVzpZDgUgZoTikqnYWoh)
const BACK_SVG = `<svg overflow="visible" viewBox="0 0 27.7371 18.3" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Back" d="M26.5871 9.15H1.58707M9.19576 17.15L1.58707 9.15L9.19576 1.15" stroke="#6B52AE" stroke-width="2.3" stroke-linecap="round"/>
</svg>`;

const PIN_SVG = `<svg overflow="visible" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Location pin" d="M5.5 0.549805C6.81088 0.549805 8.06934 1.07575 8.99805 2.01367C9.92697 2.95198 10.4502 4.22633 10.4502 5.55566C10.4502 6.34919 10.148 7.30859 9.64648 8.33691C9.14967 9.35563 8.48184 10.394 7.80469 11.3311C7.12889 12.2662 6.45104 13.0898 5.94238 13.6807C5.77516 13.8749 5.62417 14.0419 5.5 14.1807C5.37583 14.0419 5.22484 13.8749 5.05762 13.6807C4.54896 13.0898 3.87111 12.2662 3.19531 11.3311C2.51816 10.394 1.85033 9.35563 1.35352 8.33691C0.852039 7.30859 0.549832 6.34919 0.549805 5.55566C0.549805 4.22633 1.07303 2.95198 2.00195 2.01367C2.93066 1.07575 4.18912 0.549805 5.5 0.549805ZM7.15039 5.44434C7.15039 5.88956 6.97503 6.31573 6.66504 6.62891C6.35517 6.94191 5.93581 7.11621 5.5 7.11621C5.06419 7.11621 4.64483 6.94191 4.33496 6.62891C4.02497 6.31573 3.84961 5.88956 3.84961 5.44434C3.84964 4.9991 4.02493 4.57293 4.33496 4.25977C4.64483 3.94677 5.06419 3.77246 5.5 3.77246C5.93581 3.77246 6.35517 3.94677 6.66504 4.25977C6.97507 4.57293 7.15036 4.9991 7.15039 5.44434ZM8.25 5.44434C8.24997 4.71091 7.96137 4.00661 7.44629 3.48633C6.931 2.96584 6.23113 2.67188 5.5 2.67188C4.76887 2.67188 4.069 2.96584 3.55371 3.48633C3.03863 4.00661 2.75003 4.71091 2.75 5.44434C2.75 6.17775 3.03867 6.88205 3.55371 7.40234C4.069 7.92284 4.76886 8.2168 5.5 8.2168C6.23114 8.2168 6.931 7.92284 7.44629 7.40234C7.96133 6.88205 8.25 6.17775 8.25 5.44434Z" stroke="#6B52AE" stroke-width="1.1"/>
</svg>`;

const CHEVRON_DOWN_SVG = `<svg overflow="visible" viewBox="0 0 11.8001 9.44849" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Change location" d="M0.90007 0.90007L5.90007 7.90007L10.9001 0.90007" stroke="#6B52AE" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const SEARCH_SVG = `<svg overflow="visible" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="search">
<path id="Vector" d="M19.2501 19.2501L15.2718 15.2718M17.4167 10.0833C17.4167 14.1334 14.1334 17.4167 10.0833 17.4167C6.03324 17.4167 2.75 14.1334 2.75 10.0833C2.75 6.03324 6.03324 2.75 10.0833 2.75C14.1334 2.75 17.4167 6.03324 17.4167 10.0833Z" stroke="#6B52AE" stroke-width="1.8" stroke-linecap="round"/>
</g>
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

const CHEVRON_RIGHT_SVG = `<svg overflow="visible" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="chevron-right">
<path id="Vector" d="M6 12L10 8L6 4" stroke="#6B52AE" stroke-width="2" stroke-linecap="round"/>
</g>
</svg>`;

const SPARKLE_SVG = `<svg overflow="visible" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Sparkle" d="M5.5 0L7.5 5L11 7L7.5 9L5.5 14L3.5 9L0 7L3.5 5L5.5 0Z" fill="#F4BD71"/>
</svg>`;

const LIVER_SVG = `<svg overflow="visible" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Liver illustration">
<path id="Liver" d="M7 30.4589C7 14.4735 18.2018 14.4735 29.4036 17.6706C37.5504 19.802 44.6788 16.6049 52.8256 22.9991C60.9724 29.3932 55.8807 37.9187 48.7522 41.1158C39.5871 45.3785 31.4403 43.2472 26.3486 48.5756C16.1651 59.2325 7 49.6413 7 30.4589Z" fill="#E88973"/>
<path id="Gallbladder" d="M30.2105 36C37.4463 38 35.3789 47 31.2442 49C27.1094 48 27.1094 41 30.2105 36Z" fill="#70AC8D"/>
<path id="Liver detail" d="M30 20C34 27 33 33 28 39M32 29C38 25.6667 44.3333 24.6667 51 26" stroke="#C26B63" stroke-width="1.2" stroke-linecap="round"/>
<path id="Liver highlight" d="M10 26.3362C12 19.125 19 19.125 28 21.1854L32 34.5776C26 37.6681 23 43.8491 17 46.9396C13 47.9698 10 35.6077 10 26.3362Z" fill="#F6A58B"/>
<path id="Sparkle" d="M56.5 2L58.5 7L62 9L58.5 11L56.5 16L54.5 11L51 9L54.5 7L56.5 2Z" fill="#F4BD71"/>
<path id="Sparkle_2" d="M45.5 46L47.5 51L51 53L47.5 55L45.5 60L43.5 55L40 53L43.5 51L45.5 46Z" fill="#F4BD71"/>
</g>
</svg>`;

const TEST_TUBES_SVG = `<svg overflow="visible" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="test-tubes">
<path id="Vector" d="M8.625 1.9159V18.6881C8.625 19.3235 8.37258 19.933 7.92328 20.3823C7.47397 20.8317 6.86458 21.0841 6.22917 21.0841C5.59375 21.0841 4.98436 20.8317 4.53506 20.3823C4.08575 19.933 3.83333 19.3235 3.83333 18.6881V1.9159M19.1667 1.9159V18.6881C19.1667 19.3235 18.9142 19.933 18.4649 20.3823C18.0156 20.8317 17.4062 21.0841 16.7708 21.0841C16.1354 21.0841 15.526 20.8317 15.0767 20.3823C14.6274 19.933 14.375 19.3235 14.375 18.6881V1.9159M2.875 1.9159H9.58333M13.4167 1.9159H20.125M8.625 15.3336H3.83333M19.1667 15.3336H14.375" stroke="#CF7374" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const FLASK_SVG = `<svg overflow="visible" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="flask-conical">
<path id="Vector" d="M13.4178 1.9159V7.66636C13.4177 7.98789 13.4984 8.30429 13.6526 8.58643L18.933 18.2472C19.0927 18.5391 19.1737 18.8676 19.1679 19.2004C19.1622 19.5331 19.0699 19.8586 18.9002 20.1449C18.7305 20.4311 18.4892 20.6682 18.2 20.8329C17.9109 20.9976 17.5839 21.0842 17.2511 21.0841H5.7512C5.41844 21.0842 5.0914 20.9976 4.80225 20.8329C4.5131 20.6682 4.2718 20.4311 4.1021 20.1449C3.93239 19.8586 3.84013 19.5331 3.83439 19.2004C3.82864 18.8676 3.90961 18.5391 4.06933 18.2472L9.34971 8.58643C9.50389 8.30429 9.58463 7.98789 9.5845 7.66636V1.9159M6.18499 14.3752H16.8167M8.14657 1.9159H14.8548" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const DROPLET_SVG = `<svg overflow="visible" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="droplet">
<path id="Vector" d="M16.244 19.1192C14.9858 20.3773 13.2794 21.0841 11.5 21.0841C9.72064 21.0841 8.01415 20.3773 6.75595 19.1192C5.49775 17.8611 4.7909 16.1547 4.7909 14.3755C4.7909 12.4587 5.74934 10.6378 7.66623 9.10443C9.58311 7.57103 11.0208 5.27093 11.5 2.875C11.9792 5.27093 13.4169 7.57103 15.3338 9.10443C17.2507 10.6378 18.2091 12.4587 18.2091 14.3755C18.2091 16.1547 17.5023 17.8611 16.244 19.1192Z" stroke="#42998D" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const PLUS_SVG = `<svg overflow="visible" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="plus">
<path id="Vector" d="M2.083 5H7.917M5 2.083V7.917" stroke="#6B52AE" stroke-width="1.8" stroke-linecap="round"/>
</g>
</svg>`;

type Category = {
  label: string;
  kind: 'tubes' | 'capsules' | 'liver' | 'image';
  image?: number;
};

const CATEGORIES_1: Category[] = [
  { label: 'Blood tests', kind: 'tubes' },
  { label: 'Thyroid', kind: 'image', image: require('./assets/images/lab/cat-thyroid.png') },
  { label: 'Diabetes', kind: 'image', image: require('./assets/images/lab/cat-diabetes.png') },
];
const CATEGORIES_2: Category[] = [
  { label: 'Vitamins', kind: 'capsules' },
  { label: 'Liver function', kind: 'liver' },
  { label: 'Kidney function', kind: 'image', image: require('./assets/images/lab/cat-kidney.png') },
];

const POPULAR = [
  { name: 'Complete Blood Count', sub: 'CBC \u2022 Blood sample', tint: '#ffe8e2', icon: TEST_TUBES_SVG },
  { name: 'Thyroid Profile', sub: 'T3, T4, TSH \u2022 Blood sample', tint: '#eee7f9', icon: FLASK_SVG },
  { name: 'Blood Glucose', sub: 'Fasting \u2022 Blood sample', tint: '#dff4ef', icon: DROPLET_SVG },
];

function BloodTubesArt() {
  const tube = (cap: string, sample: string, left: number, top: number) => (
    <View style={{ position: 'absolute', left, top, width: 17, height: 43 }}>
      <View style={{ position: 'absolute', left: 2, top: 5, width: 13, height: 38, backgroundColor: '#dfebf1', borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }} />
      <View style={{ position: 'absolute', left: 0, top: 0, width: 17, height: 9, backgroundColor: cap, borderRadius: 2 }} />
      <View style={{ position: 'absolute', left: 4, top: 23, width: 9, height: 17, backgroundColor: sample, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />
      <View style={{ position: 'absolute', left: 5, top: 12, width: 3, height: 10, backgroundColor: '#ffffff', borderRadius: 1.5 }} />
    </View>
  );
  return (
    <View style={{ width: 64, height: 64 }}>
      {tube('#729dbb', '#ef8582', 13, 10)}
      {tube('#a78bcb', '#e6676b', 34, 17)}
      <View style={{ position: 'absolute', left: 49, top: 10 }}>
        <SvgXml xml={SPARKLE_SVG} width={11} height={14} />
      </View>
    </View>
  );
}

function VitaminCapsulesArt() {
  const capsule = (bg: string, shell: string, shellLeft: number, highlight: string, width: number) => (
    <View style={{ width, height: 19, backgroundColor: bg, borderRadius: 10, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: shellLeft, top: 0, width: width - 23, height: 19, backgroundColor: shell }} />
      <View style={{ position: 'absolute', left: 7, top: 4, width: 12, height: 3, backgroundColor: highlight, borderRadius: 2 }} />
    </View>
  );
  return (
    <View style={{ width: 64, height: 64 }}>
      <View style={{ position: 'absolute', left: 7, top: 4.63, width: 46.6, height: 45.268, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ transform: [{ rotate: '-43deg' }] }}>
          {capsule('#64b7ae', '#f4fcf9', 23, '#aee1d7', 46)}
        </View>
      </View>
      <View style={{ position: 'absolute', left: -0.21, top: 22, width: 45.153, height: 42.195, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ transform: [{ rotate: '40deg' }] }}>
          {capsule('#f5b75d', '#fff4d8', 0, '#ffffff', 43)}
        </View>
      </View>
      <View style={{ position: 'absolute', left: 47, top: 46 }}>
        <SvgXml xml={SPARKLE_SVG} width={11} height={14} />
      </View>
      <View style={{ position: 'absolute', left: 58.33, top: 22 }}>
        <SvgXml xml={SPARKLE_SVG} width={11} height={14} />
      </View>
    </View>
  );
}

export default function LabTestsScreen({
  onBack,
  onHomeCollection,
}: {
  onBack: () => void;
  onHomeCollection: () => void;
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

  const categoryCard = (item: Category) => (
    <View key={item.label} style={styles.category}>
      <View style={styles.categoryCard}>
        {item.kind === 'tubes' ? (
          <BloodTubesArt />
        ) : item.kind === 'capsules' ? (
          <VitaminCapsulesArt />
        ) : item.kind === 'liver' ? (
          <SvgXml xml={LIVER_SVG} width={64} height={64} />
        ) : (
          <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
        )}
      </View>
      <Text style={styles.categoryLabel}>{item.label}</Text>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Lab tests header (Figma 70:154) */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack} accessibilityLabel="Back">
          <SvgXml xml={BACK_SVG} width={25} height={16} />
        </Pressable>
        <Text style={styles.headerTitle}>LAB TESTS</Text>
        <Text style={styles.locationLabel}>Your Location:</Text>
        <View style={styles.locationRow}>
          <SvgXml xml={PIN_SVG} width={11} height={15} />
          <Text style={styles.locationText}>Barabanki 225003</Text>
          <SvgXml xml={CHEVRON_DOWN_SVG} width={10} height={7} />
        </View>
        <View style={styles.searchBar}>
          <SvgXml xml={SEARCH_SVG} width={22} height={22} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tests, profiles & packages"
            placeholderTextColor="#777382"
          />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Home sample collection banner */}
        <Pressable style={styles.banner} onPress={onHomeCollection}>
          <SvgXml xml={KIT_SVG} width={60} height={60} />
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerTitle}>Lab tests, from home</Text>
            <Text style={styles.bannerSub}>Choose home sample collection at checkout.</Text>
          </View>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={16} height={16} />
        </Pressable>

        {/* Browse by category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by category</Text>
          <View style={styles.categoryRow}>{CATEGORIES_1.map(categoryCard)}</View>
          <View style={styles.categoryRow}>{CATEGORIES_2.map(categoryCard)}</View>
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
                <View style={[styles.testSymbol, { backgroundColor: t.tint }]}>
                  <SvgXml xml={t.icon} width={23} height={23} />
                </View>
                <View style={styles.testInfo}>
                  <Text style={styles.testName}>{t.name}</Text>
                  <Text style={styles.testSub}>{t.sub}</Text>
                </View>
                <View style={styles.addButton}>
                  <SvgXml xml={PLUS_SVG} width={10} height={10} />
                  <Text style={styles.addText}>Add</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#efedff' },
  header: {
    height: 169,
    borderBottomWidth: 1,
    borderBottomColor: '#d8d0e8',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 14,
    top: 61,
    width: 25,
    height: 16,
    justifyContent: 'center',
  },
  headerTitle: {
    position: 'absolute',
    left: 52,
    top: 62,
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#6b52ae',
  },
  locationLabel: {
    position: 'absolute',
    left: 220,
    top: 53,
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#999c9c',
  },
  locationRow: {
    position: 'absolute',
    left: 202,
    top: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    color: '#1d1b26',
    marginLeft: 7,
    marginRight: 18,
  },
  searchBar: {
    position: 'absolute',
    left: 14,
    top: 111,
    width: 332,
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8d0e8',
    borderRadius: 12,
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
    paddingBottom: 22,
    gap: 20,
  },
  banner: {
    backgroundColor: '#e5def8',
    borderRadius: 16,
    height: 92,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  bannerCopy: { flex: 1, gap: 5 },
  bannerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15.5,
    color: '#1d1b26',
  },
  bannerSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    lineHeight: 17,
    color: '#6b5d83',
  },
  section: { gap: 13 },
  sectionTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 18,
    color: '#1d1b26',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  categoryImage: { width: 64, height: 64, borderRadius: 8 },
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
    height: 66,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testSymbol: {
    width: 36,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testInfo: { flex: 1, gap: 5 },
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#6b52ae',
  },
});
