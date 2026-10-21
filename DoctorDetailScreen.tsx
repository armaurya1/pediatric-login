import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

// Icons: the screen's own Figma SVGs (node 143:30).
const CHEVRON_LEFT_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M10.625 12.75L6.375 8.5L10.625 4.25" stroke-width="2" stroke-linecap="round" stroke="white"/></g></svg>`;
const HEART_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M1.4161 6.72931C1.41611 5.94107 1.65525 5.17138 2.10191 4.52189C2.54858 3.8724 3.18177 3.37366 3.91785 3.09156C4.65393 2.80946 5.45827 2.75726 6.22465 2.94185C6.99102 3.12644 7.68337 3.53915 8.21025 4.12545C8.24736 4.16513 8.29222 4.19676 8.34206 4.21839C8.3919 4.24001 8.44565 4.25117 8.49998 4.25117C8.55431 4.25117 8.60806 4.24001 8.65789 4.21839C8.70773 4.19676 8.7526 4.16513 8.78971 4.12545C9.31494 3.53534 10.0074 3.11916 10.7751 2.93233C11.5427 2.74549 12.349 2.79685 13.0867 3.07958C13.8244 3.3623 14.4585 3.86298 14.9046 4.51497C15.3507 5.16696 15.5876 5.93934 15.5839 6.72931C15.5839 8.35141 14.5213 9.56267 13.4587 10.6252L9.56823 14.3886C9.43623 14.5402 9.27349 14.662 9.09081 14.7458C8.90813 14.8297 8.70969 14.8737 8.50868 14.875C8.30768 14.8762 8.1087 14.8347 7.92497 14.7532C7.74124 14.6717 7.57697 14.552 7.44306 14.4021L3.54126 10.6252C2.47868 9.56267 1.4161 8.35849 1.4161 6.72931Z" stroke-width="2" stroke-linecap="round" stroke="white"/></g></svg>`;
const CHAT_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_0_25)"><path d="M5.66728 8.49995H5.67436M8.5005 8.49995H8.50758M11.3337 8.49995H11.3408M2.12022 11.5755C2.22437 11.8383 2.24755 12.1262 2.1868 12.4022L1.43246 14.7328C1.40815 14.851 1.41443 14.9734 1.45071 15.0885C1.48699 15.2036 1.55206 15.3075 1.63975 15.3904C1.72744 15.4733 1.83485 15.5324 1.95178 15.5621C2.06872 15.5918 2.19131 15.5911 2.30792 15.5602L4.72536 14.8532C4.98582 14.8016 5.25555 14.8241 5.50379 14.9184C7.01629 15.6248 8.72966 15.7743 10.3416 15.3404C11.9536 14.9065 13.3605 13.9172 14.3142 12.547C15.2679 11.1768 15.707 9.51372 15.5541 7.85124C15.4013 6.18876 14.6662 4.6337 13.4786 3.46042C12.2911 2.28714 10.7273 1.57105 9.06329 1.43848C7.39925 1.30591 5.74187 1.76539 4.38356 2.73584C3.02525 3.7063 2.05331 5.12537 1.6392 6.74268C1.2251 8.35999 1.39546 10.0716 2.12022 11.5755Z" stroke-width="2" stroke-linecap="round" stroke="#5937A0"/></g><defs><clipPath><rect width="17" height="17" fill="white"/></clipPath></defs></svg>`;
const PHONE_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_0_9)"><path d="M9.79777 11.7359C9.94407 11.8031 10.1089 11.8185 10.2651 11.7794C10.4213 11.7404 10.5595 11.6494 10.657 11.5213L10.9085 11.1919C11.0405 11.0159 11.2116 10.8731 11.4083 10.7747C11.6051 10.6764 11.822 10.6252 12.0419 10.6252H14.1671C14.5429 10.6252 14.9032 10.7744 15.1689 11.0401C15.4346 11.3058 15.5839 11.6662 15.5839 12.0419V14.1671C15.5839 14.5429 15.4346 14.9032 15.1689 15.1689C14.9032 15.4346 14.5429 15.5839 14.1671 15.5839C10.7853 15.5839 7.54207 14.2405 5.15079 11.8492C2.75951 9.45793 1.4161 6.21466 1.4161 2.83288C1.4161 2.45713 1.56537 2.09676 1.83107 1.83107C2.09676 1.56537 2.45713 1.4161 2.83288 1.4161H4.95805C5.3338 1.4161 5.69417 1.56537 5.95986 1.83107C6.22556 2.09676 6.37483 2.45713 6.37483 2.83288V4.95805C6.37483 5.178 6.32362 5.39493 6.22526 5.59165C6.12689 5.78838 5.98408 5.95951 5.80812 6.09147L5.47659 6.34012C5.34654 6.43942 5.25488 6.58068 5.21717 6.7399C5.17947 6.89912 5.19804 7.06648 5.26974 7.21356C6.23788 9.17996 7.83016 10.7702 9.79777 11.7359Z" stroke-width="2" stroke-linecap="round" stroke="#5937A0"/></g><defs><clipPath><rect width="17" height="17" fill="white"/></clipPath></defs></svg>`;
const VIDEO_SVG = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M12.0002 9.7502L15.9178 12.3617C15.9743 12.3993 16.0399 12.4208 16.1076 12.4241C16.1754 12.4273 16.2428 12.4121 16.3026 12.3801C16.3624 12.3481 16.4124 12.3005 16.4473 12.2423C16.4821 12.1841 16.5006 12.1175 16.5006 12.0497V5.9027C16.5006 5.83672 16.4832 5.7719 16.4502 5.71478C16.4171 5.65767 16.3696 5.61029 16.3124 5.57742C16.2552 5.54456 16.1903 5.52737 16.1243 5.52759C16.0583 5.52781 15.9935 5.54544 15.9366 5.5787L12.0002 7.8752M12.0002 9.7502V7.8752M12.0002 9.7502V12C12.0002 12.8284 11.3286 13.5 10.5001 13.5H2.99952C2.17103 13.5 1.4994 12.8284 1.4994 12V6C1.4994 5.17157 2.17103 4.5 2.99952 4.5H10.5001C11.3286 4.5 12.0002 5.17157 12.0002 6V7.8752" stroke-width="2" stroke-linecap="round" stroke="#5937A0"/></g></svg>`;
const STAR_SM_SVG = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_0_15)"><path d="M6.24325 1.24263C6.26699 1.19468 6.30366 1.15431 6.34912 1.12608C6.39458 1.09786 6.44703 1.0829 6.50054 1.0829C6.55405 1.0829 6.6065 1.09786 6.65196 1.12608C6.69743 1.15431 6.7341 1.19468 6.75783 1.24263L8.00908 3.77709C8.09151 3.94391 8.21319 4.08823 8.36367 4.19767C8.51415 4.30711 8.68894 4.3784 8.87304 4.40543L11.6713 4.81493C11.7243 4.82261 11.7741 4.84497 11.8151 4.87949C11.8561 4.91401 11.8866 4.95931 11.9031 5.01025C11.9197 5.0612 11.9217 5.11577 11.9089 5.16779C11.896 5.2198 11.8689 5.26719 11.8305 5.30459L9.80688 7.27518C9.67342 7.40523 9.57356 7.56577 9.51591 7.74297C9.45826 7.92018 9.44453 8.10874 9.47592 8.29243L9.95367 11.0766C9.96303 11.1296 9.9573 11.1841 9.93715 11.234C9.91699 11.2839 9.88321 11.3272 9.83967 11.3588C9.79613 11.3904 9.74457 11.4092 9.69089 11.4129C9.6372 11.4166 9.58354 11.4052 9.53604 11.3799L7.03463 10.0648C6.86981 9.97821 6.68643 9.933 6.50027 9.933C6.31411 9.933 6.13074 9.97821 5.96592 10.0648L3.46504 11.3799C3.41755 11.4051 3.36397 11.4164 3.31037 11.4126C3.25677 11.4088 3.20532 11.39 3.16187 11.3584C3.11841 11.3268 3.0847 11.2836 3.06456 11.2338C3.04443 11.184 3.03867 11.1295 3.04796 11.0766L3.52517 8.29297C3.55669 8.1092 3.54303 7.92052 3.48537 7.7432C3.42772 7.56589 3.32779 7.40526 3.19421 7.27518L1.17054 5.30513C1.13186 5.26778 1.10445 5.22031 1.09144 5.16813C1.07842 5.11596 1.08032 5.06118 1.09692 5.01003C1.11352 4.95888 1.14414 4.91342 1.18532 4.87883C1.22649 4.84424 1.27655 4.82191 1.32979 4.81438L4.1275 4.40543C4.31181 4.37861 4.48684 4.30742 4.63752 4.19796C4.78821 4.08851 4.91005 3.94407 4.99254 3.77709L6.24325 1.24263Z" stroke-width="2" stroke-linecap="round" stroke="#FFBC43"/></g><defs><clipPath><rect width="13" height="13" fill="white"/></clipPath></defs></svg>`;
const HISTORY_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M2.125 8.5C2.125 9.76086 2.49889 10.9934 3.19938 12.0418C3.89988 13.0901 4.89551 13.9072 6.06039 14.3897C7.22527 14.8722 8.50707 14.9985 9.7437 14.7525C10.9803 14.5065 12.1162 13.8994 13.0078 13.0078C13.8994 12.1162 14.5065 10.9803 14.7525 9.7437C14.9985 8.50707 14.8722 7.22527 14.3897 6.06039C13.9072 4.89551 13.0901 3.89988 12.0418 3.19938C10.9934 2.49889 9.76086 2.125 8.5 2.125C6.7178 2.1317 5.00719 2.82712 3.72583 4.06583L2.125 5.66667M5.66667 5.66667H2.125V2.125M8.5 4.95833V8.5L11.3333 9.91667" stroke-width="2" stroke-linecap="round" stroke="#5937A0"/></g></svg>`;
const USERS_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M12.7505 14.875C12.7505 13.3721 12.1534 11.9308 11.0906 10.8681C10.0278 9.80536 8.5863 9.20833 7.08328 9.20833M7.08328 9.20833C5.58025 9.20833 4.13878 9.80536 3.07598 10.8681C2.01318 11.9308 1.4161 13.3721 1.4161 14.875M7.08328 9.20833C9.03946 9.20833 10.6253 7.62268 10.6253 5.66667C10.6253 3.71066 9.03946 2.125 7.08328 2.125C5.12709 2.125 3.54129 3.71066 3.54129 5.66667C3.54129 7.62268 5.12709 9.20833 7.08328 9.20833ZM15.5839 14.1668C15.5839 11.7797 14.1671 9.56264 12.7503 8.50014C13.216 8.15077 13.5884 7.69199 13.8346 7.16441C14.0807 6.63683 14.193 6.05672 14.1615 5.47541C14.1299 4.89411 13.9556 4.32953 13.6539 3.83165C13.3521 3.33378 12.9323 2.91795 12.4315 2.62097" stroke-width="2" stroke-linecap="round" stroke="#5937A0"/></g></svg>`;
const STAR_LG_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M8.16425 1.62498C8.19529 1.56227 8.24324 1.50948 8.30269 1.47257C8.36215 1.43566 8.43073 1.4161 8.50071 1.4161C8.57068 1.4161 8.63927 1.43566 8.69872 1.47257C8.75817 1.50948 8.80612 1.56227 8.83717 1.62498L10.4734 4.93927C10.5812 5.15742 10.7403 5.34615 10.9371 5.48926C11.1339 5.63238 11.3625 5.72561 11.6032 5.76094L15.2625 6.29644C15.3318 6.30649 15.3969 6.33573 15.4505 6.38087C15.5041 6.42601 15.544 6.48525 15.5656 6.55187C15.5873 6.6185 15.5899 6.68985 15.5731 6.75788C15.5563 6.8259 15.5209 6.88787 15.4707 6.93677L12.8244 9.51369C12.6499 9.68376 12.5193 9.8937 12.4439 10.1254C12.3685 10.3572 12.3505 10.6037 12.3916 10.8439L13.0163 14.4848C13.0286 14.5541 13.0211 14.6254 12.9947 14.6907C12.9684 14.7559 12.9242 14.8125 12.8673 14.8538C12.8103 14.8952 12.7429 14.9197 12.6727 14.9246C12.6025 14.9295 12.5323 14.9145 12.4702 14.8814L9.19912 13.1616C8.98359 13.0484 8.74379 12.9893 8.50035 12.9893C8.25691 12.9893 8.01712 13.0484 7.80158 13.1616L4.53121 14.8814C4.46911 14.9143 4.39903 14.9291 4.32894 14.9241C4.25886 14.9191 4.19158 14.8946 4.13475 14.8533C4.07793 14.8119 4.03384 14.7555 4.00751 14.6904C3.98117 14.6252 3.97365 14.554 3.98579 14.4848L4.60983 10.8447C4.65106 10.6043 4.6332 10.3576 4.5578 10.1257C4.4824 9.89385 4.35172 9.6838 4.17704 9.51369L1.53071 6.93748C1.48013 6.88863 1.44429 6.82656 1.42726 6.75833C1.41024 6.6901 1.41273 6.61846 1.43443 6.55158C1.45614 6.48469 1.49619 6.42525 1.55003 6.38001C1.60387 6.33478 1.66933 6.30558 1.73896 6.29573L5.3975 5.76094C5.63851 5.72588 5.8674 5.63277 6.06446 5.48964C6.26151 5.34651 6.42083 5.15763 6.52871 4.93927L8.16425 1.62498Z" stroke-width="2" stroke-linecap="round" stroke="#5937A0"/></g></svg>`;
const CLOCK_ACTIVE_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_0_17)"><path d="M6 2.99976V6L8.00016 7.00008M11.0004 6C11.0004 8.76164 8.76164 11.0004 6 11.0004C3.23836 11.0004 0.9996 8.76164 0.9996 6C0.9996 3.23836 3.23836 0.9996 6 0.9996C8.76164 0.9996 11.0004 3.23836 11.0004 6Z" stroke-width="1.6" stroke-linecap="round" stroke="#8055BD"/></g><defs><clipPath><rect width="12" height="12" fill="white"/></clipPath></defs></svg>`;
const CLOCK_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_0_7)"><path d="M6 2.99976V6L8.00016 7.00008M11.0004 6C11.0004 8.76164 8.76164 11.0004 6 11.0004C3.23836 11.0004 0.9996 8.76164 0.9996 6C0.9996 3.23836 3.23836 0.9996 6 0.9996C8.76164 0.9996 11.0004 3.23836 11.0004 6Z" stroke-width="1.6" stroke-linecap="round" stroke="#554353"/></g><defs><clipPath><rect width="12" height="12" fill="white"/></clipPath></defs></svg>`;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS = Array.from({ length: 12 }, (_, index) => {
  const date = new Date(new Date().getFullYear(), 9 + index, 1);
  return {
    key: `${date.getFullYear()}-${date.getMonth()}`,
    label: MONTH_NAMES[date.getMonth()],
    year: date.getFullYear(),
    monthIndex: date.getMonth(),
  };
});
const TIMES = [
  '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
];
const DATE_ITEM_WIDTH = 44;
const STATS = [
  { icon: HISTORY_SVG, value: '8 years', label: 'Experience' },
  { icon: USERS_SVG, value: '2.7K+', label: 'Patients' },
  { icon: STAR_LG_SVG, value: '4.8', label: 'Reviews' },
];

export default function DoctorDetailScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium });
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(5);
  const [time, setTime] = useState(0);
  const [scrollX] = useState(() => new Animated.Value((5 - 1) * DATE_ITEM_WIDTH));
  const dayScrollRef = useRef<ScrollViewInstance>(null);
  if (!fontsLoaded) return null;

  const selectedMonth = MONTHS[month];
  const daysInMonth = new Date(
    selectedMonth.year,
    selectedMonth.monthIndex + 1,
    0,
  ).getDate();
  const selectMonth = (nextMonth: number) => {
    const next = MONTHS[nextMonth];
    const lastDay = new Date(next.year, next.monthIndex + 1, 0).getDate();
    const nextDay = Math.min(day, lastDay);
    scrollX.setValue((nextDay - 1) * DATE_ITEM_WIDTH);
    setMonth(nextMonth);
    setDay(nextDay);
  };
  const updateSelectedDay = (offset: number) => {
    setDay(
      Math.min(
        daysInMonth,
        Math.max(1, Math.round(offset / DATE_ITEM_WIDTH) + 1),
      ),
    );
  };
  const selectDay = (dateNumber: number) => {
    setDay(dateNumber);
    dayScrollRef.current?.scrollTo({
      x: (dateNumber - 1) * DATE_ITEM_WIDTH,
      animated: true,
    });
  };

  const profileCardHeight = Math.max(
    401,
    Math.min(441, windowHeight * 0.55),
  );
  const portraitHeight = profileCardHeight - 84;
  const navTop = Math.max(insets.top + 12, 24);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ minHeight: windowHeight }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" />
      {/* Profile card */}
      <View style={[styles.profileCard, { height: profileCardHeight }]}>
        <View style={[styles.portrait, { height: portraitHeight }]}>
          <Image
            source={require('./assets/images/doctor/doctor-photo.jpg')}
            style={[styles.photo, { height: windowWidth * 2 }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(171,133,220,0)', '#ad86de', '#ad86de']}
            locations={[0, 0.42, 1]}
            style={[styles.fade, { top: portraitHeight - 127 }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
            style={[styles.navBtn, styles.backBtn, { top: navTop }]}
            onPress={onBack}
            hitSlop={8}
          >
            <SvgXml xml={CHEVRON_LEFT_SVG} width={17} height={17} />
          </Pressable>
          <View style={[styles.navBtn, styles.heartBtn, { top: navTop }]}>
            <SvgXml xml={HEART_SVG} width={17} height={17} />
          </View>
          <Text style={[styles.name, { top: portraitHeight - 74 }]}>A. R. Maurya</Text>
          <View style={[styles.specialtyRow, { top: portraitHeight - 46 }]}>
            <Text style={styles.specialty}>Neurologist</Text>
            <View style={styles.rating}>
              <SvgXml xml={STAR_SM_SVG} width={13} height={13} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
          <View style={[styles.actionBtn, { left: windowWidth - 161, top: portraitHeight - 67 }]}>
            <SvgXml xml={CHAT_SVG} width={17} height={17} />
          </View>
          <View style={[styles.actionBtn, { left: windowWidth - 111, top: portraitHeight - 67 }]}>
            <SvgXml xml={PHONE_SVG} width={17} height={17} />
          </View>
          <View style={[styles.actionBtn, { left: windowWidth - 61, top: portraitHeight - 67 }]}>
            <SvgXml xml={VIDEO_SVG} width={18} height={18} />
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.stat}>
              <View style={styles.statIcon}>
                <SvgXml xml={s.icon} width={17} height={17} />
              </View>
              <View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Booking */}
      <View style={[styles.booking, { height: Math.max(363, windowHeight - profileCardHeight) }]}>
        <Text style={[styles.heading, { top: 24 }]}>Select Date</Text>
        <ScrollView
          horizontal
          style={[styles.monthRow, { width: windowWidth - 28 }]}
          contentContainerStyle={styles.monthRowContent}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={66}
          snapToAlignment="start"
          nestedScrollEnabled
        >
          {MONTHS.map((m, i) => (
            <Pressable
              key={m.key}
              style={[styles.monthChip, i === month && styles.monthChipActive]}
              onPress={() => selectMonth(i)}
            >
              <Text style={styles.monthText}>{m.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Animated.ScrollView
          ref={dayScrollRef}
          key={selectedMonth.key}
          horizontal
          style={[styles.dayRow, { width: windowWidth - 70 }]}
          contentContainerStyle={[
            styles.dayRowContent,
            { paddingHorizontal: Math.max(0, (windowWidth - 70 - DATE_ITEM_WIDTH) / 2) },
          ]}
          contentOffset={{ x: (day - 1) * DATE_ITEM_WIDTH, y: 0 }}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={DATE_ITEM_WIDTH}
          snapToAlignment="start"
          nestedScrollEnabled
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true },
          )}
          onScrollEndDrag={({ nativeEvent }) =>
            updateSelectedDay(nativeEvent.contentOffset.x)
          }
          onMomentumScrollEnd={({ nativeEvent }) =>
            updateSelectedDay(nativeEvent.contentOffset.x)
          }
        >
          {Array.from({ length: daysInMonth }, (_, index) => {
            const dateNumber = index + 1;
            const date = new Date(selectedMonth.year, selectedMonth.monthIndex, dateNumber);
            const active = dateNumber === day;
            const itemCenterOffset = (dateNumber - 1) * DATE_ITEM_WIDTH;
            const scale = scrollX.interpolate({
              inputRange: [
                itemCenterOffset - DATE_ITEM_WIDTH * 3,
                itemCenterOffset - DATE_ITEM_WIDTH * 2,
                itemCenterOffset - DATE_ITEM_WIDTH,
                itemCenterOffset,
                itemCenterOffset + DATE_ITEM_WIDTH,
                itemCenterOffset + DATE_ITEM_WIDTH * 2,
                itemCenterOffset + DATE_ITEM_WIDTH * 3,
              ],
              outputRange: [0.4, 0.62, 0.74, 1, 0.74, 0.62, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Pressable
                key={dateNumber}
                style={styles.dayOption}
                onPress={() => selectDay(dateNumber)}
              >
                <Animated.View
                  style={[
                    styles.dayChip,
                    active && styles.dayChipActive,
                    { transform: [{ scale }] },
                  ]}
                >
                  <Text style={[styles.dayNum, active && styles.dayTextActive]}>
                    {dateNumber}
                  </Text>
                  <Text style={[styles.dayDow, active && styles.dayTextActive]}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                </Animated.View>
                {active && <View style={styles.dayDot} />}
              </Pressable>
            );
          })}
        </Animated.ScrollView>
        <View
          pointerEvents="none"
          style={[
            styles.daySelectionMarker,
            { left: 35 + (windowWidth - 70 - 54) / 2 },
          ]}
        />

        <Text style={[styles.heading, { top: 205 }]}>Select Time</Text>
        <ScrollView
          horizontal
          style={[styles.timeRow, { width: windowWidth - 28 }]}
          contentContainerStyle={styles.timeRowContent}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={106}
          snapToAlignment="start"
          nestedScrollEnabled
        >
          {TIMES.map((t, i) => {
            const active = i === time;
            return (
              <Pressable
                key={t}
                style={[styles.timeChip, active && styles.timeChipActive]}
                onPress={() => setTime(i)}
              >
                <SvgXml xml={active ? CLOCK_ACTIVE_SVG : CLOCK_SVG} width={12} height={12} />
                <Text style={styles.timeText}>{t}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable style={[styles.bookBtn, { width: windowWidth - 34 }]}>
          <Text style={styles.bookText}>Book Appointment - ₹500/hr</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  profileCard: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000000',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 8,
    zIndex: 1,
  },
  portrait: {
    backgroundColor: '#8262b8',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: { position: 'absolute', left: 0, top: 0, width: '100%' },
  fade: { position: 'absolute', left: 0, width: '100%', height: 127, opacity: 0.65 },
  navBtn: {
    position: 'absolute',
    width: 46,
    height: 44,
    borderRadius: 23,
    backgroundColor: '#8163b4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: { left: 12 },
  heartBtn: { right: 16 },
  name: {
    position: 'absolute',
    left: 20,
    top: 0,
    fontFamily: 'Roboto_400Regular',
    fontSize: 20,
    color: '#ffffff',
  },
  specialtyRow: {
    position: 'absolute',
    left: 20,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  specialty: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#dfccf2' },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(147,120,187,0.53)',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 100,
  },
  ratingText: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#ffffff' },
  actionBtn: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 41,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIcon: {
    width: 34,
    height: 35,
    borderRadius: 17,
    backgroundColor: '#eee5fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#5937a0' },
  statLabel: { fontFamily: 'Roboto_400Regular', fontSize: 10, color: '#433b44', marginTop: 4 },
  booking: { height: 363, position: 'relative' },
  heading: {
    position: 'absolute',
    left: 17,
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#433b44',
  },
  monthRow: {
    position: 'absolute',
    top: 54,
    left: 14,
  },
  monthRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
  },
  monthChip: {
    width: 64,
    height: 31,
    borderRadius: 100,
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthChipActive: { backgroundColor: '#e8dafc' },
  monthText: { fontFamily: 'Roboto_400Regular', fontSize: 10.5, color: '#433b44' },
  dayRow: {
    position: 'absolute',
    top: 98,
    left: 35,
    height: 87,
  },
  dayRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayOption: {
    width: 44,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChip: {
    width: 54,
    height: 68,
    backgroundColor: '#eaeaea',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  dayChipActive: {
    backgroundColor: '#5937a0',
    borderWidth: 3,
    borderColor: '#dccbf5',
  },
  dayNum: { fontFamily: 'Roboto_500Medium', fontSize: 18, color: '#4b4b4b' },
  dayDow: { fontFamily: 'Roboto_400Regular', fontSize: 10, color: '#665f68' },
  dayTextActive: { color: '#ffffff' },
  daySelectionMarker: {
    position: 'absolute',
    top: 107.5,
    width: 54,
    height: 68,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#dccbf5',
  },
  dayDot: {
    position: 'absolute',
    bottom: 0,
    width: 5.5,
    height: 5.5,
    borderRadius: 3,
    backgroundColor: '#5937a0',
  },
  timeRow: {
    position: 'absolute',
    top: 234,
    left: 14,
  },
  timeRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
  },
  timeChip: {
    width: 98,
    height: 31,
    marginRight: 8,
    borderRadius: 100,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeChipActive: { backgroundColor: '#ebe0fc' },
  timeText: { fontFamily: 'Roboto_400Regular', fontSize: 10.5, color: '#433b44' },
  bookBtn: {
    position: 'absolute',
    top: 282,
    left: 17,
    height: 52,
    borderRadius: 100,
    backgroundColor: '#7048ca',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: { fontFamily: 'Roboto_500Medium', fontSize: 14, color: '#ffffff' },
});


