import React from "react";
import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, typography } from "@rapidlifeline/ui-tokens";
import {
  ActionButton,
  BookingHeading,
  BookingScreen,
  bookingStyles,
  InfoCard,
} from "../../src/booking/components";

export default function BookingStatusScreen() {
  const router = useRouter();

  return (
    <BookingScreen>
      <BookingHeading
        step="C5 · Booking status"
        title="Booking unavailable"
        subtitle="No booking was created and no provider has been contacted."
      />
      <InfoCard>
        <Text style={bookingStyles.cardTitle}>No active booking</Text>
        <Text style={[bookingStyles.body, styles.message]}>
          Booking, dispatch, and hospital integrations are not connected. No
          driver assignment, vehicle location, or arrival estimate is available.
        </Text>
      </InfoCard>
      <Text style={styles.disclosure}>
        Rapid Lifeline is a private ambulance coordination platform. This app
        does not provide medical advice or dispatch emergency services.
      </Text>
      <ActionButton
        label="Return home"
        onPress={() => router.replace("/")}
        testID="return-home"
      />
    </BookingScreen>
  );
}

const styles = StyleSheet.create({
  message: {
    marginTop: spacing.scale[8],
  },
  disclosure: {
    color: colors.ink[600],
    fontSize: typography.styles.caption.fontSize,
    lineHeight: typography.styles.caption.lineHeight,
    marginTop: spacing.scale[8],
  },
});
