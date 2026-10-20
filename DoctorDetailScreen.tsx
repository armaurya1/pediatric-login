import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

// Icons: the screen's own Figma SVGs (node 57:24).
const CHEVRON_LEFT_SVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M12.5 15L7.5 10L12.5 5" stroke-width="1.8" stroke-linecap="round" stroke="#11101B"/></g></svg>`;
const ELLIPSIS_SVG = `<svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M10.2923 11C10.2923 11.5062 9.93757 11.9166 9.5 11.9166C9.06242 11.9166 8.7077 11.5062 8.7077 11C8.7077 10.4938 9.06242 10.0834 9.5 10.0834C9.93757 10.0834 10.2923 10.4938 10.2923 11ZM10.2923 4.58398C10.2923 5.09019 9.93757 5.50055 9.5 5.50055C9.06242 5.50055 8.7077 5.09019 8.7077 4.58398C8.7077 4.07776 9.06242 3.6674 9.5 3.6674C9.93757 3.6674 10.2923 4.07776 10.2923 4.58398ZM10.2923 17.416C10.2923 17.9222 9.93757 18.3326 9.5 18.3326C9.06242 18.3326 8.7077 17.9222 8.7077 17.416C8.7077 16.9098 9.06242 16.4994 9.5 16.4994C9.93757 16.4994 10.2923 16.9098 10.2923 17.416Z" stroke-width="1.8" stroke-linecap="round" stroke="#11101B"/></g></svg>`;
const STAR_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 0L9.1 4.52632L14 5.26316L10.5 8.8421L11.3 14L7 11.5789L2.7 14L3.5 8.8421L0 5.26316L4.9 4.52632L7 0Z" fill="#F8C328"/></svg>`;

const DATES = [
  { day: '19', dow: 'Sat' },
  { day: '20', dow: 'Sun' },
  { day: '21', dow: 'Mon' },
  { day: '22', dow: 'Tue' },
  { day: '23', dow: 'Wed' },
];
const TIMES = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'];

export default function DoctorDetailScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(-1);
  if (!fontsLoaded) return null;

  return (
    <View style={styles.root}>
      {/* Doctor portrait header */}
      <View style={styles.header}>
        <Image
          source={require('./assets/images/doctor/doctor-photo.png')}
          style={styles.photo}
          resizeMode="cover"
        />
        <Pressable style={[styles.backBtn, { top: insets.top + 10 }]} onPress={onBack} hitSlop={8}>
          <SvgXml xml={CHEVRON_LEFT_SVG} width={20} height={20} />
        </Pressable>
        <View style={[styles.menuBtn, { top: insets.top + 10 }]}>
          <SvgXml xml={ELLIPSIS_SVG} width={19} height={22} />
        </View>
      </View>

      {/* Details sheet */}
      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.info}>
            <View style={styles.identity}>
              <View>
                <Text style={styles.name}>John Wilson</Text>
                <Text style={styles.specialty}>Cardiology</Text>
              </View>
              <View style={styles.rating}>
                <SvgXml xml={STAR_SVG} width={14} height={14} />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>

            <View style={styles.descriptions}>
              <Text style={styles.sectionTitle}>Descriptions</Text>
              <Text style={styles.paragraph}>
                There are many variations of passages of Lorem Ipsum available, but the majority
                have suffered alteration in some form, by injected humour, or randomised words
                which don’t look even slightly believable.
              </Text>
            </View>

            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Online consultation fee</Text>
              <Text style={styles.feeValue}>₹200</Text>
            </View>
          </View>

          <View style={styles.selectDate}>
            <Text style={[styles.sectionTitle, styles.selectTitle]}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {DATES.map((d, i) => {
                const active = i === selectedDate;
                return (
                  <Pressable key={d.day} style={[styles.dateChip, active && styles.chipActive]} onPress={() => setSelectedDate(i)}>
                    <Text style={[styles.dateDay, active && styles.chipTextActive]}>{d.day}</Text>
                    <Text style={[styles.dateDow, active && styles.chipTextActive]}>{d.dow}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.selectTime}>
            <Text style={[styles.sectionTitle, styles.selectTitle]}>Select Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {TIMES.map((t, i) => {
                const active = i === selectedTime;
                return (
                  <Pressable key={t} style={[styles.timeChip, active && styles.chipActive]} onPress={() => setSelectedTime(i)}>
                    <Text style={[styles.timeText, active && styles.chipTextActive]}>{t}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 4) }]}>
          <Pressable style={styles.sendBtn}>
            <Text style={styles.sendText}>Send Message</Text>
          </Pressable>
          <Pressable style={styles.bookBtn}>
            <Text style={styles.bookText}>Book Appointment</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f7ff' },
  header: { height: 240, backgroundColor: '#f8f7ff', overflow: 'hidden' },
  photo: { position: 'absolute', left: 60, top: 43, width: 240, height: 321 },
  backBtn: { position: 'absolute', left: 22 },
  menuBtn: { position: 'absolute', right: 21 },
  sheet: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  info: { paddingHorizontal: 20 },
  identity: {
    height: 82,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebef',
  },
  name: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#11101b' },
  specialty: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#11101b', marginTop: 7 },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffcf4',
    padding: 4,
    borderRadius: 4,
  },
  ratingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#11101b' },
  descriptions: { paddingTop: 20, paddingBottom: 17, borderBottomWidth: 1, borderBottomColor: '#ebebef' },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 19, color: '#11101b' },
  paragraph: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#11101b',
    marginTop: 8,
  },
  feeRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebef',
  },
  feeLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#11101b' },
  feeValue: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#11101b' },
  selectDate: { paddingTop: 20 },
  selectTime: { paddingTop: 14 },
  selectTitle: { marginLeft: 20 },
  chipRow: { gap: 10, paddingHorizontal: 20, paddingTop: 12 },
  dateChip: {
    width: 67,
    height: 66,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dateDay: { fontFamily: 'Inter_700Bold', fontSize: 19, color: '#11101b' },
  dateDow: { fontFamily: 'Inter_400Regular', fontSize: 13.5, color: '#11101b' },
  timeChip: {
    width: 87,
    height: 39,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#11101b' },
  chipActive: { backgroundColor: '#7761ff' },
  chipTextActive: { color: '#ffffff' },
  actions: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sendBtn: {
    flex: 1,
    height: 49,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7379b1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: '#7379b1' },
  bookBtn: {
    flex: 1,
    height: 49,
    borderRadius: 8,
    backgroundColor: '#7379b1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: { fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: '#ffffff' },
});
