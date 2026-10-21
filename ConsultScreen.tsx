import { useMemo, useRef, useState } from 'react';
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

const CLEAR_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4L4 12M4 4L12 12" stroke="#7e8184" stroke-width="2" stroke-linecap="round"/>
</svg>`;

type Specialty = {
  label: string;
  name: string;
  keywords: string[];
  image: number;
};

const ALL_SPECIALTIES: Specialty[] = [
  {
    label: 'General\nPractitioner',
    name: 'General Practitioner',
    keywords: ['general', 'physician', 'practitioner', 'doctor', 'fever', 'cold', 'cough', 'flu', 'headache', 'infection'],
    image: require('./assets/images/consult/general-practitioner.png'),
  },
  {
    label: "Women's\nHealth",
    name: "Women's Health",
    keywords: ['women', 'health', 'gynecology', 'gynaecology', 'pregnancy', 'period', 'fertility', 'pcos'],
    image: require('./assets/images/consult/womens-health.png'),
  },
  {
    label: 'Dermatology',
    name: 'Dermatology',
    keywords: ['dermatology', 'skin', 'hair', 'acne', 'rash', 'pimples', 'scalp', 'allergy'],
    image: require('./assets/images/consult/dermatology.png'),
  },
  {
    label: 'Psychiatry',
    name: 'Psychiatry',
    keywords: ['psychiatry', 'mental', 'depression', 'anxiety', 'stress', 'therapy', 'mood', 'sleep'],
    image: require('./assets/images/consult/psychiatry.png'),
  },
  {
    label: 'Urology',
    name: 'Urology',
    keywords: ['urology', 'kidney', 'urine', 'urinary', 'bladder', 'prostate', 'stone'],
    image: require('./assets/images/consult/urology.png'),
  },
  {
    label: 'ENT',
    name: 'ENT',
    keywords: ['ent', 'ear', 'nose', 'throat', 'sinus', 'hearing', 'tonsil'],
    image: require('./assets/images/consult/ent.png'),
  },
  {
    label: 'Cardiology',
    name: 'Cardiology',
    keywords: ['cardiology', 'heart', 'cardio', 'chest', 'bp', 'blood pressure', 'hypertension'],
    image: require('./assets/images/consult/cardiology.png'),
  },
  {
    label: 'Paediatrics',
    name: 'Paediatrics',
    keywords: ['paediatrics', 'pediatrics', 'child', 'baby', 'kids', 'infant', 'vaccination'],
    image: require('./assets/images/consult/paediatrics.png'),
  },
  {
    label: 'Digestive\nHealth',
    name: 'Digestive Health',
    keywords: ['digestive', 'health', 'gastro', 'stomach', 'gut', 'acidity', 'gas', 'constipation', 'digestion'],
    image: require('./assets/images/consult/digestive-health.png'),
  },
  {
    label: 'Neurology',
    name: 'Neurology',
    keywords: ['neurology', 'neuro', 'brain', 'nerves', 'migraine', 'stroke', 'seizure', 'paralysis'],
    image: require('./assets/images/consult/neurology.png'),
  },
  {
    label: 'Orthopaedics',
    name: 'Orthopaedics',
    keywords: ['orthopaedics', 'ortho', 'bone', 'joint', 'fracture', 'knee', 'back pain', 'spine', 'muscle'],
    image: require('./assets/images/consult/orthopaedics.png'),
  },
  {
    label: 'Thyroid\nCare',
    name: 'Thyroid Care',
    keywords: ['thyroid', 'care', 'hormone', 'weight', 'hypothyroid', 'hyperthyroid', 'goiter'],
    image: require('./assets/images/consult/thyroid-care.png'),
  },
  {
    label: 'Diabetology',
    name: 'Diabetology',
    keywords: ['diabetology', 'diabetes', 'sugar', 'glucose', 'insulin', 'hba1c'],
    image: require('./assets/images/consult/diabetology.png'),
  },
];

export default function ConsultScreen({
  onBack,
  onSelectDoctor,
}: {
  onBack: () => void;
  onSelectDoctor?: (specialtyName: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const items = q
      ? ALL_SPECIALTIES.filter((s) => {
          const cleanName = s.name.toLowerCase();
          const cleanLabel = s.label.replace('\n', ' ').toLowerCase();
          return (
            cleanName.includes(q) ||
            cleanLabel.includes(q) ||
            s.keywords.some((k) => k.includes(q) || q.includes(k))
          );
        })
      : ALL_SPECIALTIES;

    const rows: Specialty[][] = [];
    for (let i = 0; i < items.length; i += 4) {
      rows.push(items.slice(i, i + 4));
    }
    return rows;
  }, [searchQuery]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Consultation header (Figma 22:194) */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.titleGroup}>
            <Pressable
              style={styles.backButton}
              onPress={onBack}
              accessibilityLabel="Back"
              hitSlop={8}
            >
              <SvgXml xml={BACK_SVG} width={25} height={16} />
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>
              ONLINE CONSULTANT
            </Text>
          </View>

          <View style={styles.locationRow}>
            <SvgXml xml={PIN_SVG} width={11} height={15} />
            <Text style={styles.locationText} numberOfLines={1}>
              Barabanki 225003
            </Text>
            <SvgXml xml={CHEVRON_SVG} width={10} height={7} />
          </View>
        </View>

        <Pressable
          style={styles.searchBar}
          onPress={() => inputRef.current?.focus()}
        >
          <SvgXml xml={SEARCH_SVG} width={22} height={24} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Doctors, specialties, symptoms..."
            placeholderTextColor="#7e8184"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable
              style={styles.clearIconButton}
              onPress={() => setSearchQuery('')}
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <SvgXml xml={CLEAR_SVG} width={16} height={16} />
            </Pressable>
          )}
        </Pressable>
      </View>

      {/* Medical specialties (Figma 22:207) */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery.trim()
              ? `Search Results (${filteredRows.reduce((acc, r) => acc + r.length, 0)})`
              : 'Speciality'}
          </Text>

          {filteredRows.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No matches found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching for general practitioner, dermatology, heart, fever, etc.
              </Text>
              <Pressable
                style={styles.clearBtn}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearBtnText}>Clear Search</Text>
              </Pressable>
            </View>
          ) : (
            filteredRows.map((row, i) => (
              <View
                key={i}
                style={[styles.tileRow, i > 0 && styles.tileRowGap]}
              >
                {row.map((item) => (
                  <Pressable
                    key={item.label}
                    style={({ pressed }) => [
                      styles.tile,
                      pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
                    ]}
                    onPress={() => onSelectDoctor?.(item.name)}
                    accessibilityRole="button"
                    accessibilityLabel={item.label.replace('\n', ' ')}
                  >
                    <View style={styles.tileCard}>
                      <Image
                        source={item.image}
                        style={styles.tileImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.tileLabel}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#d8d0e8',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 25,
    height: 16,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#6b52ae',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    color: '#1d1b26',
  },
  searchBar: {
    marginTop: 14,
    marginHorizontal: 14,
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
    height: '100%',
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: '#1d1b26',
    paddingVertical: 0,
    outlineWidth: 0,
  } as object,
  clearIconButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#1d1b26',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#7e8184',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  clearBtn: {
    backgroundColor: '#6b52ae',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  clearBtnText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#ffffff',
  },
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
    backgroundColor: '#f5ede0',
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
});
