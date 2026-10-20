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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';

type Props = {
  onBack: () => void;
};

const SPECIALTIES = [
  {
    label: 'General\nPractitioner',
    image: require('./assets/images/consult/general-practitioner.png'),
  },
  {
    label: "Women's\nHealth",
    image: require('./assets/images/consult/womens-health.png'),
  },
  {
    label: 'Dermatology',
    image: require('./assets/images/consult/dermatology.png'),
  },
  {
    label: 'Psychiatry',
    image: require('./assets/images/consult/psychiatry.png'),
  },
  {
    label: 'Urology',
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
