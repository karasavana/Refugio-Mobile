import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/refugio-ui";
import {
    borderRadius,
    getNotificationIcon,
    notifications,
    palette,
    shadow,
    spacing,
    typography,
} from "@/constants/refugio";

export default function NotificationsScreen() {
  const [notificationList, setNotificationList] = useState(notifications);

  const unreadCount = notificationList.filter((n) => n.read_at === null).length;

  const markAsRead = (id: number) => {
    setNotificationList((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotificationList((prev) =>
      prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id));
  };

  if (notificationList.length === 0) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="notifications-off-outline"
              color={palette.muted}
              size={64}
            />
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyText}>
            You&apos;re all caught up. New updates will appear here.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount} unread item{unreadCount === 1 ? "" : "s"}
          </Text>
        </View>
        {unreadCount > 0 && (
          <Pressable
            onPress={markAllAsRead}
            style={({ pressed }) => [
              styles.markAllButton,
              pressed && styles.pressed,
            ]}
            accessibilityLabel="Mark all notifications as read"
            accessibilityRole="button"
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {notificationList.map((notification) => (
          <Pressable
            key={notification.id}
            onPress={() => markAsRead(notification.id)}
            style={({ pressed }) => [
              styles.notificationCard,
              notification.read_at === null && styles.unreadCard,
              pressed && styles.pressed,
            ]}
            accessibilityLabel={`${notification.message}, ${formatTime(notification.created_at)}`}
            accessibilityRole="button"
            accessibilityState={{ selected: notification.read_at === null }}
          >
            <View style={styles.notificationHeader}>
              <View
                style={[
                  styles.iconContainer,
                  notification.read_at === null && styles.unreadIcon,
                ]}
              >
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  color={
                    notification.read_at === null
                      ? palette.white
                      : palette.muted
                  }
                  size={20}
                />
              </View>
              <View style={styles.headerTextWrap}>
                <Text
                  style={[
                    styles.message,
                    notification.read_at === null && styles.unreadMessage,
                  ]}
                >
                  {notification.message}
                </Text>
                <Text style={styles.time}>
                  {formatTime(notification.created_at)}
                </Text>
              </View>
              <Pressable
                onPress={() => deleteNotification(notification.id)}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.pressed,
                ]}
                accessibilityLabel="Delete notification"
                accessibilityRole="button"
              >
                <Ionicons
                  name="close-outline"
                  color={palette.gray500}
                  size={18}
                />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.sm,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: palette.darkGreen,
    ...typography.headerLarge,
  },
  subtitle: {
    color: palette.muted,
    ...typography.bodyMedium,
    marginTop: spacing.xs,
  },
  markAllButton: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: palette.paleMint,
  },
  markAllText: {
    color: palette.green,
    ...typography.labelMedium,
    fontWeight: "700",
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl + spacing.lg,
  },
  notificationCard: {
    backgroundColor: palette.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.md,
    ...shadow.sm,
  },
  unreadCard: {
    backgroundColor: palette.mintStrong,
    borderColor: palette.green,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.995 }],
  },
  notificationHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  headerTextWrap: {
    flex: 1,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: palette.gray100,
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  unreadIcon: {
    backgroundColor: palette.green,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  message: {
    color: palette.gray700,
    ...typography.bodyMedium,
  },
  unreadMessage: {
    color: palette.gray900,
    ...typography.titleSmall,
    fontWeight: "700",
  },
  time: {
    color: palette.muted,
    ...typography.labelSmall,
  },
  emptyContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: palette.gray100,
    borderRadius: borderRadius.full,
    height: 120,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 120,
  },
  emptyTitle: {
    color: palette.darkGreen,
    ...typography.headerMedium,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: palette.muted,
    ...typography.bodyLarge,
    textAlign: "center",
  },
});
