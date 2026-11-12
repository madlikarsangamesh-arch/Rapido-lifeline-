import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, spacing, typography } from "@rapidlifeline/ui-tokens";
import {
  ActionButton,
  BookingHeading,
  BookingScreen,
  bookingStyles,
  InfoCard,
  InlineButton,
} from "../../src/booking/components";
import { getAmbulanceCategory } from "../../src/booking/categories";

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pickup = typeof params.pickup === "string" ? params.pickup : "";
  const category = getAmbulanceCategory(
    typeof params.categoryId === "string" ? params.categoryId : undefined,
  );
  const bookingForSomeoneElse = params.bookingForSomeoneElse === "true";

  const changeHospital = () => {
    router.push({
      pathname: "/booking/hospitals",
      params: {
        pickup,
        bookingForSomeoneElse: String(bookingForSomeoneElse),
        categoryId: category?.id ?? "",
      },
    });
  };

  return (
    <BookingScreen>
      <BookingHeading
        step="C4 · Confirmation"
        title="Review your booking"
        subtitle="Booking cannot be confirmed until verified provider services are connected."
      />

      <InfoCard>
        <Text style={bookingStyles.label}>PICKUP</Text>
        <Text style={[bookingStyles.cardTitle, styles.value]}>
          {pickup || "Not entered"}
        </Text>
        <Text style={[bookingStyles.body, styles.note]}>
          Address is not map-verified.
        </Text>
      </InfoCard>

      <InfoCard>
        <View style={styles.row}>
          <View style={styles.valueCopy}>
            <Text style={bookingStyles.label}>DESTINATION HOSPITAL</Text>
            <Text style={[bookingStyles.cardTitle, styles.value]}>
              No verified destination selected
            </Text>
            <Text style={[bookingStyles.body, styles.note]}>
              Hospital directory is not connected.
            </Text>
          </View>
          <InlineButton
            label="Change hospital"
            onPress={changeHospital}
            testID="change-hospital"
          />
        </View>
      </InfoCard>

      <InfoCard>
        <Text style={bookingStyles.label}>AMBULANCE CATEGORY</Text>
        <Text style={[bookingStyles.cardTitle, styles.value]}>
          {category?.name ?? "Not selected"}
        </Text>
      </InfoCard>

      <InfoCard>
        <Text style={bookingStyles.label}>FARE</Text>
        <Text style={[bookingStyles.cardTitle, styles.value]}>
          No verified fare available
        </Text>
      </InfoCard>

      <InfoCard>
        <Text style={bookingStyles.label}>BOOKING FOR</Text>
        <Text style={[bookingStyles.cardTitle, styles.value]}>
          {bookingForSomeoneElse ? "Someone else" : "Myself"}
        </Text>
        <Text style={[bookingStyles.body, styles.note]}>
          No patient details have been entered.
        </Text>
      </InfoCard>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          No booking will be submitted. Provider availability, destination
          selection, fare calculation, and booking services are not connected.
        </Text>
      </View>

      <ActionButton
        label="Booking unavailable"
        onPress={() => undefined}
        disabled
        testID="confirm-booking"
      />
    </BookingScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.scale[8],
  },
  valueCopy: {
    flex: 1,
  },
  value: {
    marginTop: spacing.scale[4],
  },
  note: {
    marginTop: spacing.scale[4],
  },
  disclaimer: {
    padding: spacing.scale[12],
    borderRadius: spacing.radius.buttons,
    backgroundColor: colors.warning[50],
    marginTop: spacing.scale[8],
  },
  disclaimerText: {
    color: colors.warning[600],
    fontSize: typography.styles.caption.fontSize,
    lineHeight: typography.styles.caption.lineHeight,
    fontWeight: "600",
  },
});
