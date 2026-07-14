import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, LinkProps } from 'expo-router';
import { PropsWithChildren } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { getInitials, palette, Pet } from '@/constants/refugio';

export function Screen({
  children,
  variant = 'light',
  style,
}: PropsWithChildren<{
  variant?: 'light' | 'green';
  style?: StyleProp<ViewStyle>;
}>) {
  return <View style={[styles.screen, variant === 'green' && styles.greenScreen, style]}>{children}</View>;
}

export function Title({ children, light, style }: PropsWithChildren<{ light?: boolean; style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.title, light && styles.lightText, style]}>{children}</Text>;
}

export function Muted({ children, light, style }: PropsWithChildren<{ light?: boolean; style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.muted, light && styles.lightMuted, style]}>{children}</Text>;
}

export function Card({
  children,
  style,
  selected,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; selected?: boolean }>) {
  return <View style={[styles.card, selected && styles.selectedCard, style]}>{children}</View>;
}

export function Pill({
  children,
  tone = 'green',
}: PropsWithChildren<{ tone?: 'green' | 'yellow' | 'red' | 'neutral' }>) {
  const toneStyle = {
    green: styles.greenPill,
    yellow: styles.yellowPill,
    red: styles.redPill,
    neutral: styles.neutralPill,
  }[tone];

  return <Text style={[styles.pill, toneStyle]}>{children}</Text>;
}

export function PetAvatar({ pet, size = 72 }: { pet: Pet; size?: number }) {
  const backgroundColor = pet.id % 2 === 0 ? palette.blue : palette.green;

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{getInitials(pet.name)}</Text>
    </View>
  );
}

export function IconBubble({
  name,
  color = palette.green,
  backgroundColor = palette.mint,
  size = 48,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color?: string;
  backgroundColor?: string;
  size?: number;
}) {
  return (
    <View style={[styles.iconBubble, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
      <Ionicons name={name} size={size * 0.46} color={color} />
    </View>
  );
}

export function ShadowButton({
  children,
  color = palette.green,
  style,
  textStyle,
  ...pressableProps
}: PropsWithChildren<
  PressableProps & {
    color?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
  }
>) {
  return (
    <Pressable style={[styles.button, { backgroundColor: color }, style]} {...pressableProps}>
      <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </Pressable>
  );
}

export function LinkButton({
  children,
  href,
  style,
}: PropsWithChildren<{ href: LinkProps['href']; style?: StyleProp<ViewStyle> }>) {
  return (
    <Link href={href} asChild>
      <Pressable style={[styles.button, style]}>
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </Link>
  );
}

export function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLabelWrap}>
        {icon ? <IconBubble name={icon} size={36} /> : null}
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paleMint,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  greenScreen: {
    backgroundColor: palette.green,
  },
  title: {
    color: palette.darkGreen,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  lightText: {
    color: palette.white,
  },
  muted: {
    color: palette.muted,
    fontSize: 17,
    lineHeight: 24,
  },
  lightMuted: {
    color: '#D7F8E9',
  },
  card: {
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: 32,
    borderWidth: 1.5,
    padding: 22,
  },
  selectedCard: {
    backgroundColor: palette.mint,
    borderColor: palette.line,
    shadowColor: palette.darkGreen,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 0,
    elevation: 5,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    fontSize: 16,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  greenPill: {
    backgroundColor: palette.mint,
    color: '#0CA865',
  },
  yellowPill: {
    backgroundColor: '#FFF2BD',
    color: '#E4A600',
  },
  redPill: {
    backgroundColor: '#FFE2E5',
    color: palette.red,
  },
  neutralPill: {
    backgroundColor: '#EEF7F2',
    color: palette.muted,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.white,
    fontWeight: '800',
    letterSpacing: 1,
  },
  iconBubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: palette.green,
    borderRadius: 28,
    justifyContent: 'center',
    minHeight: 62,
    paddingHorizontal: 24,
    shadowColor: palette.shadowGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  buttonText: {
    color: palette.white,
    fontSize: 22,
    fontWeight: '800',
  },
  row: {
    alignItems: 'center',
    borderBottomColor: palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  rowLabelWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  rowLabel: {
    color: palette.muted,
    fontSize: 18,
  },
  rowValue: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },
});
