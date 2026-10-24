import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

// Custom Profile Avatar SVG matching the stylized illustration in the screenshot
const AVATAR_SVG = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="30" fill="#152766"/>
  <!-- Hair & Back Head -->
  <path d="M30 7C20.5 7 14 14.5 13 25C12 36.5 17 46 24 49.5C22.8 46 22 41 22 36C22 28.5 25.5 23 29.5 21C33.5 19 37.5 15.5 37.5 12C35 8.5 32.5 7 30 7Z" fill="#2E55D8"/>
  <!-- Face Profile (Yellow/Gold) -->
  <path d="M29 21.5C25 23.5 23 27 23 32C23 37 26 40.5 26.5 46C29.5 47.5 33 48 37 47C36.5 44.5 36 42 35.5 40C34.8 36.5 36 34.5 38.5 33C40.2 32 41.5 30.5 41 28.5C40.5 26.5 38.5 25.5 37 25C35.5 24.5 35 23.5 34.5 21.5C32.5 21.5 30.8 21.5 29 21.5Z" fill="#FCCF4D"/>
  <!-- Shoulder / Torso (Teal Blue) -->
  <path d="M15 53.5C19 57.5 24.2 60 30 60C35.8 60 41 57.5 45 53.5C43 50.5 39 49 35 48.5C29 48.5 21 50 15 53.5Z" fill="#0EA5E9"/>
</svg>`;

// Shield icon for the membership banner
const SHIELD_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L3 6V11.5C3 16.8 6.8 21.6 12 23C17.2 21.6 21 16.8 21 11.5V6L12 2Z" fill="#F59E0B" stroke="#FDE68A" stroke-width="1.5"/>
  <path d="M12 7V17M7 12H17" stroke="#78350F" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// Chevron right icon for list items
const CHEVRON_RIGHT_SVG = `<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 1L7 7L1 13" stroke="#82889E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const BANNER_CHEVRON_SVG = `<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 1L7 7L1 13" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// History item icons
const IN_PERSON_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 21H21M5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21M9 21V16C9 15.4477 9.44772 15 10 15H14C14.5523 15 15 15.4477 15 16V21M12 7V11M10 9H14" stroke="#1D2129" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const VIDEO_CONSULT_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="5" width="14" height="14" rx="3" stroke="#1D2129" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 10L22 6V18L16 14" stroke="#1D2129" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const TEST_BOOKINGS_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.5 2V8.5L19.5 17C20.5 18.7 19.3 21 17.3 21H6.7C4.7 21 3.5 18.7 4.5 17L9.5 8.5V2M8 2H16M7 15H17" stroke="#1D2129" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="10" cy="17.5" r="1.2" fill="#1D2129"/>
  <circle cx="14" cy="18" r="1" fill="#1D2129"/>
</svg>`;

const MEDICINE_ORDERS_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="7" width="12" height="14" rx="3" stroke="#1D2129" stroke-width="2" stroke-linecap="round"/>
  <path d="M9 3H15M8 7V3M16 7V3M12 11V17M9 14H15" stroke="#1D2129" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const MY_DOCTORS_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="4" width="18" height="16" rx="3" stroke="#1D2129" stroke-width="2"/>
  <circle cx="9" cy="10" r="2.5" stroke="#1D2129" stroke-width="2"/>
  <path d="M5.5 16C6 14 7.5 13 9 13C10.5 13 12 14 12.5 16M15 9H18M15 13H17" stroke="#1D2129" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const MEDICAL_RECORDS_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="3" width="16" height="18" rx="3" stroke="#1D2129" stroke-width="2"/>
  <path d="M12 7L9 15M12 7L15 15M10 13H14" stroke="#1D2129" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const PAYMENTS_HEALTHCASH_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="5" width="20" height="14" rx="3" stroke="#1D2129" stroke-width="2"/>
  <line x1="2" y1="10" x2="22" y2="10" stroke="#1D2129" stroke-width="2"/>
  <circle cx="6" cy="15" r="1.5" fill="#1D2129"/>
  <circle cx="10" cy="15" r="1.5" fill="#1D2129"/>
</svg>`;

const HELP_CENTER_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 14V12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V14M3 14C3 15.6569 4.34315 17 6 17H7V13H5C3.89543 13 3 13.8954 3 14ZM21 14C21 15.6569 19.6569 17 18 17H17V13H19C20.1046 13 21 13.8954 21 14ZM19 17V19C19 20.1046 18.1046 21 17 21H14" stroke="#1D2129" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const CLOSE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 6L6 18M6 6L18 18" stroke="#19112C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

type Props = {
  onOnlineConsult: () => void;
  onMedicines: () => void;
  onLabTests: () => void;
  onDoctorProfile: (name?: string) => void;
};

export default function ProfileScreen({
  onOnlineConsult,
  onMedicines,
  onLabTests,
  onDoctorProfile,
}: Props) {
  const insets = useSafeAreaInsets();

  // User details state
  const [name, setName] = useState('Alok Maurya');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('alok.maurya@example.com');

  // Edit profile modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('Alok Maurya');
  const [editPhone, setEditPhone] = useState('+91 98765 43210');
  const [editEmail, setEditEmail] = useState('alok.maurya@example.com');

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    setName(editName.trim());
    setPhone(editPhone.trim());
    setEmail(editEmail.trim());
    setIsEditing(false);
  };

  const handleOpenShield = () => {
    Alert.alert(
      'Care Shield Membership',
      'Your active benefits:\n\n• 10 Free Hospital Visits\n• Unlimited GP Video Consultations\n• Free Home Sample Collection for Lab Tests\n• 20% Extra off on Medicine Orders\n\nValid till Dec 2026',
      [{ text: 'Got it' }],
    );
  };

  const handleMedicalRecords = () => {
    Alert.alert(
      'Medical Records',
      'You have 3 digital health records stored:\n\n1. Pediatric Consultation Report (Oct 2026)\n2. Complete Blood Count Report (Oct 2026)\n3. Prescription for Amoxyclav (Oct 2026)',
      [{ text: 'Close' }],
    );
  };

  const handlePayments = () => {
    Alert.alert(
      'Payments & HealthCash',
      'HealthCash Balance: ₹250\n\n• Saved Payment Methods: UPI / Cards\n• Billing History: 2 invoices paid',
      [{ text: 'Close' }],
    );
  };

  const handleHelpCenter = () => {
    Alert.alert(
      'Help Center & Support',
      'Need assistance with your booking or order?\n\n• Call Support: 1800-123-CARE\n• WhatsApp Support: +91 98765 00000\n• 24x7 Customer Care available',
      [{ text: 'OK' }],
    );
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 14, paddingBottom: 130 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. User Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <SvgXml xml={AVATAR_SVG} width={58} height={58} />
        </View>

        <View style={styles.nameWrap}>
          <Text style={styles.userName} numberOfLines={1}>
            {name}
          </Text>
        </View>

        <Pressable
          style={styles.editBtn}
          onPress={() => {
            setEditName(name);
            setEditPhone(phone);
            setEditEmail(email);
            setIsEditing(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Edit Profile"
          hitSlop={8}
        >
          <Text style={styles.editText}>EDIT</Text>
        </Pressable>
      </View>

      {/* 2. Shield Membership Banner */}
      <Pressable
        style={styles.shieldBanner}
        onPress={handleOpenShield}
        accessibilityRole="button"
        accessibilityLabel="Shield Membership Banner"
      >
        <View style={styles.shieldLeft}>
          <View style={styles.shieldPill}>
            <SvgXml xml={SHIELD_ICON_SVG} width={13} height={13} />
            <Text style={styles.shieldPillText}>•practo• SHIELD</Text>
          </View>
          <Text style={styles.shieldDesc}>
            10 Free Hospital Visits &amp; Unlimited GP Video Consultations*
          </Text>
        </View>
        <SvgXml xml={BANNER_CHEVRON_SVG} width={8} height={14} />
      </Pressable>

      {/* 3. "My History" Section */}
      <Text style={styles.sectionHeading}>My History</Text>

      <View style={styles.menuCard}>
        {/* In Person Appointments */}
        <Pressable
          style={styles.menuRow}
          onPress={onOnlineConsult}
          accessibilityRole="button"
          accessibilityLabel="In Person Appointments"
        >
          <View style={styles.menuIconWrap}>
            <SvgXml xml={IN_PERSON_SVG} width={22} height={22} />
          </View>
          <Text style={styles.menuTitle}>In Person Appointments</Text>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={8} height={14} />
        </Pressable>

        {/* Video Consultations */}
        <Pressable
          style={styles.menuRow}
          onPress={onOnlineConsult}
          accessibilityRole="button"
          accessibilityLabel="Video Consultations"
        >
          <View style={styles.menuIconWrap}>
            <SvgXml xml={VIDEO_CONSULT_SVG} width={22} height={22} />
          </View>
          <Text style={styles.menuTitle}>Video Consultations</Text>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={8} height={14} />
        </Pressable>

        {/* Test Bookings */}
        <Pressable
          style={styles.menuRow}
          onPress={onLabTests}
          accessibilityRole="button"
          accessibilityLabel="Test Bookings"
        >
          <View style={styles.menuIconWrap}>
            <SvgXml xml={TEST_BOOKINGS_SVG} width={22} height={22} />
          </View>
          <Text style={styles.menuTitle}>Test Bookings</Text>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={8} height={14} />
        </Pressable>

        {/* Medicine Orders */}
        <Pressable
          style={styles.menuRow}
          onPress={onMedicines}
          accessibilityRole="button"
          accessibilityLabel="Medicine Orders"
        >
          <View style={styles.menuIconWrap}>
            <SvgXml xml={MEDICINE_ORDERS_SVG} width={22} height={22} />
          </View>
          <Text style={styles.menuTitle}>Medicine Orders</Text>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={8} height={14} />
        </Pressable>

        {/* My Doctors */}
        <Pressable
          style={styles.menuRow}
          onPress={() => onDoctorProfile('General physician')}
          accessibilityRole="button"
          accessibilityLabel="My Doctors"
        >
          <View style={styles.menuIconWrap}>
            <SvgXml xml={MY_DOCTORS_SVG} width={22} height={22} />
          </View>
          <Text style={styles.menuTitle}>My Doctors</Text>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={8} height={14} />
        </Pressable>

        {/* Medical Records */}
        <Pressable
          style={styles.menuRow}
          onPress={handleMedicalRecords}
          accessibilityRole="button"
          accessibilityLabel="Medical Records"
        >
          <View style={styles.menuIconWrap}>
            <SvgXml xml={MEDICAL_RECORDS_SVG} width={22} height={22} />
          </View>
          <Text style={styles.menuTitle}>Medical Records</Text>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={8} height={14} />
        </Pressable>

        {/* Payments & HealthCash */}
        <Pressable
          style={[styles.menuRow, styles.lastMenuRow]}
          onPress={handlePayments}
          accessibilityRole="button"
          accessibilityLabel="Payments and HealthCash"
        >
          <View style={styles.menuIconWrap}>
            <SvgXml xml={PAYMENTS_HEALTHCASH_SVG} width={22} height={22} />
          </View>
          <Text style={styles.menuTitle}>Payments &amp; HealthCash</Text>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={8} height={14} />
        </Pressable>
      </View>

      {/* 4. Help Center Section */}
      <View style={styles.helpSectionCard}>
        <Pressable
          style={[styles.menuRow, styles.lastMenuRow]}
          onPress={handleHelpCenter}
          accessibilityRole="button"
          accessibilityLabel="Help Center"
        >
          <View style={styles.menuIconWrap}>
            <SvgXml xml={HELP_CENTER_SVG} width={22} height={22} />
          </View>
          <Text style={styles.menuTitle}>Help Center</Text>
          <SvgXml xml={CHEVRON_RIGHT_SVG} width={8} height={14} />
        </Pressable>
      </View>

      {/* 5. Edit Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsEditing(false)} />
          <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Edit Profile</Text>
              <Pressable
                onPress={() => setIsEditing(false)}
                hitSlop={8}
                style={styles.modalCloseBtn}
              >
                <SvgXml xml={CLOSE_SVG} width={20} height={20} />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="email@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Pressable style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#edf0f9',
  },
  scrollContent: {
    paddingHorizontal: 14,
  },

  // 1. Profile Top Card
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(20, 24, 40, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: '#152766',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameWrap: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#1a1d2e',
    letterSpacing: -0.2,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#0284c7',
    letterSpacing: 0.5,
  },

  // 2. Shield Banner
  shieldBanner: {
    marginTop: 14,
    backgroundColor: '#0a1029',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(10, 16, 41, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  shieldLeft: {
    flex: 1,
    paddingRight: 10,
  },
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: '#38bdf8',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    gap: 5,
  },
  shieldPillText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#38bdf8',
    letterSpacing: 0.3,
  },
  shieldDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#ffffff',
    marginTop: 8,
  },

  // 3. Section Heading
  sectionHeading: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#474d66',
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 2,
  },

  // 4. History Menu Card
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e6f0',
    shadowColor: 'rgba(20, 24, 40, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f9',
  },
  lastMenuRow: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: '#1a1d2e',
  },

  // Help Section
  helpSectionCard: {
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e6f0',
    shadowColor: 'rgba(20, 24, 40, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f6',
  },
  modalHeaderTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1a1d2e',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalForm: {
    paddingTop: 16,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#474d66',
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e6f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14.5,
    color: '#1a1d2e',
    backgroundColor: '#f8fafc',
  },
  saveBtn: {
    marginTop: 8,
    backgroundColor: '#6b52ae',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#ffffff',
  },
});
