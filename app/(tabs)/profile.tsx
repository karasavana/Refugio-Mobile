import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Card, IconBubble, Screen, ShadowButton, Title } from '@/components/refugio-ui';
import { currentUser, getInitials, notifications, palette } from '@/constants/refugio';

export default function ProfileScreen() {
  const unreadCount = notifications.filter((notification) => notification.read_at === null).length;

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitials}>{getInitials(currentUser.name)}</Text>
          </View>
          <Title style={styles.name}>{currentUser.name}</Title>
          <Text style={styles.email}>{currentUser.email}</Text>
        </View>

        <Card style={styles.infoCard}>
          <InfoRow label="Phone" value={currentUser.contact_number} />
          <InfoRow label="Address" value={currentUser.address} last />
        </Card>

        <Text style={styles.sectionTitle}>Settings</Text>
        <SettingRow icon="notifications-outline" title="Push Notifications" value={<Switch value trackColor={{ true: palette.green }} />} />
        <SettingRow icon="mail-unread-outline" title="Unread Notifications" value={<Text style={styles.count}>{unreadCount}</Text>} />
        <SettingRow icon="lock-closed-outline" title="Change Password" chevron />
        <SettingRow icon="help-circle-outline" title="Help & Support" chevron />

        <ShadowButton color={palette.red} style={styles.logout}>
          Log Out
        </ShadowButton>
      </ScrollView>
    </Screen>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.lastInfoRow]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  value,
  chevron,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: React.ReactNode;
  chevron?: boolean;
}) {
  return (
    <View style={styles.settingRow}>
      <IconBubble name={icon} />
      <Text style={styles.settingTitle}>{title}</Text>
      {value}
      {chevron ? <Ionicons name="chevron-forward" color={palette.muted} size={28} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
  },
  content: {
    gap: 24,
    paddingBottom: 34,
  },
  profileHeader: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
  },
  userAvatar: {
    alignItems: 'center',
    backgroundColor: palette.green,
    borderRadius: 76,
    height: 152,
    justifyContent: 'center',
    marginBottom: 18,
    width: 152,
  },
  userInitials: {
    color: palette.white,
    fontSize: 40,
    fontWeight: '800',
  },
  name: {
    fontSize: 34,
    textAlign: 'center',
  },
  email: {
    color: palette.muted,
    fontSize: 20,
  },
  infoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  infoRow: {
    alignItems: 'center',
    borderBottomColor: palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    color: palette.muted,
    fontSize: 19,
  },
  infoValue: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'right',
  },
  sectionTitle: {
    color: palette.darkGreen,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 12,
  },
  settingRow: {
    alignItems: 'center',
    borderBottomColor: palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 18,
    paddingVertical: 18,
  },
  settingTitle: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
  },
  count: {
    color: palette.green,
    fontSize: 22,
    fontWeight: '900',
  },
  logout: {
    marginTop: 34,
  },
});
