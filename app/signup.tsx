import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandIcon, FormField, Screen, ShadowButton } from '@/components/refugio-ui';
import { palette } from '@/constants/refugio';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('Juan dela Cruz');
  const [email, setEmail] = useState('you@email.com');
  const [phone, setPhone] = useState('+63 900 000 0000');
  const [password, setPassword] = useState('password');
  const [confirmPassword, setConfirmPassword] = useState('password');
  const [error, setError] = useState('');

  function handleCreateAccount() {
    const cleanEmail = email.trim().toLowerCase();

    if (!name.trim() || !cleanEmail || !phone.trim() || !password || !confirmPassword) {
      setError('Please complete all fields.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    router.replace('/(tabs)/home');
  }

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <BrandIcon size={116} />
            <Text style={styles.title}>
              Create Your{'\n'}
              <Text style={styles.green}>Account</Text>
            </Text>
            <Text style={styles.subtitle}>Join Refugio Vet Care today</Text>
          </View>

          <FormField label="Full Name" icon="person-outline" onChangeText={setName} placeholder="Juan dela Cruz" value={name} />
          <FormField
            label="Email"
            icon="mail-outline"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@email.com"
            value={email}
          />
          <FormField
            label="Phone Number"
            icon="call-outline"
            keyboardType="phone-pad"
            onChangeText={setPhone}
            placeholder="+63 900 000 0000"
            value={phone}
          />
          <FormField
            label="Password"
            icon="lock-closed-outline"
            onChangeText={setPassword}
            placeholder="Create a password"
            rightIcon="eye-off-outline"
            secureTextEntry
            value={password}
          />
          <FormField
            label="Confirm Password"
            icon="lock-closed-outline"
            onChangeText={setConfirmPassword}
            placeholder="Repeat your password"
            rightIcon="eye-off-outline"
            secureTextEntry
            value={confirmPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <ShadowButton style={styles.submit} onPress={handleCreateAccount}>
            Create Account
          </ShadowButton>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.or}>or</Text>
            <View style={styles.divider} />
          </View>

          <Text style={styles.switchText}>
            Already have an account?{' '}
            <Link href="/login" style={styles.switchLink}>
              Log In
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 26,
    paddingTop: 58,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    gap: 21,
    paddingBottom: 34,
  },
  hero: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  title: {
    color: palette.darkGreen,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    textAlign: 'center',
  },
  green: {
    color: palette.green,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
  },
  error: {
    color: palette.red,
    fontSize: 12,
    fontWeight: '600',
  },
  submit: {
    marginTop: 12,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  divider: {
    backgroundColor: palette.line,
    flex: 1,
    height: 1.5,
  },
  or: {
    color: palette.muted,
    fontSize: 13,
  },
  switchText: {
    color: palette.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  switchLink: {
    color: palette.blue,
    fontWeight: '600',
  },
});
