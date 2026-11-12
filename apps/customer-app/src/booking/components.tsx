import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@rapidlifeline/ui-tokens";

export function BookingScreen({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

export function PrototypeLabel() {
  return (
    <View style={styles.prototypeBadge}>
      <View style={styles.prototypeDot} />
      <Text style={styles.prototypeText}>
        Prototype · operational data unavailable
      </Text>
    </View>
  );
}

export function BookingHeading({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) {
  return (
    <>
      <PrototypeLabel />
      <Text style={styles.step}>{step}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </>
  );
}

export function InfoCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.infoCard}>{children}</View>;
}

export function ActionButton({
  label,
  onPress,
  disabled = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        disabled && styles.actionButtonDisabled,
        pressed && !disabled && styles.actionButtonPressed,
      ]}
      testID={testID}
    >
      <Text style={styles.actionButtonText}>{label}</Text>
    </Pressable>
  );
}

export function InlineButton({
  label,
  onPress,
  testID,
}: {
  label: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.inlineButton}
      testID={testID}
    >
      <Text style={styles.inlineButtonText}>{label}</Text>
    </Pressable>
  );
}

export const bookingStyles = StyleSheet.create({
  body: {
    color: colors.ink[600],
    fontSize: typography.styles.body.fontSize,
    lineHeight: typography.styles.body.lineHeight,
  },
  cardTitle: {
    color: colors.ink[900],
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
  },
  label: {
    color: colors.ink[600],
    fontSize: typography.styles.caption.fontSize,
    lineHeight: typography.styles.caption.lineHeight,
  },
  section: {
    marginTop: spacing.scale[16],
  },
});

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
  step: {
    color: colors.primary[600],
    fontSize: typography.styles.caption.fontSize,
    fontWeight: "700",
    marginBottom: spacing.scale[4],
  },
  title: {
    color: colors.ink[900],
    fontSize: typography.styles.display.fontSize,
    lineHeight: typography.styles.display.lineHeight,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.ink[600],
    fontSize: typography.styles.body.fontSize,
    lineHeight: typography.styles.body.lineHeight,
    marginTop: spacing.scale[8],
    marginBottom: spacing.scale[16],
  },
  infoCard: {
    padding: spacing.scale[16],
    borderWidth: 1,
    borderColor: colors.ink[300],
    borderRadius: spacing.radius.cards,
    backgroundColor: colors.surface[0],
    marginBottom: spacing.scale[12],
  },
  actionButton: {
    minHeight: spacing.layout.bookButtonHeight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.scale[16],
    borderRadius: spacing.radius.buttons,
    backgroundColor: colors.primary[600],
    marginTop: spacing.scale[16],
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonPressed: {
    backgroundColor: colors.primary[700],
  },
  actionButtonText: {
    color: colors.surface[0],
    fontSize: typography.styles.body.fontSize,
    fontWeight: "700",
  },
  inlineButton: {
    minHeight: 48,
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingHorizontal: spacing.scale[8],
  },
  inlineButtonText: {
    color: colors.primary[600],
    fontSize: typography.styles.body.fontSize,
    fontWeight: "700",
  },
});
