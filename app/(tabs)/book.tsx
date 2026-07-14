import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, PetAvatar, Row, Screen, ShadowButton, Title } from '@/components/refugio-ui';
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

const dates = ['2026-07-10', '2026-07-14', '2026-07-22', '2026-07-24'];
const times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const bookedTimes = ['10:00', '14:00'];

export default function BookScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [petId, setPetId] = useState(pets[0].id);
  const [serviceType, setServiceType] = useState<AppointmentType>('vaccination');
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState('09:00');
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

  if (confirmed) {
    return (
      <Screen variant="green" style={styles.successScreen}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" color={palette.white} size={72} />
        </View>
        <Title light style={styles.successTitle}>
          Booking sent!
        </Title>
        <Text style={styles.successCopy}>
          Your appointment is saved as pending until clinic staff confirms it.
        </Text>
        <Card style={styles.successCard}>
          <Row label="Pet" value={selectedPet.name} icon="paw-outline" />
          <Row label="Service" value={selectedService.label} icon={selectedService.icon as keyof typeof Ionicons.glyphMap} />
          <Row label="Status" value={draftAppointment.status} icon="hourglass-outline" />
        </Card>
        <ShadowButton style={styles.successButton} onPress={() => router.replace('/(tabs)/visits' as never)}>
          View Appointments
        </ShadowButton>
      </Screen>
    );
  }

  return (
    <Screen variant="green" style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.back} onPress={() => (step === 1 ? router.back() : setStep((value) => value - 1))}>
          {step === 1 ? '×' : '←'}
        </Text>
        <Title style={styles.headerTitle}>Book Appointment</Title>
      </View>
      <Progress step={step} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepLabel}>STEP {step} OF 4</Text>
        {step === 1 ? (
          <>
            <Text style={styles.prompt}>Which pet is this for?</Text>
            {pets.map((pet) => (
              <Card key={pet.id} selected={pet.id === petId} style={styles.selectCard}>
                <PetAvatar pet={pet} />
                <View style={styles.selectText}>
                  <Text style={styles.selectTitle}>{pet.name}</Text>
                  <Text style={styles.selectSub}>
                    {pet.breed} · {pet.species}
                  </Text>
                </View>
                <Text onPress={() => setPetId(pet.id)} style={styles.selectHitbox}>
                  {pet.id === petId ? '✓' : '●'}
                </Text>
              </Card>
            ))}
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Text style={styles.prompt}>Select a service</Text>
            <View style={styles.serviceGrid}>
              {serviceOptions.map((service) => (
                <Card key={service.type} selected={service.type === serviceType} style={styles.serviceCard}>
                  <Ionicons name={service.icon as keyof typeof Ionicons.glyphMap} color={service.color} size={38} />
                  <Text style={styles.serviceLabel} onPress={() => setServiceType(service.type)}>
                    {service.label}
                  </Text>
                </Card>
              ))}
            </View>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Text style={styles.prompt}>Pick a date & time</Text>
            <Card style={styles.calendarCard}>
              <Text style={styles.month}>July 2026</Text>
              <View style={styles.dateGrid}>
                {dates.map((option) => (
                  <Text
                    key={option}
                    onPress={() => setDate(option)}
                    style={[styles.dateCell, date === option && styles.selectedDate]}>
                    {new Date(`${option}T00:00:00`).getDate()}
                  </Text>
                ))}
              </View>
            </Card>
            <Text style={styles.subhead}>Choose a time</Text>
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
            <Text style={styles.prompt}>Review your booking</Text>
            <Card style={styles.reviewCard}>
              <View style={styles.reviewPet}>
                <PetAvatar pet={selectedPet} size={60} />
                <View>
                  <Text style={styles.selectTitle}>{selectedPet.name}</Text>
                  <Text style={styles.selectSub}>
                    {selectedPet.breed} · {selectedPet.sex} · {getAge(selectedPet.birthdate)}
                  </Text>
                </View>
              </View>
              <Row label="Service" value={selectedService.label} icon={selectedService.icon as keyof typeof Ionicons.glyphMap} />
              <Row label="Date" value={formatDate(date)} icon="calendar-outline" />
              <Row label="Time" value={formatTime(time)} icon="time-outline" />
              <Row label="Vet" value={assignedVet?.name ?? 'Assigned by clinic'} icon="person-outline" />
            </Card>
            <Text style={styles.reasonLabel}>Reason (optional)</Text>
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

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginBottom: 34,
  },
  back: {
    color: palette.muted,
    fontSize: 42,
    lineHeight: 44,
  },
  headerTitle: {
    fontSize: 32,
  },
  progress: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginBottom: 34,
  },
  progressBar: {
    backgroundColor: '#BCEED8',
    borderRadius: 999,
    height: 8,
    width: 78,
  },
  progressActive: {
    backgroundColor: palette.white,
  },
  content: {
    paddingBottom: 120,
  },
  stepLabel: {
    color: palette.muted,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 18,
  },
  prompt: {
    color: palette.darkGreen,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 26,
  },
  selectCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    marginBottom: 18,
  },
  selectText: {
    flex: 1,
  },
  selectTitle: {
    color: palette.darkGreen,
    fontSize: 27,
    fontWeight: '900',
  },
  selectSub: {
    color: palette.muted,
    fontSize: 19,
    marginTop: 6,
    textTransform: 'capitalize',
  },
  selectHitbox: {
    color: palette.green,
    fontSize: 34,
    fontWeight: '900',
    minWidth: 44,
    textAlign: 'center',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  serviceCard: {
    alignItems: 'center',
    gap: 28,
    height: 150,
    justifyContent: 'center',
    width: '47%',
  },
  serviceLabel: {
    color: palette.darkGreen,
    fontSize: 19,
    fontWeight: '900',
  },
  calendarCard: {
    marginBottom: 24,
  },
  month: {
    color: palette.darkGreen,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 18,
    textAlign: 'center',
  },
  dateGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateCell: {
    borderRadius: 25,
    color: palette.darkGreen,
    fontSize: 22,
    fontWeight: '900',
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    width: 50,
  },
  selectedDate: {
    backgroundColor: palette.green,
    color: palette.white,
  },
  subhead: {
    color: palette.darkGreen,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCell: {
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: 24,
    borderWidth: 2,
    color: palette.darkGreen,
    fontSize: 18,
    fontWeight: '900',
    minHeight: 66,
    paddingTop: 18,
    textAlign: 'center',
    width: '30.5%',
  },
  selectedTime: {
    backgroundColor: palette.mint,
    color: palette.green,
  },
  bookedTime: {
    backgroundColor: '#E8F4EE',
    color: palette.muted,
    textDecorationLine: 'line-through',
  },
  reviewCard: {
    marginBottom: 22,
    paddingBottom: 0,
  },
  reviewPet: {
    alignItems: 'center',
    backgroundColor: palette.mint,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: -22,
    marginTop: -22,
    padding: 22,
  },
  reasonLabel: {
    color: palette.darkGreen,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 14,
  },
  reasonInput: {
    backgroundColor: '#E9F7F0',
    borderRadius: 28,
    color: palette.darkGreen,
    fontSize: 20,
    minHeight: 120,
    padding: 22,
    textAlignVertical: 'top',
  },
  nextButton: {
    bottom: 30,
    left: 18,
    position: 'absolute',
    right: 18,
  },
  successScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    alignItems: 'center',
    backgroundColor: '#0EAA66',
    borderRadius: 70,
    height: 140,
    justifyContent: 'center',
    marginBottom: 24,
    width: 140,
  },
  successTitle: {
    textAlign: 'center',
  },
  successCopy: {
    color: '#D7F8E9',
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
