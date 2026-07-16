import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, LinkProps, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card, IconBubble, PetAvatar, Screen } from "@/components/refugio-ui";
import {
    appointments,
    borderRadius,
    capitalize,
    currentUser,
    findPet,
    findVet,
    formatTime,
    getNotificationIcon,
    getServiceLabel,
    notifications,
    palette,
    pets,
    shadow,
    spacing,
    typography,
} from "@/constants/refugio";

export default function HomeScreen() {
  const router = useRouter();
  const upcomingVisits = appointments
    .filter(
      (appointment) =>
        appointment.status === "pending" || appointment.status === "confirmed",
    )
    .sort((first, second) =>
      `${first.appointment_date} ${first.appointment_time}`.localeCompare(
        `${second.appointment_date} ${second.appointment_time}`,
      ),
    );
  const upcomingVisit = upcomingVisits[0];
  const upcomingPet = upcomingVisit ? findPet(upcomingVisit.pet_id) : undefined;
  const upcomingVet = upcomingVisit
    ? findVet(upcomingVisit.veterinarian_id)
    : undefined;
  const [notificationList, setNotificationList] = useState(notifications);
  const reminder = notificationList.find(
    (notification) => notification.read_at === null,
  );
  const unreadCount = notificationList.filter(
    (notification) => notification.read_at === null,
  ).length;
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <Screen style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
          <View>
            <Text style={styles.heroGreeting}>Good morning,</Text>
            <Text style={styles.heroName}>
              {currentUser.name.split(" ")[0]}!
            </Text>
          </View>
          <Pressable
            onPress={() => setIsNotificationsOpen(true)}
            style={styles.bell}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            accessibilityState={{ selected: unreadCount > 0 }}
          >
            <Ionicons
              name="notifications-outline"
              color={palette.green}
              size={26}
            />
            {unreadCount > 0 && <View style={styles.dot} />}
          </Pressable>
        </Animated.View>

        {reminder ? (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Pressable onPress={() => router.push("/(tabs)/book")}>
              <Card style={styles.reminder}>
                <IconBubble name="shield-checkmark-outline" size={56} />
                <Text style={styles.reminderText}>
                  {reminder.message}{" "}
                  <Text style={styles.linkText}>Book now</Text>
                </Text>
              </Card>
            </Pressable>
          </Animated.View>
        ) : null}

        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>My Pets</Text>
          <Link href="/(tabs)/pets" style={styles.seeAll}>
            See all
          </Link>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.petStrip}
        >
          {pets.map((pet) => (
            <Link
              key={pet.id}
              href={{ pathname: "/pet/[id]", params: { id: pet.id } }}
              asChild
            >
              <Pressable
                style={styles.petChip}
                accessibilityLabel={`View ${pet.name}'s profile`}
                accessibilityRole="button"
              >
                <PetAvatar pet={pet} size={76} />
                <Text style={styles.petName}>{pet.name}</Text>
                <View style={styles.petIndicator} />
              </Pressable>
            </Link>
          ))}
          <Pressable
            style={styles.addPet}
            onPress={() =>
              Alert.alert(
                "Add Pet",
                "Pet registration is ready for the Laravel pets endpoint.",
              )
            }
            accessibilityLabel="Add new pet"
            accessibilityRole="button"
          >
            <View style={styles.addCircle}>
              <Ionicons name="add" color={palette.muted} size={34} />
            </View>
            <Text style={styles.addText}>Add Pet</Text>
          </Pressable>
        </Animated.View>

        {upcomingVisits.length > 0 ? (
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Visits</Text>
              <Link href="/(tabs)/visits" style={styles.seeAll}>
                See all
              </Link>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.visitsScroll}
            >
              {upcomingVisits.slice(0, 3).map((visit) => {
                const pet = findPet(visit.pet_id);
                const vet = findVet(visit.veterinarian_id);
                if (!pet || !vet) return null;

                return (
                  <Card key={visit.id} style={styles.visitCard}>
                    <View style={styles.visitTop}>
                      <Text style={styles.status}>
                        {capitalize(visit.status)}
                      </Text>
                    </View>
                    <View style={styles.visitBody}>
                      <View style={styles.dateBadge}>
                        <Text style={styles.dayNumber}>
                          {new Date(
                            `${visit.appointment_date}T00:00:00`,
                          ).getDate()}
                        </Text>
                        <Text style={styles.month}>
                          {new Date(
                            `${visit.appointment_date}T00:00:00`,
                          ).toLocaleDateString("en-US", { month: "short" })}
                        </Text>
                      </View>
                      <View style={styles.visitInfo}>
                        <Text style={styles.cardTitle}>
                          {getServiceLabel(visit.type)}
                        </Text>
                        <Text style={styles.cardSub}>
                          {pet.name} - {formatTime(visit.appointment_time)}
                        </Text>
                        <Text style={styles.cardSub}>{vet.name}</Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </ScrollView>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actions}>
            <View style={styles.actionWrapper}>
              <QuickAction
                label="Book Appointment"
                icon="calendar-outline"
                href="/(tabs)/book"
                color={palette.green}
                backgroundColor={palette.mintStrong}
              />
            </View>
            <View style={styles.actionWrapper}>
              <QuickAction
                label="Medical Records"
                icon="document-text-outline"
                href={{ pathname: "/pet/[id]", params: { id: "1", tab: "medical" } }}
                color={palette.blue}
                backgroundColor={palette.bluePale}
              />
            </View>
            <View style={styles.actionWrapper}>
              <QuickAction
                label="Vaccinations"
                icon="eyedrop-outline"
                href={{ pathname: "/pet/[id]", params: { id: "1", tab: "vaccinations" } }}
                color={palette.darkGreen}
                backgroundColor={palette.yellowPale}
              />
            </View>
            <View style={styles.actionWrapper}>
              <QuickAction
                label="Lab Results"
                icon="flask-outline"
                href={{ pathname: "/pet/[id]", params: { id: "1", tab: "labs" } }}
                color={palette.red}
                backgroundColor={palette.redPale}
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {isNotificationsOpen ? (
        <View style={styles.notificationsOverlay} pointerEvents="box-none">
          <Pressable
            style={styles.overlayBackdrop}
            onPress={() => setIsNotificationsOpen(false)}
            accessibilityLabel="Close notifications overlay"
            accessibilityRole="button"
          />
          <View style={styles.notificationsModal}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>Notifications</Text>
              <Text
                style={styles.markAllRead}
                onPress={() => {
                  setNotificationList((prev) =>
                    prev.map((notification) => ({
                      ...notification,
                      read_at: notification.read_at ?? new Date().toISOString(),
                    })),
                  );
                }}
              >
                Mark all read
              </Text>
            </View>
            <ScrollView
              style={styles.notificationsList}
              contentContainerStyle={styles.notificationsListContent}
              showsVerticalScrollIndicator={false}
            >
              {notificationList.map((notification) => (
                <View key={notification.id} style={styles.notificationRow}>
                  <View style={styles.notificationBadge}>
                    <Ionicons
                      name={getNotificationIcon(notification.type)}
                      color={palette.white}
                      size={18}
                    />
                  </View>
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationSubtitle}>
                      {formatRelativeTime(notification.created_at)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <Pressable
              onPress={() => setIsNotificationsOpen(false)}
              style={styles.closeNotifications}
              accessibilityLabel="Close notifications"
              accessibilityRole="button"
            >
              <Text style={styles.closeNotificationsText}>Close</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

function formatRelativeTime(isoDate: string) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
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
  href: LinkProps["href"];
  color: string;
  backgroundColor: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.actionCard,
          pressed && styles.actionPressed,
        ]}
        accessibilityLabel={`Quick action: ${label}`}
        accessibilityRole="button"
      >
        <View
          style={[
            styles.actionBadge,
            { backgroundColor: backgroundColor || palette.mint },
          ]}
        >
          <Ionicons name={icon} color={color} size={20} />
        </View>
        <Text style={styles.actionText}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: spacing.xl,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  hero: {
    backgroundColor: palette.green,
    borderRadius: borderRadius.xxl,
    minHeight: 140,
    padding: spacing.lg,
    ...shadow.lg,
  },
  heroGreeting: {
    color: "#D7F7EB",
    ...typography.bodyLarge,
  },
  heroName: {
    color: palette.white,
    ...typography.headerLarge,
    marginTop: spacing.xs,
  },
  bell: {
    alignItems: "center",
    backgroundColor: palette.white,
    borderRadius: borderRadius.full,
    height: 48,
    justifyContent: "center",
    position: "absolute",
    right: spacing.lg,
    top: spacing.lg,
    width: 48,
    ...shadow.sm,
  },
  dot: {
    backgroundColor: palette.red,
    borderRadius: borderRadius.full,
    height: 10,
    position: "absolute",
    right: 12,
    top: 12,
    width: 10,
  },
  reminder: {
    alignItems: "center",
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    gap: spacing.md,
  },
  reminderText: {
    color: palette.darkGreen,
    flex: 1,
    ...typography.bodyLarge,
    fontWeight: "600",
  },
  linkText: {
    color: palette.blue,
    fontWeight: "700",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: palette.darkGreen,
    ...typography.headerMedium,
    marginBottom: spacing.sm,
  },
  seeAll: {
    color: palette.blue,
    ...typography.bodyLarge,
    fontWeight: "600",
  },
  petStrip: {
    flexDirection: "row",
    gap: spacing.md,
  },
  petChip: {
    alignItems: "center",
    gap: spacing.sm,
  },
  petName: {
    color: palette.darkGreen,
    ...typography.labelMedium,
    fontWeight: "600",
  },
  petIndicator: {
    backgroundColor: palette.green,
    borderRadius: borderRadius.sm,
    height: 8,
    width: 8,
  },
  addPet: {
    alignItems: "center",
    gap: spacing.sm,
  },
  addCircle: {
    alignItems: "center",
    backgroundColor: palette.paleMint,
    borderColor: palette.line,
    borderRadius: borderRadius.full,
    borderStyle: "dashed",
    borderWidth: 1.5,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  addText: {
    color: palette.muted,
    ...typography.labelMedium,
    fontWeight: "600",
  },
  visitCard: {
    gap: spacing.md,
    width: 280,
    marginRight: spacing.md,
  },
  visitsScroll: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  visitTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  visitTitle: {
    color: palette.darkGreen,
    ...typography.headerSmall,
  },
  status: {
    backgroundColor: palette.mintStrong,
    borderRadius: borderRadius.full,
    color: palette.greenDark,
    ...typography.labelMedium,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  visitBody: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  dateBadge: {
    alignItems: "center",
    backgroundColor: palette.mintStrong,
    borderRadius: borderRadius.lg,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  dayNumber: {
    color: palette.green,
    ...typography.headerMedium,
  },
  month: {
    color: palette.green,
    ...typography.labelMedium,
  },
  visitInfo: {
    flex: 1,
  },
  cardTitle: {
    color: palette.darkGreen,
    ...typography.titleLarge,
  },
  cardSub: {
    color: palette.muted,
    ...typography.bodyMedium,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  actionWrapper: {
    width: "48%",
  },
  actionCard: {
    backgroundColor: palette.white,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    minHeight: 130,
    padding: spacing.lg,
    width: "100%",
    ...shadow.md,
  },
  actionPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.992 }],
  },
  actionBadge: {
    alignItems: "center",
    borderRadius: borderRadius.full,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  actionText: {
    color: palette.darkGreen,
    ...typography.titleSmall,
    fontWeight: "700",
  },
  notificationsOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  notificationsModal: {
    backgroundColor: palette.white,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    maxHeight: "80%",
    minHeight: 280,
    overflow: "hidden",
    padding: spacing.lg,
    width: "92%",
    ...shadow.lg,
  },
  notificationsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  notificationsTitle: {
    color: palette.darkGreen,
    ...typography.headerSmall,
  },
  markAllRead: {
    color: palette.greenDark,
    ...typography.labelMedium,
    fontWeight: "700",
  },
  notificationsList: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  notificationsListContent: {
    gap: spacing.md,
  },
  notificationRow: {
    alignItems: "center",
    borderBottomColor: palette.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  notificationBadge: {
    alignItems: "center",
    backgroundColor: palette.green,
    borderRadius: borderRadius.md,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    color: palette.darkGreen,
    ...typography.bodyMedium,
    fontWeight: "700",
  },
  notificationSubtitle: {
    color: palette.muted,
    ...typography.labelSmall,
    marginTop: spacing.xs,
  },
  closeNotifications: {
    alignItems: "center",
    borderColor: palette.green,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  closeNotificationsText: {
    color: palette.green,
    ...typography.titleMedium,
    fontWeight: "700",
  },
});
