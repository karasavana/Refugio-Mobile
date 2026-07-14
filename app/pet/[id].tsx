import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, PetAvatar, Pill, Row, Screen, Title } from '@/components/refugio-ui';
import {
  currentUser,
  findVet,
  formatDate,
  getAge,
  labResults,
  medicalRecords,
  palette,
  pets,
  prescriptions,
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
  const petPrescriptions = prescriptions.filter((prescription) => prescription.pet_id === pet.id);
  const petLabResults = labResults.filter((result) => result.pet_id === pet.id);

  return (
    <Screen variant="green" style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text onPress={() => router.back()} style={styles.back}>
          ←
        </Text>
        <PetAvatar pet={pet} size={62} />
        <View style={styles.headerText}>
          <Title light style={styles.petName}>
            {pet.name}
          </Title>
          <Text style={styles.petSub}>
            {pet.breed} · {getAge(pet.birthdate)} · {pet.sex}
          </Text>
        </View>
        <Pill>{pet.status}</Pill>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          <StatCard icon="eyedrop-outline" count={petVaccinations.length} label="Vaccines" color={palette.green} />
          <StatCard icon="calendar-outline" count={petMedicalRecords.length + 4} label="Visits" color={palette.blue} />
          <StatCard icon="flask-outline" count={petLabResults.length} label="Lab Tests" color={palette.yellow} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {[
            ['overview', 'Overview'],
            ['medical', 'Medical'],
            ['vaccinations', 'Vaccinations'],
            ['prescriptions', 'Prescriptions'],
            ['labs', 'Lab Results'],
          ].map(([value, label]) => (
            <Text
              key={value}
              onPress={() => setActiveTab(value as PetTab)}
              style={[styles.tab, activeTab === value && styles.activeTab]}>
              {label}
            </Text>
          ))}
        </ScrollView>

        {activeTab === 'overview' ? (
          <Card style={styles.tableCard}>
            <Row label="Species" value={pet.species} />
            <Row label="Breed" value={pet.breed} />
            <Row label="Sex" value={pet.sex} />
            <Row label="Birthdate" value={formatDate(pet.birthdate)} />
            <Row label="Weight" value={`${pet.weight} kg`} />
            <Row label="Color" value={pet.color} />
            <Row label="Owner" value={currentUser.name} />
          </Card>
        ) : null}

        {activeTab === 'medical'
          ? petMedicalRecords.map((record) => (
              <RecordCard
                key={record.id}
                icon="document-text-outline"
                title={record.diagnosis}
                meta={`${formatDate(record.visit_date)} · ${findVet(record.veterinarian_id)?.name ?? 'Veterinarian'}`}
                body={record.treatment_notes ?? 'No extra treatment notes.'}
              />
            ))
          : null}

        {activeTab === 'vaccinations'
          ? petVaccinations.map((vaccination) => (
              <RecordCard
                key={vaccination.id}
                icon="eyedrop-outline"
                title={vaccination.vaccine_name}
                meta={`Given ${formatDate(vaccination.date_administered)}`}
                body={vaccination.next_due_date ? `Next due: ${formatDate(vaccination.next_due_date)}` : 'No next due date recorded.'}
              />
            ))
          : null}

        {activeTab === 'prescriptions'
          ? petPrescriptions.map((prescription) => (
              <RecordCard
                key={prescription.id}
                icon="medical-outline"
                title={prescription.medicine}
                meta={`${prescription.dosage} · Qty ${prescription.quantity}`}
                body={prescription.instructions}
              />
            ))
          : null}

        {activeTab === 'labs'
          ? petLabResults.map((result) => (
              <RecordCard
                key={result.id}
                icon="flask-outline"
                title={result.test_name}
                meta={result.date_released ? `Released ${formatDate(result.date_released)}` : `Status: ${result.status}`}
                body={result.result_details ?? 'Result is not released yet.'}
              />
            ))
          : null}
      </ScrollView>
    </Screen>
  );
}

function StatCard({
  icon,
  count,
  label,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  label: string;
  color: string;
}) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} color={color} size={30} />
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function RecordCard({
  icon,
  title,
  meta,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  meta: string;
  body: string;
}) {
  return (
    <Card style={styles.recordCard}>
      <Ionicons name={icon} color={palette.green} size={30} />
      <View style={styles.recordText}>
        <Text style={styles.recordTitle}>{title}</Text>
        <Text style={styles.recordMeta}>{meta}</Text>
        <Text style={styles.recordBody}>{body}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 18,
    paddingTop: 54,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  back: {
    color: palette.white,
    fontSize: 38,
    fontWeight: '700',
  },
  headerText: {
    flex: 1,
  },
  petName: {
    fontSize: 34,
  },
  petSub: {
    color: '#D7F8E9',
    fontSize: 18,
    textTransform: 'capitalize',
  },
  content: {
    gap: 22,
    paddingBottom: 36,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    paddingHorizontal: 10,
  },
  statCount: {
    color: palette.darkGreen,
    fontSize: 27,
    fontWeight: '900',
  },
  statLabel: {
    color: palette.muted,
    fontSize: 15,
    fontWeight: '700',
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
  recordCard: {
    flexDirection: 'row',
    gap: 16,
  },
  recordText: {
    flex: 1,
    gap: 6,
  },
  recordTitle: {
    color: palette.darkGreen,
    fontSize: 22,
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
