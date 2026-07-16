import Ionicons from "@expo/vector-icons/Ionicons";

export type UserRole = "admin" | "veterinarian" | "staff" | "pet_owner";
export type UserStatus = "active" | "inactive" | "transferred";
export type PetStatus = "active" | "deceased" | "transferred" | "inactive";
export type AppointmentType =
  | "consultation"
  | "follow_up"
  | "vaccination"
  | "grooming"
  | "surgery";
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";
export type NotificationType =
  | "appointment"
  | "vaccination"
  | "stock_alert"
  | "lab_result"
  | "new_booking";
export type NotificationChannel = "web" | "push" | "both";
export type LabStatus = "pending" | "processing" | "completed" | "cancelled";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  contact_number: string;
  address: string;
  status: UserStatus;
};

export type Pet = {
  id: number;
  owner_id: number;
  name: string;
  species: string;
  breed: string | null;
  sex: "male" | "female";
  birthdate: string | null;
  color: string | null;
  weight: number | null;
  photo_path: string | null;
  status: PetStatus;
};

export type Appointment = {
  id: number;
  pet_id: number;
  owner_id: number;
  veterinarian_id: number;
  staff_id: number | null;
  appointment_date: string;
  appointment_time: string;
  type: AppointmentType;
  reason: string | null;
  status: AppointmentStatus;
  notes: string | null;
  updated_at: string;
};

export type MedicalRecord = {
  id: number;
  pet_id: number;
  veterinarian_id: number;
  appointment_id: number | null;
  diagnosis: string;
  treatment_notes: string | null;
  visit_date: string;
  follow_up_date: string | null;
  weight_at_visit: number | null;
};

export type Vaccination = {
  id: number;
  pet_id: number;
  veterinarian_id: number;
  vaccine_name: string;
  date_administered: string;
  next_due_date: string | null;
  notes: string | null;
};

export type Prescription = {
  id: number;
  medical_record_id: number;
  veterinarian_id: number;
  date_prescribed: string;
  notes: string | null;
};

export type Medicine = {
  id: number;
  name: string;
  category: string | null;
  unit: string;
  description: string | null;
  reorder_level: number;
  requires_prescription: boolean;
  status: "active" | "discontinued";
};

export type PrescriptionItem = {
  id: number;
  prescription_id: number;
  medicine_id: number;
  dosage: string;
  quantity: number;
  instructions: string | null;
};

export type LabTest = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
};

export type LabRequest = {
  id: number;
  pet_id: number;
  veterinarian_id: number;
  appointment_id: number | null;
  lab_test_id: number;
  request_date: string;
  status: LabStatus;
};

export type LabResult = {
  id: number;
  lab_request_id: number;
  result_details: string | null;
  file_attachment: string | null;
  date_released: string | null;
  released_by: number | null;
};

export type AppNotification = {
  id: number;
  user_id: number;
  type: NotificationType;
  channel: NotificationChannel;
  message: string;
  read_at: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
};

export const palette = {
  // Primary teal/cyan palette - gradient theme
  green: "#0EA5B7", // Primary teal (replaces old green)
  greenDark: "#00A8B5", // Accent teal (replaces darkGreen)
  darkGreen: "#1E2A38", // Secondary dark panel (replaces old darkGreen)

  // Light teal palette - for secondary buttons/subtle backgrounds
  mint: "#E0F7FA",
  mintStrong: "#B2EBF2",
  paleMint: "#F0F9FB",

  // Text colors - updated for proper contrast
  muted: "#4A4A4A", // Secondary/body text
  ink: "#1A1A1A", // Primary text (near-black)

  // Border/divider
  line: "#D0E8EB", // Adjusted for teal theme

  // Accent colors - keep for variety
  yellow: "#F59E0B",
  yellowPale: "#FEF3C7",
  blue: "#3B82F6",
  bluePale: "#DBEAFE",
  red: "#EF4444",
  redPale: "#FEE2E2",
  purple: "#8B5CF6",

  // Neutral
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
};

// Typography system - mobile-appropriate sizes
export const typography = {
  // Headers - Bold (max 18px for mobile)
  headerLarge: {
    fontSize: 18,
    fontWeight: "700" as const,
    lineHeight: 24,
  },
  headerMedium: {
    fontSize: 18,
    fontWeight: "700" as const,
    lineHeight: 24,
  },
  headerSmall: {
    fontSize: 16,
    fontWeight: "700" as const,
    lineHeight: 22,
  },

  // Section Titles - SemiBold
  titleLarge: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 22,
  },
  titleMedium: {
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 20,
  },

  // Body - Regular (14px for mobile)
  bodyLarge: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 18,
  },

  // Labels - Medium (12px for mobile)
  labelLarge: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 18,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 18,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: "500" as const,
    lineHeight: 16,
  },
};

// Spacing system - 8pt grid
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius - consistent
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

// Shadow - subtle elevation
export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const currentUser: User = {
  id: 1,
  name: "Maria Santos",
  email: "you@email.com",
  role: "pet_owner",
  contact_number: "+63 917 123 4567",
  address: "Tubigon, Bohol",
  status: "active",
};

export const vets: User[] = [
  {
    id: 2,
    name: "Dr. R. Villanueva",
    email: "rvillanueva@refugio.vet",
    role: "veterinarian",
    contact_number: "+63 917 222 0101",
    address: "Refugio Veterinary Clinic",
    status: "active",
  },
  {
    id: 3,
    name: "Dr. Santos",
    email: "santos@refugio.vet",
    role: "veterinarian",
    contact_number: "+63 917 222 0102",
    address: "Refugio Veterinary Clinic",
    status: "active",
  },
];

export const pets: Pet[] = [
  {
    id: 1,
    owner_id: currentUser.id,
    name: "Bantay",
    species: "Dog",
    breed: "Aspin Mix",
    sex: "male",
    birthdate: "2023-03-05",
    color: "Brown / White",
    weight: 12.4,
    photo_path: null,
    status: "active",
  },
  {
    id: 2,
    owner_id: currentUser.id,
    name: "Mimi",
    species: "Cat",
    breed: "Domestic Shorthair",
    sex: "female",
    birthdate: "2024-04-09",
    color: "Calico",
    weight: 4.2,
    photo_path: null,
    status: "active",
  },
];

export const appointments: Appointment[] = [
  {
    id: 101,
    pet_id: 1,
    owner_id: currentUser.id,
    veterinarian_id: 2,
    staff_id: null,
    appointment_date: "2026-07-14",
    appointment_time: "09:00",
    type: "vaccination",
    reason: "Annual rabies booster",
    status: "confirmed",
    notes: null,
    updated_at: "2026-07-01T09:30:00Z",
  },
  {
    id: 102,
    pet_id: 2,
    owner_id: currentUser.id,
    veterinarian_id: 3,
    staff_id: null,
    appointment_date: "2026-07-18",
    appointment_time: "14:00",
    type: "consultation",
    reason: "Annual wellness check",
    status: "confirmed",
    notes: null,
    updated_at: "2026-07-02T10:00:00Z",
  },
  {
    id: 103,
    pet_id: 1,
    owner_id: currentUser.id,
    veterinarian_id: 2,
    staff_id: null,
    appointment_date: "2026-07-22",
    appointment_time: "10:30",
    type: "follow_up",
    reason: "Deworming follow-up",
    status: "pending",
    notes: null,
    updated_at: "2026-07-08T08:30:00Z",
  },
  {
    id: 104,
    pet_id: 1,
    owner_id: currentUser.id,
    veterinarian_id: 2,
    staff_id: 4,
    appointment_date: "2026-04-12",
    appointment_time: "09:30",
    type: "vaccination",
    reason: "DHPP booster",
    status: "completed",
    notes: null,
    updated_at: "2026-04-12T03:00:00Z",
  },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: 201,
    pet_id: 1,
    veterinarian_id: 2,
    appointment_id: 101,
    diagnosis: "Healthy; rabies booster administered.",
    treatment_notes:
      "Monitor injection site and continue annual booster schedule.",
    visit_date: "2026-07-14",
    follow_up_date: "2027-07-14",
    weight_at_visit: 12.4,
  },
  {
    id: 202,
    pet_id: 2,
    veterinarian_id: 3,
    appointment_id: 102,
    diagnosis: "Healthy wellness exam.",
    treatment_notes: "Continue balanced diet and hydration.",
    visit_date: "2026-07-18",
    follow_up_date: "2027-01-18",
    weight_at_visit: 4.1,
  },
];

export const vaccinations: Vaccination[] = [
  {
    id: 301,
    pet_id: 1,
    veterinarian_id: 2,
    vaccine_name: "Rabies Booster",
    date_administered: "2026-07-14",
    next_due_date: "2027-07-14",
    notes: "Annual booster.",
  },
  {
    id: 302,
    pet_id: 1,
    veterinarian_id: 2,
    vaccine_name: "DHPP",
    date_administered: "2026-01-10",
    next_due_date: "2027-01-10",
    notes: null,
  },
  {
    id: 303,
    pet_id: 2,
    veterinarian_id: 3,
    vaccine_name: "FVRCP",
    date_administered: "2026-05-04",
    next_due_date: "2027-05-04",
    notes: null,
  },
];

export const medicines: Medicine[] = [
  {
    id: 401,
    name: "Multivitamin syrup",
    category: "Vitamin",
    unit: "mL",
    description: "Daily supplement",
    reorder_level: 5,
    requires_prescription: false,
    status: "active",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: 501,
    medical_record_id: 201,
    veterinarian_id: 2,
    date_prescribed: "2026-07-14",
    notes: "Give after meals.",
  },
];

export const prescriptionItems: PrescriptionItem[] = [
  {
    id: 601,
    prescription_id: 501,
    medicine_id: 401,
    dosage: "5 mL once daily",
    quantity: 1,
    instructions: "Give after meals for 7 days.",
  },
];

export const labTests: LabTest[] = [
  {
    id: 701,
    name: "CBC - Complete Blood Count",
    description: "Routine blood screening",
    price: 450,
  },
  {
    id: 702,
    name: "Fecalysis",
    description: "Stool sample analysis",
    price: 250,
  },
];

export const labRequests: LabRequest[] = [
  {
    id: 801,
    pet_id: 1,
    veterinarian_id: 2,
    appointment_id: 101,
    lab_test_id: 701,
    request_date: "2026-07-10",
    status: "completed",
  },
  {
    id: 802,
    pet_id: 2,
    veterinarian_id: 3,
    appointment_id: 102,
    lab_test_id: 702,
    request_date: "2026-07-18",
    status: "processing",
  },
];

export const labResults: LabResult[] = [
  {
    id: 901,
    lab_request_id: 801,
    result_details: "Within normal range.",
    file_attachment: "lab-results/bantay-cbc.pdf",
    date_released: "2026-07-10",
    released_by: 3,
  },
];

export const notifications: AppNotification[] = [
  {
    id: 1001,
    user_id: currentUser.id,
    type: "vaccination",
    channel: "both",
    message: "Bantay's deworming is due this week.",
    read_at: null,
    scheduled_at: "2026-07-14T08:00:00Z",
    sent_at: "2026-07-14T08:00:00Z",
    created_at: "2026-07-14T08:00:00Z",
  },
  {
    id: 1002,
    user_id: currentUser.id,
    type: "appointment",
    channel: "push",
    message: "Your appointment for Mimi is confirmed for Jul 18 at 2:00 PM.",
    read_at: "2026-07-02T10:30:00Z",
    scheduled_at: null,
    sent_at: "2026-07-02T10:00:00Z",
    created_at: "2026-07-02T10:00:00Z",
  },
  {
    id: 1003,
    user_id: currentUser.id,
    type: "lab_result",
    channel: "both",
    message: "Bantay's CBC result is ready to view.",
    read_at: null,
    scheduled_at: null,
    sent_at: "2026-07-10T15:15:00Z",
    created_at: "2026-07-10T15:15:00Z",
  },
];

export const serviceOptions: {
  type: AppointmentType;
  label: string;
  icon: string;
  color: string;
  backgroundColor: string;
}[] = [
  {
    type: "consultation",
    label: "Consultation",
    icon: "medkit-outline",
    color: palette.muted,
    backgroundColor: palette.mint,
  },
  {
    type: "follow_up",
    label: "Follow-up",
    icon: "calendar-outline",
    color: palette.muted,
    backgroundColor: palette.mint,
  },
  {
    type: "vaccination",
    label: "Vaccination",
    icon: "eyedrop-outline",
    color: palette.green,
    backgroundColor: palette.mintStrong,
  },
  {
    type: "grooming",
    label: "Grooming",
    icon: "cut-outline",
    color: palette.muted,
    backgroundColor: palette.mint,
  },
  {
    type: "surgery",
    label: "Surgery",
    icon: "pulse-outline",
    color: palette.muted,
    backgroundColor: palette.mint,
  },
];

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));

export const formatShortDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));

export const formatTime = (time: string) => {
  const [hourValue, minuteValue] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hourValue, minuteValue, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const getAge = (birthdate: string | null) => {
  if (!birthdate) return "Unknown";

  const birth = new Date(`${birthdate}T00:00:00`);
  const now = new Date("2026-07-14T00:00:00");
  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }

  return `${Math.max(age, 0)} yrs`;
};

export const findPet = (petId: number) => pets.find((pet) => pet.id === petId);
export const findVet = (vetId: number) => vets.find((vet) => vet.id === vetId);
export const findMedicalRecord = (recordId: number) =>
  medicalRecords.find((record) => record.id === recordId);
export const findMedicine = (medicineId: number) =>
  medicines.find((medicine) => medicine.id === medicineId);
export const findLabTest = (testId: number) =>
  labTests.find((test) => test.id === testId);
export const findLabResult = (requestId: number) =>
  labResults.find((result) => result.lab_request_id === requestId);

export const getServiceLabel = (type: AppointmentType) =>
  serviceOptions.find((service) => service.type === type)?.label ?? type;

export const getPetPrescriptions = (petId: number) => {
  const recordIds = medicalRecords
    .filter((record) => record.pet_id === petId)
    .map((record) => record.id);
  return prescriptions.filter((prescription) =>
    recordIds.includes(prescription.medical_record_id),
  );
};

export const getPrescriptionItems = (prescriptionId: number) =>
  prescriptionItems.filter((item) => item.prescription_id === prescriptionId);

export const getPetLabRequests = (petId: number) =>
  labRequests.filter((request) => request.pet_id === petId);

// Utility functions for UI display and formatting
export const capitalize = (value: string): string =>
  value[0].toUpperCase() + value.slice(1);

export const getStepTitle = (step: number): string => {
  if (step === 1) return "Which pet?";
  if (step === 2) return "What service?";
  if (step === 3) return "Pick a date & time";
  return "Review & confirm";
};

export const getNotificationIcon = (
  type: string,
): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case "appointment":
      return "calendar-outline";
    case "vaccination":
      return "eyedrop-outline";
    case "lab_result":
      return "flask-outline";
    case "new_booking":
      return "checkmark-circle-outline";
    default:
      return "notifications-outline";
  }
};
