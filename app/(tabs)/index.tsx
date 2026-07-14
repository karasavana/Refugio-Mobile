import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, IconBubble, PetAvatar, Screen, ShadowButton } from '@/components/refugio-ui';
import {
  appointments,
  currentUser,
  findPet,
  findVet,
  formatShortDate,
  formatTime,
  getServiceLabel,
  notifications,
  palette,
  pets,
} from '@/constants/refugio';

export default function HomeScreen() {
  const upcomingVisit = appointments.find((appointment) => appointment.status !== 'cancelled');
  const upcomingPet = upcomingVisit ? findPet(upcomingVisit.pet_id) : undefined;
  const upcomingVet = upcomingVisit ? findVet(upcomingVisit.veterinarian_id) : undefined;
  const reminder = notifications.find((notification) => notification.read_at === null);

  return (
    <Screen variant="green" style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View>
            <Text style={styles.heroGreeting}>Good morning,</Text>
            <Text style={styles.heroName}>{currentUser.name}!</Text>
          </View>
          <View style={styles.bell}>
            <View style={styles.dot} />
          </View>
          <View style={styles.stats}>
            <Text style={styles.stat}>🔥 7-day streak</Text>
            <Text style={styles.stat}>⭐ 320 pts</Text>
          </View>
        </View>

        {reminder ? (
          <Card style={styles.reminder}>
            <IconBubble name="heart-outline" />
            <Text style={styles.reminderText}>{reminder.message}</Text>
          </Card>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Pets</Text>
          <Link href={'/(tabs)/pets' as never} style={styles.seeAll}>
            See all
          </Link>
        </View>
        <View style={styles.petStrip}>
          {pets.map((pet) => (
            <Link key={pet.id} href={{ pathname: '/pet/[id]', params: { id: pet.id } } as never} asChild>
              <Pressable style={styles.petChip}>
                <PetAvatar pet={pet} size={70} />
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed}</Text>
              </Pressable>
            </Link>
          ))}
          <View style={styles.addPet}>
            <Ionicons name="add" color={palette.muted} size={34} />
            <Text style={styles.petBreed}>Add pet</Text>
          </View>
        </View>

        {upcomingVisit && upcomingPet && upcomingVet ? (
          <Card style={styles.visitCard}>
            <View style={styles.visitHeader}>
              <Text style={styles.visitTitle}>Upcoming Visit</Text>
              <Text style={styles.visitDate}>{formatShortDate(upcomingVisit.appointment_date)}</Text>
            </View>
            <View style={styles.visitBody}>
              <PetAvatar pet={upcomingPet} size={58} />
              <View style={styles.visitInfo}>
                <Text style={styles.cardTitle}>{getServiceLabel(upcomingVisit.type)}</Text>
                <Text style={styles.cardSub}>
                  {upcomingPet.name} · {upcomingVet.name}
                </Text>
              </View>
              <View style={styles.visitMeta}>
                <Text style={styles.visitTime}>{formatTime(upcomingVisit.appointment_time)}</Text>
                <Text style={styles.status}>{upcomingVisit.status}</Text>
              </View>
            </View>
          </Card>
        ) : null}

        <Card style={styles.careCard}>
          <View style={styles.careHeader}>
            <Text style={styles.cardTitle}>Bantay&apos;s Care Path</Text>
            <Text style={styles.cardSub}>3 / 6 done</Text>
          </View>
          {['Registration', '1st Check-up', 'Deworming', 'Rabies Booster', 'Dental Cleaning', 'Annual Wellness'].map(
            (item, index) => (
              <View key={item} style={styles.careRow}>
                <Ionicons
                  name={index < 3 ? 'checkmark-circle' : index === 3 ? 'radio-button-on' : 'lock-closed'}
                  color={index < 3 ? palette.yellow : index === 3 ? palette.green : '#BBDDCF'}
                  size={34}
                />
                <Text style={[styles.careText, index > 3 && styles.locked]}>{item}</Text>
              </View>
            ),
          )}
        </Card>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          {[
            ['Book Appointment', 'calendar-outline', '/book'],
            ['Medical Records', 'document-text-outline', '/pet/1'],
            ['Vaccinations', 'eyedrop-outline', '/pet/1'],
            ['Lab Results', 'flask-outline', '/pet/1'],
          ].map(([label, icon, href]) => (
            <Link key={label} href={href as never} asChild>
              <Pressable style={styles.actionPressable}>
                <Card style={styles.actionCard}>
                  <Ionicons name={icon as keyof typeof Ionicons.glyphMap} color={label === 'Lab Results' ? palette.red : palette.green} size={28} />
                  <Text style={styles.actionText}>{label}</Text>
                </Card>
              </Pressable>
            </Link>
          ))}
        </View>
        <Link href={'/(tabs)/book' as never} asChild>
          <ShadowButton style={styles.bottomButton}>Book an appointment</ShadowButton>
        </Link>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 28,
  },
  content: {
    gap: 20,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  hero: {
    backgroundColor: '#14A968',
    borderRadius: 34,
    minHeight: 150,
    padding: 24,
  },
  heroGreeting: {
    color: '#CFF9E5',
    fontSize: 18,
  },
  heroName: {
    color: palette.white,
    fontSize: 28,
    fontWeight: '900',
  },
  bell: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top: 26,
    width: 56,
  },
  dot: {
    backgroundColor: palette.red,
    borderRadius: 6,
    height: 12,
    position: 'absolute',
    right: 14,
    top: 12,
    width: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 26,
  },
  stat: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    color: palette.white,
    fontSize: 16,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  reminder: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  reminderText: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: palette.darkGreen,
    fontSize: 24,
    fontWeight: '900',
  },
  seeAll: {
    color: palette.blue,
    fontSize: 16,
    fontWeight: '800',
  },
  petStrip: {
    flexDirection: 'row',
    gap: 18,
  },
  petChip: {
    alignItems: 'center',
    gap: 6,
  },
  addPet: {
    alignItems: 'center',
    borderColor: '#CFF9E5',
    borderRadius: 36,
    borderStyle: 'dashed',
    borderWidth: 3,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  petName: {
    color: palette.darkGreen,
    fontSize: 16,
    fontWeight: '900',
  },
  petBreed: {
    color: palette.muted,
    fontSize: 14,
  },
  visitCard: {
    padding: 0,
    overflow: 'hidden',
  },
  visitHeader: {
    backgroundColor: palette.mint,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
  },
  visitTitle: {
    color: palette.darkGreen,
    fontSize: 18,
    fontWeight: '900',
  },
  visitDate: {
    color: palette.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  visitBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    padding: 18,
  },
  visitInfo: {
    flex: 1,
  },
  cardTitle: {
    color: palette.darkGreen,
    fontSize: 21,
    fontWeight: '900',
  },
  cardSub: {
    color: palette.muted,
    fontSize: 16,
    marginTop: 4,
  },
  visitMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  visitTime: {
    color: palette.green,
    fontSize: 16,
    fontWeight: '900',
  },
  status: {
    backgroundColor: palette.mint,
    borderRadius: 999,
    color: '#0CA865',
    fontSize: 13,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    textTransform: 'capitalize',
  },
  careCard: {
    gap: 14,
  },
  careHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  careRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  careText: {
    color: palette.darkGreen,
    fontSize: 18,
    fontWeight: '800',
  },
  locked: {
    color: palette.muted,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  actionCard: {
    gap: 24,
    minHeight: 126,
    width: '100%',
  },
  actionPressable: {
    width: '47%',
  },
  actionText: {
    color: palette.darkGreen,
    fontSize: 17,
    fontWeight: '900',
  },
  bottomButton: {
    marginBottom: 8,
  },
});
