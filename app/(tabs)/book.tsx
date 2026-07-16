import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";

import { Card, PetAvatar, Screen, ShadowButton } from "@/components/refugio-ui";
import {
    AppointmentType,
    borderRadius,
    formatTime,
    getStepTitle,
    palette,
    pets,
    serviceOptions,
    shadow,
    spacing,
    typography
} from "@/constants/refugio";

// Generate available time slots (in production, this would come from API based on vet/clinic availability)
const times = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
// Mock booked times for selected date (in production, this would come from API)
const bookedTimes = ["09:00", "10:30"];

export default function BookScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [petId, setPetId] = useState(pets[0].id);
  const [serviceType, setServiceType] =
    useState<AppointmentType>("vaccination");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  function goBack() {
    if (step === 1) {
      router.back();
      return;
    }

    setStep((value) => value - 1);
  }

  function changeMonth(delta: number) {
    setCurrentMonth((current) => {
      const next = new Date(
        current.getFullYear(),
        current.getMonth() + delta,
        1,
      );
      return next;
    });
  }

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const monthStartDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();
  const monthDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarCells = Array.from(
    { length: monthStartDay + monthDays },
    (_, index) => {
      if (index < monthStartDay) return null;
      const day = index - monthStartDay + 1;
      const iso = `${currentMonth.getFullYear()}-${String(
        currentMonth.getMonth() + 1,
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dateObj = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      // Disable all past dates - only today and future dates are selectable
      const selectable = dateObj >= today;
      return { day, iso, selectable };
    },
  );
  return (
    <Screen style={styles.screen}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        {step < 4 ? (
          <Pressable
            onPress={goBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="chevron-back" color={palette.darkGreen} size={28} />
          </Pressable>
        ) : null}
        <View>
          <Text style={styles.step}>
            Step {step} of 4 · {getStepTitle(step)}
          </Text>
        </View>
      </Animated.View>

      <Progress step={step} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setPetId(pet.id)}
                style={({ pressed }) => [
                  styles.selectPressable,
                  pressed && styles.pressed,
                ]}
                accessibilityLabel={`Select ${pet.name}, ${pet.breed ?? pet.species}`}
                accessibilityRole="button"
                accessibilityState={{ selected: pet.id === petId }}
              >
                <Card selected={pet.id === petId} style={styles.selectCard}>
                  <PetAvatar pet={pet} size={88} />
                  <View style={styles.selectText}>
                    <Text style={styles.selectTitle}>{pet.name}</Text>
                    <Text style={styles.selectSub}>
                      {pet.breed ?? pet.species}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      pet.id === petId && styles.radioActive,
                    ]}
                  >
                    {pet.id === petId ? (
                      <Ionicons
                        name="checkmark"
                        color={palette.white}
                        size={20}
                      />
                    ) : null}
                  </View>
                </Card>
              </Pressable>
            ))}
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInDown.delay(120).duration(400)}>
            <View style={styles.serviceGrid}>
              {serviceOptions.map((service) => (
                <Pressable
                  key={service.type}
                  onPress={() => setServiceType(service.type)}
                  style={({ pressed }) => [
                    styles.servicePressable,
                    pressed && styles.pressed,
                  ]}
                  accessibilityLabel={`Select ${service.label}`}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: service.type === serviceType,
                  }}
                >
                  <Card
                    selected={service.type === serviceType}
                    style={styles.serviceCard}
                  >
                    <View
                      style={[
                        styles.serviceIcon,
                        service.type === serviceType
                          ? styles.serviceIconActive
                          : styles.serviceIconInactive,
                      ]}
                    >
                      <Ionicons
                        name={service.icon as keyof typeof Ionicons.glyphMap}
                        color={
                          service.type === serviceType
                            ? palette.white
                            : palette.green
                        }
                        size={28}
                      />
                    </View>
                    <Text
                      style={[
                        styles.serviceLabel,
                        service.type === serviceType &&
                          styles.serviceActiveText,
                      ]}
                    >
                      {service.label}
                    </Text>
                  </Card>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInDown.delay(120).duration(400)}>
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <Pressable
                  onPress={() => changeMonth(-1)}
                  style={styles.calendarNav}
                  accessibilityLabel="Previous month"
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="chevron-back"
                    color={palette.darkGreen}
                    size={20}
                  />
                </Pressable>
                <Text style={styles.calendarTitle}>{monthLabel}</Text>
                <Pressable
                  onPress={() => changeMonth(1)}
                  style={styles.calendarNav}
                  accessibilityLabel="Next month"
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="chevron-forward"
                    color={palette.darkGreen}
                    size={20}
                  />
                </Pressable>
              </View>

              <View style={styles.weekdaysRow}>
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <Text key={day} style={styles.weekdayLabel}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {calendarCells.map((cell, index) => {
                  if (!cell) {
                    return <View key={index} style={styles.calendarBlank} />;
                  }

                  const selected = date === cell.iso;
                  const disabled = !cell.selectable;

                  return (
                    <Pressable
                      key={cell.iso}
                      onPress={() => !disabled && setDate(cell.iso)}
                      style={[
                        styles.calendarDate,
                        selected && styles.calendarDateActive,
                        disabled && styles.calendarDateDisabled,
                      ]}
                      disabled={disabled}
                      accessibilityLabel={`Select ${cell.iso}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected, disabled }}
                    >
                      <Text
                        style={[
                          styles.calendarDateText,
                          selected && styles.calendarDateTextActive,
                          disabled && styles.calendarDateTextDisabled,
                        ]}
                      >
                        {cell.day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Available Time</Text>
              <View style={styles.timeGrid}>
                {times.map((option) => {
                  const isBooked = bookedTimes.includes(option);
                  const selected = time === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => !isBooked && setTime(option)}
                      style={[
                        styles.timeCell,
                        selected && styles.selectedTime,
                        isBooked && styles.bookedTime,
                      ]}
                      accessibilityLabel={`${formatTime(option)}${isBooked ? ", booked" : ""}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected, disabled: isBooked }}
                      disabled={isBooked}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          selected && styles.timeTextActive,
                          isBooked && styles.timeTextDisabled,
                        ]}
                      >
                        {formatTime(option)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        )}

        {step === 4 && (
          <Animated.View
            entering={FadeInDown.delay(120).duration(400)}
            style={styles.successScreen}
          >
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" color={palette.white} size={40} />
            </View>
            <Text style={styles.successTitle}>Appointment Requested!</Text>
            <Text style={styles.successCopy}>
              We&apos;ll notify you once the clinic confirms your visit.
            </Text>
            <ShadowButton
              style={styles.successButton}
              onPress={() => router.replace("/(tabs)/visits")}
            >
              View My Appointments
            </ShadowButton>
            <Pressable
              onPress={() => router.replace("/(tabs)/home")}
              accessibilityRole="button"
              style={styles.backHomeLink}
            >
              <Text style={styles.backHomeText}>Back to Home</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      {step < 4 ? (
        <Animated.View entering={FadeInUp.duration(300)} style={styles.footer}>
          <ShadowButton
            style={styles.nextButton}
            onPress={() => setStep((value) => Math.min(4, value + 1))}
            disabled={step === 3 && (!date || !time)}
            accessibilityLabel={step === 3 ? "Continue to review" : "Next step"}
            accessibilityRole="button"
          >
            Continue
          </ShadowButton>
        </Animated.View>
      ) : null}
    </Screen>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <View style={styles.progress}>
      {[1, 2, 3, 4].map((value) => (
        <View
          key={value}
          style={[styles.progressBar, value <= step && styles.progressActive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.md,
    paddingTop: 62,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
    ...shadow.sm,
  },
  step: {
    color: palette.muted,
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
  },
  title: {
    color: palette.darkGreen,
    ...typography.headerMedium,
  },
  progress: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  progressBar: {
    backgroundColor: palette.gray200,
    borderRadius: borderRadius.full,
    flex: 1,
    height: 8,
  },
  progressActive: {
    backgroundColor: palette.green,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 170,
  },
  selectPressable: {
    borderRadius: borderRadius.lg,
  },
  selectCard: {
    alignItems: "center",
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 110,
    padding: spacing.md,
  },
  selectText: {
    flex: 1,
  },
  selectTitle: {
    color: palette.darkGreen,
    ...typography.titleMedium,
  },
  selectSub: {
    color: palette.muted,
    ...typography.bodyMedium,
    marginTop: spacing.xs,
    textTransform: "capitalize",
  },
  radio: {
    borderColor: palette.line,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    height: 42,
    width: 42,
  },
  radioActive: {
    alignItems: "center",
    backgroundColor: palette.green,
    borderColor: palette.green,
    justifyContent: "center",
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  servicePressable: {
    width: Dimensions.get("window").width > 600 ? "23%" : "48%",
  },
  serviceCard: {
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    minHeight: 132,
    justifyContent: "center",
    padding: spacing.md,
    ...shadow.sm,
  },
  serviceIcon: {
    alignItems: "center",
    borderRadius: borderRadius.md,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  serviceIconActive: {
    backgroundColor: palette.green,
  },
  serviceIconInactive: {
    backgroundColor: palette.mint,
  },
  serviceLabel: {
    color: palette.darkGreen,
    ...typography.titleSmall,
  },
  serviceActiveText: {
    color: palette.green,
    fontWeight: "700",
  },
  sectionBlock: {
    gap: spacing.sm,
  },
  sectionHeading: {
    color: palette.darkGreen,
    ...typography.headerSmall,
  },
  dateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  dateChip: {
    alignItems: "center",
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minWidth: 84,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadow.sm,
  },
  dateChipActive: {
    backgroundColor: palette.green,
    borderColor: palette.green,
  },
  dateChipLabel: {
    color: palette.muted,
    ...typography.labelSmall,
  },
  dateChipLabelActive: {
    color: palette.white,
  },
  dateChipValue: {
    color: palette.darkGreen,
    ...typography.headerSmall,
    fontWeight: "700",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  timeCell: {
    alignItems: "center",
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minWidth: "30%",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...shadow.sm,
  },
  selectedTime: {
    borderColor: palette.green,
    backgroundColor: palette.mintStrong,
  },
  bookedTime: {
    borderColor: palette.gray200,
    backgroundColor: palette.gray100,
  },
  timeText: {
    color: palette.darkGreen,
    ...typography.bodyMedium,
    fontWeight: "600",
  },
  timeTextActive: {
    color: palette.green,
  },
  timeTextDisabled: {
    color: palette.gray400,
    textDecorationLine: "line-through",
  },
  timeHint: {
    color: palette.muted,
    ...typography.labelSmall,
    marginTop: spacing.xs,
  },
  calendarCard: {
    backgroundColor: palette.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadow.sm,
  },
  calendarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  calendarNav: {
    alignItems: "center",
    backgroundColor: palette.gray100,
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  calendarTitle: {
    color: palette.darkGreen,
    ...typography.titleMedium,
    fontWeight: "700",
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  weekdayLabel: {
    color: palette.muted,
    ...typography.labelSmall,
    width: "14.28%",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  calendarBlank: {
    width: "14.28%",
    height: 42,
  },
  calendarDate: {
    alignItems: "center",
    borderRadius: borderRadius.md,
    height: 42,
    justifyContent: "center",
    width: "14.28%",
  },
  calendarDateActive: {
    backgroundColor: palette.green,
  },
  calendarDateDisabled: {
    backgroundColor: palette.gray100,
  },
  calendarDateText: {
    color: palette.darkGreen,
    ...typography.bodyMedium,
    fontWeight: "600",
  },
  calendarDateTextActive: {
    color: palette.white,
  },
  calendarDateTextDisabled: {
    color: palette.gray400,
  },
  backHomeLink: {
    marginTop: spacing.sm,
  },
  backHomeText: {
    color: palette.green,
    ...typography.titleMedium,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: {
    left: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  nextButton: {
    width: "100%",
  },
  successScreen: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  successIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: borderRadius.full,
    height: 120,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 120,
  },
  successTitle: {
    color: palette.white,
    ...typography.headerMedium,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  successCopy: {
    color: palette.white,
    ...typography.bodyLarge,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  successButton: {
    width: "100%",
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});
