import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import {
    Alert,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    Card,
    PetAvatar,
    Pill,
    Screen,
    ShadowButton,
} from "@/components/refugio-ui";
import {
    borderRadius,
    capitalize,
    getAge,
    palette,
    pets,
    spacing,
    typography,
} from "@/constants/refugio";

export default function PetsScreen() {
  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pets</Text>
        <ShadowButton
          style={styles.addButton}
          onPress={() =>
            Alert.alert(
              "Add Pet",
              "Pet registration will save to the pets table once the API is connected.",
            )
          }
          accessibilityLabel="Add new pet"
          accessibilityRole="button"
        >
          <Ionicons name="add" color={palette.white} size={26} />
          <Text style={styles.addText}>Add Pet</Text>
        </ShadowButton>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {pets.map((pet) => (
          <Link
            key={pet.id}
            href={{ pathname: "/pet/[id]", params: { id: pet.id } }}
            asChild
          >
            <Pressable
              accessibilityLabel={`View ${pet.name}, ${pet.breed ?? pet.species}, ${pet.sex}, ${getAge(pet.birthdate)} old`}
              accessibilityRole="button"
            >
              <Card style={styles.petCard}>
                <PetAvatar pet={pet} size={94} />
                <View style={styles.petInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Pill>{capitalize(pet.status)}</Pill>
                  </View>
                  <Text style={styles.petBreed}>
                    {pet.breed ?? pet.species}
                  </Text>
                  <View style={styles.metaRow}>
                    <Meta
                      icon={pet.sex === "male" ? "male" : "female"}
                      label={capitalize(pet.sex)}
                    />
                    <Meta
                      icon="calendar-outline"
                      label={getAge(pet.birthdate)}
                    />
                    <Meta icon="paw-outline" label={pet.species} />
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  color={palette.muted}
                  size={30}
                />
              </Card>
            </Pressable>
          </Link>
        ))}

        <Pressable
          style={styles.emptyAdd}
          onPress={() =>
            Alert.alert(
              "Add Pet",
              "This will open the pet registration form when the backend is available.",
            )
          }
        >
          <View style={styles.emptyIcon}>
            <Ionicons name="add" color={palette.muted} size={42} />
          </View>
          <Text style={styles.emptyCopy}>
            Add another pet to track their care too
          </Text>
          <Text style={styles.emptyButton}>Add Pet</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function Meta({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} color={palette.muted} size={18} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.sm,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  title: {
    color: palette.darkGreen,
    ...typography.headerLarge,
  },
  addButton: {
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  addText: {
    color: palette.white,
    ...typography.titleLarge,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl + spacing.lg,
  },
  petCard: {
    alignItems: "center",
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    width: Dimensions.get("window").width > 600 ? "48%" : "100%",
  },
  petInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  nameRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  petName: {
    color: palette.darkGreen,
    ...typography.headerSmall,
  },
  petBreed: {
    color: palette.muted,
    ...typography.bodyLarge,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metaItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  metaText: {
    color: palette.muted,
    ...typography.labelMedium,
  },
  emptyAdd: {
    alignItems: "center",
    borderColor: palette.line,
    borderRadius: borderRadius.lg,
    borderStyle: "dashed",
    borderWidth: 1.5,
    gap: spacing.md,
    minHeight: 200,
    justifyContent: "center",
    padding: spacing.lg,
  },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: palette.mint,
    borderRadius: borderRadius.full,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  emptyCopy: {
    color: palette.muted,
    ...typography.bodyLarge,
    lineHeight: 24,
    textAlign: "center",
  },
  emptyButton: {
    borderColor: palette.green,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    color: palette.green,
    ...typography.titleMedium,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
