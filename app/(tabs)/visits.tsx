import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, PetAvatar, Pill, Screen } from "@/components/refugio-ui";
import {
    AppointmentStatus,
    appointments,
    borderRadius,
    capitalize,
    findPet,
    findVet,
    formatShortDate,
    formatTime,
    getServiceLabel,
    palette,
    spacing,
    typography,
} from "@/constants/refugio";

export default function VisitsScreen() {
  const [mode, setMode] = useState<"upcoming" | "history">("upcoming");
  const visibleAppointments = appointments.filter((appointment) =>
    mode === "upcoming"
      ? appointment.status === "pending" || appointment.status === "confirmed"
      : appointment.status === "completed" ||
        appointment.status === "cancelled",
  );

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>Appointments</Text>
      <View style={styles.segment}>
        {(["upcoming", "history"] as const).map((value) => (
          <Text
            key={value}
            onPress={() => setMode(value)}
            style={[
              styles.segmentButton,
              mode === value && styles.segmentActive,
            ]}
          >
            {value === "upcoming" ? "Upcoming" : "History"}
          </Text>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {visibleAppointments.map((appointment) => {
          const pet = findPet(appointment.pet_id);
          const vet = findVet(appointment.veterinarian_id);

          if (!pet || !vet) return null;

          return (
            <Card key={appointment.id} style={styles.visitCard}>
              <View style={styles.visitTop}>
                <Pill tone={getStatusTone(appointment.status)}>
                  {capitalize(appointment.status)}
                </Pill>
                <Text style={styles.date}>
                  {formatShortDate(appointment.appointment_date)}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  color={palette.muted}
                  size={28}
                />
              </View>
              <View style={styles.visitBody}>
                <PetAvatar pet={pet} size={62} />
                <View style={styles.visitInfo}>
                  <Text style={styles.visitTitle}>
                    {getServiceLabel(appointment.type)}
                  </Text>
                  <Text style={styles.petName}>{pet.name}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Meta
                  icon="time-outline"
                  label={formatTime(appointment.appointment_time)}
                />
                <Meta icon="medkit-outline" label={vet.name} />
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

function Meta({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} color={palette.muted} size={20} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

function getStatusTone(status: AppointmentStatus) {
  if (status === "pending") return "yellow";
  if (status === "cancelled") return "red";
  if (status === "completed") return "neutral";
  return "green";
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.sm,
  },
  title: {
    color: palette.darkGreen,
    ...typography.headerLarge,
    marginBottom: spacing.lg,
  },
  segment: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  segmentButton: {
    borderColor: palette.line,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    color: palette.darkGreen,
    flex: 1,
    ...typography.titleMedium,
    overflow: "hidden",
    paddingVertical: spacing.sm,
    textAlign: "center",
  },
  segmentActive: {
    backgroundColor: palette.green,
    borderColor: palette.green,
    color: palette.white,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl + spacing.lg,
  },
  visitCard: {
    gap: spacing.md,
    width: Dimensions.get("window").width > 600 ? "48%" : "100%",
  },
  visitTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  date: {
    color: palette.muted,
    flex: 1,
    ...typography.bodyMedium,
    textAlign: "right",
  },
  visitBody: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  visitInfo: {
    flex: 1,
  },
  visitTitle: {
    color: palette.darkGreen,
    ...typography.headerSmall,
  },
  petName: {
    color: palette.muted,
    ...typography.bodyMedium,
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  meta: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  metaText: {
    color: palette.muted,
    ...typography.labelMedium,
  },
});
