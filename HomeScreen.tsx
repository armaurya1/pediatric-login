import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
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
  const { width: windowWidth } = useWindowDimensions();
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
                style={styles.doctorFace}
                resizeMode="cover"
              />
            </LinearGradient>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open online consultation"
              onPress={onOnlineConsult}
              style={({ pressed }) => [
                styles.consultCard,
                pressed && { opacity: 0.85 },
              ]}
            >
              <LinearGradient
                colors={['#e8dff9', '#cba5f8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.consultTitle}>
                Video{'\n'}Consultation
              </Text>
              <Image
                source={require('./assets/images/home/video-call.png')}
                style={styles.videoCall}
                resizeMode="cover"
              />
            </Pressable>
          </View>

          <View style={styles.shortcutRow}>
            {SHORTCUTS.map((item) => (
              <View key={item.label} style={styles.shortcut}>
                <Image
                  source={item.image}
                  style={styles.shortcutIcon}
                  resizeMode="cover"
                />
                <Text style={styles.shortcutLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recently viewed and care assistant (Figma 34:582) */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionHeading}>Recently Viewed</Text>

          <View style={styles.recentCard}>
            <Image
              source={require('./assets/images/home/physician.png')}
              style={styles.physicianIcon}
              resizeMode="cover"
            />
            <Text style={styles.recentSpecialty}>General physician</Text>
            <Text style={styles.recentChannel}>in Video Consult</Text>
          </View>

          <ScrollView
            accessibilityLabel="Home promotions"
            contentContainerStyle={[
              styles.promoCarouselContent,
              { paddingRight: Math.max(8, windowWidth - 320) },
            ]}
            decelerationRate="fast"
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={324}
            style={styles.promoCarousel}
          >
            <LinearGradient
              colors={['#332e80', '#a75dea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.promoCard}
            >
              <View style={styles.promoTextBlock}>
                <Text style={styles.promoTitle}>Ask Care AI</Text>
                <Text style={styles.promoDesc}>
                  Get trustworthy, instant &amp; free answers to your health
                  queries
                </Text>
                <Pressable style={styles.askNow}>
                  <Text style={styles.askNowText}>Ask Now</Text>
                </Pressable>
              </View>
              <Image
                source={require('./assets/images/home/ai-illustration.png')}
                style={styles.promoIllustration}
                resizeMode="cover"
              />
            </LinearGradient>

            <LinearGradient
              colors={['#332e80', '#a75dea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.promoOfferCard}
            >
              <Text style={styles.affordableTitle}>
                Affordable Procedures{'\n'}by Expert Doctors
              </Text>
              <Text style={styles.procedureList}>
                Piles, Pregnancy, Knee{'\n'}Replacement +50 more
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Get cost estimate"
                style={styles.estimateButton}
              >
                <Text style={styles.estimateButtonText}>Get Cost Estimate</Text>
              </Pressable>
              <Text style={styles.affordableInsurance}>
                All insurances accepted &amp; No Cost EMI available
              </Text>
              <Image
                source={require('./assets/images/home/affordable-procedures.png')}
                style={styles.procedurePhoto}
                resizeMode="cover"
              />
            </LinearGradient>

            <LinearGradient
              colors={['#332e80', '#a75dea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.promoOfferCard}
            >
              <Text style={styles.fullBodyTitle}>
                Full Body Checkups{'\n'}at Your Doorstep
              </Text>
              <Text style={styles.checkupList}>
                70+ tests for a{'\n'}healthier tomorrow
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Book a checkup"
                style={styles.bookCheckupButton}
              >
                <Text style={styles.bookCheckupButtonText}>Book a Checkup</Text>
              </Pressable>
              <Text style={styles.fullBodyInsurance}>
                Certified labs &amp; home sample collection
              </Text>
              <Image
                source={require('./assets/images/home/full-body-checkups.png')}
                style={styles.checkupPhoto}
                resizeMode="cover"
              />
            </LinearGradient>
          </ScrollView>

          <View
            style={[
              styles.footerIllustration,
              { width: windowWidth, height: (windowWidth * 400) / 360 },
            ]}
          >
            <Image
              source={require('./assets/images/home/footer-ambulance.png')}
              style={styles.footerImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>

      {/* Primary navigation (Figma 34:602) */}
      <View style={[styles.navWrap, { bottom: 0 }]}>
        <LinearGradient
          colors={['#e7e4ef', '#dedce9']}
          style={styles.navBar}
        >
          {TABS.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tab, selected && styles.tabSelected]}
                onPress={() => {
                  if (tab.key === 'video') {
                    onOnlineConsult();
                    return;
                  }
                  setActiveTab(tab.key);
                }}
              >
                <SvgXml
                  xml={tabIcon(tab.key, selected)}
                  width={tab.key === 'inPerson' ? 27 : 24}
                  height={tab.key === 'inPerson' ? 29 : 23}
                />
                <Text
                  style={[styles.tabLabel, selected && styles.tabLabelSelected]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </LinearGradient>
        <View
          style={[styles.gestureArea, { height: 16 + insets.bottom }]}
        >
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f2effc' },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    gap: 9,
  },
  locationText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: '#160b37',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 11,
    marginTop: 21,
  },
  searchBox: {
    flex: 1,
    height: 49,
    backgroundColor: '#ffffff',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    gap: 9,
    shadowColor: 'rgba(39,26,61,0.19)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#160b37',
    outlineWidth: 0,
  },
  askPill: {
    width: 76,
    height: 49,
    borderRadius: 17,
    borderWidth: 1.6,
    borderColor: '#ae7bdf',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  askSparkles: { position: 'absolute', top: 4, right: 10 },
  askLine1: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 16,
    color: '#160b37',
  },
  askLine2: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    lineHeight: 18,
    color: '#9564d2',
  },
  services: {
    marginTop: 13,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingTop: 2,
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  consultRow: { flexDirection: 'row', gap: 8 },
  consultCard: {
    flex: 1,
    height: 102,
    borderRadius: 17,
    overflow: 'hidden',
  },
  consultTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16.5,
    lineHeight: 18.5,
    color: '#160b37',
    marginTop: 13,
    marginLeft: 12,
  },
  doctorPortrait: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 80,
    height: 51,
  },
  doctorFace: {
    position: 'absolute',
    right: 9,
    top: 30,
    width: 41,
    height: 31,
  },
  videoCall: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    width: 47,
    height: 71,
  },
  shortcutRow: { flexDirection: 'row', gap: 9, marginTop: 13 },
  shortcut: {
    flex: 1,
    height: 103,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1dcf5',
    borderRadius: 17,
    alignItems: 'center',
    shadowColor: 'rgba(53,35,66,0.19)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 3,
  },
  shortcutIcon: { width: 47, height: 47, marginTop: 8 },
  shortcutLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    lineHeight: 13.5,
    color: '#160b37',
    textAlign: 'center',
    marginTop: 7,
    width: '100%',
    paddingHorizontal: 1,
  },
  recentSection: { paddingHorizontal: 8, paddingTop: 31 },
  sectionHeading: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 19,
    color: '#160b37',
  },
  recentCard: {
    width: 134,
    height: 82,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginTop: 11,
  },
  physicianIcon: { width: 37, height: 30, marginLeft: 16, marginTop: 8 },
  recentSpecialty: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12.5,
    color: '#160b37',
    marginLeft: 16,
    marginTop: 4,
  },
  recentChannel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#160b37',
    marginLeft: 16,
    marginTop: 1,
  },
  promoCarousel: { height: 109, marginTop: 29, marginHorizontal: -8 },
  promoCarouselContent: { paddingLeft: 8, gap: 12 },
  promoCard: {
    width: 312,
    height: 109,
    flexShrink: 0,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  promoOfferCard: {
    width: 312,
    height: 109,
    flexShrink: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  affordableTitle: {
    position: 'absolute',
    left: 15,
    top: 15,
    width: 165,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#ffffff',
  },
  procedureList: {
    position: 'absolute',
    left: 180,
    top: 13,
    width: 110,
    fontFamily: 'Roboto_400Regular',
    fontSize: 9,
    lineHeight: 11,
    color: '#ffffff',
    textAlign: 'center',
  },
  estimateButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    width: 111,
    height: 23,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimateButtonText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    lineHeight: 14,
    color: '#303794',
  },
  affordableInsurance: {
    position: 'absolute',
    left: 15,
    top: 83,
    width: 167,
    fontFamily: 'Roboto_400Regular',
    fontSize: 7.5,
    lineHeight: 9,
    color: '#ffffff',
  },
  procedurePhoto: {
    position: 'absolute',
    left: 182,
    top: 45,
    width: 111,
    height: 70,
  },
  fullBodyTitle: {
    position: 'absolute',
    left: 15,
    top: 15,
    width: 165,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#ffffff',
  },
  checkupList: {
    position: 'absolute',
    left: 180,
    top: 13,
    width: 110,
    fontFamily: 'Roboto_400Regular',
    fontSize: 9,
    lineHeight: 11,
    color: '#ffffff',
    textAlign: 'center',
  },
  bookCheckupButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    width: 102,
    height: 23,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookCheckupButtonText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    lineHeight: 14,
    color: '#303794',
  },
  fullBodyInsurance: {
    position: 'absolute',
    left: 15,
    top: 83,
    width: 167,
    fontFamily: 'Roboto_400Regular',
    fontSize: 7.5,
    lineHeight: 9,
    color: '#ffffff',
  },
  checkupPhoto: {
    position: 'absolute',
    left: 182,
    top: 42,
    width: 111,
    height: 76,
  },
  promoTextBlock: { flex: 1, paddingLeft: 15, paddingTop: 11 },
  promoTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#ffffff',
  },
  promoDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 16.5,
    color: '#ffffff',
    marginTop: 4,
    width: 191,
  },
  askNow: {
    width: 82,
    height: 23,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  askNowText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11.5,
    color: '#6451b7',
  },
  promoIllustration: { width: 100, height: 109 },
  footerIllustration: {
    position: 'relative',
    marginTop: 32,
    marginHorizontal: -8,
    overflow: 'hidden',
  },
  footerImage: { ...StyleSheet.absoluteFillObject },
  navWrap: { position: 'absolute', left: 0, right: 0 },
  navBar: {
    marginHorizontal: 14,
    height: 78,
    borderRadius: 50,
    borderWidth: 1.2,
    borderColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    shadowColor: 'rgba(38,33,62,0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  tab: {
    flex: 1,
    height: 66,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabSelected: { backgroundColor: '#6650d6' },
  tabLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 9.5,
    lineHeight: 10,
    color: '#160b37',
    textAlign: 'center',
  },
  tabLabelSelected: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    color: '#ffffff',
  },
  gestureArea: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    alignItems: 'center',
  },
  homeIndicator: {
    width: 122,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#858585',
    marginTop: 5,
  },
});

