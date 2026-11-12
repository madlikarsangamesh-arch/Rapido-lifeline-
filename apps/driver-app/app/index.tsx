import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@rapidlifeline/ui-tokens";
import { formatIstDateTime } from "@rapidlifeline/shared";

export default function DriverHomeScreen() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.status}>Driver services unavailable</Text>
        <Text style={styles.title}>Rapid Lifeline Driver</Text>
        <Text style={styles.subtitle}>{formatIstDateTime(now)} · IST</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>No driver session</Text>
          <Text style={styles.cardText}>
            Driver authentication and assigned-trip services are not connected.
            No driver is signed in and no trip is assigned.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location sharing is off</Text>
          <Text style={styles.cardText}>
            Device location permission has not been requested. No coordinates
            are being collected or shared. Location sharing requires an
            authenticated driver and an active assigned trip.
          </Text>
        </View>

        <Text style={styles.safetyNotice}>
          Do not interact with this app while driving. Any future driving safety
          or motion-lock behavior must be validated on real devices before use.
        </Text>
        <Text style={styles.disclaimer}>
          Rapid Lifeline is a private ambulance coordination platform, not a
          government emergency response service.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.scale[16],
  },
  container: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  status: {
    alignSelf: "flex-start",
    color: colors.warning[600],
    backgroundColor: colors.warning[50],
    paddingHorizontal: spacing.scale[12],
    paddingVertical: spacing.scale[8],
    borderRadius: spacing.radius.chips,
    fontSize: typography.styles.caption.fontSize,
    fontWeight: "700",
  },
  title: {
    color: colors.ink[900],
    fontSize: typography.styles.display.fontSize,
    lineHeight: typography.styles.display.lineHeight,
    fontWeight: "700",
    marginTop: spacing.scale[16],
  },
  subtitle: {
    color: colors.ink[600],
    fontSize: typography.styles.caption.fontSize,
    marginTop: spacing.scale[8],
    marginBottom: spacing.scale[16],
  },
  card: {
    padding: spacing.scale[16],
    borderWidth: 1,
    borderColor: colors.ink[300],
    borderRadius: spacing.radius.cards,
    backgroundColor: colors.surface[0],
    marginBottom: spacing.scale[12],
  },
  cardTitle: {
    color: colors.ink[900],
    fontSize: typography.styles.body.fontSize,
    fontWeight: "700",
  },
  cardText: {
    color: colors.ink[600],
    fontSize: typography.styles.body.fontSize,
    lineHeight: typography.styles.body.lineHeight,
    marginTop: spacing.scale[8],
  },
  safetyNotice: {
    color: colors.warning[600],
    fontSize: typography.styles.caption.fontSize,
    lineHeight: typography.styles.caption.lineHeight,
    marginTop: spacing.scale[8],
  },
  disclaimer: {
    color: colors.ink[600],
    fontSize: typography.styles.caption.fontSize,
    lineHeight: typography.styles.caption.lineHeight,
    marginTop: spacing.scale[12],
  },
});
