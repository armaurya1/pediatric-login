import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
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
import { SvgXml } from 'react-native-svg';
import { ALL_MEDICINES, Medicine } from './medicinesData';

// SVG Icons matching the search screen design
const BACK_ARROW_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 12H5M12 19L5 12L12 5" stroke="#1D2129" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const LOCATION_PIN_OUTLINE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#71747E"/>
</svg>`;

const CHEVRON_DOWN_THICK_SVG = `<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L5 5L9 1" stroke="#1D2129" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const CAMERA_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#71747E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="12" cy="13" r="4" stroke="#71747E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const GOLD_COIN_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
<circle cx="12" cy="12" r="7.5" stroke="#FDE68A" stroke-width="1.2"/>
<text x="12" y="16.5" font-size="12" font-weight="bold" fill="#78350F" text-anchor="middle" font-family="sans-serif">₹</text>
</svg>`;

const CHEVRON_DOUBLE_DOWN_SVG = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 9L12 14L17 9" stroke="#1D2129" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 15L12 20L17 15" stroke="#1D2129" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const PILL_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2" y="8" width="14" height="8" rx="4" transform="rotate(-45 2 8)" fill="#F59E0B" fill-opacity="0.25" stroke="#F59E0B" stroke-width="1.8"/>
<circle cx="15.5" cy="15.5" r="4.5" fill="#38BDF8" fill-opacity="0.35" stroke="#0284C7" stroke-width="1.8"/>
</svg>`;

const PERCENT_BADGE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="12" fill="#107A6E"/>
<path d="M8 16L16 8M9 9H9.01M15 15H15.01" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const CLEAR_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4L4 12M4 4L12 12" stroke="#7e8184" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const CLOSE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 6L6 18M6 6L18 18" stroke="#19112C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const SHIELD_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22S4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const TRUCK_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="3" width="15" height="13" stroke="#107a6e" stroke-width="2" stroke-linecap="round"/>
<polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="#107a6e" stroke-width="2" stroke-linecap="round"/>
<circle cx="5.5" cy="18.5" r="2.5" stroke="#107a6e" stroke-width="2"/>
<circle cx="18.5" cy="18.5" r="2.5" stroke="#107a6e" stroke-width="2"/>
</svg>`;

// Clean Home Screen SVGs (Preserved)
const HOME_PIN_SVG = `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><g><rect width="23" height="23" rx="11.5" fill="#FF503E"/><path d="M6.94829 10.0398L15.3538 6.64159C16.4745 6.26401 16.7734 6.64159 16.2504 7.77434L13.4485 15.7035C12.8508 16.8363 12.2905 16.7608 11.7674 15.477L10.8709 12.3053L7.50866 11.7389C6.38793 11.3614 6.20114 10.795 6.94829 10.0398Z" fill="white"/></g></svg>`;

const HOME_CART_SVG = `<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M1.9642 1.8788H3.88087L4.9071 6.46236M4.9071 6.46236L6.43003 13.2644C6.52355 13.6814 6.76609 14.0541 7.11592 14.3185C7.46575 14.5828 7.90099 14.7223 8.3467 14.7128H17.7192C18.1554 14.7121 18.5783 14.5691 18.9181 14.3074C19.2579 14.0458 19.4942 13.681 19.588 13.2735L21.1692 6.46236H4.9071ZM4.9071 6.46236H4.90628M8.6248 19.2507C8.6248 19.757 8.19574 20.1674 7.66647 20.1674C7.1372 20.1674 6.70814 19.757 6.70814 19.2507C6.70814 18.7444 7.1372 18.334 7.66647 18.334C8.19574 18.334 8.6248 18.7444 8.6248 19.2507ZM19.1665 19.2507C19.1665 19.757 18.7374 20.1674 18.2081 20.1674C17.6789 20.1674 17.2498 19.757 17.2498 19.2507C17.2498 18.7444 17.6789 18.334 18.2081 18.334C18.7374 18.334 19.1665 18.7444 19.1665 19.2507Z" stroke-width="1.7" stroke-linecap="round" stroke="#19112C"/></g></svg>`;

const HOME_SEARCH_SVG = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M14.8751 15.7501L11.8009 12.4951M13.4583 8.25C13.4583 11.5637 10.9213 14.25 7.79167 14.25C4.66205 14.25 2.125 11.5637 2.125 8.25C2.125 4.93629 4.66205 2.25 7.79167 2.25C10.9213 2.25 13.4583 4.93629 13.4583 8.25Z" stroke-width="1.7" stroke-linecap="round" stroke="#827D90"/></g></svg>`;

// Category product photos for clean home screen
const HOME_CATEGORIES: { label: string; image: number }[][] = [
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

const SEARCH_FILTER_TABS = [
  'All',
  'Branded Substitute',
  'Antibiotics',
  'Daily Essentials',
  'Acidity & Gas',
  'Antifungal',
  'Pain Relief',
];

export default function MedicinesScreen({ onBack }: { onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<any>(null);

  // Screen modes: 'home' | 'search'
  const [screenMode, setScreenMode] = useState<'home' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});

  // Filtered & sorted medicines for the 2-column search screen
  const filteredMedicines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = ALL_MEDICINES.filter((m) => {
      const matchesCategory =
        selectedFilter === 'All'
          ? true
          : selectedFilter === 'Branded Substitute'
          ? m.discount >= 20 || m.category === 'Antibiotics'
          : m.category === selectedFilter;

      if (!matchesCategory) return false;
      if (!q) return true;

      // Salt matching for amoxicillin, etc.
      const isAmox = q.includes('amox') || q.includes('mox');
      if (
        isAmox &&
        (m.name.toLowerCase().includes('amox') ||
          m.name.toLowerCase().includes('mox') ||
          m.name.toLowerCase().includes('augmentin'))
      ) {
        return true;
      }

      return (
        m.name.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });

    // If query or view is related to Amoxicillin/Amox, sort Amoxyclav and Mox to the top matching the design
    if (q.includes('amox') || q.includes('mox')) {
      list = [...list].sort((a, b) => {
        const aScore = a.id === 6 ? -10 : a.id === 11 ? -5 : 0;
        const bScore = b.id === 6 ? -10 : b.id === 11 ? -5 : 0;
        return aScore - bScore;
      });
    }

    return list;
  }, [searchQuery, selectedFilter]);

  // Cart totals
  const totalCartCount = useMemo(() => {
    return Object.values(cartQuantities).reduce((acc, qty) => acc + qty, 0);
  }, [cartQuantities]);

  const totalCartPrice = useMemo(() => {
    return Object.entries(cartQuantities).reduce((sum, [idStr, qty]) => {
      const med = ALL_MEDICINES.find((m) => m.id === parseInt(idStr));
      return sum + (med ? med.sellingPrice * qty : 0);
    }, 0);
  }, [cartQuantities]);

  const handleAddToCart = (id: number) => {
    setCartQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (id: number) => {
    setCartQuantities((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const handleCheckout = () => {
    Alert.alert(
      'Order Confirmation',
      `You have ${totalCartCount} item(s) in your cart totaling ₹${totalCartPrice.toFixed(
        2,
      )}.\n\nFree delivery to 225003 Barabanki-1. Would you like to place this order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Order',
          onPress: () => {
            setCartQuantities({});
            Alert.alert('Order Placed!', 'Your medicines will be delivered in 2 hours.');
          },
        },
      ],
    );
  };

  const openSearchScreen = (category?: string) => {
    if (category) {
      setSelectedFilter(category);
    } else {
      setSelectedFilter('All');
      setSearchQuery('Amoxicillin'); // Pre-populate with query from screenshot
    }
    setScreenMode('search');
  };

  // Render 2-Column Product Card matching the screenshot
  const renderProductCard = ({ item: m }: { item: Medicine }) => {
    const qty = cartQuantities[m.id] || 0;
    const isRx = m.prescriptionRequired !== false;

    return (
      <Pressable
        style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.95 }]}
        onPress={() => setSelectedMedicine(m)}
        accessibilityRole="button"
        accessibilityLabel={`${m.name}, ₹${m.sellingPrice}`}
      >
        {/* Product Image Area with Rx Badge */}
        <View style={styles.cardImageArea}>
          {isRx && (
            <View style={styles.rxBadge}>
              <Text style={styles.rxBadgeText}>Rx</Text>
            </View>
          )}
          <Image source={m.image} style={styles.cardProductImage} resizeMode="contain" />
        </View>

        {/* Medicine Name (2 lines, bold) */}
        <Text style={styles.cardMedicineTitle} numberOfLines={2}>
          {m.name}
        </Text>

        {/* Package info */}
        <Text style={styles.cardPackageInfo} numberOfLines={1}>
          {m.packageInfo || '10 Tablet(s) in Strip'}
        </Text>

        {/* Price Block */}
        <View style={styles.cardPriceBlock}>
          <Text style={styles.cardMrpText}>MRP ₹{m.mrp.toFixed(2)}</Text>
          <View style={styles.cardSellingRow}>
            <Text style={styles.cardSellingPrice}>₹{m.sellingPrice.toFixed(2)}</Text>
            <Text style={styles.cardDiscountText}>{m.discount}% OFF</Text>
          </View>
        </View>

        {/* Add to cart / Quantity Selector Button */}
        {qty > 0 ? (
          <View style={styles.cardQtySelector}>
            <Pressable
              style={styles.cardQtyBtn}
              onPress={(e) => {
                e.stopPropagation();
                handleRemoveFromCart(m.id);
              }}
              hitSlop={6}
            >
              <Text style={styles.cardQtyBtnText}>−</Text>
            </Pressable>
            <Text style={styles.cardQtyValue}>{qty}</Text>
            <Pressable
              style={styles.cardQtyBtn}
              onPress={(e) => {
                e.stopPropagation();
                handleAddToCart(m.id);
              }}
              hitSlop={6}
            >
              <Text style={styles.cardQtyBtnText}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.cardAddButton}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(m.id);
            }}
            hitSlop={4}
          >
            <Text style={styles.cardAddButtonText}>Add to cart</Text>
          </Pressable>
        )}

        {/* Savings Offer Pill */}
        <View style={styles.cardSavingsPill}>
          <SvgXml xml={GOLD_COIN_SVG} width={14} height={14} />
          <Text style={styles.cardSavingsText} numberOfLines={1}>
            Click to save {m.discount > 25 ? '13%' : '8%'}
          </Text>
          <SvgXml xml={CHEVRON_DOUBLE_DOWN_SVG} width={9} height={9} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* ========================================================
          MODE 1: 2-COLUMN SEARCH ORDER MEDICINE (From Screenshot)
         ======================================================== */}
      {screenMode === 'search' ? (
        <View style={styles.searchRoot}>
          {/* 1. Deliver to Header */}
          <View style={styles.deliverToRow}>
            <SvgXml xml={LOCATION_PIN_OUTLINE_SVG} width={15} height={15} />
            <Text style={styles.deliverToLabel}>Deliver to </Text>
            <Text style={styles.deliverToAddress}>225003 Barabanki-1</Text>
            <SvgXml xml={CHEVRON_DOWN_THICK_SVG} width={9} height={5} />
          </View>

          {/* 2. Search Input Box with Camera Icon */}
          <View style={styles.searchBarBox}>
            <Pressable
              onPress={() => {
                setScreenMode('home');
                setSearchQuery('');
              }}
              style={styles.searchBackBtn}
              accessibilityLabel="Back to medicines"
              hitSlop={8}
            >
              <SvgXml xml={BACK_ARROW_SVG} width={22} height={22} />
            </Pressable>

            <TextInput
              ref={searchInputRef}
              style={styles.searchTextInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search medicines, symptoms..."
              placeholderTextColor="#827d90"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />

            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchIcon}
                hitSlop={8}
              >
                <SvgXml xml={CLEAR_SVG} width={15} height={15} />
              </Pressable>
            )}

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Upload Prescription',
                  'Upload or take a photo of your doctor’s prescription to automatically order medicines.',
                )
              }
              style={styles.cameraIconBtn}
              hitSlop={8}
              accessibilityLabel="Scan Prescription"
            >
              <SvgXml xml={CAMERA_SVG} width={22} height={22} />
            </Pressable>
          </View>

          {/* 3. Filter Pills Row */}
          <View style={styles.filterPillsRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterPillsScroll}
            >
              {SEARCH_FILTER_TABS.map((tab) => {
                const isSelected = selectedFilter === tab;
                const isBranded = tab === 'Branded Substitute';

                return (
                  <Pressable
                    key={tab}
                    style={[
                      styles.filterPill,
                      isSelected && styles.filterPillSelected,
                      isBranded && !isSelected && styles.filterPillBranded,
                    ]}
                    onPress={() => setSelectedFilter(tab)}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        isSelected && styles.filterPillTextSelected,
                      ]}
                    >
                      {tab}
                    </Text>
                    {isBranded && (
                      <View style={styles.pillIconWrap}>
                        <SvgXml xml={PILL_ICON_SVG} width={14} height={14} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 4. 2-Column Product Grid */}
          <FlatList
            data={filteredMedicines}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={renderProductCard}
            columnWrapperStyle={styles.gridColumnWrapper}
            contentContainerStyle={[
              styles.gridContentContainer,
              totalCartCount > 0 && { paddingBottom: 110 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={Platform.OS !== 'web'}
            ListEmptyComponent={
              <View style={styles.emptyResultsBox}>
                <Text style={styles.emptyResultsTitle}>No medicines found</Text>
                <Text style={styles.emptyResultsSub}>
                  Try searching for Amoxicillin, Azithral, Dolo, Mox, or Pan 40.
                </Text>
                <Pressable
                  style={styles.resetSearchBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedFilter('All');
                  }}
                >
                  <Text style={styles.resetSearchBtnText}>Show All Medicines</Text>
                </Pressable>
              </View>
            }
          />

          {/* 5. Sticky Floating Cart Bar (When Items Added) */}
          {totalCartCount > 0 && (
            <View style={[styles.floatingCartBar, { bottom: Math.max(insets.bottom, 48) }]}>
              <View style={styles.cartInfoSection}>
                <Text style={styles.cartCountText}>
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in cart
                </Text>
                <Text style={styles.cartPriceTotal}>₹{totalCartPrice.toFixed(2)}</Text>
              </View>
              <Pressable
                style={styles.cartOrderButton}
                onPress={handleCheckout}
                accessibilityRole="button"
              >
                <Text style={styles.cartOrderButtonText}>View Cart ›</Text>
              </Pressable>
            </View>
          )}

          {/* 6. Bottom Sticky Offer Banner */}
          <View
            style={[
              styles.bottomOfferBanner,
              { bottom: Math.max(insets.bottom, 6) },
            ]}
          >
            <SvgXml xml={PERCENT_BADGE_SVG} width={18} height={18} />
            <Text style={styles.bottomOfferText}>
              Get upto 26% OFF on orders above Rs 1000+
            </Text>
          </View>
        </View>
      ) : (
        /* ========================================================
            MODE 2: CLEAN MEDICINE HOME SCREEN (Popular Categories)
           ======================================================== */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.homeContent,
            totalCartCount > 0 && { paddingBottom: 90 },
          ]}
        >
          {/* Delivery location + cart */}
          <View style={styles.homeTopRow}>
            {onBack && (
              <Pressable
                onPress={onBack}
                accessibilityLabel="Back"
                style={styles.homeBackBtn}
                hitSlop={8}
              >
                <SvgXml xml={BACK_ARROW_SVG} width={24} height={24} />
              </Pressable>
            )}
            <View style={styles.homeLocationPill}>
              <SvgXml xml={HOME_PIN_SVG} width={23} height={23} />
              <Text style={styles.homeLocationCity}>Barabanki</Text>
              <Text style={styles.homeLocationCountry}>India</Text>
            </View>
            <Pressable
              style={styles.homeCartBtn}
              onPress={() => {
                if (totalCartCount > 0) handleCheckout();
              }}
            >
              <SvgXml xml={HOME_CART_SVG} width={23} height={22} />
              {totalCartCount > 0 && (
                <View style={styles.homeCartBadge}>
                  <Text style={styles.homeCartBadgeText}>{totalCartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Search bar - Tapping opens the 2-Column Search Screen */}
          <Pressable
            style={styles.homeSearchBar}
            onPress={() => openSearchScreen()}
            accessibilityRole="button"
            accessibilityLabel="Search medicines, wellness"
          >
            <SvgXml xml={HOME_SEARCH_SVG} width={17} height={18} />
            <Text style={styles.homeSearchPlaceholder}>
              Search medicines, wellness...
            </Text>
          </Pressable>

          {/* Popular categories heading */}
          <Text style={styles.homeHeading}>Popular categories</Text>

          {/* 20 Popular category tiles */}
          {HOME_CATEGORIES.map((row, i) => (
            <View key={i} style={styles.homeTileRow}>
              {row.map((item) => (
                <Pressable
                  key={item.label}
                  style={styles.homeTile}
                  onPress={() => {
                    const l = item.label.toLowerCase();
                    const cat = l.includes('other\nmedicines')
                      ? 'Antibiotics'
                      : l.includes('gut')
                      ? 'Acidity & Gas'
                      : l.includes('skin')
                      ? 'Antifungal'
                      : 'Daily Essentials';
                    openSearchScreen(cat);
                  }}
                >
                  <Image source={item.image} style={styles.homeTileImage} resizeMode="cover" />
                  <Text style={styles.homeTileLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Floating Bottom Cart Bar for Home Mode */}
      {screenMode === 'home' && totalCartCount > 0 && (
        <View style={[styles.floatingCartBar, { bottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.cartInfoSection}>
            <Text style={styles.cartCountText}>
              {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in cart
            </Text>
            <Text style={styles.cartPriceTotal}>₹{totalCartPrice.toFixed(2)}</Text>
          </View>
          <Pressable
            style={styles.cartOrderButton}
            onPress={handleCheckout}
            accessibilityRole="button"
          >
            <Text style={styles.cartOrderButtonText}>Order Now ›</Text>
          </Pressable>
        </View>
      )}

      {/* Product Detail Modal */}
      <Modal
        visible={!!selectedMedicine}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedMedicine(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelectedMedicine(null)}
          />
          {selectedMedicine && (
            <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalCategoryBadge}>
                  <Text style={styles.modalCategoryBadgeText}>
                    {selectedMedicine.category}
                  </Text>
                </View>
                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedMedicine(null)}
                  hitSlop={8}
                >
                  <SvgXml xml={CLOSE_SVG} width={20} height={20} />
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Product Photo Showcase */}
                <View style={styles.modalImageContainer}>
                  <Image
                    source={selectedMedicine.image}
                    style={styles.modalProductImage}
                    resizeMode="contain"
                  />
                  <View style={styles.modalDiscountPill}>
                    <Text style={styles.modalDiscountPillText}>
                      {selectedMedicine.discount}% OFF
                    </Text>
                  </View>
                </View>

                {/* Title & Manufacturer */}
                <Text style={styles.modalTitle}>{selectedMedicine.name}</Text>
                <Text style={styles.modalMfr}>
                  Manufactured by {selectedMedicine.manufacturer}
                </Text>

                {/* Price Box */}
                <View style={styles.modalPriceBox}>
                  <View>
                    <Text style={styles.modalPriceHeading}>Special Price</Text>
                    <View style={styles.modalPriceNumbers}>
                      <Text style={styles.modalSellingPrice}>
                        ₹{selectedMedicine.sellingPrice.toFixed(2)}
                      </Text>
                      <Text style={styles.modalMrp}>
                        MRP ₹{selectedMedicine.mrp.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.savingsTag}>
                    <Text style={styles.savingsTagText}>
                      Save ₹{(selectedMedicine.mrp - selectedMedicine.sellingPrice).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Highlights / Badges */}
                <View style={styles.modalSpecsRow}>
                  <View style={styles.modalSpecItem}>
                    <SvgXml xml={SHIELD_SVG} width={14} height={14} />
                    <Text style={styles.modalSpecText}>100% Genuine Medicine</Text>
                  </View>
                  <View style={styles.modalSpecItem}>
                    <SvgXml xml={TRUCK_SVG} width={14} height={14} />
                    <Text style={styles.modalSpecText}>Fast 2-hr Home Delivery</Text>
                  </View>
                </View>

                {/* Packaging & Details */}
                <View style={styles.modalDetailBox}>
                  <Text style={styles.modalDetailBoxTitle}>Packaging Details</Text>
                  <Text style={styles.modalDetailBoxText}>
                    {selectedMedicine.packageInfo}
                  </Text>
                  <Text style={styles.modalDeliveryNote}>
                    Deliver to 225003 Barabanki-1 • Standard temperature-controlled storage
                  </Text>
                </View>
              </ScrollView>

              {/* Modal Bottom Action Button */}
              <View style={styles.modalBottomAction}>
                <Pressable
                  style={styles.modalAddToCartBtn}
                  onPress={() => {
                    handleAddToCart(selectedMedicine.id);
                  }}
                >
                  <Text style={styles.modalAddToCartBtnText}>
                    {(cartQuantities[selectedMedicine.id] || 0) > 0
                      ? `✓ In Cart (${cartQuantities[selectedMedicine.id]}) • Add More`
                      : `Add to Cart • ₹${selectedMedicine.sellingPrice.toFixed(2)}`}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // ==========================================
  // SEARCH SCREEN STYLES (2-COLUMN GRID)
  // ==========================================
  searchRoot: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  deliverToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 4,
  },
  deliverToLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#71747e',
    marginLeft: 2,
  },
  deliverToAddress: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#1d2129',
    marginRight: 4,
  },
  searchBarBox: {
    height: 48,
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e4ea',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  searchBackBtn: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTextInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: '#1d2129',
    paddingVertical: 0,
    outlineWidth: 0,
  } as object,
  clearSearchIcon: {
    padding: 4,
  },
  cameraIconBtn: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillsRow: {
    paddingBottom: 10,
  },
  filterPillsScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  filterPill: {
    height: 32,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e4ea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillSelected: {
    backgroundColor: '#2b2d38',
    borderColor: '#2b2d38',
  },
  filterPillBranded: {
    borderColor: '#fcd34d',
    backgroundColor: '#ffffff',
  },
  filterPillText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    color: '#1d2129',
  },
  filterPillTextSelected: {
    color: '#ffffff',
  },
  pillIconWrap: {
    marginLeft: 6,
  },

  // 2-Column Grid Layout
  gridContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eaedf2',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardImageArea: {
    height: 135,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  rxBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#9fb5d8',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    zIndex: 1,
  },
  rxBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#ffffff',
  },
  cardProductImage: {
    width: '88%',
    height: 115,
  },
  cardMedicineTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    lineHeight: 18,
    color: '#1d2129',
    marginTop: 6,
    minHeight: 36,
  },
  cardPackageInfo: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#71747e',
    marginTop: 2,
    marginBottom: 6,
  },
  cardPriceBlock: {
    marginBottom: 8,
  },
  cardMrpText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#71747e',
    textDecorationLine: 'line-through',
  },
  cardSellingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 1,
  },
  cardSellingPrice: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#1d2129',
  },
  cardDiscountText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    color: '#e53967',
    marginLeft: 6,
  },
  cardAddButton: {
    backgroundColor: '#107a6e',
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAddButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#ffffff',
  },
  cardQtySelector: {
    height: 38,
    borderRadius: 8,
    backgroundColor: '#e6f7f4',
    borderWidth: 1.5,
    borderColor: '#107a6e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  cardQtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cardQtyBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#107a6e',
  },
  cardQtyValue: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#107a6e',
  },
  cardSavingsPill: {
    height: 28,
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: '#fffdfa',
    borderWidth: 1,
    borderColor: '#bee3db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  cardSavingsText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10.5,
    color: '#1d2129',
    marginHorizontal: 3,
  },

  // Bottom Sticky Offer Banner
  bottomOfferBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: '#e8faf0',
    borderWidth: 1,
    borderColor: '#a3e8c1',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomOfferText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#065f46',
  },

  // Floating Cart Bar
  floatingCartBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: '#107a6e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  cartInfoSection: {
    gap: 2,
  },
  cartCountText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#e6f7f4',
  },
  cartPriceTotal: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#ffffff',
  },
  cartOrderButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cartOrderButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#107a6e',
  },

  // Empty Results Box
  emptyResultsBox: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyResultsTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#1d2129',
    marginBottom: 6,
  },
  emptyResultsSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#71747e',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetSearchBtn: {
    backgroundColor: '#107a6e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetSearchBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#ffffff',
  },

  // ==========================================
  // HOME SCREEN STYLES (PRESERVED CLEAN DESIGN)
  // ==========================================
  homeContent: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 24,
  },
  homeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeBackBtn: {
    marginRight: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeLocationPill: {
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
  homeLocationCity: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#19112c',
  },
  homeLocationCountry: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#706a80',
  },
  homeCartBtn: {
    padding: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeCartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#107a6e',
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  homeCartBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#ffffff',
  },
  homeSearchBar: {
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cecbd3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 10,
    marginTop: 17,
    backgroundColor: '#ffffff',
  },
  homeSearchPlaceholder: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 15.3,
    color: '#827d90',
  },
  homeHeading: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#19112c',
    marginTop: 26,
    marginBottom: 16,
  },
  homeTileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8.5,
  },
  homeTile: {
    width: 78,
    alignItems: 'center',
  },
  homeTileImage: {
    width: 78,
    height: 79,
    borderRadius: 9,
  },
  homeTileLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
    color: '#19112c',
    textAlign: 'center',
    width: 84,
    marginTop: 4,
  },

  // ==========================================
  // MODAL STYLES
  // ==========================================
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f4',
  },
  modalCategoryBadge: {
    backgroundColor: '#e6f7f4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalCategoryBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#107a6e',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  modalImageContainer: {
    height: 180,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eaedf2',
  },
  modalProductImage: {
    width: '80%',
    height: 150,
  },
  modalDiscountPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e53967',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modalDiscountPillText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#ffffff',
  },
  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#1d2129',
    lineHeight: 22,
    marginBottom: 4,
  },
  modalMfr: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#71747e',
    marginBottom: 14,
  },
  modalPriceBox: {
    backgroundColor: '#f8faf9',
    borderWidth: 1,
    borderColor: '#e2ece7',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalPriceHeading: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#71747e',
  },
  modalPriceNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 2,
  },
  modalSellingPrice: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#1d2129',
  },
  modalMrp: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#8a8d98',
    textDecorationLine: 'line-through',
  },
  savingsTag: {
    backgroundColor: '#e8faf0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  savingsTagText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#065f46',
  },
  modalSpecsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modalSpecItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#eaedf2',
  },
  modalSpecText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#1d2129',
    flex: 1,
  },
  modalDetailBox: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f4',
    paddingTop: 14,
  },
  modalDetailBoxTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#1d2129',
    marginBottom: 4,
  },
  modalDetailBoxText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#4b5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  modalDeliveryNote: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#107a6e',
  },
  modalBottomAction: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f4',
  },
  modalAddToCartBtn: {
    backgroundColor: '#107a6e',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddToCartBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#ffffff',
  },
});
