import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, PetAvatar, Pill, Screen, ShadowButton } from '@/components/refugio-ui';
import { getAge, palette, pets } from '@/constants/refugio';

export default function PetsScreen() {
  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pets</Text>
        <ShadowButton
          style={styles.addButton}
          onPress={() => Alert.alert('Add Pet', 'Pet registration will save to the pets table once the API is connected.')}>
          <Ionicons name="add" color={palette.white} size={26} />
          <Text style={styles.addText}>Add Pet</Text>
        </ShadowButton>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {pets.map((pet) => (
          <Link key={pet.id} href={{ pathname: '/pet/[id]', params: { id: pet.id } }} asChild>
            <Pressable>
              <Card style={styles.petCard}>
                <PetAvatar pet={pet} size={94} />
                <View style={styles.petInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Pill>{capitalize(pet.status)}</Pill>
                  </View>
                  <Text style={styles.petBreed}>{pet.breed ?? pet.species}</Text>
                  <View style={styles.metaRow}>
                    <Meta icon={pet.sex === 'male' ? 'male' : 'female'} label={capitalize(pet.sex)} />
                    <Meta icon="calendar-outline" label={getAge(pet.birthdate)} />
                    <Meta icon="paw-outline" label={pet.species} />
                  </View>
                </View>
                <Ionicons name="chevron-forward" color={palette.muted} size={30} />
              </Card>
            </Pressable>
          </Link>
        ))}

        <Pressable
          style={styles.emptyAdd}
          onPress={() => Alert.alert('Add Pet', 'This will open the pet registration form when the backend is available.')}>
          <View style={styles.emptyIcon}>
            <Ionicons name="add" color={palette.muted} size={42} />
          </View>
          <Text style={styles.emptyCopy}>Add another pet to track their care too</Text>
          <Text style={styles.emptyButton}>Add Pet</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function Meta({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} color={palette.muted} size={18} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    color: palette.darkGreen,
    fontSize: 36,
    fontWeight: '900',
  },
  addButton: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 58,
    paddingHorizontal: 20,
  },
  addText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '900',
  },
  list: {
    gap: 22,
    paddingBottom: 116,
  },
  petCard: {
    alignItems: 'center',
    borderRadius: 32,
    flexDirection: 'row',
    gap: 18,
    padding: 22,
  },
  petInfo: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  petName: {
    color: palette.darkGreen,
    fontSize: 29,
    fontWeight: '900',
  },
  petBreed: {
    color: palette.muted,
    fontSize: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaText: {
    color: palette.muted,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyAdd: {
    alignItems: 'center',
    borderColor: palette.line,
    borderRadius: 30,
    borderStyle: 'dashed',
    borderWidth: 2,
    gap: 18,
    minHeight: 260,
    justifyContent: 'center',
    padding: 26,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: palette.mint,
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  emptyCopy: {
    color: palette.muted,
    fontSize: 19,
    lineHeight: 28,
    textAlign: 'center',
  },
  emptyButton: {
    borderColor: palette.green,
    borderRadius: 22,
    borderWidth: 2,
    color: palette.green,
    fontSize: 18,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
});
