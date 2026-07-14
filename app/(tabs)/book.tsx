import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, PetAvatar, Row, Screen, ShadowButton } from '@/components/refugio-ui';
import {
  AppointmentType,
  findVet,
  formatDate,
  formatTime,
  getAge,
  palette,
  pets,
  serviceOptions,
} from '@/constants/refugio';

const availableDates = ['2026-07-01', '2026-07-14', '2026-07-22', '2026-07-24'];
const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const bookedTimes = ['09:00', '10:30'];

export default function BookScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [petId, setPetId] = useState(pets[0].id);
  const [serviceType, setServiceType] = useState<AppointmentType>('vaccination');
  const [date, setDate] = useState('2026-07-14');
  const [time, setTime] = useState('08:00');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === petId) ?? pets[0], [petId]);
  const selectedService = serviceOptions.find((service) => service.type === serviceType) ?? serviceOptions[0];
  const assignedVet = findVet(serviceType === 'grooming' ? 3 : 2);

  const draftAppointment = {
    pet_id: selectedPet.id,
    owner_id: selectedPet.owner_id,
    veterinarian_id: assignedVet?.id ?? 2,
    staff_id: null,
    appointment_date: date,
    appointment_time: time,
    type: serviceType,
    reason: reason.trim() || null,
    status: 'pending' as const,
    notes: null,
  };

  function goBack() {
    if (confirmed) {
      setConfirmed(false);
      return;
    }

    if (step === 1) {
      router.back();
      return;
    }

    setStep((value) => value - 1);
  }

  if (confirmed) {
    return (
      <Screen variant="green" style={styles.successScreen}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" color={palette.white} size={72} />
        </View>
        <Text style={styles.successTitle}>Booking sent!</Text>
        <Text style={styles.successCopy}>Your appointment is pending until clinic staff confirms it.</Text>
        <Card style={styles.successCard}>
          <Row label="Pet" value={selectedPet.name} icon="paw-outline" />
          <Row label="Service" value={selectedService.label} icon={selectedService.icon as keyof typeof Ionicons.glyphMap} />
          <Row label="Date" value={formatDate(draftAppointment.appointment_date)} icon="calendar-outline" />
          <Row label="Status" value={draftAppointment.status} icon="hourglass-outline" />
        </Card>
        <ShadowButton style={styles.successButton} onPress={() => router.replace('/(tabs)/visits')}>
          View Appointments
        </ShadowButton>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" color={palette.darkGreen} size={34} />
        </Pressable>
        <View>
          <Text style={styles.step}>Step {step} of 4</Text>
          <Text style={styles.title}>{getStepTitle(step)}</Text>
        </View>
      </View>
      <Progress step={step} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <>
            {pets.map((pet) => (
              <Pressable key={pet.id} onPress={() => setPetId(pet.id)}>
                <Card selected={pet.id === petId} style={styles.selectCard}>
                  <PetAvatar pet={pet} size={92} />
                  <View style={styles.selectText}>
                    <Text style={styles.selectTitle}>{pet.name}</Text>
                    <Text style={styles.selectSub}>{pet.breed ?? pet.species}</Text>
                  </View>
                  <View style={[styles.radio, pet.id === petId && styles.radioActive]}>
                    {pet.id === petId ? <Ionicons name="checkmark" color={palette.white} size={28} /> : null}
                  </View>
                </Card>
              </Pressable>
            ))}
          </>
        ) : null}

        {step === 2 ? (
          <View style={styles.serviceGrid}>
            {serviceOptions.map((service) => (
              <Pressable key={service.type} style={styles.servicePressable} onPress={() => setServiceType(service.type)}>
                <Card selected={service.type === serviceType} style={styles.serviceCard}>
                  <View style={[styles.serviceIcon, { backgroundColor: service.type === serviceType ? palette.green : palette.mint }]}>
                    <Ionicons
                      name={service.icon as keyof typeof Ionicons.glyphMap}
                      color={service.type === serviceType ? palette.white : palette.muted}
                      size={35}
                    />
                  </View>
                  <Text style={[styles.serviceLabel, service.type === serviceType && styles.serviceActiveText]}>{service.label}</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        ) : null}

        {step === 3 ? (
          <>
            <Card style={styles.calendarCard}>
              <View style={styles.monthRow}>
                <IconButton name="chevron-back" />
                <Text style={styles.month}>July 2026</Text>
                <IconButton name="chevron-forward" />
              </View>
              <View style={styles.weekRow}>
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                  <Text key={day} style={styles.weekday}>
                    {day}
                  </Text>
                ))}
              </View>
              <View style={styles.dateGrid}>
                {Array.from({ length: 31 }, (_, index) => {
                  const day = index + 1;
                  const isoDate = `2026-07-${String(day).padStart(2, '0')}`;
                  const canSelect = availableDates.includes(isoDate);
                  return (
                    <Text
                      key={isoDate}
                      onPress={() => canSelect && setDate(isoDate)}
                      style={[styles.dateCell, date === isoDate && styles.selectedDate, !canSelect && styles.disabledDate]}>
                      {day}
                    </Text>
                  );
                })}
              </View>
            </Card>

            <Text style={styles.subhead}>Available Times</Text>
            <View style={styles.timeGrid}>
              {times.map((option) => {
                const isBooked = bookedTimes.includes(option);
                return (
                  <Text
                    key={option}
                    onPress={() => !isBooked && setTime(option)}
                    style={[styles.timeCell, time === option && styles.selectedTime, isBooked && styles.bookedTime]}>
                    {formatTime(option)}
                    {isBooked ? '\nBooked' : ''}
                  </Text>
                );
              })}
            </View>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <Card style={styles.reviewCard}>
              <View style={styles.reviewPet}>
                <PetAvatar pet={selectedPet} size={74} />
                <View>
                  <Text style={styles.selectTitle}>{selectedPet.name}</Text>
                  <Text style={styles.selectSub}>
                    {selectedPet.breed ?? selectedPet.species} - {selectedPet.sex} - {getAge(selectedPet.birthdate)}
                  </Text>
                </View>
              </View>
              <Row label="Service" value={selectedService.label} icon={selectedService.icon as keyof typeof Ionicons.glyphMap} />
              <Row label="Date" value={formatDate(date)} icon="calendar-outline" />
              <Row label="Time" value={formatTime(time)} icon="time-outline" />
              <Row label="Vet" value={assignedVet?.name ?? 'Assigned by clinic'} icon="person-outline" />
            </Card>
            <Text style={styles.reasonLabel}>Reason</Text>
            <TextInput
              multiline
              onChangeText={setReason}
              placeholder="e.g. Annual rabies booster for my dog"
              placeholderTextColor={palette.muted}
              style={styles.reasonInput}
              value={reason}
            />
          </>
        ) : null}
      </ScrollView>

      <ShadowButton style={styles.nextButton} onPress={() => (step === 4 ? setConfirmed(true) : setStep((value) => value + 1))}>
        {step === 4 ? 'Confirm Booking' : 'Next'}
      </ShadowButton>
    </Screen>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <View style={styles.progress}>
      {[1, 2, 3, 4].map((value) => (
        <View key={value} style={[styles.progressBar, value <= step && styles.progressActive]} />
      ))}
    </View>
  );
}

function IconButton({ name }: { name: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.calendarButton}>
      <Ionicons name={name} color={palette.darkGreen} size={28} />
    </View>
  );
}

function getStepTitle(step: number) {
  if (step === 1) return 'Which pet?';
  if (step === 2) return 'What service?';
  if (step === 3) return 'Pick a date & time';
  return 'Review booking';
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 62,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
    marginBottom: 34,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: 28,
    borderWidth: 1.5,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  step: {
    color: palette.muted,
    fontSize: 18,
    fontWeight: '800',
  },
  title: {
    color: palette.darkGreen,
    fontSize: 33,
    fontWeight: '900',
    lineHeight: 39,
  },
  progress: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 34,
    paddingHorizontal: 28,
  },
  progressBar: {
    backgroundColor: '#E3F3ED',
    borderRadius: 999,
    flex: 1,
    height: 9,
  },
  progressActive: {
    backgroundColor: palette.green,
  },
  content: {
    gap: 18,
    paddingBottom: 120,
  },
  selectCard: {
    alignItems: 'center',
    borderRadius: 38,
    flexDirection: 'row',
    gap: 22,
    minHeight: 142,
  },
  selectText: {
    flex: 1,
  },
  selectTitle: {
    color: palette.darkGreen,
    fontSize: 29,
    fontWeight: '900',
  },
  selectSub: {
    color: palette.muted,
    fontSize: 20,
    marginTop: 7,
    textTransform: 'capitalize',
  },
  radio: {
    borderColor: palette.line,
    borderRadius: 24,
    borderWidth: 3,
    height: 48,
    width: 48,
  },
  radioActive: {
    alignItems: 'center',
    backgroundColor: palette.green,
    borderColor: palette.green,
    justifyContent: 'center',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  servicePressable: {
    width: '47.4%',
  },
  serviceCard: {
    borderRadius: 34,
    gap: 34,
    height: 166,
    justifyContent: 'center',
  },
  serviceIcon: {
    alignItems: 'center',
    borderRadius: 28,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  serviceLabel: {
    color: palette.darkGreen,
    fontSize: 20,
    fontWeight: '900',
  },
  serviceActiveText: {
    color: palette.green,
  },
  calendarCard: {
    borderRadius: 36,
    padding: 22,
  },
  monthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  calendarButton: {
    alignItems: 'center',
    backgroundColor: palette.mint,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  month: {
    color: palette.darkGreen,
    fontSize: 24,
    fontWeight: '900',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    color: palette.muted,
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  dateCell: {
    borderRadius: 24,
    color: palette.darkGreen,
    fontSize: 20,
    fontWeight: '900',
    height: 48,
    lineHeight: 48,
    marginBottom: 10,
    textAlign: 'center',
    width: `${100 / 7}%`,
  },
  selectedDate: {
    backgroundColor: palette.green,
    color: palette.white,
  },
  disabledDate: {
    opacity: 0.45,
  },
  subhead: {
    color: palette.darkGreen,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 18,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCell: {
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: 22,
    borderWidth: 1.5,
    color: palette.darkGreen,
    fontSize: 17,
    fontWeight: '900',
    minHeight: 58,
    paddingTop: 17,
    textAlign: 'center',
    width: '22.7%',
  },
  selectedTime: {
    backgroundColor: palette.mintStrong,
    borderColor: palette.green,
    color: palette.greenDark,
  },
  bookedTime: {
    backgroundColor: '#E8F4EE',
    color: palette.muted,
    textDecorationLine: 'line-through',
  },
  reviewCard: {
    paddingBottom: 0,
  },
  reviewPet: {
    alignItems: 'center',
    backgroundColor: palette.mint,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: -20,
    marginTop: -20,
    padding: 20,
  },
  reasonLabel: {
    color: palette.darkGreen,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },
  reasonInput: {
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: 28,
    borderWidth: 1.5,
    color: palette.darkGreen,
    fontSize: 18,
    minHeight: 120,
    padding: 20,
    textAlignVertical: 'top',
  },
  nextButton: {
    bottom: 30,
    left: 20,
    position: 'absolute',
    right: 20,
  },
  successScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    alignItems: 'center',
    backgroundColor: palette.greenDark,
    borderRadius: 70,
    height: 140,
    justifyContent: 'center',
    marginBottom: 24,
    width: 140,
  },
  successTitle: {
    color: palette.white,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
  },
  successCopy: {
    color: palette.mint,
    fontSize: 18,
    lineHeight: 26,
    marginVertical: 14,
    textAlign: 'center',
  },
  successCard: {
    alignSelf: 'stretch',
    marginVertical: 18,
    paddingBottom: 0,
  },
  successButton: {
    alignSelf: 'stretch',
  },
});
