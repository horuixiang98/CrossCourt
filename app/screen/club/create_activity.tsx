import {
  Coordinate,
  getCoordinates,
  whereAmI,
} from "@/src/services/locationService";
import { supabase } from "@/src/utils/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
  PencilLine,
  Users,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CreateActivityScreen() {
  const router = useRouter();
  const { clubId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<MapView>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(
    new Date(new Date().setHours(20, 0, 0, 0))
  );
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(22, 0, 0, 0))
  );

  // Picker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Focus states for visual feedback
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Temp states for iOS modal pickers
  const [tempDate, setTempDate] = useState(new Date());

  // Location State
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(
    null
  );
  const [locationSuggestions, setLocationSuggestions] = useState<Coordinate[]>(
    []
  );
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 3.139,
    longitude: 101.6869,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Details State
  const [courtCount, setCourtCount] = useState("1");
  const [maxPlayers, setMaxPlayers] = useState("6");
  const [priceMale, setPriceMale] = useState("");
  const [priceFemale, setPriceFemale] = useState("");
  const [samePrice, setSamePrice] = useState(false);

  // Initialize Map
  useEffect(() => {
    (async () => {
      const loc = await whereAmI();
      if (loc) {
        setMapRegion({
          ...mapRegion,
          latitude: loc.latitude,
          longitude: loc.longitude,
        });
      }
    })();
  }, []);

  // Price Sync
  useEffect(() => {
    if (samePrice) setPriceFemale(priceMale);
  }, [priceMale, samePrice]);

  // Player Recommendation
  useEffect(() => {
    const courts = parseInt(courtCount);
    if (!isNaN(courts) && courts > 0) {
      setMaxPlayers((courts * 6).toString());
    }
  }, [courtCount]);

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (locationQuery.length > 2 && !selectedLocation) {
        setIsSearchingLocation(true);
        const results = await getCoordinates(locationQuery);
        setLocationSuggestions(results);
        setShowLocationDropdown(true);
        setIsSearchingLocation(false);
      } else {
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [locationQuery, selectedLocation]);

  const handleSelectLocation = (loc: Coordinate) => {
    setSelectedLocation(loc);
    setLocationQuery(loc.name);
    setShowLocationDropdown(false);
    const newRegion = {
      latitude: loc.latitude,
      longitude: loc.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setMapRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 800);
  };

  const handleCreate = async () => {
    if (!title || !selectedLocation || !priceMale) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const activityData = {
        club_id: clubId,
        name: title,
        start_time: startTime.toTimeString().split(" ")[0],
        end_time: endTime.toTimeString().split(" ")[0],
        date: date.toISOString().split("T")[0],
        location:
          selectedLocation.name +
          (selectedLocation.city ? `, ${selectedLocation.city}` : ""),
        location_lat: selectedLocation.latitude,
        location_lon: selectedLocation.longitude,
        region:
          selectedLocation.city ||
          selectedLocation.region ||
          selectedLocation.country,
        place_name: selectedLocation.name,
        address: [selectedLocation.street, selectedLocation.postalcode]
          .filter(Boolean)
          .join(", "),
        fee_per_male: parseFloat(priceMale),
        fee_per_female: samePrice
          ? parseFloat(priceMale)
          : parseFloat(priceFemale),
        court_count: parseInt(courtCount),
        max_players: parseInt(maxPlayers),
      };

      const { error } = await supabase
        .from("club_activity")
        .insert(activityData);
      if (error) throw error;

      Alert.alert("Success", "Game created!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Picker Handlers
  const renderPickerModal = (
    visible: boolean,
    setVisible: (v: boolean) => void,
    mode: "date" | "time",
    currentVal: Date,
    onConfirm: (d: Date) => void
  ) => {
    if (Platform.OS !== "ios") return null;
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalLabel}>
                Select {mode === "date" ? "Date" : "Time"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  onConfirm(tempDate);
                  setVisible(false);
                }}
              >
                <Text style={styles.modalDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode={mode}
              display="spinner"
              textColor="#fff"
              onChange={(_, d) => d && setTempDate(d)}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Host a game</Text>
          <TouchableOpacity
            style={[
              styles.topBtn,
              (!title || !selectedLocation || !priceMale) && { opacity: 0.5 },
            ]}
            onPress={handleCreate}
            disabled={!title || !selectedLocation || !priceMale}
          >
            <Text style={styles.topBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* Prominent Title Section with Field Highlight */}
          <View style={styles.titleSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.titleInput}
                placeholder="e.g. Wednesday Girls Night"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={title}
                onChangeText={setTitle}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
                multiline
              />
              <View
                style={[
                  styles.titleAccent,
                  focusedField === "title" && {
                    width: 80,
                    backgroundColor: "#10b981",
                  },
                ]}
              />
            </View>
          </View>

          {/* Full Width Non-Scrollable Map */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              region={mapRegion}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
              scrollEnabled={false}
              zoomEnabled={true}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {selectedLocation && (
                <Marker
                  key={`${selectedLocation.gid}-${selectedLocation.latitude}`}
                  coordinate={{
                    latitude: Number(selectedLocation.latitude),
                    longitude: Number(selectedLocation.longitude),
                  }}
                  title={selectedLocation.name}
                  pinColor="red"
                />
              )}
            </MapView>

            <View style={styles.searchOverlay}>
              <View
                style={[
                  styles.searchBox,
                  focusedField === "location" && styles.searchBoxFocused,
                ]}
              >
                <MapPin
                  size={18}
                  color={selectedLocation ? "#10b981" : "#64748b"}
                />
                <TextInput
                  style={styles.searchTextInput}
                  placeholder="Where is the venue?"
                  placeholderTextColor="#94a3b8"
                  value={locationQuery}
                  onFocus={() => setFocusedField("location")}
                  onBlur={() => setFocusedField(null)}
                  onChangeText={(text) => {
                    setLocationQuery(text);
                    if (selectedLocation && text !== selectedLocation.name)
                      setSelectedLocation(null);
                  }}
                />
                {isSearchingLocation && (
                  <ActivityIndicator size="small" color="#10b981" />
                )}
              </View>

              {showLocationDropdown && locationSuggestions.length > 0 && (
                <View style={styles.resultsOverlay}>
                  {locationSuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resItem}
                      onPress={() => handleSelectLocation(item)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.resName}>{item.name}</Text>
                        <Text style={styles.resAddr}>
                          {item.city || item.region}
                        </Text>
                      </View>
                      {item.distance !== undefined && (
                        <Text style={styles.resDist}>
                          {item.distance.toFixed(1)} km
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.formContainer}>
            {/* Schedule Section - Enhanced Underline Design */}
            <Label
              text="SCHEDULE & TIME"
              icon={<Clock size={14} color="#64748b" />}
            />

            <TouchableOpacity
              style={styles.fieldRow}
              onPress={() => {
                setTempDate(date);
                setShowDatePicker(true);
              }}
            >
              <View style={styles.fieldMain}>
                <Calendar size={18} color="#10b981" />
                <Text style={styles.fieldValue}>
                  {date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                <ChevronRight size={18} color="#3f3f46" />
              </View>
            </TouchableOpacity>

            <View style={styles.multiFieldRow}>
              <TouchableOpacity
                style={[styles.fieldRow, { flex: 1, marginBottom: 0 }]}
                onPress={() => {
                  setTempDate(startTime);
                  setShowStartTimePicker(true);
                }}
              >
                <View style={[styles.fieldMain, { marginBottom: 0 }]}>
                  <Clock size={16} color="#10b981" />
                  <Text style={styles.fieldValueSmall}>
                    {startTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.fieldSeparator}>to</Text>

              <TouchableOpacity
                style={[styles.fieldRow, { flex: 1, marginBottom: 0 }]}
                onPress={() => {
                  setTempDate(endTime);
                  setShowEndTimePicker(true);
                }}
              >
                <View style={[styles.fieldMain, { marginBottom: 0 }]}>
                  <Clock size={16} color="#10b981" />
                  <Text style={styles.fieldValueSmall}>
                    {endTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Divider />

            {/* Pricing Section with Input Affordance */}
            <View style={styles.sectionTitleRow}>
              <Label
                text="PRICING (RM)"
                icon={<DollarSign size={14} color="#64748b" />}
              />
              <View style={styles.samePriceToggle}>
                <Text style={styles.toggleText}>Equal fee</Text>
                <Switch
                  value={samePrice}
                  onValueChange={setSamePrice}
                  trackColor={{ false: "#1e293b", true: "#059669" }}
                  thumbColor="#fff"
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
              </View>
            </View>

            <View style={styles.multiFieldRow}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.boxLabel}>Male</Text>
                <View style={styles.boxInputRow}>
                  <TextInput
                    style={styles.boxValue}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255,255,255,0.1)"
                    keyboardType="numeric"
                    value={priceMale}
                    onChangeText={setPriceMale}
                  />
                  <PencilLine size={12} color="#10b981" />
                </View>
                <View style={styles.fieldUnderline} />
              </View>

              {!samePrice && (
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.boxLabel}>Female</Text>
                  <View style={styles.boxInputRow}>
                    <TextInput
                      style={styles.boxValue}
                      placeholder="0.00"
                      placeholderTextColor="rgba(255,255,255,0.1)"
                      keyboardType="numeric"
                      value={priceFemale}
                      onChangeText={setPriceFemale}
                    />
                    <PencilLine size={12} color="#10b981" />
                  </View>
                  <View style={styles.fieldUnderline} />
                </View>
              )}
            </View>

            <Divider />

            {/* Courts & Players */}
            <Label
              text="VENUE RESOURCE"
              icon={<Users size={14} color="#64748b" />}
            />
            <View style={styles.multiFieldRow}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.boxLabel}>Number of Courts</Text>
                <View style={styles.boxInputRow}>
                  <TextInput
                    style={styles.boxValueLarge}
                    placeholder="1"
                    placeholderTextColor="rgba(255,255,255,0.1)"
                    keyboardType="numeric"
                    value={courtCount}
                    onChangeText={setCourtCount}
                  />
                </View>
                <View style={styles.fieldUnderline} />
                <Text style={styles.hintText}>Standard: 6pax/court</Text>
              </View>

              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.boxLabel}>Player Capacity</Text>
                <View style={styles.boxInputRow}>
                  <TextInput
                    style={styles.boxValueLarge}
                    placeholder="6"
                    placeholderTextColor="rgba(255,255,255,0.1)"
                    keyboardType="numeric"
                    value={maxPlayers}
                    onChangeText={setMaxPlayers}
                  />
                </View>
                <View style={styles.fieldUnderline} />
                <Text style={styles.hintText}>Auto-calculated</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Android Pickers */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) setDate(d);
          }}
        />
      )}
      {Platform.OS === "android" &&
        (showStartTimePicker || showEndTimePicker) && (
          <DateTimePicker
            value={showStartTimePicker ? startTime : endTime}
            mode="time"
            display="default"
            onChange={(e, d) => {
              setShowStartTimePicker(false);
              setShowEndTimePicker(false);
              if (d) {
                if (showStartTimePicker) setStartTime(d);
                else setEndTime(d);
              }
            }}
          />
        )}

      {/* iOS Modal Pickers */}
      {renderPickerModal(
        showDatePicker,
        setShowDatePicker,
        "date",
        date,
        setDate
      )}
      {renderPickerModal(
        showStartTimePicker,
        setShowStartTimePicker,
        "time",
        startTime,
        setStartTime
      )}
      {renderPickerModal(
        showEndTimePicker,
        setShowEndTimePicker,
        "time",
        endTime,
        setEndTime
      )}
    </View>
  );
}

const Label = ({ text, icon }: { text: string; icon: any }) => (
  <View style={styles.labelWrapper}>
    {icon}
    <Text style={styles.labelTag}>{text}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#121212" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#525252" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e1e1e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080808" },
  headerSafe: { backgroundColor: "#080808" },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#fff", opacity: 0.9 },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  topBtn: {
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#10b981",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  topBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  titleSection: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  inputWrapper: { width: "100%" },
  titleInput: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    padding: 0,
    minHeight: 48,
    letterSpacing: -0.5,
  },
  titleAccent: {
    width: 32,
    height: 4,
    backgroundColor: "#10b981",
    marginTop: 8,
    borderRadius: 2,
  },

  mapContainer: { width: "100%", height: 320, backgroundColor: "#111" },
  map: { flex: 1 },
  searchOverlay: { position: "absolute", top: 20, left: 20, right: 20 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 18, 0.98)",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  searchBoxFocused: { borderColor: "#10b981" },
  searchTextInput: { flex: 1, color: "#fff", marginLeft: 12, fontSize: 15 },
  resultsOverlay: {
    backgroundColor: "rgba(18, 18, 18, 0.98)",
    marginTop: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    maxHeight: 200,
    overflow: "hidden",
  },
  resItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    gap: 12,
  },
  resName: { color: "#fff", fontWeight: "600", fontSize: 14 },
  resAddr: { color: "#71717a", fontSize: 12, marginTop: 4 },
  resDist: { color: "#10b981", fontSize: 12, fontWeight: "700" },

  formContainer: { padding: 24 },
  labelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  labelTag: {
    color: "#525252",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 32,
  },

  fieldRow: { marginBottom: 20 },
  fieldMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  fieldValue: { color: "#fff", fontSize: 20, fontWeight: "700" },
  fieldValueSmall: { color: "#fff", fontSize: 18, fontWeight: "700" },
  fieldUnderline: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    width: "100%",
    borderRadius: 1,
  },
  fieldSeparator: {
    color: "#3f3f46",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 16,
  },
  multiFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },

  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  samePriceToggle: { flexDirection: "row", alignItems: "center", gap: 8 },
  toggleText: { color: "#404040", fontSize: 12, fontWeight: "600" },

  inputBox: { gap: 4 },
  boxLabel: {
    color: "#525252",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  boxInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  boxValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    padding: 0,
    flex: 1,
  },
  boxValueLarge: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    padding: 0,
    flex: 1,
  },
  hintText: { color: "#262626", fontSize: 10, fontWeight: "600", marginTop: 4 },
  curr: { color: "#10b981", fontWeight: "800", fontSize: 14, marginRight: 8 },

  recommendationText: {
    color: "#52525b",
    fontSize: 13,
    marginTop: 12,
    fontStyle: "italic",
  },

  // iOS Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  modalCancel: { color: "#71717a", fontSize: 16 },
  modalDone: { color: "#10b981", fontSize: 16, fontWeight: "700" },
  modalLabel: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
