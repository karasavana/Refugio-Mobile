import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
    AuthBrand,
    BrandIcon,
    Screen,
    ShadowButton,
} from "@/components/refugio-ui";
import { palette } from "@/constants/refugio";

const onboardingSlides = [
  {
    icon: "notifications-outline",
    title: "Never Miss a Reminder",
    body: "Get nudged before a booster is due and keep your pet's care on track.",
  },
  {
    icon: "document-text-outline",
    title: "Track Records & Vaccinations",
    body: "See every checkup, prescription, and lab result for each pet in one secure place.",
  },
  {
    icon: "calendar-outline",
    title: "Book Visits in Seconds",
    body: "Pick a service, choose an open time slot, and send your request with no phone calls needed.",
  },
] as const;

export default function LandingScreen() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showLanding, setShowLanding] = useState(false);
  const slide = onboardingSlides[slideIndex];
  const isLastSlide = slideIndex === onboardingSlides.length - 1;

  function advance() {
    if (isLastSlide) {
      setShowLanding(true);
      return;
    }

    setSlideIndex((value) => value + 1);
  }

  if (!showLanding) {
    return (
      <Screen variant="green" style={styles.onboardingScreen}>
        <Text style={styles.skip} onPress={() => setShowLanding(true)}>
          Skip
        </Text>
        <View style={styles.slideContent}>
          <View style={styles.slideIcon}>
            <Ionicons name={slide.icon} color={palette.white} size={70} />
          </View>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideBody}>{slide.body}</Text>
        </View>
        <View style={styles.onboardingBottom}>
          <View style={styles.dots}>
            {onboardingSlides.map((item, index) => (
              <View
                key={item.title}
                style={[styles.dot, index === slideIndex && styles.activeDot]}
              />
            ))}
          </View>
          <ShadowButton style={styles.fullButton} onPress={advance}>
            {isLastSlide ? "Get Started" : "Next"}
          </ShadowButton>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.landingScreen}>
      <View style={styles.logoWrap}>
        <BrandIcon size={150} muted />
      </View>

      <View style={styles.copy}>
        <AuthBrand />
        <Text style={styles.headline}>
          Turn pet care into a <Text style={styles.green}>daily habit.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Keep your pet healthy with easy booking, complete records, and timely
          reminders.
        </Text>
      </View>

      <View style={styles.actions}>
        <Link href="/login" asChild>
          <ShadowButton>Sign In</ShadowButton>
        </Link>
        <Link href="/signup" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Create Account</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  onboardingScreen: {
    paddingHorizontal: 28,
    paddingTop: 84,
  },
  skip: {
    alignSelf: "flex-end",
    color: palette.white,
    fontSize: 13,
    fontWeight: "600",
  },
  slideContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginTop: 40,
  },
  slideIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 46,
    height: 176,
    justifyContent: "center",
    marginBottom: 54,
    width: 176,
  },
  slideTitle: {
    color: palette.darkGreen,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 16,
    textAlign: "center",
  },
  slideBody: {
    color: palette.white,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 350,
    textAlign: "center",
  },
  onboardingBottom: {
    gap: 58,
    paddingBottom: 48,
  },
  dots: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 999,
    height: 14,
    width: 14,
  },
  activeDot: {
    backgroundColor: palette.white,
    width: 56,
  },
  fullButton: {
    alignSelf: "stretch",
    backgroundColor: palette.green,
  },
  landingScreen: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logoWrap: {
    marginBottom: 54,
    opacity: 0.92,
  },
  copy: {
    alignItems: "center",
    gap: 22,
  },
  headline: {
    color: palette.darkGreen,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    textAlign: "center",
  },
  green: {
    color: palette.green,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  actions: {
    alignSelf: "stretch",
    gap: 18,
    marginTop: 56,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: palette.line,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 64,
  },
  secondaryText: {
    color: palette.green,
    fontSize: 13,
    fontWeight: "600",
  },
});
