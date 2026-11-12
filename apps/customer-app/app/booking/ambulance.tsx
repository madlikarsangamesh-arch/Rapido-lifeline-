import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, spacing, typography } from "@rapidlifeline/ui-tokens";
import {
  ActionButton,
  BookingHeading,
  BookingScreen,
  bookingStyles,
  InfoCard,
} from "../../src/booking/components";
import {
  ambulanceCategories,
  getAmbulanceCategory,
} from "../../src/booking/categories";

export default function AmbulanceSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pickup = typeof params.pickup === "string" ? params.pickup : "";
  const bookingForSomeoneElse = params.bookingForSomeoneElse === "true";
  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    const category = getAmbulanceCategory(
      typeof params.categoryId === "string" ? params.categoryId : undefined,
    );
    return category?.id ?? "";
  });
  const selectedCategory = getAmbulanceCategory(selectedCategoryId);

  const continueToConfirmation = () => {
    if (!selectedCategory) return;
    router.push({
      pathname: "/booking/confirmation",
      params: {
        pickup,
        bookingForSomeoneElse: String(bookingForSomeoneElse),
        categoryId: selectedCategory.id,
      },
    });
  };

  return (
    <BookingScreen>
      <BookingHeading
        step="C2 · Ambulance selection"
        title="Choose an ambulance"
        subtitle="Choose a requested category. No provider availability or price data is connected."
      />
      {ambulanceCategories.map((category) => {
        const selected = category.id === selectedCategory?.id;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={category.id}
            onPress={() => setSelectedCategoryId(category.id)}
            style={[
              styles.categoryCard,
              selected && styles.categoryCardSelected,
            ]}
            testID={`category-${category.id}`}
          >
            <View style={styles.categoryCopy}>
              <Text style={bookingStyles.cardTitle}>{category.name}</Text>
            </View>
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected ? <View style={styles.radioDot} /> : null}
            </View>
          </Pressable>
        );
      })}

      <InfoCard>
        <Text style={bookingStyles.cardTitle}>Service availability</Text>
        <Text style={[bookingStyles.body, styles.helperText]}>
          Selecting a category does not confirm that an ambulance is available.
          Booking is unavailable until a verified provider service is connected.
        </Text>
      </InfoCard>

      <ActionButton
        label="Continue"
        onPress={continueToConfirmation}
        disabled={!selectedCategory}
        testID="ambulance-continue"
      />
    </BookingScreen>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    minHeight: 100,
    padding: spacing.scale[16],
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.ink[300],
    borderRadius: spacing.radius.cards,
    backgroundColor: colors.surface[0],
    marginBottom: spacing.scale[12],
  },
  categoryCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  categoryCopy: {
    flex: 1,
    paddingRight: spacing.scale[12],
  },
  radio: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.ink[300],
    borderRadius: 12,
  },
  radioSelected: {
    borderColor: colors.primary[600],
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[600],
  },
  helperText: {
    marginTop: spacing.scale[4],
  },
});
