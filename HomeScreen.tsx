import { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';

// SVG icons from Figma (file q4OVzpZDgUgZoTikqnYWoh, node 34:537)
const ICONS = {
  pin: `<svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 0C3.8 0 0 3.7 0 8.3C0 14.2 8.5 22 8.5 22C8.5 22 17 14.2 17 8.3C17 3.7 13.2 0 8.5 0ZM8.5 5.6C7.73087 5.6 6.99325 5.90553 6.44939 6.44939C5.90553 6.99325 5.6 7.73087 5.6 8.5C5.6 9.26913 5.90553 10.0068 6.44939 10.5506C6.99325 11.0945 7.73087 11.4 8.5 11.4C9.26913 11.4 10.0068 11.0945 10.5506 10.5506C11.0945 10.0068 11.4 9.26913 11.4 8.5C11.4 7.73087 11.0945 6.99325 10.5506 6.44939C10.0068 5.90553 9.26913 5.6 8.5 5.6Z" fill="#A57CDA"/>
</svg>`,
  chevronDown: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#160B37" stroke-width="1.8" stroke-linecap="round"/>
</svg>`,
  search: `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.1252 20.1252L15.966 15.966M18.2083 10.5417C18.2083 14.7758 14.7758 18.2083 10.5417 18.2083C6.30748 18.2083 2.875 14.7758 2.875 10.5417C2.875 6.30748 6.30748 2.875 10.5417 2.875C14.7758 2.875 18.2083 6.30748 18.2083 10.5417Z" stroke="#C5B5EA" stroke-width="1.8" stroke-linecap="round"/>
</svg>`,
  sparkles: `<svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.5 0L7.6 4.9L12.5 6L7.6 7.1L6.5 12L5.4 7.1L0.5 6L5.4 4.9L6.5 0Z" fill="#A57CDA"/>
<path d="M11 10.5L11.7 13.3L14.5 14L11.7 14.7L11 17.5L10.3 14.7L7.5 14L10.3 13.3L11 10.5Z" fill="#C5A5E8" transform="scale(0.85)"/>
</svg>`,
  homeWhite: `<svg width="23" height="21" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 0.5L23 10.5H20V21.5H14.5V15H9.5V21.5H4V10.5H1L12 0.5Z" fill="white"/>
</svg>`,
  homeDark: `<svg width="23" height="21" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 0.5L23 10.5H20V21.5H14.5V15H9.5V21.5H4V10.5H1L12 0.5Z" fill="#160B37"/>
</svg>`,
  inPerson: `<svg width="27" height="29" viewBox="0 0 27 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="5" y="3" width="15" height="23" rx="2.5" stroke="#160B37" stroke-width="1.7"/>
<rect x="9.5" y="1" width="6" height="4" rx="1.5" fill="#160B37"/>
<circle cx="12.5" cy="11" r="2.6" stroke="#160B37" stroke-width="1.6"/>
<path d="M8 19.5C8.8 17.4 10.5 16.2 12.5 16.2C14.5 16.2 16.2 17.4 17 19.5" stroke="#160B37" stroke-width="1.6" stroke-linecap="round"/>
<circle cx="21.5" cy="22.5" r="4.5" fill="#160B37"/>
<path d="M21.5 20.2V24.8M19.2 22.5H23.8" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
</svg>`,
  videoConsult: `<svg width="28" height="21" viewBox="0 0 28 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1.5" y="1.5" width="24" height="18" rx="4" stroke="#160B37" stroke-width="1.7"/>
<path d="M11 7.2L17.5 10.5L11 13.8V7.2Z" fill="#160B37"/>
<circle cx="21.8" cy="4.6" r="1.4" fill="#9564D2"/>
</svg>`,
  account: `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11.5" cy="11.5" r="10" stroke="#160B37" stroke-width="1.7"/>
<circle cx="11.5" cy="9" r="3.1" stroke="#160B37" stroke-width="1.6"/>
<path d="M5.8 18.2C6.9 15.9 9 14.8 11.5 14.8C14 14.8 16.1 15.9 17.2 18.2" stroke="#160B37" stroke-width="1.6" stroke-linecap="round"/>
</svg>`,
};

const SHORTCUTS = [
  { label: 'Book\nLab Tests', image: require('./assets/images/home/icon-lab.png') },
  { label: 'Plan\nSurgeries', image: require('./assets/images/home/icon-surgeries.png') },
  { label: 'Order\nMedicines', image: require('./assets/images/home/icon-medicines.png') },
  { label: 'Buy\nSubscriptions', image: require('./assets/images/home/icon-subscriptions.png') },
];

const TABS = [
  { key: 'home', label: 'Home' },
  { key: 'inPerson', label: 'In-Person' },
  { key: 'video', label: 'Video\nConsult' },
  { key: 'account', label: 'Account' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

type Props = {
  onOnlineConsult: () => void;
};

export default function HomeScreen({ onOnlineConsult }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const tabIcon = (key: TabKey, selected: boolean) => {
    switch (key) {
      case 'home':
        return selected ? ICONS.homeWhite : ICONS.homeDark;
      case 'inPerson':
        return ICONS.inPerson;
      case 'video':
        return ICONS.videoConsult;
      case 'account':
        return ICONS.account;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 118 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Location and search (Figma 34:538) */}
        <View style={{ paddingTop: insets.top + 18 }}>
          <View style={styles.locationRow}>
            <SvgXml xml={ICONS.pin} width={17} height={22} />
            <Text style={styles.locationText}>Bangalore</Text>
            <SvgXml xml={ICONS.chevronDown} width={18} height={18} />
          </View>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <SvgXml xml={ICONS.search} width={23} height={23} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for Doctors, symptoms..."
                placeholderTextColor="#7b788b"
              />
            </View>
            <LinearGradient
              colors={['#fbf8ff', '#e9d6fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.askPill}
            >
              <View style={styles.askSparkles}>
                <SvgXml xml={ICONS.sparkles} width={14} height={17} />
              </View>
              <Text style={styles.askLine1}>Ask</Text>
              <Text style={styles.askLine2}>Care AI</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Healthcare services (Figma 34:555) */}
        <View style={styles.services}>
          <View style={styles.consultRow}>
            <LinearGradient
              colors={['#e8dff9', '#cba5f8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.consultCard}
            >
              <Text style={styles.consultTitle}>
                In-Person{'\n'}Consultation
              </Text>
              <Image
                source={require('./assets/images/home/doctor-portrait.png')}
                style={styles.doctorPortrait}
                resizeMode="cover"
              />
              <Image
                source={require('./assets/images/home/doctor-face.png')}
                style={styles.doctos­ûæÚ$z{-®éÜj×,
    image: require('./assets/images/consult/urology.png'),
  },
  { label: 'ENT', image: require('./assets/images/consult/ent.png') },
  {
    label: 'Cardiology',
    image: require('./assets/images/consult/cardiology.png'),
  },
  {
    label: 'Paediatrics',
    image: require('./assets/images/consult/paediatrics.png'),
  },
  {
    label: 'Digestive\nHealth',
    image: require('./assets/images/consult/digestive-health.png'),
  },
  {
    label: 'Neurology',
    image: require('./assets/images/consult/neurology.png'),
  },
  {
    label: 'Orthopaedics',
    image: require('./assets/images/consult/orthopaedics.png'),
  },
  {
    label: 'Thyroid\nCare',
    image: require('./assets/images/consult/thyroid-care.png'),
  },
  {
    label: 'Diabetology',
    image: require('./assets/images/consult/diabetology.png'),
  },
];

export default function ConsultScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  const safeOffset = Math.max(0, insets.top - 44);
  const columnWidth = (width - 28 - 39) / 4;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(12, insets.bottom) }}
      >
        <View style={[styles.header, { height: 169 + safeOffset }]}>
          <View style={[styles.topRow, { top: 53 + safeOffset }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to home"
              hitSlop={8}
              onPress={onBack}
              style={styles.backButton}
            >
              <Image
                source={require('./assets/images/consult/back.png')}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </Pressable>
            <Text style={styles.headerTitle}>ONLINE CONSULT</Text>
          </View>

          <View style={[styles.locationGroup, { top: 53 + safeOffset }]}>
            <Text style={styles.locationCaption}>Your Location:</Text>
            <Image
              source={require('./assets/images/consult/location-pin.png')}
              style={styles.locationPin}
              resizeMode="contain"
            />
            <Text style={styles.locationValue}>Barabanki 225003</Text>
            <Image
              source={require('./assets/images/consult/location-change.png')}
              style={styles.locationChange}
              resizeMode="contain"
            />
          </View>

          <View style={[styles.searchBox, { top: 111 + safeOffset }]}>
            <Image
              source={require('./assets/images/consult/search.png')}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              accessibilityLabel="Search doctors, specialties, or symptoms"
              style={styles.searchInput}
              placeholder="Search Doctors, specialties, symptoms..."
              placeholderTextColor="#7e8184"
              returnKeyType="search"
            />
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Speciality</Text>

          <View style={styles.specialtyGrid}>
            {SPECIALTIES.map((specialty) => (
              <View
                key={specialty.label}
                style={[styles.specialtyItem, { width: columnWidth }]}
              >
                <View style={styles.iconShadow}>
                  <View style={styles.iconCard}>
                    <Image
                      source={specialty.image}
                      style={styles.specialtyImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <Text style={styles.specialtyName}>{specialty.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.symptomHeading}>
            <Text style={styles.symptomTitle}>Find Doctor by Symptoms</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#efedff' },
  header: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#d8d0e8',
  },
  topRow: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 25,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { width: 25, height: 16 },
  headerTitle: {
    marginLeft: 13,
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#6b52ae',
  },
  locationGroup: {
    position: 'absolute',
    right: 19,
    width: 139,
    height: 34,
  },
  locationCaption: {
    position: 'absolute',
    top: 0,
    left: 18,
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    lineHeight: 15,
    color: '#999c9c',
  },
  locationPin: {
    position: 'absolute',
    left: 0,
    top: 17,
    width: 11,
    height: 15,
  },
  locationValue: {
    position: 'absolute',
    top: 18,
    left: 18,
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    lineHeight: 15,
    color: '#1d1b26',
  },
  locationChange: {
    position: 'absolute',
    right: 0,
    top: 22,
    width: 10,
    height: 7,
  },
  searchBox: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d8d0e8',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 11,
  },
  searchIcon: { width: 22, height: 24 },
  searchInput: {
    flex: 1,
    padding: 0,
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: '#1d1b26',
    outlineWidth: 0,
  },
  body: { minHeight: 635, paddingTop: 10 },
  sectionTitle: {
    height: 28,
    marginHorizontal: 14,
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    lineHeight: 22,
    color: '#1d1b26',
  },
  specialtyGrid: {
    marginTop: 21,
    marginHorizontal: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 26,
  },
  specialtyItem: { alignItems: 'center' },
  iconShadow: {
    width: 73,
    height: 73,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    shadowColor: '#142533',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
  iconCard: {
    flex: 1,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  specialtyImage: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 65,
    height: 65,
  },
  specialtyName: {
    width: 86,
    marginTop: 9,
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#1d1b26',
    textAlign: 'center',
  },
  symptomHeading: {
    marginTop: 41,
    marginHorizontal: 14,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  symptomTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17.5,
    color: '#1d1b26',
  },
  viewAll: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#6b52ae',
  },
});
