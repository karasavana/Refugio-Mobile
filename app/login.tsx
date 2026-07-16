import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandIcon, FormField, Screen, ShadowButton } from '@/components/refugio-ui';
import { currentUser, palette } from '@/constants/refugio';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  function handleLogin() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
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
            <BrandIcon size={124} />
            <Text style={styles.title}>
              Welcome{'\n'}
              <Text style={styles.green}>Back!</Text>
            </Text>
            <Text style={styles.subtitle}>Log in to your pet&apos;s care hub</Text>
          </View>

          <FormField
            label="Email"
            icon="mail-outline"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@email.com"
            value={email}
          />
          <FormField
            label="Password"
            icon="lock-closed-outline"
            onChangeText={setPassword}
            placeholder="Your password"
            rightIcon="eye-off-outline"
            secureTextEntry
            value={password}
          />

          <Text
            style={styles.forgot}
            onPress={() => Alert.alert('Password Reset', 'A reset link can be sent once the Laravel API endpoint is connected.')}>
            Forgot password?
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <ShadowButton onPress={handleLogin}>Log In</ShadowButton>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.or}>or</Text>
            <View style={styles.divider} />
          </View>

          <Text style={styles.switchText}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={styles.switchLink}>
              Sign Up
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
    paddingTop: 70,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    gap: 24,
    paddingBottom: 34,
  },
  hero: {
    alignItems: 'center',
    gap: 18,
    marginBottom: 42,
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
  forgot: {
    color: palette.blue,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  error: {
    color: palette.red,
    fontSize: 12,
    fontWeight: '600',
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
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
