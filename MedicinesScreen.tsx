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

// Icons: the screen's own Figma SVGs (node 160:233)
const BACK_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 12H5M12 19L5 12L12 5" stroke="#19112C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const PIN_SVG = `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><g><rect width="23" height="23" rx="11.5" fill="#FF503E"/><path d="M6.94829 10.0398L15.3538 6.64159C16.4745 6.26401 16.7734 6.64159 16.2504 7.77434L13.4485 15.7035C12.8508 16.8363 12.2905 16.7608 11.7674 15.477L10.8709 12.3053L7.50866 11.7389C6.38793 11.3614 6.20114 10.795 6.94829 10.0398Z" fill="white"/></g></svg>`;

const CART_SVG = `<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M1.9642 1.8788H3.88087L4.9071 6.46236M4.9071 6.46236L6.43003 13.2644C6.52355 13.6814 6.76609 14.0541 7.11592 14.3185C7.46575 14.5828 7.90099 14.7223 8.3467 14.7128H17.7192C18.1554 14.7121 18.5783 14.5691 18.9181 14.3074C19.2579 14.0458 19.4942 13.681 19.588 13.2735L21.1692 6.46236H4.9071ZM4.9071 6.46236H4.90628M8.6248 19.2507C8.6248 19.757 8.19574 20.1674 7.66647 20.1674C7.1372 20.1674 6.70814 19.757 6.70814 19.2507C6.70814 18.7444 7.1372 18.334 7.66647 18.334C8.19574 18.334 8.6248 18.7444 8.6248 19.2507ZM19.1665 19.2507C19.1665 19.757 18.7374 20.1674 18.2081 20.1674C17.6789 20.1674 17.2498 19.757 17.2498 19.2507C17.2498 18.7444 17.6789 18.334 18.2081 18.334C18.7374 18.334 19.1665 18.7444 19.1665 19.2507Z" stroke-width="1.7" stroke-linecap="round" stroke="#19112C"/></g></svg>`;

const SEARCH_SVG = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M14.8751 15.7501L11.8009 12.4951M13.4583 8.25C13.4583 11.5637 10.9213 14.25 7.79167 14.25C4.66205 14.25 2.125 11.5637 2.125 8.25C2.125 4.93629 4.66205 2.25 7.79167 2.25C10.9213 2.25 13.4583 4.93629 13.4583 8.25Z" stroke-width="1.7" stroke-linecap="round" stroke="#827D90"/></g></svg>`;

const CLEAR_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4L4 12M4 4L12 12" stroke="#7e8184" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const PLUS_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5V19M5 12H19" stroke="#6b52ae" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const CLOSE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 6L6 18M6 6L18 18" stroke="#19112C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const SHIELD_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22S4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const TRUCK_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="3" width="15" height="13" stroke="#6b52ae" stroke-width="2" stroke-linecap="round"/>
<polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="#6b52ae" stroke-width="2" stroke-linecap="round"/>
<circle cx="5.5" cy="18.5" r="2.5" stroke="#6b52ae" stroke-width="2"/>
<circle cx="18.5" cy="18.5" r="2.5" stroke="#6b52ae" stroke-width="2"/>
</svg>`;

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

const FILTER_TABS = ['Antibiotics', 'Daily Essentials', 'Acidity & Gas', 'Antifungal', 'All'];

export default function MedicinesScreen({ onBack }: { onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<any>(null);

  // Screen modes: 'home' | 'search'
  const [screenMode, setScreenMode] = useState<'home' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Antibiotics');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});

  // Filtered medicines for the search screen
  const filteredMedicines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_MEDICINES.filter((m) => {
      const matchesCategory =
        selectedFilter === 'All' || m.category === selectedFilter;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
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
      )}.\n\nFree delivery to Barabanki (225003). Would you like to proceed with the order?`,
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
    }
    setScreenMode('search');
  };

  // Medicine Item Card in Search
  const renderMedicineCard = (m: Medicine) => {
    const qty = cartQuantities[m.id] || 0;
    return (
      <Pressable
        key={m.id}
        style={({ pressed }) => [styles.medicineCard, pressed && { opacity: 0.94 }]}
        onPress={() => setSelectedMedicine(m)}
        accessibilityRole="button"
        accessibilityLabel={`${m.name}, ₹${m.sellingPrice}`}
      >
        <View style={styles.medicineImageWrap}>
          <Image source={m.image} style={styles.medicineImage} resizeMode="contain" />
        </View>

        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName} numberOfLines={2}>
            {m.name}
          </Text>
          <Text style={styles.medicineMfr} numberOfLines={1}>
            By {m.manufacturer}
          </Text>

          <View style={styles.medicineBadgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{m.category}</Text>
            </View>
            {m.packageInfo ? (
              <Text style={styles.packageInfoText}>{m.packageInfo}</Text>
            ) : null}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.sellingPrice}>₹{m.sellingPrice.toFixed(2)}</Text>
            <Text style={styles.mrpText}>₹{m.mrp.toFixed(2)}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{m.discount}% OFF</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionCol}>
          {qty > 0 ? (
            <View style={styles.qtyControls}>
              <Pressable
                style={styles.qtyBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  handleRemoveFromCart(m.id);
                }}
                hitSlop={6}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </Pressable>
              <Text style={styles.qtyValue}>{qty}</Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToCart(m.id);
                }}
                hitSlop={6}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.addBtn}
              onPress={(e) => {
                e.stopPropagation();
                handleAddToCart(m.id);
              }}
              hitSlop={6}
            >
              <SvgXml xml={PLUS_SVG} width={10} height={10} />
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* ========================================================
          MODE 1: SEARCH SCREEN (Separate Screen for 100 Medicines)
         ======================================================== */}
      {screenMode === 'search' ? (
        <View style={styles.searchScreenRoot}>
          {/* Search Header */}
          <View style={styles.searchHeader}>
            <Pressable
              onPress={() => {
                setScreenMode('home');
                setSearchQuery('');
              }}
              style={styles.backButton}
              accessibilityLabel="Back to medicines"
              hitSlop={8}
            >
              <SvgXml xml={BACK_SVG} width={24} height={24} />
            </Pressable>

            <View style={styles.activeSearchBar}>
              <SvgXml xml={SEARCH_SVG} width={18} height={18} />
              <TextInput
                ref={searchInputRef}
                style={styles.activeSearchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search 100+ medicines, manufacturers..."
                placeholderTextColor="#827d90"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  style={styles.clearBtn}
                  hitSlop={8}
                >
                  <SvgXml xml={CLEAR_SVG} width={16} height={16} />
                </Pressable>
              )}
            </View>

            <Pressable
              style={styles.headerCartBtn}
              onPress={() => {
                if (totalCartCount > 0) handleCheckout();
              }}
            >
              <SvgXml xml={CART_SVG} width={23} height={22} />
              {totalCartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Quick Filter Category Tabs */}
          <View style={styles.filterTabsRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTabsContent}
            >
              {FILTER_TABS.map((tab) => {
                const isActive = selectedFilter === tab;
                return (
                  <Pressable
                    key={tab}
                    style={[styles.filterChip, isActive && styles.activeFilterChip]}
                    onPress={() => setSelectedFilter(tab)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.activeFilterChipText,
                      ]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Virtualized Search Results List - Fast 0ms render */}
          <FlatList
            data={filteredMedicines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderMedicineCard(item)}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={Platform.OS !== 'web'}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.searchResultsScroll}
            contentContainerStyle={[
              styles.searchResultsContent,
              totalCartCount > 0 && { paddingBottom: 100 },
            ]}
            ListHeaderComponent={
              <View style={styles.resultSummaryRow}>
                <Text style={styles.resultCountText}>
                  {filteredMedicines.length}{' '}
                  {filteredMedicines.length === 1 ? 'medicine' : 'medicines'} found
                </Text>
                <Text style={styles.activeCategoryLabel}>
                  {selectedFilter === 'All' ? 'All Medicines' : selectedFilter}
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No medicines found</Text>
                <Text style={styles.emptySub}>
                  Try searching for Dolo, Azithral, Pan 40, Augmentin, or Cipla.
                </Text>
                <Pressable
                  style={styles.clearSearchBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedFilter('Antibiotics');
                  }}
                >
                  <Text style={styles.clearSearchBtnText}>Reset Search</Text>
                </Pressable>
              </View>
            }
          />
        </View>
      ) : (
        /* ========================================================
            MODE 2: CLEAN MEDICINE HOME SCREEN (Popular Categories)
           ======================================================== */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            totalCartCount > 0 && { paddingBottom: 100 },
          ]}
        >
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
            <Pressable
              style={styles.headerCartBtn}
              onPress={() => {
                if (totalCartCount > 0) handleCheckout();
              }}
            >
              <SvgXml xml={CART_SVG} width={23} height={22} />
              {totalCartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Search bar - Tapping opens the different Search Screen */}
          <Pressable
            style={styles.searchBar}
            onPress={() => openSearchScreen()}
            accessibilityRole="button"
            accessibilityLabel="Search medicines, wellness"
          >
            <SvgXml xml={SEARCH_SVG} width={17} height={18} />
            <Text style={styles.searchInputPlaceholder}>
              Search medicines, wellness...
            </Text>
          </Pressable>

          {/* Popular categories heading */}
          <Text style={styles.heading}>Popular categories</Text>

          {/* 20 Popular category tiles (Exact same clean design as before) */}
          {CATEGORIES.map((row, i) => (
            <View key={i} style={styles.tileRow}>
              {row.map((item) => (
                <Pressable
                  key={item.label}
                  style={styles.tile}
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
                  <Image source={item.image} style={styles.tileImage} resizeMode="cover" />
                  <Text style={styles.tileLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <View style={[styles.floatingCartBar, { bottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.cartSummaryTextWrap}>
            <Text style={styles.cartItemsCount}>
              {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in cart
            </Text>
            <Text style={styles.cartTotalAmount}>₹{totalCartPrice.toFixed(2)}</Text>
          </View>
          <Pressable
            style={styles.cartCheckoutBtn}
            onPress={handleCheckout}
            accessibilityRole="button"
          >
            <Text style={styles.cartCheckoutBtnText}>Order Now ›</Text>
          </Pressable>
        </View>
      )}

      {/* Medicine Details Modal */}
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
                <View style={styles.modalHeaderCategoryPill}>
                  <Text style={styles.modalHeaderCategoryText}>
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
                    Deliver to Barabanki (225003) • Standard temperature-controlled storage
                  </Text>
                </View>
              </ScrollView>

              {/* Modal Bottom Action Button */}
              <View style={styles.modalBottomAction}>
                <Pressable
                  style={[
                    styles.modalAddCartBtn,
                    (cartQuantities[selectedMedicine.id] || 0) > 0 &&
                      styles.modalAddCartBtnActive,
                  ]}
                  onPress={() => {
                    handleAddToCart(selectedMedicine.id);
                  }}
                >
                  {(cartQuantities[selectedMedicine.id] || 0) > 0 ? (
                    <Text style={styles.modalAddCartBtnText}>
                      ✓ Added to Cart ({cartQuantities[selectedMedicine.id]}) • Add More
                    </Text>
                  ) : (
                    <Text style={styles.modalAddCartBtnText}>
                      Add to Cart • ₹{selectedMedicine.sellingPrice.toFixed(2)}
                    </Text>
                  )}
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
  headerCartBtn: {
    padding: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#6b52ae',
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#ffffff',
  },

  // Home Screen Search Bar (Pressable to open search screen)
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
    backgroundColor: '#ffffff',
  },
  searchInputPlaceholder: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 15.3,
    color: '#827d90',
  },

  // Popular Categories Section (Original 20 items)
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

  // ==========================================
  // SEARCH SCREEN STYLES (Second Screen)
  // ==========================================
  searchScreenRoot: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0edf7',
    gap: 8,
  },
  activeSearchBar: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f5f3fa',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  activeSearchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14.5,
    color: '#19112c',
    paddingVertical: 0,
    outlineWidth: 0,
  } as object,
  clearBtn: {
    padding: 4,
  },
  filterTabsRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f0f8',
    paddingVertical: 8,
  },
  filterTabsContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f4f2f9',
    borderWidth: 1,
    borderColor: '#e8e4f2',
  },
  activeFilterChip: {
    backgroundColor: '#6b52ae',
    borderColor: '#6b52ae',
  },
  filterChipText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12.5,
    color: '#6b52ae',
  },
  activeFilterChipText: {
    color: '#ffffff',
  },
  searchResultsScroll: {
    flex: 1,
  },
  searchResultsContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 30,
    gap: 10,
  },
  resultSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultCountText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#706a80',
  },
  activeCategoryLabel: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#6b52ae',
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#19112c',
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#827d90',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  clearSearchBtn: {
    backgroundColor: '#6b52ae',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearSearchBtnText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#ffffff',
  },

  // Medicine Item Card in Search Results
  medicineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ece8f5',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: 'rgba(22, 11, 55, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 2,
  },
  medicineImageWrap: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#faf8fd',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eeeaf7',
    padding: 2,
  },
  medicineImage: {
    width: '100%',
    height: '100%',
  },
  medicineInfo: {
    flex: 1,
    gap: 2,
  },
  medicineName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13.5,
    color: '#19112c',
    lineHeight: 18,
  },
  medicineMfr: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#706a80',
  },
  medicineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: '#f0edf7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    color: '#6b52ae',
  },
  packageInfoText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10.5,
    color: '#8b8798',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  sellingPrice: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#19112c',
  },
  mrpText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#999c9c',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#eaf6ec',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  discountText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#2e7d32',
  },
  actionCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    borderWidth: 1,
    borderColor: '#6b52ae',
    borderRadius: 8,
    height: 32,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
  },
  addBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12.5,
    color: '#6b52ae',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6b52ae',
    borderRadius: 8,
    height: 32,
    paddingHorizontal: 4,
    gap: 6,
  },
  qtyBtn: {
    width: 22,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 18,
  },
  qtyValue: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#ffffff',
    minWidth: 14,
    textAlign: 'center',
  },

  // Floating Cart Bar
  floatingCartBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    backgroundColor: '#19112c',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    shadowOpacity: 0.25,
    elevation: 8,
  },
  cartSummaryTextWrap: {
    gap: 2,
  },
  cartItemsCount: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#c5c3cc',
  },
  cartTotalAmount: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#ffffff',
  },
  cartCheckoutBtn: {
    backgroundColor: '#6b52ae',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cartCheckoutBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13.5,
    color: '#ffffff',
  },

  // Modal Product Details
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 16,
    paddingHorizontal: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0edf7',
  },
  modalHeaderCategoryPill: {
    backgroundColor: '#f5f2fc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalHeaderCategoryText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#6b52ae',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    marginTop: 10,
  },
  modalScrollContent: {
    gap: 14,
    paddingBottom: 16,
  },
  modalImageContainer: {
    height: 180,
    backgroundColor: '#faf8fd',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#eeeaf7',
    padding: 12,
  },
  modalProductImage: {
    width: '100%',
    height: '100%',
  },
  modalDiscountPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    color: '#19112c',
    lineHeight: 23,
  },
  modalMfr: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#706a80',
  },
  modalPriceBox: {
    backgroundColor: '#f9f8fc',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ece7f5',
  },
  modalPriceHeading: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#827d90',
  },
  modalPriceNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  modalSellingPrice: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: '#19112c',
  },
  modalMrp: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    color: '#999c9c',
    textDecorationLine: 'line-through',
  },
  savingsTag: {
    backgroundColor: '#eaf6ec',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  savingsTagText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11.5,
    color: '#2e7d32',
  },
  modalSpecsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalSpecItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fbfaff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee9f7',
  },
  modalSpecText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11.5,
    color: '#19112c',
  },
  modalDetailBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ece8f5',
    gap: 4,
  },
  modalDetailBoxTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#19112c',
  },
  modalDetailBoxText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    color: '#55525d',
  },
  modalDeliveryNote: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#706a80',
    marginTop: 4,
  },
  modalBottomAction: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0edf7',
  },
  modalAddCartBtn: {
    backgroundColor: '#6b52ae',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddCartBtnActive: {
    backgroundColor: '#2e7d32',
  },
  modalAddCartBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 15,
    color: '#ffffff',
  },
});
