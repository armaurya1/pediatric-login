import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
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

// SVGs styled with lavender & dark palette matching the app UI
const ICONS = {
  backWhite: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 12H5M12 19L5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  pinLavender: `<svg width="15" height="19" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 0C3.8 0 0 3.7 0 8.3C0 14.2 8.5 22 8.5 22C8.5 22 17 14.2 17 8.3C17 3.7 13.2 0 8.5 0ZM8.5 5.6C7.73087 5.6 6.99325 5.90553 6.44939 6.44939C5.90553 6.99325 5.6 7.73087 5.6 8.5C5.6 9.26913 5.90553 10.0068 6.44939 10.5506C6.99325 11.0945 7.73087 11.4 8.5 11.4C9.26913 11.4 10.0068 11.0945 10.5506 10.5506C11.0945 10.0068 11.4 9.26913 11.4 8.5C11.4 7.73087 11.0945 6.99325 10.5506 6.44939C10.0068 5.90553 9.26913 5.6 8.5 5.6Z" fill="#6B52AE"/>
</svg>`,
  chevronDownLavender: `<svg width="11" height="7" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B52AE" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  phoneWhite: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.4019C21.1468 21.5901 20.9046 21.7332 20.6407 21.822C20.3769 21.9108 20.0974 21.9433 19.82 21.917C16.7628 21.5842 13.8254 20.5394 11.25 18.86C8.84711 17.3073 6.81267 15.2729 5.26 12.87C3.57529 10.2842 2.53006 7.33385 2.2 4.26C2.17387 3.98369 2.20612 3.70529 2.29467 3.44238C2.38321 3.17947 2.52608 2.9379 2.71383 2.73335C2.90158 2.52881 3.12999 2.36592 3.38407 2.25528C3.63816 2.14464 3.91222 2.08876 4.19 2.091H7.19C7.67448 2.08625 8.14361 2.25754 8.50974 2.57271C8.87588 2.88789 9.11369 3.32537 9.18 3.81C9.3033 4.71791 9.52528 5.60946 9.84 6.46C9.96788 6.80436 9.99264 7.17838 9.91107 7.53429C9.8295 7.89019 9.64506 8.21278 9.38 8.46L8.11 9.73C9.54988 12.2608 11.6492 14.3601 14.18 15.8L15.45 14.53C15.7072 14.2649 16.0298 14.0805 16.3857 13.9989C16.7416 13.9174 17.1156 13.9421 17.46 14.07C18.3105 14.3847 19.2021 14.6067 20.11 14.73C20.5997 14.7969 21.0416 15.0392 21.3564 15.4116C21.6711 15.784 21.8373 16.2602 21.82 16.75L22 16.92Z" fill="white"/>
</svg>`,
  whatsappGreen: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="#25D366"/>
  <path d="M16.56 14.39C16.31 14.26 15.09 13.66 14.86 13.58C14.64 13.5 14.47 13.46 14.31 13.71C14.14 13.96 13.66 14.52 13.51 14.68C13.37 14.85 13.22 14.87 12.97 14.75C12.72 14.62 11.92 14.36 10.97 13.52C10.23 12.86 9.73 12.05 9.59 11.8C9.44 11.55 9.57 11.42 9.7 11.29C9.81 11.18 9.95 11 10.07 10.86C10.19 10.72 10.23 10.62 10.31 10.45C10.39 10.28 10.35 10.14 10.29 10.02C10.23 9.89 9.73 8.67 9.52 8.17C9.32 7.68 9.12 7.74 8.97 7.74H8.5C8.33 7.74 8.06 7.8 7.84 8.05C7.61 8.29 6.99 8.87 6.99 10.05C6.99 11.23 7.85 12.37 7.97 12.53C8.09 12.69 9.66 15.11 12.07 16.15C12.64 16.4 13.09 16.54 13.43 16.65C14.01 16.83 14.53 16.81 14.95 16.74C15.42 16.67 16.38 16.16 16.59 15.58C16.79 14.99 16.79 14.49 16.73 14.39C16.67 14.28 16.51 14.22 16.26 14.09L16.56 14.39Z" fill="white"/>
</svg>`,
  whatsappWhiteOnGreen: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="white"/>
  <path d="M16.56 14.39C16.31 14.26 15.09 13.66 14.86 13.58C14.64 13.5 14.47 13.46 14.31 13.71C14.14 13.96 13.66 14.52 13.51 14.68C13.37 14.85 13.22 14.87 12.97 14.75C12.72 14.62 11.92 14.36 10.97 13.52C10.23 12.86 9.73 12.05 9.59 11.8C9.44 11.55 9.57 11.42 9.7 11.29C9.81 11.18 9.95 11 10.07 10.86C10.19 10.28 10.35 10.14 10.29 10.02C10.23 9.89 9.73 8.67 9.52 8.17C9.32 7.68 9.12 7.74 8.97 7.74H8.5C8.33 7.74 8.06 7.8 7.84 8.05C7.61 8.29 6.99 8.87 6.99 10.05C6.99 11.23 7.85 12.37 7.97 12.53C8.09 12.69 9.66 15.11 12.07 16.15C12.64 16.4 13.09 16.54 13.43 16.65C14.01 16.83 14.53 16.81 14.95 16.74C15.42 16.67 16.38 16.16 16.59 15.58C16.79 14.99 16.79 14.49 16.73 14.39C16.67 14.28 16.51 14.22 16.26 14.09L16.56 14.39Z" fill="#00a859"/>
</svg>`,
  checkWhite: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  closeDark: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 6L6 18M6 6L18 18" stroke="#1d1b26" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  searchLavender: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="11" cy="11" r="8" stroke="#6B52AE" stroke-width="2"/>
  <path d="M21 21L16.65 16.65" stroke="#6B52AE" stroke-width="2" stroke-linecap="round"/>
</svg>`,
};

export type PackageItem = {
  id: string;
  name: string;
  testCountBadge: string;
  ageGroup: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: any;
  testsCount: number;
  testsIncluded: string[];
  fastingInfo: string;
  sampleType: string;
  reportTime: string;
  description: string;
};

const PACKAGES: PackageItem[] = [
  {
    id: 'pkg-vitamin',
    name: 'Vitamin Deficiency Health Checkup',
    testCountBadge: 'Includes 5 tests',
    ageGroup: 'For Age:11-80yrs',
    price: 899,
    originalPrice: 1200,
    discount: '25% OFF',
    image: require('./assets/images/lab/pkg-vitamin-hd.png'),
    testsCount: 5,
    testsIncluded: [
      'Vitamin D (25-OH Cholecalciferol)',
      'Vitamin B12 (Cyanocobalamin)',
      'Serum Calcium Total',
      'Serum Inorganic Phosphorus',
      'Complete Blood Count (CBC)',
    ],
    fastingInfo: '8-10 hours overnight fasting recommended.',
    sampleType: 'Blood Sample (Home Collection)',
    reportTime: 'Within 24 hours (NABL Certified)',
    description:
      'Identifies essential vitamin & mineral deficiencies causing chronic fatigue, bone aches, hair loss, muscle pain, and poor immunity.',
  },
  {
    id: 'pkg-young-indian',
    name: 'Young Indian Health Checkup',
    testCountBadge: 'Includes 96 tests',
    ageGroup: 'For Age:30-50yrs',
    price: 2599,
    originalPrice: 3400,
    discount: '24% OFF',
    image: require('./assets/images/lab/pkg-young-indian-hd.png'),
    testsCount: 96,
    testsIncluded: [
      'Complete Blood Count (CBC - 24 parameters)',
      'Liver Function Test (LFT - 11 parameters)',
      'Kidney Function Test (KFT - 8 parameters)',
      'Lipid Profile for Heart (9 parameters)',
      'Fasting Blood Sugar (FBS) & HbA1c',
      'Total Thyroid Profile (T3, T4, TSH)',
      'Urine Complete Examination (20 parameters)',
      'Serum Electrolytes & Minerals',
    ],
    fastingInfo: '10-12 hours overnight fasting required.',
    sampleType: 'Blood & Urine (Home Collection)',
    reportTime: 'Within 24 hours (NABL Certified)',
    description:
      'Designed specifically for working individuals and young adults to screen for metabolic disorders, early cardiovascular risks, fatty liver, and stress markers.',
  },
  {
    id: 'pkg-full-body',
    name: 'Comprehensive Full Body Check',
    testCountBadge: 'Includes 106 tests',
    ageGroup: 'For Age:18-100yrs',
    price: 3499,
    originalPrice: 4500,
    discount: '22% OFF',
    image: require('./assets/images/lab/pkg-full-body-hd.png'),
    testsCount: 106,
    testsIncluded: [
      'Full Blood Hemogram & Anemia Screen (28 parameters)',
      'Comprehensive Liver Function & Enzymes',
      'Renal & Glomerular Filtration Screen (Creatinine, Urea, Uric Acid)',
      'Cardiac Risk & Extended Lipid Markers',
      'Diabetes Dual Screen (HbA1c & Fasting Glucose)',
      'Thyroid Hormone Panel (T3, T4, TSH Ultra)',
      'Vitamin D & Vitamin B12 Duo',
      'Urine Routine & Sediment Analysis',
    ],
    fastingInfo: '10-12 hours overnight fasting required.',
    sampleType: 'Blood & Urine (Home Collection)',
    reportTime: 'Within 24 hours (NABL Certified)',
    description:
      'Master health checkup covering all vital organ systems, hormonal balance, nutritional reserves, and blood vitality for adult men and women.',
  },
  {
    id: 'pkg-platinum',
    name: 'Annual Health Check - Platinum',
    testCountBadge: 'Includes 112 tests',
    ageGroup: 'For Age:18-100yrs',
    price: 4999,
    originalPrice: 6249,
    discount: '20% OFF',
    image: require('./assets/images/lab/pkg-platinum-hd.png'),
    testsCount: 112,
    testsIncluded: [
      'Complete Hemogram & Platelet Kinetics',
      'Advanced Liver Function & Protein Fractions',
      'Kidney & Electrolyte Filtration Panel',
      'Extended Cardiac Lipid Assessment & Apolipoproteins',
      'Diabetic Glycated Hemoglobin & Average Glucose (eAG)',
      'Thyroid Profile Total & Free Indices',
      'Master Vitamin & Mineral Suite (Vit D, B12, Iron, Ferritin, Calcium)',
      'Cardiac Enzymes & Inflammatory hs-CRP Marker',
      'Pancreatic Amylase & Lipase',
      'Urine Complete & Microalbuminuria',
    ],
    fastingInfo: '10-12 hours overnight fasting required.',
    sampleType: 'Blood & Urine (Home Collection)',
    reportTime: 'Within 24 hours (NABL Certified)',
    description:
      'Gold-standard executive wellness checkup providing an exhaustive evaluation of heart, metabolic, endocrinological, and nutritional health.',
  },
];

const LOCATIONS = ['Bangalore', 'Barabanki', 'Lucknow', 'Delhi NCR', 'Mumbai'];

type Props = {
  onBack: () => void;
};

export default function LabTestsScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  // Location selector state
  const [selectedLocation, setSelectedLocation] = useState('Bangalore');
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Cart & booking state
  const [bookedIds, setBookedIds] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // 2-column card width matching the design
  const cardWidth = Math.floor((windowWidth - 36) / 2);

  // Toggle book action
  const toggleBook = (pkg: PackageItem) => {
    setBookedIds((prev) =>
      prev.includes(pkg.id) ? prev.filter((id) => id !== pkg.id) : [...prev, pkg.id],
    );
  };

  // Filtered packages
  const displayedPackages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PACKAGES;
    return PACKAGES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.testCountBadge.toLowerCase().includes(q) ||
        p.ageGroup.toLowerCase().includes(q) ||
        p.testsIncluded.some((t) => t.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  // Expert calling action
  const handleCallExpert = () => {
    Alert.alert(
      'Connect with Care Expert',
      'Our medical diagnostics advisor is available to help you choose the best tests for your needs.\n\nCall 1800-123-CARE (Toll Free)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL('tel:18001232273').catch(() => {
              Alert.alert('Phone Call', 'Dialing 1800-123-CARE');
            });
          },
        },
      ],
    );
  };

  // WhatsApp chat action
  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Hello! I want to book a Health Checkup in ${selectedLocation}. Please connect me with a diagnostics expert.`,
    );
    const url = `whatsapp://send?text=${text}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        'WhatsApp Support',
        `Connected to Care WhatsApp Diagnostics Desk.\n\nMessage: "Hello! I want to book a Health Checkup in ${selectedLocation}."`,
      );
    });
  };

  // Checkout confirmation
  const handleCheckoutCart = () => {
    const booked = PACKAGES.filter((p) => bookedIds.includes(p.id));
    const total = booked.reduce((acc, p) => acc + p.price, 0);
    Alert.alert(
      'Confirm Sample Collection',
      `You have selected ${booked.length} package(s) for a total of ₹${total}.\n\nLocation: ${selectedLocation}\n\nA certified phlebotomist will arrive for painless home sample collection at your scheduled morning slot.`,
      [
        { text: 'Modify', style: 'cancel' },
        {
          text: 'Confirm Booking',
          onPress: () => {
            Alert.alert(
              'Booking Confirmed!',
              'Your health checkup sample collection is scheduled. Our care team will contact you shortly.',
            );
            setBookedIds([]);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      {/* Light status bar icons on dark lavender header */}
      <StatusBar style="light" />

      {/* 1. Dark Lavender Header (Replaces Blue matching the app design) */}
      <LinearGradient
        colors={['#271852', '#3e2677', '#4d3191']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <Pressable
          onPress={onBack}
          style={styles.headerBackBtn}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <SvgXml xml={ICONS.backWhite} width={24} height={24} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Care | Full Body Health Checkup for e...
        </Text>
      </LinearGradient>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Location Row (Lavender Pin & Text) */}
        <Pressable
          style={styles.locationRow}
          onPress={() => setShowLocationModal(true)}
          accessibilityRole="button"
          accessibilityLabel={`Change location, current is ${selectedLocation}`}
        >
          <SvgXml xml={ICONS.pinLavender} width={15} height={19} />
          <Text style={styles.locationText}>{selectedLocation}</Text>
          <SvgXml xml={ICONS.chevronDownLavender} width={11} height={7} />
        </Pressable>

        {/* 3. Hero Scooter Delivery Illustration */}
        <View style={styles.heroWrap}>
          <Image
            source={require('./assets/images/lab/hero-delivery-hd.png')}
            style={[styles.heroImage, { width: windowWidth - 28, height: Math.min(windowWidth - 28, 250) }]}
            resizeMode="contain"
          />
        </View>

        {/* 4. Talk to Care Expert Section */}
        <View style={styles.expertSection}>
          <View style={styles.expertHeaderRow}>
            <Image
              source={require('./assets/images/lab/expert-avatar-hd.png')}
              style={styles.expertAvatar}
              resizeMode="cover"
            />
            <View style={styles.expertTextWrap}>
              <Text style={styles.expertTitle}>Talk to Care expert to book tests</Text>
              <Text style={styles.expertSub}>
                You will be connected with Care expert on call to book tests
              </Text>
            </View>
          </View>

          {/* Primary Action: Call us to book tests (Lavender button replacing blue) */}
          <Pressable
            style={({ pressed }) => [styles.callBtnWrap, pressed && { opacity: 0.9 }]}
            onPress={handleCallExpert}
            accessibilityRole="button"
            accessibilityLabel="Call us to book tests"
          >
            <LinearGradient
              colors={['#7e60d5', '#6b52ae', '#583ea2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.callBtnGradient}
            >
              <SvgXml xml={ICONS.phoneWhite} width={18} height={18} />
              <Text style={styles.callBtnText}>Call us to book tests</Text>
            </LinearGradient>
          </Pressable>

          {/* Secondary Action: Chat on Whatsapp */}
          <Pressable
            style={({ pressed }) => [styles.whatsAppBtn, pressed && { opacity: 0.85 }]}
            onPress={handleWhatsAppChat}
            accessibilityRole="button"
            accessibilityLabel="Chat on WhatsApp"
          >
            <SvgXml xml={ICONS.whatsappGreen} width={20} height={20} />
            <Text style={styles.whatsAppBtnText}>Chat on Whatsapp</Text>
          </Pressable>

          {/* Disclaimer */}
          <Text style={styles.disclaimerText}>
            On clicking, you agree to Care to message you over WhatsApp
          </Text>
        </View>

        {/* Optional Search Bar */}
        <View style={styles.searchBar}>
          <SvgXml xml={ICONS.searchLavender} width={18} height={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search health checkups, vitamins, organs..."
            placeholderTextColor="#8a859e"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <SvgXml xml={ICONS.closeDark} width={16} height={16} />
            </Pressable>
          )}
        </View>

        {/* 5. Health Checkup Packages (2-Column Grid matching Screenshot 2) */}
        <View style={styles.packageGrid}>
          {displayedPackages.map((pkg) => {
            const isBooked = bookedIds.includes(pkg.id);
            return (
              <Pressable
                key={pkg.id}
                style={[styles.packageCard, { width: cardWidth }]}
                onPress={() => setSelectedPackage(pkg)}
                accessibilityRole="button"
                accessibilityLabel={`${pkg.name}, ${pkg.testCountBadge}, price ₹${pkg.price}`}
              >
                {/* Package Card Top Photo */}
                <View style={styles.cardImageContainer}>
                  <Image source={pkg.image} style={styles.cardImage} resizeMode="cover" />
                  {/* Test count pill badge overlapping image bottom */}
                  <View style={styles.testBadgePill}>
                    <Text style={styles.testBadgeText}>{pkg.testCountBadge}</Text>
                  </View>
                </View>

                {/* Package Content */}
                <View style={styles.cardBody}>
                  <Text style={styles.pkgTitle} numberOfLines={2}>
                    {pkg.name}
                  </Text>
                  <Text style={styles.pkgAge}>{pkg.ageGroup}</Text>

                  {/* Price Row */}
                  <View style={styles.pkgPriceRow}>
                    <Text style={styles.pkgPrice}>₹{pkg.price}</Text>
                    <Text style={styles.pkgOriginalPrice}>₹{pkg.originalPrice}</Text>
                  </View>

                  {/* Book Now Button */}
                  <Pressable
                    style={[styles.bookBtn, isBooked && styles.bookedBtn]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleBook(pkg);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={isBooked ? `Remove ${pkg.name}` : `Book ${pkg.name}`}
                  >
                    {isBooked ? (
                      <View style={styles.bookBtnInner}>
                        <SvgXml xml={ICONS.checkWhite} width={14} height={14} />
                        <Text style={styles.bookedBtnText}>Booked</Text>
                      </View>
                    ) : (
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    )}
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* 6. Sticky Bottom Floating Bar (Exact match with Screenshots) */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomBarLeft}>
          <View style={styles.bottomAvatarWrap}>
            <Image
              source={require('./assets/images/lab/expert-avatar-hd.png')}
              style={styles.bottomAvatar}
              resizeMode="cover"
            />
            {/* Green Online Status Dot */}
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.bottomExpertsText}>20+ Experts Online</Text>
        </View>

        {bookedIds.length > 0 ? (
          <Pressable
            style={({ pressed }) => [styles.cartCheckoutBtn, pressed && { opacity: 0.9 }]}
            onPress={handleCheckoutCart}
            accessibilityRole="button"
            accessibilityLabel={`Checkout ${bookedIds.length} packages`}
          >
            <Text style={styles.cartCheckoutText}>Book ({bookedIds.length})</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.chatToBookBtn, pressed && { opacity: 0.9 }]}
            onPress={handleWhatsAppChat}
            accessibilityRole="button"
            accessibilityLabel="Chat to Book Tests on WhatsApp"
          >
            <SvgXml xml={ICONS.whatsappWhiteOnGreen} width={22} height={22} />
            <Text style={styles.chatToBookText}>Chat to Book{'\n'}Tests</Text>
          </Pressable>
        )}
      </View>

      {/* Package Detail Modal */}
      <Modal
        visible={selectedPackage !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPackage(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedPackage(null)} />
          {selectedPackage && (
            <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.modalBadge}>{selectedPackage.testCountBadge}</Text>
                  <Text style={styles.modalTitle}>{selectedPackage.name}</Text>
                  <Text style={styles.modalAge}>{selectedPackage.ageGroup}</Text>
                </View>
                <Pressable
                  onPress={() => setSelectedPackage(null)}
                  hitSlop={10}
                  style={styles.modalCloseBtn}
                >
                  <SvgXml xml={ICONS.closeDark} width={20} height={20} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalDesc}>{selectedPackage.description}</Text>

                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Home Sample:</Text>
                  <Text style={styles.modalInfoValue}>{selectedPackage.sampleType}</Text>
                </View>

                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Fasting:</Text>
                  <Text style={styles.modalInfoValue}>{selectedPackage.fastingInfo}</Text>
                </View>

                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Report Delivery:</Text>
                  <Text style={styles.modalInfoValue}>{selectedPackage.reportTime}</Text>
                </View>

                <Text style={styles.modalSectionTitle}>Key Tests Included:</Text>
                {selectedPackage.testsIncluded.map((t, idx) => (
                  <View key={idx} style={styles.modalTestItem}>
                    <Text style={styles.modalBullet}>•</Text>
                    <Text style={styles.modalTestItemText}>{t}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <View>
                  <Text style={styles.modalPriceText}>₹{selectedPackage.price}</Text>
                  <Text style={styles.modalOrigPriceText}>₹{selectedPackage.originalPrice}</Text>
                </View>
                <Pressable
                  style={[
                    styles.modalBookBtn,
                    bookedIds.includes(selectedPackage.id) && styles.modalBookedBtn,
                  ]}
                  onPress={() => {
                    toggleBook(selectedPackage);
                    setSelectedPackage(null);
                  }}
                >
                  <Text style={styles.modalBookBtnText}>
                    {bookedIds.includes(selectedPackage.id) ? 'Remove' : 'Book Package'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowLocationModal(false)} />
          <View style={styles.locationModalCard}>
            <Text style={styles.locationModalTitle}>Select Your City</Text>
            {LOCATIONS.map((loc) => {
              const selected = selectedLocation === loc;
              return (
                <Pressable
                  key={loc}
                  style={[styles.locationOption, selected && styles.locationOptionSelected]}
                  onPress={() => {
                    setSelectedLocation(loc);
                    setShowLocationModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.locationOptionText,
                      selected && styles.locationOptionTextSelected,
                    ]}
                  >
                    {loc}
                  </Text>
                  {selected && <SvgXml xml={ICONS.checkWhite} width={14} height={14} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // 1. Header (Dark Lavender Gradient replacing Blue)
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: 'rgba(39, 24, 82, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  headerBackBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Roboto_700Bold',
    fontSize: 16.5,
    color: '#ffffff',
    letterSpacing: -0.2,
  },

  scrollContent: {
    paddingHorizontal: 14,
  },

  // 2. Location Row
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 2,
    gap: 6,
  },
  locationText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 15,
    color: '#6B52AE',
    letterSpacing: 0.1,
  },

  // 3. Hero Scooter Delivery Illustration
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  heroImage: {
    borderRadius: 16,
  },

  // 4. Talk to Care Expert Section
  expertSection: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eceef6',
    shadowColor: 'rgba(20, 24, 40, 0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  expertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  expertAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#d7cbee',
  },
  expertTextWrap: {
    flex: 1,
  },
  expertTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15.5,
    color: '#1a1d2e',
    lineHeight: 20,
  },
  expertSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#555b70',
    marginTop: 3,
    lineHeight: 16,
  },

  // Call us to book tests (Lavender button replacing blue)
  callBtnWrap: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  callBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    gap: 8,
  },
  callBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14.5,
    color: '#ffffff',
    letterSpacing: 0.2,
  },

  // Secondary Chat on Whatsapp button
  whatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#d0d5dd',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  whatsAppBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14.5,
    color: '#1d1b26',
  },
  disclaimerText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#82889e',
    textAlign: 'center',
    marginTop: 10,
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f4fa',
    borderWidth: 1,
    borderColor: '#e7e2f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    color: '#1a1d2e',
    padding: 0,
  },

  // 5. 2-Column Package Grid
  packageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 18,
    rowGap: 16,
  },
  packageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ebf2',
    overflow: 'hidden',
    shadowColor: 'rgba(20, 24, 40, 0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImageContainer: {
    position: 'relative',
    height: 142,
    width: '100%',
    backgroundColor: '#f3f4f6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  testBadgePill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf0f6',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  testBadgeText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#344054',
  },
  cardBody: {
    padding: 12,
  },
  pkgTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#1d1b26',
    lineHeight: 18,
    minHeight: 36,
  },
  pkgAge: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#717684',
    marginTop: 4,
  },
  pkgPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 10,
    marginBottom: 10,
  },
  pkgPrice: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#009e4f',
  },
  pkgOriginalPrice: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#98a2b3',
    textDecorationLine: 'line-through',
  },
  bookBtn: {
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#344054',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookedBtn: {
    backgroundColor: '#6b52ae',
    borderColor: '#6b52ae',
  },
  bookBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12.5,
    color: '#1d1b26',
  },
  bookedBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12.5,
    color: '#ffffff',
  },

  // 6. Sticky Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f2f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: 'rgba(20, 24, 40, 0.1)',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomAvatarWrap: {
    position: 'relative',
    width: 38,
    height: 38,
  },
  bottomAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  onlineDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16a34a',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  bottomExpertsText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#1d1b26',
  },
  chatToBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00a859',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  chatToBookText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    lineHeight: 15,
    color: '#ffffff',
  },
  cartCheckoutBtn: {
    backgroundColor: '#6b52ae',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cartCheckoutText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#ffffff',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 18,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f6',
  },
  modalBadge: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11.5,
    color: '#6b52ae',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#1d1b26',
    lineHeight: 22,
  },
  modalAge: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#667085',
    marginTop: 3,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    paddingVertical: 14,
  },
  modalDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    lineHeight: 19,
    color: '#475467',
    marginBottom: 14,
  },
  modalInfoRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  modalInfoLabel: {
    width: 120,
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#1d1b26',
  },
  modalInfoValue: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#475467',
  },
  modalSectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14.5,
    color: '#1d1b26',
    marginTop: 16,
    marginBottom: 8,
  },
  modalTestItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    gap: 8,
  },
  modalBullet: {
    color: '#6b52ae',
    fontSize: 16,
    lineHeight: 18,
  },
  modalTestItemText: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#344054',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f6',
  },
  modalPriceText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 19,
    color: '#009e4f',
  },
  modalOrigPriceText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#98a2b3',
    textDecorationLine: 'line-through',
  },
  modalBookBtn: {
    backgroundColor: '#6b52ae',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  modalBookedBtn: {
    backgroundColor: '#dc2626',
  },
  modalBookBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#ffffff',
  },

  // Location Modal
  locationModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 18,
    gap: 8,
  },
  locationModalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#1d1b26',
    marginBottom: 8,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  locationOptionSelected: {
    backgroundColor: '#6b52ae',
  },
  locationOptionText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14.5,
    color: '#1d1b26',
  },
  locationOptionTextSelected: {
    color: '#ffffff',
    fontFamily: 'Roboto_700Bold',
  },
});
