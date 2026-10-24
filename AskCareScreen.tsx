import { useRef, useState, type ComponentRef } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
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
import * as ImagePicker from 'expo-image-picker';

// Live Ask Care AI webhook (n8n, Published). NOTE: this webhook URL is
// unauthenticated by design, so anyone who knows it can call it and consume
// the workflow's AI quota. Keep that in mind before sharing the app widely.
const WEBHOOK_URL = 'https://alokma.app.n8n.cloud/webhook/ask-care-ai';

const BACK_SVG = `<svg width="27.7371" height="18.3" viewBox="0 0 27.7371 18.3" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.5871 9.15H1.58707M9.19576 17.15L1.58707 9.15L9.19576 1.15" stroke="#6B52AE" stroke-width="2.3" stroke-linecap="round"/>
</svg>`;

const SEND_SVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.166 10H15.834M10 15.834L15.834 10L10 4.166" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const PHOTO_SVG = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2" y="4" width="18" height="14" rx="2" stroke="#6650d6" stroke-width="1.6"/>
<circle cx="8" cy="10" r="2" stroke="#6650d6" stroke-width="1.6"/>
<path d="M4 17l4-4 3 3 2-2 3 3" stroke="#6650d6" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

type MedicineMatch = {
  name: string;
  brand: string;
  mrp: number;
  price: number;
  savings: number;
  discount: number;
  url: string;
};

type LabResult = {
  test?: string;
  value?: string;
  unit?: string;
  reference_range?: string;
  flag?: string;
  status?: string;
};

type AskCareReply = {
  capability: string;
  reply: string;
  specialty?: string | null;
  reason?: string | null;
  urgency?: string | null;
  safety_warning?: string | null;
  results?: LabResult[];
  explanation?: string | null;
  matchStatus?: string;
  matches?: MedicineMatch[];
};

type ChatMessage = {
  id: string;
  from: 'user' | 'ai' | 'error';
  text?: string;
  imageUri?: string;
  reply?: AskCareReply;
};

type AttachedPhoto = {
  uri: string;
  dataUrl: string;
};

const WELCOME: ChatMessage = {
  id: 'welcome',
  from: 'ai',
  text: 'Hi! I am Ask Care AI. Describe your symptoms in words, or send a photo of a lab report or a medicine strip, and I will help you understand it.',
};

const SUGGESTIONS = [
  'Fever and sore throat',
  'My child has a cough',
];

function urgencyStyle(urgency: string | null | undefined) {
  const u = (urgency || '').toLowerCase();
  if (u === 'emergency') {
    return { backgroundColor: '#fde8e8', color: '#b91c1c' };
  }
  if (u === 'urgent') {
    return { backgroundColor: '#fef0e0', color: '#c2570a' };
  }
  if (u === 'soon') {
    return { backgroundColor: '#ece6fb', color: '#5937a0' };
  }
  return { backgroundColor: '#e6f4ea', color: '#2f6b3f' };
}

function labStatusStyle(status: string | null | undefined) {
  const s = (status || '').toLowerCase();
  if (s === 'above') {
    return { backgroundColor: '#fde8e8', color: '#b91c1c' };
  }
  if (s === 'below') {
    return { backgroundColor: '#e0eefb', color: '#1d4f9c' };
  }
  if (s === 'within') {
    return { backgroundColor: '#e6f4ea', color: '#2f6b3f' };
  }
  return { backgroundColor: '#eeeeee', color: '#555555' };
}

export default function AskCareScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [photo, setPhoto] = useState<AttachedPhoto | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const idRef = useRef(0);

  const nextId = () => {
    idRef.current += 1;
    return `m${idRef.current}`;
  };

  if (!fontsLoaded) {
    return null;
  }

  const sendMessage = async (text: string, attached: AttachedPhoto | null) => {
    const message = text.trim();
    if (!message && !attached) {
      return;
    }
    const userMsg: ChatMessage = {
      id: nextId(),
      from: 'user',
      text: message || undefined,
      imageUri: attached?.uri,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setPhoto(null);
    setSending(true);
    try {
      const controller = new AbortController();
      const timer: ReturnType<typeof setTimeout> = setTimeout(
        () => controller.abort(),
        120000,
      );
      let res: Response;
      try {
        res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            ...(attached ? { image: attached.dataUrl } : {}),
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as AskCareReply;
      setMessages((prev) => [
        ...prev,
        { id: nextId(), from: 'ai', reply: data },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          from: 'error',
          text: 'Could not reach Ask Care AI. Please check your connection and try again.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const pickPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
        base64: true,
      });
      if (res.canceled || !res.assets[0]) {
        return;
      }
      const asset = res.assets[0];
      if (!asset.base64) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            from: 'error',
            text: 'Could not read that photo. Please try another photo.',
          },
        ]);
        return;
      }
      setPhoto({
        uri: asset.uri,
        dataUrl: `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          from: 'error',
          text: 'Could not open your photos. Please try again.',
        },
      ]);
    }
  };

  const renderReply = (reply: AskCareReply) => {
    if (reply.capability === 'symptom_specialty') {
      return (
        <View style={{ gap: 10 }}>
          <View style={styles.pillRow}>
            {reply.specialty ? (
              <View style={[styles.pill, styles.specialtyPill]}>
                <Text style={[styles.pillText, { color: '#5937a0' }]}>
                  {reply.specialty}
                </Text>
              </View>
            ) : null}
            {reply.urgency ? (
              <View
                style={[styles.pill, urgencyStyle(reply.urgency)]}
              >
                <Text
                  style={[styles.pillText, urgencyStyle(reply.urgency)]}
                >
                  {reply.urgency}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.aiText}>{reply.reply}</Text>
          {reply.reason ? (
            <Text style={styles.reasonText}>{reply.reason}</Text>
          ) : null}
          {reply.safety_warning ? (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{reply.safety_warning}</Text>
            </View>
          ) : null}
        </View>
      );
    }
    if (reply.capability === 'medicine_strip') {
      const match =
        reply.matchStatus === 'confident' ? reply.matches?.[0] : undefined;
      return (
        <View style={{ gap: 10 }}>
          {match ? (
            <View style={styles.medicineCard}>
              <Text style={styles.medicineName}>{match.name}</Text>
              <Text style={styles.medicineBrand}>{match.brand}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.mrpText}>
                  MRP ₹{match.mrp.toFixed(2)}
                </Text>
                <Text style={styles.priceText}>
                  ₹{match.price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.pillRow}>
                <View style={[styles.pill, styles.savePill]}>
                  <Text style={[styles.pillText, { color: '#2f6b3f' }]}>
                    Save ₹{match.savings.toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.pill, styles.discountPill]}>
                  <Text style={[styles.pillText, { color: '#5937a0' }]}>
                    {match.discount}% off
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  void Linking.openURL(match.url);
                }}
              >
                <Text style={styles.sourceLink}>View on PharmEasy</Text>
              </Pressable>
            </View>
          ) : null}
          <Text style={styles.aiText}>{reply.reply}</Text>
        </View>
      );
    }
    if (reply.capability === 'lab_report') {
      const rows = reply.results ?? [];
      return (
        <View style={{ gap: 10 }}>
          {rows.length > 0 ? (
            <View style={{ gap: 8 }}>
              {rows.map((row, i) => (
                <View key={i} style={styles.labRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.labTest}>{row.test ?? '-'}</Text>
                    <Text style={styles.labMeta}>
                      {[row.value, row.unit].filter(Boolean).join(' ')}
                      {row.reference_range
                        ? `  (Ref: ${row.reference_range})`
                        : ''}
                    </Text>
                  </View>
                  <View
                    style={[styles.pill, labStatusStyle(row.status)]}
                  >
                    <Text
                      style={[styles.pillText, labStatusStyle(row.status)]}
                    >
                      {row.status ?? 'unable'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
          <Text style={styles.aiText}>{reply.reply}</Text>
          {reply.explanation ? (
            <Text style={styles.reasonText}>{reply.explanation}</Text>
          ) : null}
        </View>
      );
    }
    return <Text style={styles.aiText}>{reply.reply}</Text>;
  };

  const showSuggestions = messages.length <= 1 && !sending;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Back"
        >
          <SvgXml xml={BACK_SVG} width={25} height={16} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>ASK CARE AI</Text>
          <Text style={styles.headerSubtitle}>
            Symptoms, lab reports &amp; medicines
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.disclaimer}>
          Information only — not a diagnosis. For an emergency, call emergency
          services immediately.
        </Text>
        {messages.map((msg) => {
          if (msg.from === 'user') {
            return (
              <View key={msg.id} style={styles.userRow}>
                <View style={styles.userBubble}>
                  {msg.imageUri ? (
                    <Image
                      source={{ uri: msg.imageUri }}
                      style={styles.userPhoto}
                      resizeMode="cover"
                    />
                  ) : null}
                  {msg.text ? (
                    <Text style={styles.userText}>{msg.text}</Text>
                  ) : null}
                </View>
              </View>
            );
          }
          if (msg.from === 'error') {
            return (
              <View key={msg.id} style={styles.aiRow}>
                <View style={[styles.aiBubble, styles.errorBubble]}>
                  <Text style={styles.errorText}>{msg.text}</Text>
                </View>
              </View>
            );
          }
          return (
            <View key={msg.id} style={styles.aiRow}>
              <View style={styles.aiBubble}>
                {msg.reply ? (
                  renderReply(msg.reply)
                ) : (
                  <Text style={styles.aiText}>{msg.text}</Text>
                )}
                <Text style={styles.aiFooter}>
                  Information only — not a diagnosis.
                </Text>
              </View>
            </View>
          );
        })}
        {sending ? (
          <View style={styles.aiRow}>
            <View style={styles.aiBubble}>
              <ActivityIndicator color="#6650d6" />
            </View>
          </View>
        ) : null}
        {showSuggestions ? (
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <Pressable
                key={s}
                style={styles.chip}
                onPress={() => {
                  void sendMessage(s, null);
                }}
              >
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.chip} onPress={pickPhoto}>
              <Text style={styles.chipText}>Photo of a medicine strip</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {photo ? (
        <View style={styles.attachPreview}>
          <Image
            source={{ uri: photo.uri }}
            style={styles.attachThumb}
            resizeMode="cover"
          />
          <Text style={styles.attachLabel}>Photo attached</Text>
          <Pressable
            style={styles.attachRemove}
            onPress={() => setPhoto(null)}
            accessibilityLabel="Remove photo"
          >
            <Text style={styles.attachRemoveText}>×</Text>
          </Pressable>
        </View>
      ) : null}

      <View
        style={[styles.composer, { paddingBottom: 12 + insets.bottom }]}
      >
        <Pressable
          style={styles.attachButton}
          onPress={pickPhoto}
          accessibilityLabel="Attach a photo"
        >
          <SvgXml xml={PHOTO_SVG} width={22} height={22} />
        </Pressable>
        <TextInput
          style={styles.composerInput}
          value={input}
          onChangeText={setInput}
          placeholder="Describe symptoms or ask about a medicine…"
          placeholderTextColor="#7e8184"
          multiline
        />
        <Pressable
          style={[
            styles.sendButton,
            sending && styles.sendButtonDisabled,
          ]}
          onPress={() => {
            void sendMessage(input, photo);
          }}
          disabled={sending}
          accessibilityLabel="Send"
        >
          <SvgXml xml={SEND_SVG} width={20} height={20} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e1eb',
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#6b52ae',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#7e8184',
    marginTop: 2,
  },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 12, paddingBottom: 24 },
  disclaimer: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#7e8184',
    textAlign: 'center',
    marginBottom: 4,
  },
  userRow: { alignItems: 'flex-end' },
  aiRow: { alignItems: 'flex-start' },
  userBubble: {
    backgroundColor: '#6650d6',
    borderRadius: 14,
    padding: 12,
    maxWidth: '85%',
    gap: 8,
  },
  userText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 21,
  },
  userPhoto: { width: 180, height: 180, borderRadius: 10 },
  aiBubble: {
    backgroundColor: '#f6f3ff',
    borderWidth: 1,
    borderColor: '#e3e1eb',
    borderRadius: 14,
    padding: 12,
    maxWidth: '88%',
    gap: 8,
  },
  aiText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: '#1d1b26',
    lineHeight: 21,
  },
  reasonText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#55505f',
    lineHeight: 18,
  },
  aiFooter: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#7e8184',
    marginTop: 2,
  },
  errorBubble: { backgroundColor: '#fde8e8', borderColor: '#f0b8b8' },
  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#b91c1c',
    lineHeight: 20,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
  },
  specialtyPill: { backgroundColor: '#ece6fb' },
  savePill: { backgroundColor: '#e6f4ea' },
  discountPill: { backgroundColor: '#ece6fb' },
  warningBox: {
    backgroundColor: '#fff4e0',
    borderWidth: 1,
    borderColor: '#f0c987',
    borderRadius: 10,
    padding: 10,
  },
  warningText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#7a4a00',
    lineHeight: 18,
  },
  medicineCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e1eb',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  medicineName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#1d1b26',
    lineHeight: 20,
  },
  medicineBrand: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#7e8184',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 2,
  },
  mrpText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#7e8184',
    textDecorationLine: 'line-through',
  },
  priceText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1d1b26',
  },
  sourceLink: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#6b52ae',
    marginTop: 2,
  },
  labRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e1eb',
    borderRadius: 10,
    padding: 10,
  },
  labTest: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#1d1b26',
  },
  labMeta: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#7e8184',
    marginTop: 2,
  },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#d8d0e8',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#5937a0',
  },
  attachPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e3e1eb',
  },
  attachThumb: { width: 48, height: 48, borderRadius: 8 },
  attachLabel: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#55505f',
  },
  attachRemove: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachRemoveText: { fontSize: 18, color: '#555555', lineHeight: 20 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e3e1eb',
    backgroundColor: '#ffffff',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d8d0e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerInput: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: '#1d1b26',
    borderWidth: 1,
    borderColor: '#d8d0e8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 110,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6650d6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
});
