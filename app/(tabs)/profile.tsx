import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { Card, IconBubble, Screen, ShadowButton } from '@/components/refugio-ui';
import { borderRadius, currentUser, getInitials, palette, shadow, spacing, typography } from '@/constants/refugio';

export default function ProfileScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    contact_number: currentUser.contact_number,
    address: currentUser.address,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Phone number is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) {
      return;
    }

    // In production, this would make an API call to update the user profile
    // Example:
    // try {
    //   const response = await fetch('/api/user/profile', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   if (!response.ok) throw new Error('Failed to update profile');
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to update profile');
    //   return;
    // }

    // Mock success for now
    Alert.alert('Success', 'Profile updated successfully');
    setIsEditing(false);
  }

  function handleCancel() {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      contact_number: currentUser.contact_number,
      address: currentUser.address,
    });
    setErrors({});
    setIsEditing(false);
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitials}>{getInitials(formData.name)}</Text>
            {isEditing && (
              <Pressable style={styles.editPhotoButton} onPress={() => Alert.alert('Edit Photo', 'Photo upload will be implemented with the API')}>
                <Ionicons name="camera" color={palette.white} size={20} />
              </Pressable>
            )}
          </View>
          {isEditing ? (
            <TextInput
              style={[styles.name, styles.editInput]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Full name"
            />
          ) : (
            <Text style={styles.name}>{formData.name}</Text>
          )}
          {isEditing ? (
            <TextInput
              style={[styles.email, styles.editInput]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.email}>{formData.email}</Text>
          )}
        </View>

        <Card style={styles.infoCard}>
          {isEditing ? (
            <>
              <View style={[styles.infoRow, styles.lastInfoRow]}>
                <Text style={styles.infoLabel}>Phone</Text>
                <TextInput
                  style={[styles.editInput, styles.editInputInline]}
                  value={formData.contact_number}
                  onChangeText={(text) => setFormData({ ...formData, contact_number: text })}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                />
              </View>
              {errors.contact_number && <Text style={styles.errorText}>{errors.contact_number}</Text>}
              <View style={[styles.infoRow, styles.lastInfoRow]}>
                <Text style={styles.infoLabel}>Address</Text>
                <TextInput
                  style={[styles.editInput, styles.editInputInline]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Address"
                />
              </View>
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </>
          ) : (
            <>
              <InfoRow label="Phone" value={formData.contact_number} />
              <InfoRow label="Address" value={formData.address} last />
            </>
          )}
        </Card>

        {isEditing ? (
          <View style={styles.editActions}>
            <ShadowButton
              style={styles.cancelButton}
              onPress={handleCancel}
              color={palette.gray400}
            >
              Cancel
            </ShadowButton>
            <ShadowButton
              style={styles.saveButton}
              onPress={handleSave}
            >
              Save
            </ShadowButton>
          </View>
        ) : (
          <ShadowButton
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            Edit Profile
          </ShadowButton>
        )}

        <Text style={styles.sectionTitle}>Settings</Text>
        <SettingRow
          icon="notifications-outline"
          title="Push Notifications"
          value={<Switch onValueChange={setPushEnabled} value={pushEnabled} trackColor={{ true: palette.green }} />}
        />
        <SettingRow
          icon="lock-closed-outline"
          title="Change Password"
          chevron
          onPress={() => Alert.alert('Change Password', 'This will use the users/password endpoint when the API is connected.')}
        />
        <SettingRow
          icon="help-circle-outline"
          title="Help & Support"
          chevron
          onPress={() => Alert.alert('Help & Support', 'Call Refugio Veterinary Clinic - Tubigon for urgent concerns.')}
        />

        <ShadowButton color={palette.red} style={styles.logout} onPress={() => router.replace('/')}>
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
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: React.ReactNode;
  chevron?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.settingPressable}>
      <View style={styles.settingRow}>
        <IconBubble name={icon} />
        <Text style={styles.settingTitle}>{title}</Text>
        {value}
        {chevron ? <Ionicons name="chevron-forward" color={palette.muted} size={28} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.sm,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl + spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  userAvatar: {
    alignItems: 'center',
    backgroundColor: palette.green,
    borderRadius: borderRadius.full,
    height: 100,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 100,
    ...shadow.md,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: palette.darkGreen,
    borderRadius: borderRadius.full,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  userInitials: {
    color: palette.white,
    ...typography.headerLarge,
  },
  name: {
    color: palette.darkGreen,
    ...typography.headerMedium,
    textAlign: 'center',
  },
  email: {
    color: palette.muted,
    ...typography.bodyLarge,
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
    padding: spacing.md,
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    color: palette.muted,
    ...typography.bodyLarge,
  },
  infoValue: {
    color: palette.darkGreen,
    flex: 1,
    ...typography.bodyLarge,
    fontWeight: '600',
    textAlign: 'right',
  },
  sectionTitle: {
    color: palette.darkGreen,
    ...typography.headerSmall,
    marginTop: spacing.sm,
  },
  settingPressable: {
    overflow: 'hidden',
  },
  settingRow: {
    alignItems: 'center',
    borderBottomColor: palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  settingTitle: {
    color: palette.darkGreen,
    flex: 1,
    ...typography.titleLarge,
  },
  count: {
    color: palette.green,
    ...typography.headerSmall,
  },
  logout: {
    marginTop: spacing.lg,
  },
  editInput: {
    color: palette.darkGreen,
    ...typography.bodyMedium,
    padding: spacing.sm,
    backgroundColor: palette.gray100,
    borderRadius: borderRadius.md,
    textAlign: 'center',
  },
  editInputInline: {
    flex: 1,
    textAlign: 'right',
    backgroundColor: palette.gray100,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    color: palette.darkGreen,
    ...typography.bodyMedium,
  },
  errorText: {
    color: palette.red,
    ...typography.labelSmall,
    marginTop: spacing.xs,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  editButton: {
    marginTop: spacing.md,
  },
});
