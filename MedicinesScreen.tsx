import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

// Icons: the screen's own Figma SVGs (node 160:233).
const BACK_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 12H5M12 19L5 12L12 5" stroke="#19112C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const PIN_SVG = `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><g><rect width="23" height="23" rx="11.5" fill="#FF503E"/><path d="M6.94829 10.0398L15.3538 6.64159C16.4745 6.26401 16.7734 6.64159 16.2504 7.77434L13.4485 15.7035C12.8508 16.8363 12.2905 16.7608 11.7674 15.477L10.8709 12.3053L7.50866 11.7389C6.38793 11.3614 6.20114 10.795 6.94829 10.0398Z" fill="white"/></g></svg>`;
const CART_SVG = `<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M1.9642 1.8788H3.88087L4.9071 6.46236M4.9071 6.46236L6.43003 13.2644C6.52355 13.6814 6.76609 14.0541 7.11592 14.3185C7.46575 14.5828 7.90099 14.7223 8.3467 14.7128H17.7192C18.1554 14.7121 18.5783 14.5691 18.9181 14.3074C19.2579 14.0458 19.4942 13.681 19.588 13.2735L21.1692 6.46236H4.9071ZM4.9071 6.46236H4.90628M8.6248 19.2507C8.6248 19.757 8.19574 20.1674 7.66647 20.1674C7.1372 20.1674 6.70814 19.757 6.70814 19.2507C6.70814 18.7444 7.1372 18.334 7.66647 18.334C8.19574 18.334 8.6248 18.7444 8.6248 19.2507ZM19.1665 19.2507C19.1665 19.757 18.7374 20.1674 18.2081 20.1674C17.6789 20.1674 17.2498 19.757 17.2498 19.2507C17.2498 18.7444 17.6789 18.334 18.2081 18.334C18.7374 18.334 19.1665 18.7444 19.1665 19.2507Z" stroke-width="1.7" stroke-linecap="round" stroke="#19112C"/></g></svg>`;
const SEARCH_SVG = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M14.8751 15.7501L11.8009 12.4951M13.4583 8.25C13.4583 11.5637 10.9213 14.25 7.79167 14.25C4.66205 14.25 2.125 11.5637 2.125 8.25C2.125 4.93629 4.66205 2.25 7.79167 2.25C10.9213 2.25 13.4583 4.93629 13.4583 8.25Z" stroke-width="1.7" stroke-linecap="round" stroke="#827D90"/></g></svg>`;

// Category product photos: Figma 4x exports (312x316 for a 78x79 display).
const CATEGORIES: { label: string; image: number }[][] = [
  [
    { label: 'Vitamins &\nSupplements', image: require('./assets/images/medicines/med-vitamins.png') },
    { label: 'Homeopathy', image: require('./assets/images/medicines/med-homeopathy.png') },
    { label: 'Monitoring\nDevices', image: require('./assets/images/medicines/med-monitoring.png') },
    { label: 'Protein\nSupplements', image: require('./assets/images/medicines/med-protein.png') },
  ],
  [
    { label: 'Other\nMedicines', image: require('./assets/images/medicines/med-other-medicines.png') },
    { label: 'Ayurvedic\nWellness', image: require('./assets/images/medicines/med-ayurvedic.png') },
    { label: 'Food &\nNutrition', image: require('./assets/images/medicines/med-food.png') },
    { label: 'Other', image: require('./assets/images/medicines/med-other.png') },
  ],
  [
    { label: 'Skin Care', image: require('./assets/images/medicines/med-skin.png') },
    { label: 'Men Care', image: require('./assets/images/medicines/med-men.png') },
    { label: 'Women Care', image: require('./assets/images/medicines/med-women.png') },
    { label: 'Elderly Care', image: require('./assets/images/medicines/med-elderly.png') },
  ],
  [
    { label: 'Pain Relief', image: require('./assets/images/medicines/med-pain.png') },
    { label: 'Supports &\nBraces', image: require('./assets/images/medicines/med-supports.png') },
    { label: 'Gut Care', image: require('./assets/images/medicines/med-gut.png') },
    { label: 'Pollution\nEssentials', image: require('./assets/images/medicines/med-pollution.png') },
  ],
  [
    { label: 'Diabetes', image: require('./assets/images/medicines/med-diabetes.png') },
    { label: 'Hair Care', image: require('./assets/images/medicines/med-hair.png') },
    { label: 'Oral Care', image: require('./assets/images/medicines/med-oral.png') },
    { label: 'Cold, Cough', image: require('./assets/images/medicines/med-cold.png') },
  ],
];

export default function MedicinesScreen({ onBack }: { onBack?: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Delivery location + cart */}
        <View style={styles.topRow}>
          {onBack && (
            <Pressable
              onPress={onBack}
              accessibilityLabel="Back"
              style={styles.backButton}
              hitSlop={8}
            >
              <SvgXml xml={BACK_SVG} width={24} height={24} />
            </Pressable>
          )}
          <View style={styles.locationPill}>
            <SvgXml xml={PIN_SVG} width={23} height={23} />
            <Text style={styles.locationCity}>Barabanki</Text>
            <Text style={styles.locationCountry}>India</Text>
          </View>
          <SvgXml xml={CART_SVG} width={23} height={22} />
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <SvgXml xml={SEARCH_SVG} width={17} height={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines, wellness..."
            placeholderTextColor="#827d90"
          />
        </View>

        <Text style={styles.heading}>Popular categories</Text>

        {CATEGORIES.map((row, i) => (
          <View key={i} style={styles.tileRow}>
            {row.map((item) => (
              <View key={item.label} style={styles.tile}>
                <Image source={item.image} style={styles.tileImage} resizeMode="cover" />
                <Text style={styles.tileLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: {
    marginRight: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPill: {
    flex: 1,
    height: 43,
    borderRadius: 24,
    backgroundColor: '#fff5f1',
    borderWidth: 1.2,
    borderColor: '#fbddd3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    gap: 5,
    marginRight: 10,
  },
  locationCity: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#19112c' },
  locationCountry: { fontFamily: 'Roboto_400Regular', fontSize: 16, color: '#706a80' },
  searchBar: {
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cecbd3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 10,
    marginTop: 17,
  },
  searchInput: { flex: 1, fontFamily: 'Roboto_400Regular', fontSize: 15.3, color: '#19112c' },
  heading: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#19112c',
    marginTop: 26,
    marginBottom: 16,
  },
  tileRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8.5 },
  tile: { width: 78, alignItems: 'center' },
  tileImage: { width: 78, height: 79, borderRadius: 9 },
  tileLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
    color: '#19112c',
    textAlign: 'center',
    width: 84,
    marginTop: 4,
  },
});
