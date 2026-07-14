import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, PetAvatar, Pill, Screen } from '@/components/refugio-ui';
import {
  AppointmentStatus,
  appointments,
  findPet,
  findVet,
  formatShortDate,
  formatTime,
  getServiceLabel,
  palette,
} from '@/constants/refugio';

export default function VisitsScreen() {
  const [mode, setMode] = useState<'upcoming' | 'history'>('upcoming');
  const visibleAppointments = appointments.filter((appointment) =>
    mode === 'upcoming'
      ? appointment.status === 'pending' || appointment.status === 'confirmed'
      : appointment.status === 'completed' || appointment.status === 'cancelled',
  );

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>Appointments</Text>
      <View style={styles.segment}>
        {(['upcoming', 'history'] as const).map((value) => (
          <Text key={value} onPress={() => setMode(value)} style={[styles.segmentButton, mode === value && styles.segmentActive]}>
            {value === 'upcoming' ? 'Upcoming' : 'History'}
          </Text>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {visibleAppointments.map((appointment) => {
          const pet = findPet(appointment.pet_id);
          const vet = findVet(appointment.veterinarian_id);

          if (!pet || !vet) return null;

          return (
            <Card key={appointment.id} style={styles.visitCard}>
              <View style={styles.visitTop}>
                <Pill tone={getStatusTone(appointment.status)}>{capitalize(appointment.status)}</Pill>
                <Text style={styles.date}>{formatShortDate(appointment.appointment_date)}</Text>
                <Ionicons name="chevron-forward" color={palette.muted} size={28} />
              </View>
              <View style={styles.visitBody}>
                <PetAvatar pet={pet} size={62} />
                <View style={styles.visitInfo}>
                  <Text style={styles.visitTitle}>{getServiceLabel(appointment.type)}</Text>
                  <Text style={styles.petName}>{pet.name}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Meta icon="time-outline" label={formatTime(appointment.appointment_time)} />
                <Meta icon="medkit-outline" label={vet.name} />
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

function Meta({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} color={palette.muted} size={20} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

function getStatusTone(status: AppointmentStatus) {
  if (status === 'pending') return 'yellow';
  if (status === 'cancelled') return 'red';
  if (status === 'completed') return 'neutral';
  return 'green';
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  title: {
    color: palette.darkGreen,
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 26,
  },
  segment: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  segmentButton: {
    borderColor: palette.line,
    borderRadius: 28,
    borderWidth: 1.5,
    color: palette.darkGreen,
    flex: 1,
    fontSize: 19,
    fontWeight: '900',
    overflow: 'hidden',
    paddingVertical: 15,
    textAlign: 'center',
  },
  segmentActive: {
    backgroundColor: palette.green,
    borderColor: palette.green,
    color: palette.white,
  },
  list: {
    gap: 18,
    paddingBottom: 116,
  },
  visitCard: {
    gap: 18,
  },
  visitTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  date: {
    color: palette.muted,
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
  },
  visitBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  visitInfo: {
    flex: 1,
  },
  visitTitle: {
    color: palette.darkGreen,
    fontSize: 23,
    fontWeight: '900',
  },
  petName: {
    color: palette.muted,
    fontSize: 17,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  metaText: {
    color: palette.muted,
    fontSize: 16,
    fontWeight: '800',
  },
});
