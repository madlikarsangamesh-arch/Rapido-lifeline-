import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, typography } from "@rapidlifeline/ui-tokens";
import { formatIstDateTime } from "@rapidlifeline/shared";

export default function HomeScreen() {
  const router = useRouter();
  const [bookingForSomeoneElse, setBookingForSomeoneElse] = useState(false);
  const [pickup, setPickup] = useState("");
  const [pickupDraft, setPickupDraft] = useState(pickup);
  const [locationEditorVisible, setLocationEditorVisible] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const editPickup = () => {
    setPickupDraft(pickup);
    setLocationEditorVisible(true);
  };

  const savePickup = () => {
    const nextPickup = pickupDraft.trim();
    if (!nextPickup) {
      Alert.alert("Pickup required", "Enter a pickup location to continue.");
      return;
    }

    setPickup(nextPickup);
    setLocationEditorVisible(false);
  };

  const startBooking = () => {
    router.push({
      pathname: "/booking/ambulance",
      params: {
        pickup,
        bookingForSomeoneElse: String(bookingForSomeoneElse),
      },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandCross}>+</Text>
            </View>
            <View>
              <Text style={styles.brandName}>Rapid Lifeline</Text>
              <Text style={styles.brandLocation}>India Standard Time</Text>
            </View>
          </View>
        </View>

        <View style={styles.prototypeBadge}>
          <View style={styles.prototypeDot} />
          <Text style={styles.prototypeText}>Booking services unavailable</Text>
        </View>

        <Text style={styles.greeting}>{formatIstDateTime(now)}</Text>
        <Text style={styles.headline}>Plan an ambulance booking.</Text>
        <Text style={styles.intro}>
          Verified provider availability, maps, and booking services are not
          connected. No request can be submitted.
        </Text>

        <View style={styles.mapCard}>
          <View style={styles.locationCopy}>
            <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
            <Text style={styles.locationName}>{pickup || "Not set"}</Text>
            <Text style={styles.locationHint}>
              Address entry is not verified. Map and GPS services are not
              connected.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enter pickup address"
            onPress={editPickup}
            style={styles.editButton}
          >
            <Text style={styles.editText}>
              {pickup ? "Edit" : "Enter address"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleIcon}>
            <Text style={styles.toggleIconText}>♡</Text>
          </View>
          <View style={styles.toggleCopy}>
            <Text style={styles.toggleTitle}>Booking for someone else</Text>
            <Text style={styles.toggleDescription}>
              Select this if you are arranging transport for another person
            </Text>
          </View>
          <Switch
            accessibilityLabel="Booking for someone else"
            value={bookingForSomeoneElse}
            onValueChange={setBookingForSomeoneElse}
            trackColor={{ false: colors.ink[300], true: colors.primary[600] }}
            thumbColor={colors.surface[0]}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Book an ambulance"
          onPress={startBooking}
          style={({ pressed }) => [
            styles.bookButton,
            pressed && styles.bookButtonPressed,
          ]}
        >
          <View style={styles.bookIcon}>
            <Text style={styles.bookIconText}>+</Text>
          </View>
          <Text style={styles.bookButtonText}>Book an ambulance</Text>
          <Text style={styles.bookArrow}>›</Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          Rapid Lifeline is a private ambulance coordination platform, not a
          government emergency response service. It does not provide medical
          advice or replace public emergency services.
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={locationEditorVisible}
        onRequestClose={() => setLocationEditorVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.locationModal}>
            <Text style={styles.modalTitle}>Pickup location</Text>
            <Text style={styles.modalDescription}>
              Entered text is not map-verified and cannot be submitted as a
              booking.
            </Text>
            <TextInput
              accessibilityLabel="Pickup address"
              autoFocus
              onChangeText={setPickupDraft}
              onSubmitEditing={savePickup}
              placeholder="Street, area, city"
              returnKeyType="done"
              style={styles.locationInput}
              value={pickupDraft}
            />
            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setLocationEditorVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={savePickup}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save location</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.scale[16],
    paddingTop: spacing.scale[16],
    paddingBottom: spacing.scale[32],
  },
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  header: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.scale[16],
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.scale[8],
  },
  brandMark: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primary[600],
  },
  brandCross: {
    color: colors.surface[0],
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700",
  },
  brandName: {
    color: colors.ink[900],
    fontSize: typography.styles.heading.fontSize,
    lineHeight: typography.styles.heading.lineHeight,
    fontWeight: "700",
  },
  brandLocation: {
    color: colors.ink[600],
    fontSize: typography.styles.caption.fontSize,
    lineHeight: typography.styles.caption.lineHeight,
  },
  prototypeBadge: {
    alignSelf: "flex-start",
    minHeight: 28,
    paddingHorizontal: spacing.scale[12],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.scale[8],
    borderRadius: spacing.radius.chips,
    backgroundColor: colors.warning[50],
    marginBottom: spacing.scale[16],
  },
  prototypeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.warning[600],
  },
  prototypeText: {
    color: colors.warning[600],
    fontSize: typography.styles.caption.fontSize,
    fontWeight: "600",
  },
  greeting: {
    color: colors.primary[600],
    fontSize: typography.styles.body.fontSize,
    fontWeight: "700",
    marginBottom: spacing.scale[4],
  },
  headline: {
    color: colors.ink[900],
    fontSize: typography.styles.display.fontSize,
    lineHeight: typography.styles.display.lineHeight,
    fontWeight: "700",
  },
  intro: {
    color: colors.ink[600],
    fontSize: typography.styles.body.fontSize,
    lineHeight: typography.styles.body.lineHeight,
    marginTop: spacing.scale[8],
    marginBottom: spacing.scale[16],
  },
  mapCard: {
    minHeight: 128,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.scale[12],
    padding: spacing.scale[16],
    borderWidth: 1,
    borderColor: colors.ink[300],
    borderRadius: spacing.radius.cards,
    backgroundColor: colors.surface[0],
    marginBottom: spacing.scale[16],
  },
  locationCopy: {
    flex: 1,
  },
  locationLabel: {
    color: colors.ink[600],
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  locationName: {
    color: colors.ink[900],
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
  },
  locationHint: {
    color: colors.ink[600],
    fontSize: 11,
    lineHeight: 16,
  },
  editButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  editText: {
    color: colors.primary[600],
    fontSize: typography.styles.body.fontSize,
    fontWeight: "700",
  },
  bookButton: {
    height: spacing.layout.bookButtonHeight,
    paddingHorizontal: spacing.scale[16],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.scale[12],
    borderRadius: spacing.radius.buttons,
    backgroundColor: colors.primary[600],
    marginBottom: spacing.scale[12],
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonPressed: {
    backgroundColor: colors.primary[700],
  },
  bookIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  bookIconText: {
    color: colors.surface[0],
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "500",
  },
  bookButtonText: {
    flex: 1,
    color: colors.surface[0],
    fontSize: 20,
    fontWeight: "700",
  },
  bookArrow: {
    color: colors.surface[0],
    fontSize: 32,
    lineHeight: 36,
  },
  toggleCard: {
    minHeight: 76,
    paddingHorizontal: spacing.scale[12],
    paddingVertical: spacing.scale[8],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.scale[12],
    borderWidth: 1,
    borderColor: colors.ink[300],
    borderRadius: spacing.radius.cards,
    backgroundColor: colors.surface[0],
    marginBottom: spacing.scale[24],
  },
  toggleIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary[50],
  },
  toggleIconText: {
    color: colors.primary[600],
    fontSize: 24,
  },
  toggleCopy: {
    flex: 1,
  },
  toggleTitle: {
    color: colors.ink[900],
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
  },
  toggleDescription: {
    color: colors.ink[600],
    fontSize: typography.styles.caption.fontSize,
    lineHeight: typography.styles.caption.lineHeight,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(16, 24, 40, 0.45)",
  },
  locationModal: {
    padding: spacing.scale[24],
    borderTopLeftRadius: spacing.radius.bottomSheetTop,
    borderTopRightRadius: spacing.radius.bottomSheetTop,
    backgroundColor: colors.surface[0],
  },
  modalTitle: {
    color: colors.ink[900],
    fontSize: typography.styles.heading.fontSize,
    lineHeight: typography.styles.heading.lineHeight,
    fontWeight: "700",
  },
  modalDescription: {
    color: colors.ink[600],
    fontSize: typography.styles.body.fontSize,
    lineHeight: typography.styles.body.lineHeight,
    marginTop: spacing.scale[4],
  },
  locationInput: {
    minHeight: 52,
    paddingHorizontal: spacing.scale[12],
    borderWidth: 1,
    borderColor: colors.ink[300],
    borderRadius: spacing.radius.buttons,
    color: colors.ink[900],
    marginTop: spacing.scale[16],
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.scale[8],
    marginTop: spacing.scale[16],
  },
  cancelButton: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.scale[16],
  },
  cancelButtonText: {
    color: colors.ink[600],
    fontSize: typography.styles.body.fontSize,
    fontWeight: "700",
  },
  saveButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.scale[16],
    borderRadius: spacing.radius.buttons,
    backgroundColor: colors.primary[600],
  },
  saveButtonText: {
    color: colors.surface[0],
    fontSize: typography.styles.body.fontSize,
    fontWeight: "700",
  },
  disclaimer: {
    color: colors.ink[600],
    fontSize: typography.styles.caption.fontSize,
    lineHeight: typography.styles.caption.lineHeight,
    textAlign: "center",
    marginTop: spacing.scale[24],
  },
});
