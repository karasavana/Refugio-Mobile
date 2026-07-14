import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, PetAvatar, Pill, Row, Screen } from '@/components/refugio-ui';
import {
  currentUser,
  findLabResult,
  findLabTest,
  findMedicine,
  findVet,
  formatDate,
  getAge,
  getPetLabRequests,
  getPetPrescriptions,
  getPrescriptionItems,
  labResults,
  medicalRecords,
  palette,
  pets,
  vaccinations,
} from '@/constants/refugio';

type PetTab = 'overview' | 'medical' | 'vaccinations' | 'prescriptions' | 'labs';

export default function PetProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const pet = pets.find((candidate) => candidate.id === Number(params.id)) ?? pets[0];
  const [activeTab, setActiveTab] = useState<PetTab>('overview');
  const petMedicalRecords = medicalRecords.filter((record) => record.pet_id === pet.id);
  const petVaccinations = vaccinations.filter((vaccination) => vaccination.pet_id === pet.id);
  const petPrescriptions = getPetPrescriptions(pet.id);
  const petLabRequests = getPetLabRequests(pet.id);

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.hero}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" color={palette.green} size={32} />
        </Pressable>
        <PetAvatar pet={pet} size={126} />
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petSub}>
          {pet.breed ?? pet.species} - {getAge(pet.birthdate)} - {pet.sex}
        </Text>
        <View style={styles.heroPill}>
          <Pill>{capitalize(pet.status)}</Pill>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {[
            ['overview', 'Overview'],
            ['medical', 'Medical'],
            ['vaccinations', 'Vaccines'],
            ['prescriptions', 'Rx'],
            ['labs', 'Lab'],
          ].map(([value, label]) => (
            <Text key={value} onPress={() => setActiveTab(value as PetTab)} style={[styles.tab, activeTab === value && styles.activeTab]}>
              {label}
            </Text>
          ))}
        </ScrollView>

        {activeTab === 'overview' ? (
          <>
            <Card style={styles.tableCard}>
              <Row label="Species" value={pet.species} />
              <Row label="Breed" value={pet.breed ?? 'Not set'} />
              <Row label="Sex" value={pet.sex} />
              <Row label="Birthday" value={pet.birthdate ? formatDate(pet.birthdate) : 'Not set'} />
              <Row label="Weight" value={pet.weight ? `${pet.weight} kg` : 'Not set'} />
              <Row label="Color" value={pet.color ?? 'Not set'} />
              <Row label="Owner" value={currentUser.name} />
            </Card>

            <Pressable onPress={() => router.push('/(tabs)/book')}>
              <Card style={styles.dueCard}>
                <Ionicons name="eyedrop-outline" color={palette.yellow} size={34} />
                <View style={styles.recordText}>
                  <Text style={styles.dueTitle}>Deworming due soon</Text>
                  <Text style={styles.recordMeta}>Due July 20, 2026 - Dr. R. Villanueva</Text>
                  <Text style={styles.bookNow}>Book now</Text>
                </View>
              </Card>
            </Pressable>

            <Card style={styles.vaccineSummary}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Vaccinations</Text>
                <Text style={styles.seeAll} onPress={() => setActiveTab('vaccinations')}>
                  See all
                </Text>
              </View>
              {petVaccinations.slice(0, 2).map((vaccination) => (
                <View key={vaccination.id} style={styles.summaryRow}>
                  <View>
                    <Text style={styles.summaryItem}>{vaccination.vaccine_name}</Text>
                    <Text style={styles.recordMeta}>Given: {formatDate(vaccination.date_administered)}</Text>
                  </View>
                  <Pill>Up to Date</Pill>
                </View>
              ))}
            </Card>

            {petLabRequests.slice(0, 1).map((request) => {
              const test = findLabTest(request.lab_test_id);
              const result = findLabResult(request.id);

              return (
                <RecordCard
                  key={request.id}
                  icon="flask-outline"
                  iconColor={palette.green}
                  title={test?.name ?? 'Lab Test'}
                  meta={result?.date_released ? formatDate(result.date_released) : `Status: ${request.status}`}
                  badge={capitalize(request.status)}
                  action="View"
                />
              );
            })}
          </>
        ) : null}

        {activeTab === 'medical'
          ? petMedicalRecords.map((record) => (
              <RecordCard
                key={record.id}
                icon="document-text-outline"
                iconColor={palette.blue}
                title={record.diagnosis}
                meta={`${formatDate(record.visit_date)} - ${findVet(record.veterinarian_id)?.name ?? 'Veterinarian'}`}
                body={record.treatment_notes ?? 'No extra treatment notes.'}
              />
            ))
          : null}

        {activeTab === 'vaccinations'
          ? petVaccinations.map((vaccination) => (
              <RecordCard
                key={vaccination.id}
                icon="eyedrop-outline"
                iconColor={palette.green}
                title={vaccination.vaccine_name}
                meta={`Given ${formatDate(vaccination.date_administered)}`}
                body={vaccination.next_due_date ? `Next due: ${formatDate(vaccination.next_due_date)}` : 'No next due date recorded.'}
                badge="Up to Date"
              />
            ))
          : null}

        {activeTab === 'prescriptions'
          ? petPrescriptions.map((prescription) => {
              const items = getPrescriptionItems(prescription.id);
              const firstItem = items[0];
              const medicine = firstItem ? findMedicine(firstItem.medicine_id) : undefined;

              return (
                <RecordCard
                  key={prescription.id}
                  icon="medical-outline"
                  iconColor={palette.red}
                  title={medicine?.name ?? 'Prescription'}
                  meta={firstItem ? `${firstItem.dosage} - Qty ${firstItem.quantity}` : formatDate(prescription.date_prescribed)}
                  body={firstItem?.instructions ?? prescription.notes ?? 'No extra instructions.'}
                />
              );
            })
          : null}

        {activeTab === 'labs'
          ? petLabRequests.map((request) => {
              const test = findLabTest(request.lab_test_id);
              const result = labResults.find((candidate) => candidate.lab_request_id === request.id);

              return (
                <RecordCard
                  key={request.id}
                  icon="flask-outline"
                  iconColor={palette.green}
                  title={test?.name ?? 'Lab Test'}
                  meta={result?.date_released ? `Released ${formatDate(result.date_released)}` : `Status: ${request.status}`}
                  body={result?.result_details ?? 'Result is not released yet.'}
                  badge={capitalize(request.status)}
                />
              );
            })
          : null}
      </ScrollView>
    </Screen>
  );
}

function RecordCard({
  icon,
  iconColor,
  title,
  meta,
  body,
  badge,
  action,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  meta: string;
  body?: string;
  badge?: string;
  action?: string;
}) {
  return (
    <Card style={styles.recordCard}>
      <View style={[styles.recordIcon, { backgroundColor: `${iconColor}22` }]}>
        <Ionicons name={icon} color={iconColor} size={32} />
      </View>
      <View style={styles.recordText}>
        <View style={styles.recordTop}>
          <Text style={styles.recordTitle}>{title}</Text>
          {badge ? <Pill tone={badge === 'Completed' ? 'neutral' : 'green'}>{badge}</Pill> : null}
        </View>
        <Text style={styles.recordMeta}>{meta}</Text>
        {body ? <Text style={styles.recordBody}>{body}</Text> : null}
        {action ? <Text style={styles.bookNow}>{action}</Text> : null}
      </View>
    </Card>
  );
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: palette.green,
    paddingBottom: 34,
    paddingTop: 72,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    left: 24,
    position: 'absolute',
    top: 58,
    width: 56,
  },
  petName: {
    color: palette.white,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 18,
  },
  petSub: {
    color: '#D8FAEA',
    fontSize: 18,
    marginTop: 8,
    textTransform: 'capitalize',
  },
  heroPill: {
    marginTop: 22,
  },
  content: {
    gap: 22,
    paddingBottom: 36,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  tabs: {
    gap: 12,
  },
  tab: {
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: 24,
    borderWidth: 1.5,
    color: palette.muted,
    fontSize: 18,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: palette.green,
    borderColor: palette.green,
    color: palette.white,
  },
  tableCard: {
    paddingBottom: 0,
  },
  dueCard: {
    alignItems: 'center',
    backgroundColor: palette.yellowPale,
    borderColor: palette.yellow,
    borderRadius: 28,
    flexDirection: 'row',
    gap: 16,
  },
  dueTitle: {
    color: palette.darkGreen,
    fontSize: 19,
    fontWeight: '900',
  },
  bookNow: {
    color: palette.blue,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 5,
  },
  vaccineSummary: {
    gap: 14,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    color: palette.darkGreen,
    fontSize: 22,
    fontWeight: '900',
  },
  seeAll: {
    color: palette.blue,
    fontSize: 16,
    fontWeight: '900',
  },
  summaryRow: {
    alignItems: 'center',
    borderTopColor: palette.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  summaryItem: {
    color: palette.darkGreen,
    fontSize: 18,
    fontWeight: '900',
  },
  recordCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  recordIcon: {
    alignItems: 'center',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  recordText: {
    flex: 1,
    gap: 5,
  },
  recordTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  recordTitle: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 19,
    fontWeight: '900',
  },
  recordMeta: {
    color: palette.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  recordBody: {
    color: palette.darkGreen,
    fontSize: 16,
    lineHeight: 23,
  },
});
