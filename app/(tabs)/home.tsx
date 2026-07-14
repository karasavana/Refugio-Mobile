import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, LinkProps, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, IconBubble, PetAvatar, Screen } from '@/components/refugio-ui';
import {
  appointments,
  carePath,
  currentUser,
  findPet,
  findVet,
  formatTime,
  getServiceLabel,
  notifications,
  palette,
  pets,
} from '@/constants/refugio';

export default function HomeScreen() {
  const router = useRouter();
  const upcomingVisit = appointments
    .filter((appointment) => appointment.status === 'pending' || appointment.status === 'confirmed')
    .sort((first, second) => `${first.appointment_date} ${first.appointment_time}`.localeCompare(`${second.appointment_date} ${second.appointment_time}`))[0];
  const upcomingPet = upcomingVisit ? findPet(upcomingVisit.pet_id) : undefined;
  const upcomingVet = upcomingVisit ? findVet(upcomingVisit.veterinarian_id) : undefined;
  const reminder = notifications.find((notification) => notification.read_at === null);

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View>
            <Text style={styles.heroGreeting}>Good morning,</Text>
            <Text style={styles.heroName}>{currentUser.name.split(' ')[0]}!</Text>
          </View>
          <View style={styles.bell}>
            <Ionicons name="notifications-outline" color={palette.green} size={26} />
            <View style={styles.dot} />
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons name="flame-outline" color={palette.yellow} size={22} />
              <Text style={styles.statText}>7-day streak</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="star-outline" color={palette.yellow} size={22} />
              <Text style={styles.statText}>320 pts</Text>
            </View>
          </View>
        </View>

        {reminder ? (
          <Pressable onPress={() => router.push('/(tabs)/book')}>
            <Card style={styles.reminder}>
              <IconBubble name="shield-checkmark-outline" size={56} />
              <Text style={styles.reminderText}>
                {reminder.message} <Text style={styles.linkText}>Book now</Text>
              </Text>
            </Card>
          </Pressable>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Pets</Text>
          <Link href="/(tabs)/pets" style={styles.seeAll}>
            See all
          </Link>
        </View>
        <View style={styles.petStrip}>
          {pets.map((pet) => (
            <Link key={pet.id} href={{ pathname: '/pet/[id]', params: { id: pet.id } }} asChild>
              <Pressable style={styles.petChip}>
                <PetAvatar pet={pet} size={76} />
                <Text style={styles.petName}>{pet.name}</Text>
                <View style={styles.petIndicator} />
              </Pressable>
            </Link>
          ))}
          <Pressable style={styles.addPet} onPress={() => Alert.alert('Add Pet', 'Pet registration is ready for the Laravel pets endpoint.')}>
            <View style={styles.addCircle}>
              <Ionicons name="add" color={palette.muted} size={34} />
            </View>
            <Text style={styles.addText}>Add Pet</Text>
          </Pressable>
        </View>

        {upcomingVisit && upcomingPet && upcomingVet ? (
          <Card style={styles.visitCard}>
            <View style={styles.visitTop}>
              <Text style={styles.visitTitle}>Upcoming Visit</Text>
              <Text style={styles.status}>{capitalize(upcomingVisit.status)}</Text>
            </View>
            <View style={styles.visitBody}>
              <View style={styles.dateBadge}>
                <Text style={styles.dayNumber}>{new Date(`${upcomingVisit.appointment_date}T00:00:00`).getDate()}</Text>
                <Text style={styles.month}>July</Text>
              </View>
              <View style={styles.visitInfo}>
                <Text style={styles.cardTitle}>{getServiceLabel(upcomingVisit.type)}</Text>
                <Text style={styles.cardSub}>
                  {upcomingPet.name} - {formatTime(upcomingVisit.appointment_time)}
                </Text>
                <Text style={styles.cardSub}>{upcomingVet.name}</Text>
              </View>
            </View>
          </Card>
        ) : null}

        <View style={styles.careHeader}>
          <Text style={styles.sectionTitle}>Bantay&apos;s Care Path</Text>
          <Text style={styles.doneText}>2 / 5 done</Text>
        </View>
        <Card style={styles.careCard}>
          {carePath.map((item, index) => (
            <View key={item.id} style={styles.careRow}>
              {index < carePath.length - 1 ? <View style={styles.careLine} /> : null}
              <View style={[styles.careIcon, item.state === 'current' && styles.currentCareIcon, item.state === 'locked' && styles.lockedCareIcon]}>
                <Ionicons
                  name={item.state === 'done' ? 'checkmark' : item.state === 'current' ? 'paw-outline' : 'lock-closed-outline'}
                  color={item.state === 'locked' ? palette.muted : palette.white}
                  size={24}
                />
              </View>
              <Text style={[styles.careText, item.state === 'locked' && styles.locked]}>{item.title}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <QuickAction label="Book Appointment" icon="calendar-outline" href="/(tabs)/book" color={palette.green} backgroundColor={palette.mintStrong} />
          <QuickAction label="Medical Records" icon="document-text-outline" href="/pet/1" color={palette.blue} backgroundColor={palette.bluePale} />
          <QuickAction label="Vaccinations" icon="eyedrop-outline" href="/pet/1" color={palette.darkGreen} backgroundColor={palette.yellowPale} />
          <QuickAction label="Lab Results" icon="flask-outline" href="/pet/1" color={palette.red} backgroundColor={palette.redPale} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function QuickAction({
  label,
  icon,
  href,
  color,
  backgroundColor,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: LinkProps['href'];
  color: string;
  backgroundColor: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={[styles.actionCard, { backgroundColor }]}>
        <Ionicons name={icon} color={color} size={32} />
        <Text style={[styles.actionText, { color }]}>{label}</Text>
      </Pressable>
    </Link>
  );
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 34,
  },
  content: {
    gap: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  hero: {
    backgroundColor: palette.green,
    borderRadius: 34,
    minHeight: 154,
    padding: 24,
    shadowColor: palette.greenDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  heroGreeting: {
    color: '#D6FAEA',
    fontSize: 18,
    fontWeight: '600',
  },
  heroName: {
    color: palette.white,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  bell: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 28,
    height: 58,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top: 30,
    width: 58,
  },
  dot: {
    backgroundColor: palette.red,
    borderRadius: 6,
    height: 12,
    position: 'absolute',
    right: 12,
    top: 12,
    width: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 26,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 7,
    minWidth: 124,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  statText: {
    color: palette.greenDark,
    fontSize: 13,
    fontWeight: '900',
  },
  reminder: {
    alignItems: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    gap: 16,
  },
  reminderText: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
  },
  linkText: {
    color: palette.blue,
    fontWeight: '900',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: palette.darkGreen,
    fontSize: 23,
    fontWeight: '900',
  },
  seeAll: {
    color: palette.blue,
    fontSize: 17,
    fontWeight: '900',
  },
  petStrip: {
    flexDirection: 'row',
    gap: 20,
  },
  petChip: {
    alignItems: 'center',
    gap: 7,
  },
  petName: {
    color: palette.darkGreen,
    fontSize: 15,
    fontWeight: '900',
  },
  petIndicator: {
    backgroundColor: palette.green,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  addPet: {
    alignItems: 'center',
    gap: 8,
  },
  addCircle: {
    alignItems: 'center',
    backgroundColor: '#ECF9F4',
    borderColor: palette.line,
    borderRadius: 38,
    borderStyle: 'dashed',
    borderWidth: 2,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  addText: {
    color: palette.muted,
    fontSize: 15,
    fontWeight: '900',
  },
  visitCard: {
    gap: 16,
  },
  visitTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visitTitle: {
    color: palette.darkGreen,
    fontSize: 20,
    fontWeight: '900',
  },
  status: {
    backgroundColor: '#D4F6E3',
    borderRadius: 999,
    color: palette.greenDark,
    fontSize: 15,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  visitBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
  },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: palette.mintStrong,
    borderRadius: 34,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  dayNumber: {
    color: palette.green,
    fontSize: 31,
    fontWeight: '900',
  },
  month: {
    color: palette.green,
    fontSize: 15,
    fontWeight: '900',
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
    fontSize: 17,
    fontWeight: '600',
    marginTop: 4,
  },
  careHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doneText: {
    color: palette.muted,
    fontSize: 17,
    fontWeight: '700',
  },
  careCard: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    gap: 0,
    paddingVertical: 4,
    shadowOpacity: 0,
  },
  careRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 64,
    position: 'relative',
  },
  careLine: {
    backgroundColor: palette.line,
    height: 54,
    left: 27,
    position: 'absolute',
    top: 42,
    width: 3,
  },
  careIcon: {
    alignItems: 'center',
    backgroundColor: palette.yellow,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginRight: 18,
    width: 56,
    zIndex: 1,
  },
  currentCareIcon: {
    backgroundColor: palette.green,
    borderColor: palette.mintStrong,
    borderWidth: 6,
  },
  lockedCareIcon: {
    backgroundColor: '#E8F6F0',
    borderColor: palette.line,
    borderWidth: 4,
  },
  careText: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
  },
  locked: {
    color: palette.muted,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  actionCard: {
    borderRadius: 30,
    gap: 24,
    minHeight: 124,
    padding: 20,
    width: '47.8%',
  },
  actionText: {
    fontSize: 17,
    fontWeight: '900',
  },
});
