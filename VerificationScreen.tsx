import { useRef, useState } from 'react';
import {
  Alert,
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
import { SvgXml } from 'react-native-svg';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter';

// SVG icons downloaded fresh from Figma (file q4OVzpZDgUgZoTikqnYWoh, node 3:5)
const ICONS = {
  arrowRight: `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Continue arrow">
<path id="Arrow" d="M4.166 10H15.834M10 15.834L15.834 10L10 4.166" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
</g>
</svg>`,
  lock: `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Privacy lock" clip-path="url(#clip0_0_4)">
<path id="Lock" d="M3.79167 5.41658V3.79145C3.79167 3.0731 4.07701 2.38417 4.58492 1.87622C5.09283 1.36826 5.78171 1.0829 6.5 1.0829C7.21829 1.0829 7.90717 1.36826 8.41508 1.87622C8.92299 2.38417 9.20833 3.0731 9.20833 3.79145V5.41658M7.04167 8.66684C7.04167 8.96602 6.79915 9.20855 6.5 9.20855C6.20085 9.20855 5.95833 8.96602 5.95833 8.66684C5.95833 8.36766 6.20085 8.12513 6.5 8.12513C6.79915 8.12513 7.04167 8.36766 7.04167 8.66684ZM2.70833 5.41658H10.2917C10.89 5.41658 11.375 5.90164 11.375 6.5V10.8337C11.375 11.432 10.89 11.9171 10.2917 11.9171H2.70833C2.11002 11.9171 1.625 11.432 1.625 10.8337V6.5C1.625 5.90164 2.11002 5.41658 2.70833 5.41658Z" stroke="#737581" stroke-width="1.6" stroke-linecap="round"/>
</g>
<defs>
<clipPath id="clip0_0_4">
<rect width="13" height="13" fill="white"/>
</clipPath>
</defs>
</svg>`,
};

const CODE_LENGTH = 6;

type Props = {
  onVerify: () => void;
};

export default function VerificationScreen({ onVerify }: Props) {
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [focused, setFocused] = useState(0);
  const inputs = useRef<({ focus: () => void } | null)[]>([]);
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold });

  if (!fontsLoaded) {
    return null;
  }

  const handleChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 1) {
      // Pasted code: distribute across the boxes
      const next = Array(CODE_LENGTH).fill('');
      cleaned.slice(0, CODE_LENGTH).split('').forEach((d, i) => {
        next[i] = d;
      });
      setDigits(next);
      const last = Math.min(cleaned.length, CODE_LENGTH - 1);
      inputs.current[last]?.focus();
      return;
    }
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (cleaned && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (digits.some((d) => !d)) {
      Alert.alert('Incomplete code', 'Please enter all 6 digits.');
      return;
    }
    Alert.alert('Email verified', 'Your email has been verified.', [
      { text: 'OK', onPress: onVerify },
    ]);
  };

  const handleResend = () => {
    setDigits(Array(CODE_LENGTH).fill(''));
    inputs.current[0]?.focus();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header panel — same illustration as the login screen (Figma 3:6 / 3:7) */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Image
            source={require('./assets/images/pediatrician.png')}
            style={{ width: 348, height: 348 }}
            resizeMode="contain"
          />
        </View>

        {/* Verification form (Figma 3:8) */}
        <View style={styles.form}>
          <View style={styles.instructions}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code we sent to your email address.
            </Text>
          </View>

          <View style={styles.codeRow}>
            {digits.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.digitBox,
                  focused === index && styles.digitBoxFocused,
                ]}
              >
                <TextInput
                  ref={(el) => {
                    inputs.current[index] = el as { focus: () => void } | null;
                  }}
                  style={styles.digitInput}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  onFocus={() => setFocused(index)}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
                  maxLength={1}
                  cursorColor="#7379b1"
                  selectionColor="#7379b1"
                  autoFocus={index === 0}
                />
              </View>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleVerify}
          >
            <Text style={styles.buttonText}>Verify code</Text>
            <SvgXml xml={ICONS.arrowRight} width={20} height={20} />
          </Pressable>

          <Text style={styles.resendText}>
            {"Didn't receive the code? "}
            <Text style={styles.resendLink} onPress={handleResend}>
              Resend code
            </Text>
          </Text>

          <View style={styles.privacyRow}>
            <SvgXml xml={ICONS.lock} width={13} height={13} />
            <Text style={styles.privacyText}>
              Your details are safe with us.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#efedff' },
  scroll: { flexGrow: 1 },
  header: {
    backgroundColor: '#f5f5f5',
    height: 420,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { paddingTop: 28, paddingHorizontal: 32, gap: 24 },
  instructions: { gap: 8 },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
    color: '#2d3540',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: '#737581',
  },
  codeRow: { flexDirection: 'row', gap: 6 },
  digitBox: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    height: 56,
    backgroundColor: '#fcfbfe',
    borderWidth: 1,
    borderColor: '#e3e1eb',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitBoxFocused: { borderWidth: 2, borderColor: '#7379b1' },
  digitInput: {
    width: '100%',
    height: '100%',
    outlineWidth: 0,
    outlineColor: 'transparent',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#2d3540',
    textAlign: 'center',
    padding: 0,
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
  resendText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#737581',
    textAlign: 'center',
  },
  resendLink: {
    fontFamily: 'Inter_600SemiBold',
    color: '#7379b1',
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
