
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, typography } from "@rapidlifeline/ui-tokens";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface[50]} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>+</Text>
          </View>
          <Text style={styles.brandName}>Rapid Lifeline</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>AMBULANCE COORDINATION</Text>
          <Text style={styles.title}>Help starts with the right connection.</Text>
          <Text style={styles.subtitle}>
            A simpler way to connect people seeking ambulance assistance
            with drivers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How would you like to continue?</Text>
          <Text style={styles.sectionSubtitle}>
            Choose your role to enter the application.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue as customer"
            onPress={() => router.push("/customer")}
            style={({ pressed }) => [
              styles.roleCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.customerIcon}>
              <Text style={styles.iconText}>+</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>I'm a Customer</Text>
              <Text style={styles.cardDescription}>
                Request ambulance assistance and view the booking experience.
              </Text>
              <Text style={styles.cardAction}>Continue as customer  →</Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue as driver"
            onPress={() => router.push("/driver")}
            style={({ pressed }) => [
              styles.roleCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.driverIcon}>
              <Text style={styles.driverIconText}>↗</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>I'm a Driver</Text>
              <Text style={styles.cardDescription}>
                Enter the driver application and view its current capabilities.
              </Text>
              <Text style={styles.cardAction}>Continue as driver  →</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Prototype preview</Text>
          <Text style={styles.noticeText}>
            Some services, including live booking, authentication, and GPS
            tracking, are not yet connected. This application is a private
            ambulance coordination prototype, not a government emergency
            response service.
          </Text>
        </View>

        <Text style={styles.footer}>RAPID LIFELINE · VERSION 1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.layout.screenSidePadding,
    paddingTop: 32,
    paddingBottom: 28,
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: colors.surface[0],
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 34,
  },
  brandName: {
    color: colors.ink[900],
    fontSize: 19,
    fontWeight: "700",
  },
  hero: {
    marginTop: 52,
    marginBottom: 34,
  },
  eyebrow: {
    color: colors.primary[600],
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  title: {
    color: colors.ink[900],
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.ink[600],
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    color: colors.ink[900],
    fontSize: 19,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: colors.ink[600],
    fontSize: 14,
    lineHeight: 21,
    marginTop: -7,
    marginBottom: 4,
  },
  roleCard: {
    backgroundColor: colors.surface[0],
    borderWidth: 1,
    borderColor: colors.ink[300],
    borderRadius: spacing.radius.cards,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  customerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: colors.primary[600],
    fontSize: 30,
    fontWeight: "600",
  },
  driverIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.info[600],
    alignItems: "center",
    justifyContent: "center",
  },
  driverIconText: {
    color: colors.surface[0],
    fontSize: 25,
    fontWeight: "700",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: colors.ink[900],
    fontSize: 17,
    fontWeight: "700",
  },
  cardDescription: {
    color: colors.ink[600],
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  cardAction: {
    color: colors.primary[600],
    fontSize: 14,
    fontWeight: "700",
    marginTop: 14,
  },
  notice: {
    backgroundColor: colors.warning[50],
    borderRadius: 12,
    padding: 16,
    marginTop: 28,
  },
  noticeTitle: {
    color: colors.warning[600],
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  noticeText: {
    color: colors.ink[600],
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    color: colors.ink[600],
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 30,
  },
});
