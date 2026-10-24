import { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import VerificationScreen from './VerificationScreen';
import HomeScreen, { RecentItem } from './HomeScreen';
import ConsultScreen from './ConsultScreen';
import DoctorDetailScreen from './DoctorDetailScreen';
import MedicinesScreen from './MedicinesScreen';
import LabTestsScreen from './LabTestsScreen';
import AskCareScreen from './AskCareScreen';

// SVG icons downloaded fresh from Figma (file q4OVzpZDgUgZoTikqnYWoh, node 2:84)
const ICONS = {
  user: `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="user-round">
<path id="Vector" d="M10 10.8333C12.301 10.8333 14.1662 8.96785 14.1662 6.66667C14.1662 4.36548 12.301 2.5 10 2.5C7.69904 2.5 5.83375 4.36548 5.83375 6.66667C5.83375 8.96785 7.69904 10.8333 10 10.8333ZM10 10.8333C11.7679 10.8333 13.4635 11.5357 14.7136 12.786C15.9637 14.0362 16.666 15.7319 16.666 17.5M10 10.8333C8.23207 10.8333 6.53654 11.5357 5.28643 12.786C4.03631 14.0362 3.334 15.7319 3.334 17.5" stroke="#7379B1" stroke-width="1.6" stroke-linecap="round"/>
</g>
</svg>`,
  mail: `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="mail">
<path id="Vector" d="M18.334 5.83375L10.8409 10.6058C10.5866 10.7534 10.2978 10.8312 10.0038 10.8312C9.7097 10.8312 9.42087 10.7534 9.1666 10.6058L1.666 5.83375M3.3328 3.334H16.6672C17.5877 3.334 18.334 4.08012 18.334 5.0005V14.9995C18.334 15.9199 17.5877 16.666 16.6672 16.666H3.3328C2.41225 16.666 1.666 15.9199 1.666 14.9995V5.0005C1.666 4.08012 2.41225 3.334 3.3328 3.334Z" stroke="#7379B1" stroke-width="1.6" stroke-linecap="round"/>
</g>
</svg>`,
  lock: `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="lock-keyhole" clip-path="url(#clip0_0_4)">
<path id="Vector" d="M3.79167 5.41658V3.79145C3.79167 3.0731 4.07701 2.38417 4.58492 1.87622C5.09283 1.36826 5.78171 1.0829 6.5 1.0829C7.21829 1.0829 7.90717 1.36826 8.41508 1.87622C8.92299 2.38417 9.20833 3.0731 9.20833 3.79145V5.41658M7.04167 8.66684C7.04167 8.96602 6.79915 9.20855 6.5 9.20855C6.20085 9.20855 5.95833 8.96602 5.95833 8.66684C5.95833 8.36766 6.20085 8.12513 6.5 8.12513C6.79915 8.12513 7.04167 8.36766 7.04167 8.66684ZM2.70833 5.41658H10.2917C10.89 5.41658 11.375 5.90164 11.375 6.5V10.8337C11.375 11.432 10.89 11.9171 10.2917 11.9171H2.70833C2.11002 11.9171 1.625 11.432 1.625 10.8337V6.5C1.625 5.90164 2.11002 5.41658 2.70833 5.41658Z" stroke="#737581" stroke-width="1.6" stroke-linecap="round"/>
</g>
<defs>
<clipPath id="clip0_0_4">
<rect width="13" height="13" fill="white"/>
</clipPath>
</defs>
</svg>`,
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
  });
  const [screen, setScreen] = useState<
    'login' | 'verification' | 'home' | 'consult' | 'doctor' | 'medicines' | 'labTests' | 'askCare'
  >('login');
  const [doctorFrom, setDoctorFrom] = useState<'home' | 'consult'>('home');
  const [recentlyViewed, setRecentlyViewed] = useState<RecentItem[]>([
    { id: 'dermatology', name: 'Dermatology' },
    { id: 'general-physician', name: 'General physician' },
  ]);
  const [selectedDoctorSpecialty, setSelectedDoctorSpecialty] = useState<string>('Dermatology');

  const handleSelectDoctor = (specialtyName: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter(
        (item) => item.name.toLowerCase() !== specialtyName.toLowerCase(),
      );
      return [
        {
          id: specialtyName.toLowerCase().replace(/\s+/g, '-'),
          name: specialtyName,
        },
        ...filtered,
      ];
    });
    setSelectedDoctorSpecialty(specialtyName);
    setDoctorFrom('consult');
    setScreen('doctor');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {screen === 'login' ? (
        <LoginScreen onProceed={() => setScreen('verification')} />
      ) : screen === 'verification' ? (
        <VerificationScreen onVerify={() => setScreen('home')} />
      ) : screen === 'consult' ? (
        <ConsultScreen
          onBack={() => setScreen('home')}
          onSelectDoctor={handleSelectDoctor}
        />
      ) : screen === 'doctor' ? (
        <DoctorDetailScreen
          onBack={() => setScreen(doctorFrom)}
          specialty={selectedDoctorSpecialty}
        />
      ) : screen === 'medicines' ? (
        <MedicinesScreen onBack={() => setScreen('home')} />
      ) : screen === 'labTests' ? (
        <LabTestsScreen onBack={() => setScreen('home')} />
      ) : screen === 'askCare' ? (
        <AskCareScreen onBack={() => setScreen('home')} />
      ) : (
        <HomeScreen
          onOnlineConsult={() => setScreen('consult')}
          onDoctorProfile={(specialtyName?: string) => {
            if (specialtyName) {
              setSelectedDoctorSpecialty(specialtyName);
            }
            setDoctorFrom('home');
            setScreen('doctor');
          }}
          onMedicines={() => setScreen('medicines')}
          onLabTests={() => setScreen('labTests')}
          onAskCare={() => setScreen('askCare')}
          recentlyViewed={recentlyViewed}
        />
      )}
    </SafeAreaProvider>
  );
}

function LoginScreen({ onProceed }: { onProceed: () => void }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold });

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          <View
            style={[
              styles.header,
              {
                paddingTop: insets.top,
                height: keyboardVisible ? 160 + insets.top : 420,
              },
            ]}
          >
            <Image
              source={require('./assets/images/pediatrician.png')}
              style={{
                width: keyboardVisible ? 156 : 348,
                height: keyboardVisible ? 156 : 348,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.form, keyboardVisible && styles.formKeyboard]}>
            <View
              style={[
                styles.fieldsGroup,
                keyboardVisible && styles.fieldsGroupKeyboard,
              ]}
            >
              <View>
                <Text style={styles.label}>Name</Text>
                <View style={styles.input}>
                  <SvgXml xml={ICONS.user} width={20} height={20} />
                  <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setKeyboardVisible(true)}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9695a2"
                  />
                </View>
              </View>
              <View>
                <Text style={styles.label}>Email</Text>
                <View style={styles.input}>
                  <SvgXml xml={ICONS.mail} width={20} height={20} />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setKeyboardVisible(true)}
                    placeholder="Enter your email address"
                    placeholderTextColor="#9695a2"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.85 },
              ]}
              onPress={onProceed}
            >
              <Text style={styles.buttonText}>Proceed to login</Text>
            </Pressable>
            <View style={styles.privacyRow}>
              <SvgXml xml={ICONS.lock} width={13} height={13} />
              <Text style={styles.privacyText}>
                Your details are safe with us.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  keyboardAvoiding: { flex: 1 },
  scroll: { flexGrow: 1 },
  header: {
    backgroundColor: '#ffffff',
    height: 420,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { paddingTop: 28, paddingHorizontal: 32, paddingBottom: 40, gap: 28 },
  formKeyboard: { paddingTop: 12, paddingBottom: 16, gap: 16 },
  fieldsGroup: { gap: 20 },
  fieldsGroupKeyboard: { gap: 12 },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#2d3540',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e1eb',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#2d3540',
  },
  button: {
    backgroundColor: '#7379b1',
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  privacyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#737581',
  },
});

