import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, PetAvatar, Pill, Screen, ShadowButton, Title } from '@/components/refugio-ui';
import { getAge, palette, pets } from '@/constants/refugio';

export default function PetsScreen() {
  return (
    <Screen variant="green" style={styles.screen}>
      <View style={styles.header}>
        <Title>My Pets</Title>
        <ShadowButton style={styles.addButton}>
          <Ionicons name="add" color={palette.white} size={24} />
          <Text style={styles.addText}>Add Pet</Text>
        </ShadowButton>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {pets.map((pet) => (
          <Link key={pet.id} href={{ pathname: '/pet/[id]', params: { id: pet.id } } as never} asChild>
            <Pressable>
              <Card style={styles.petCard}>
                <PetAvatar pet={pet} size={86} />
                <View style={styles.petInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Pill>{pet.status}</Pill>
                  </View>
                  <Text style={styles.petMeta}>
                    {pet.breed} · {pet.species}
                  </Text>
                  <Text style={styles.petMeta}>
                    {pet.sex === 'male' ? '♂' : '♀'} {pet.sex[0].toUpperCase() + pet.sex.slice(1)}   🎂 {getAge(pet.birthdate)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" color={palette.muted} size={30} />
              </Card>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  addButton: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 54,
    paddingHorizontal: 20,
  },
  addText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '900',
  },
  list: {
    gap: 18,
    paddingBottom: 32,
  },
  petCard: {
    alignItems: 'center',
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
    fontSize: 27,
    fontWeight: '900',
  },
  petMeta: {
    color: palette.muted,
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
