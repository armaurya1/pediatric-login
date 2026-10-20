import {
  Image,
  Pressable,
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
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';
import { SvgXml } from 'react-native-svg';

// SVG assets downloaded from Figma node 22:193 (file q4OVzpZDgUgZoTikqnYWoh)
const BACK_SVG = `<svg width="27.7371" height="18.3" viewBox="0 0 27.7371 18.3" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.5871 9.15H1.58707M9.19576 17.15L1.58707 9.15L9.19576 1.15" stroke="#6B52AE" stroke-width="2.3" stroke-linecap="round"/>
</svg>`;

const PIN_SVG = `<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 0.549805C6.81088 0.549805 8.06934 1.07575 8.99805 2.01367C9.92697 2.95198 10.4502 4.22633 10.4502 5.55566C10.4502 6.34919 10.148 7.30859 9.64648 8.33691C9.14967 9.35563 8.48184 10.394 7.80469 11.3311C7.12889 12.2662 6.45104 13.0898 5.94238 13.6807C5.77516 13.8749 5.62417 14.0419 5.5 14.1807C5.37583 14.0419 5.22484 13.8749 5.05762 13.6807C4.54896 13.0898 3.87111 12.2662 3.19531 11.3311C2.51816 10.394 1.85033 9.35563 1.35352 8.33691C0.852039 7.30859 0.549832 6.34919 0.549805 5.55566C0.549805 4.22633 1.07303 2.95198 2.00195 2.01367C2.93066 1.07575 4.18912 0.549805 5.5 0.549805ZM7.15039 5.44434C7.15039 5.88956 6.97503 6.31573 6.66504 6.62891C6.35517 6.94191 5.93581 7.11621 5.5 7.11621C5.06419 7.11621 4.64483 6.94191 4.33496 6.62891C4.02497 6.31573 3.84961 5.88956 3.84961 5.44434C3.84964 4.9991 4.02493 4.57293 4.33496 4.25977C4.64483 3.94677 5.06419 3.77246 5.5 3.77246C5.93581 3.77246 6.35517 3.94677 6.66504 4.25977C6.97507 4.57293 7.15036 4.9991 7.15039 5.44434ZM8.25 5.44434C8.24997 4.71091 7.96137 4.00661 7.44629 3.48633C6.931 2.96584 6.23113 2.67188 5.5 2.67188C4.76887 2.67188 4.069 2.96584 3.55371 3.48633C3.03863 4.00661 2.75003 4.71091 2.75 5.44434C2.75 6.17775 3.03867 6.88205 3.55371 7.40234C4.069 7.92284 4.76886 8.2168 5.5 8.2168C6.23114 8.2168 6.931 7.92284 7.44629 7.40234C7.96133 6.88205 8.25 6.17775 8.25 5.44434Z" stroke="#6B52AE" stroke-width="1.1"/>
</svg>`;

const CHEVRON_SVG = `<svg width="11.8001" height="9.44849" viewBox="0 0 11.8001 9.44849" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.90007 0.90007L5.90007 7.90007L10.9001 0.90007" stroke="#6B52AE" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const SEARCH_SVG = `<svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4C14.6667 4 16 5.33333 16 8" stroke="#6B52AE" stroke-width="1.2" stroke-linecap="round"/>
<path d="M16 17L23 24" stroke="#6B52AE" stroke-width="1.8" stroke-linecap="round"/>
<circle cx="10" cy="10" r="8.1" stroke="#6B52AE" stroke-width="1.8"/>
</svg>`;

// Specialty artwork cropped from the Figma node's own hi-res reference
// sheet (1376x3104) at each tile's exact window coordinates.
const SPECIALTIES: { label: string; image: number }[][] = [
  [
    { label: 'General\nPractitioner', image: require('./assets/images/consult/spec-general.png') },
    { label: "Women's\nHealth", image: require('./assets/images/consult/spec-women.png') },
    { label: 'Dermatology', image: require('./assets/images/consult/spec-dermatology.png') },
    { label: 'Psychiatry', image: require('./assets/images/consult/spec-psychiatry.png') },
  ],
  [
    { label: 'Urology', image: require('./assets/images/consult/spec-urology.png') },
    { label: 'ENT', image: require('./assets/images/consult/spec-ent.png') },
    { label: 'Cardiology', image: require('./assets/images/consult/spec-cardiology.png') },
    { label: 'Paediatrics', image: require('./assets/images/consult/spec-paediatrics.png') },
  ],
  [
    { label: 'Digestive\nHealth', image: require('./assets/images/consult/spec-digestive.png') },
    { label: 'Neurology', image: require('./assets/images/consult/spec-neurology.png') },
    { label: 'Orthopaedics', image: require('./assets/images/consult/spec-orthopaedics.png') },
    { label: 'Thyroid\nCare', image: require('./assets/images/consult/spec-thyroid.png') },
  ],
  [
    { label: 'Diabetology', image: require('./assets/images/consult/spec-diabetology.png') },
  ],
];

export default function ConsultScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Consultation header (Figma 22:194) */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Back"
        >
          <SvgXml xml={BACK_SVG} width={25} height={16} />
        </Pressable>
        <Text style={styles.headerTitle}>ONLINE CONSULT</Text>

        <Text style={styles.locationLabel}>Your Location:</Text>
        <View style={styles.locationRow}>
          <SvgXml xml={PIN_SVG} width={11} height={15} />
          <Text style={styles.locationText}>Barabanki 225003</Text>
          <SvgXml xml={CHEVRON_SVG} width={10} height={7} />
        </View>

        <View style={styles.searchBar}>
          <SvgXml xml={SEARCH_SVG} width={22} height={24} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Doctors, specialties, symptoms..."
            placeholderTextColor="#7e8184"
          />
        </View>
      </View>

      {/* Medical specialties (Figma 22:207) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Speciality</Text>

        {SPECIALTIES.map((row, i) => (
          <View
            key={i}
            style={[styles.tileRow, i > 0 && styles.tileRowGap]}
          >
            {row.map((item) => (
              <View key={item.label} style={styles.tile}>
                <View style={styles.tileCard}>
                  <Image
                    source={item.image}
                    style={styles.tileImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.tileLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.symptomsRow}>
          <Text style={styles.symptomsTitle}>Find Doctor by Symptoms</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#efedff',
  },
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
    fontSize: 15,
    color: '#1d1b26',
    outlineWidth: 0,
  } as object,
  section: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  sectionTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 18,
    color: '#1d1b26',
    marginBottom: 27,
  },
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 13,
  },
  tileRowGap: {
    marginTop: 26,
  },
  tile: {
    width: 73,
    alignItems: 'center',
  },
  tileCard: {
    width: 73,
    height: 73,
    backgroundColor: '#ffffff',
    borderRadius: 13,
    shadowColor: 'rgba(20, 37, 51, 0.22)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 1,
    elevation: 4,
    padding: 4,
  },
  tileImage: {
    width: 65,
    height: 65,
    borderRadius: 9,
  },
  tileLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#1d1b26',
    textAlign: 'center',
    width: 86,
    marginTop: 9,
  },
  symptomsRow: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 5,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAll: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#6b52ae',
  },
  symptomsTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17.5,
    color: '#1d1b26',
  },
});
