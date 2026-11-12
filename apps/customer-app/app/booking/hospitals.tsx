import React from "react";
import { StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { spacing } from "@rapidlifeline/ui-tokens";
import {
  ActionButton,
  BookingHeading,
  BookingScreen,
  bookingStyles,
  InfoCard,
} from "../../src/booking/components";

export default function HospitalChoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const returnToConfirmation = () => {
    router.replace({
      pathname: "/booking/confirmation",
      params: {
        pickup: typeof params.pickup === "string" ? params.pickup : "",
        bookingForSomeoneElse:
          params.bookingForSomeoneElse === "true" ? "true" : "false",
        categoryId:
          typeof params.categoryId === "string" ? params.categoryId : "",
      },
    });
  };

  return (
    <BookingScreen>
      <BookingHeading
        step="C3 · Hospital choice"
        title="Choose a destination"
        subtitle="A verified hospital directory is not connected."
      />
      <InfoCard>
        <Text style={bookingStyles.cardTitle}>No verified destinations</Text>
        <Text style={[bookingStyles.body, styles.message]}>
          Hospital names, services, and availability are not available. No
          destination has been selected or contacted.
        </Text>
      </InfoCard>

      <ActionButton
        label="Back to confirmation"
        onPress={returnToConfirmation}
        testID="hospital-continue"
      />
    </BookingScreen>
  );
}

const styles = StyleSheet.create({
  message: {
    marginTop: spacing.scale[8],
  },
});
