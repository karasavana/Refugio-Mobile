import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, LinkProps } from 'expo-router';
import { PropsWithChildren } from 'react';
import {
  Image,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
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
}: PropsWithChildren<{ tone?: 'green' | 'yellow' | 'red' | 'blue' | 'neutral' }>) {
  const toneStyle = {
    green: styles.greenPill,
    yellow: styles.yellowPill,
    red: styles.redPill,
    blue: styles.bluePill,
    neutral: styles.neutralPill,
  }[tone];

  return <Text style={[styles.pill, toneStyle]}>{children}</Text>;
}

export function PetAvatar({ pet, size = 72 }: { pet: Pet; size?: number }) {
  const uri = pet.photo_path?.startsWith('http') ? pet.photo_path : null;

  if (uri) {
    return (
      <View style={[styles.avatarImageWrap, { width: size, height: size, borderRadius: size / 2 }]}>
        <Image source={{ uri }} style={{ width: size - 8, height: size - 8, borderRadius: (size - 8) / 2 }} />
      </View>
    );
  }

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name="paw-outline" color={palette.white} size={size * 0.36} />
      <Text style={[styles.avatarText, { fontSize: size * 0.18 }]}>{getInitials(pet.name)}</Text>
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
    <Pressable style={({ pressed }) => [styles.button, { backgroundColor: color }, pressed && styles.pressed, style]} {...pressableProps}>
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
      <ShadowButton style={style}>{children}</ShadowButton>
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
        {icon ? <IconBubble name={icon} size={34} /> : null}
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function FormField({
  label,
  icon,
  rightIcon,
  style,
  ...inputProps
}: TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputShell}>
        <Ionicons name={icon} color={palette.muted} size={25} />
        <TextInput
          placeholderTextColor={palette.muted}
          style={[styles.input, style]}
          autoCapitalize="none"
          autoCorrect={false}
          {...inputProps}
        />
        {rightIcon ? <Ionicons name={rightIcon} color={palette.muted} size={25} /> : null}
      </View>
    </View>
  );
}

export function BrandIcon({ size = 126, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <View
      style={[
        styles.brandIcon,
        {
          width: size,
          height: size,
          borderRadius: size * 0.24,
          backgroundColor: muted ? 'rgba(255,255,255,0.16)' : palette.green,
        },
      ]}>
      <Ionicons name="paw-outline" color={palette.white} size={size * 0.46} />
    </View>
  );
}

export function AuthBrand() {
  return <Text style={styles.authBrand}>REFUGIO VETERINARY CLINIC - TUBIGON</Text>;
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
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  lightText: {
    color: palette.white,
  },
  muted: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  lightMuted: {
    color: palette.mint,
  },
  card: {
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderRadius: 32,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: palette.mint,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: palette.mintStrong,
    borderColor: palette.green,
    borderWidth: 3,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    fontSize: 15,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  greenPill: {
    backgroundColor: '#D4F6E3',
    color: palette.greenDark,
  },
  yellowPill: {
    backgroundColor: palette.yellowPale,
    color: '#C99400',
  },
  redPill: {
    backgroundColor: palette.redPale,
    color: palette.red,
  },
  bluePill: {
    backgroundColor: palette.bluePale,
    color: palette.blue,
  },
  neutralPill: {
    backgroundColor: '#EEF7F2',
    color: palette.muted,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: palette.green,
    gap: 2,
    justifyContent: 'center',
  },
  avatarImageWrap: {
    alignItems: 'center',
    backgroundColor: palette.green,
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.white,
    fontWeight: '900',
    letterSpacing: 0,
  },
  iconBubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: palette.green,
    borderRadius: 32,
    justifyContent: 'center',
    minHeight: 64,
    paddingHorizontal: 24,
    shadowColor: palette.greenDark,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ translateY: 2 }],
  },
  buttonText: {
    color: palette.white,
    fontSize: 21,
    fontWeight: '900',
  },
  row: {
    alignItems: 'center',
    borderBottomColor: palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLabelWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  rowLabel: {
    color: palette.muted,
    fontSize: 17,
  },
  rowValue: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  fieldWrap: {
    gap: 12,
  },
  fieldLabel: {
    color: palette.darkGreen,
    fontSize: 19,
    fontWeight: '900',
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: '#EDF9F4',
    borderColor: palette.line,
    borderRadius: 30,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 16,
    minHeight: 68,
    paddingHorizontal: 22,
  },
  input: {
    color: palette.darkGreen,
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  brandIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.greenDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  authBrand: {
    color: palette.green,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
