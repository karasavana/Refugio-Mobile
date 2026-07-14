export type UserRole = 'admin' | 'veterinarian' | 'staff' | 'pet_owner';
export type UserStatus = 'active' | 'inactive' | 'transferred';
export type PetStatus = 'active' | 'deceased' | 'transferred' | 'inactive';
export type AppointmentType = 'consultation' | 'follow_up' | 'vaccination' | 'grooming' | 'surgery';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type NotificationType = 'appointment' | 'vaccination' | 'stock_alert' | 'lab_result' | 'new_booking';
export type NotificationChannel = 'web' | 'push' | 'both';

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
  breed: string;
  sex: 'male' | 'female';
  birthdate: string;
  color: string;
  weight: number;
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
  pet_id: number;
  medical_record_id: number;
  veterinarian_id: number;
  date_prescribed: string;
  medicine: string;
  dosage: string;
  quantity: number;
  instructions: string;
};

export type LabResult = {
  id: number;
  pet_id: number;
  lab_request_id: number;
  test_name: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  result_details: string | null;
  file_attachment: string | null;
  date_released: string | null;
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
  green: '#18C978',
  darkGreen: '#0B3428',
  shadowGreen: '#0B9860',
  mint: '#D7F8E9',
  paleMint: '#F1FBF6',
  muted: '#6F9183',
  line: '#CDEDDD',
  yellow: '#FFC83D',
  blue: '#27ACE0',
  red: '#FF5964',
  purple: '#A981F7',
  white: '#FFFFFF',
};

export const currentUser: User = {
  id: 1,
  name: 'Juan dela Cruz',
  email: 'you@email.com',
  role: 'pet_owner',
  contact_number: '+63 917 123 4567',
  address: 'Tubigon, Bohol',
  status: 'active',
};

export const vets: User[] = [
  {
    id: 2,
    name: 'Dr. R. Villanueva',
    email: 'rvillanueva@refugio.vet',
    role: 'veterinarian',
    contact_number: '+63 917 222 0101',
    address: 'Refugio Animal Clinic',
    status: 'active',
  },
  {
    id: 3,
    name: 'Dr. Santos',
    email: 'santos@refugio.vet',
    role: 'veterinarian',
    contact_number: '+63 917 222 0102',
    address: 'Refugio Animal Clinic',
    status: 'active',
  },
];

export const pets: Pet[] = [
  {
    id: 1,
    owner_id: currentUser.id,
    name: 'Bantay',
    species: 'Dog',
    breed: 'Aspin',
    sex: 'male',
    birthdate: '2023-03-15',
    color: 'Brown & White',
    weight: 12.5,
    photo_path: null,
    status: 'active',
  },
  {
    id: 2,
    owner_id: currentUser.id,
    name: 'Mimi',
    species: 'Cat',
    breed: 'Puspin',
    sex: 'female',
    birthdate: '2024-04-09',
    color: 'Calico',
    weight: 4.2,
    photo_path: null,
    status: 'active',
  },
];

export const appointments: Appointment[] = [
  {
    id: 101,
    pet_id: 1,
    owner_id: currentUser.id,
    veterinarian_id: 2,
    staff_id: null,
    appointment_date: '2026-07-10',
    appointment_time: '09:00',
    type: 'vaccination',
    reason: 'Annual rabies booster',
    status: 'confirmed',
    notes: null,
    updated_at: '2026-07-01T09:30:00Z',
  },
  {
    id: 102,
    pet_id: 2,
    owner_id: currentUser.id,
    veterinarian_id: 3,
    staff_id: null,
    appointment_date: '2026-07-14',
    appointment_time: '14:00',
    type: 'consultation',
    reason: 'Annual wellness check',
    status: 'confirmed',
    notes: null,
    updated_at: '2026-07-02T10:00:00Z',
  },
  {
    id: 103,
    pet_id: 1,
    owner_id: currentUser.id,
    veterinarian_id: 2,
    staff_id: null,
    appointment_date: '2026-07-22',
    appointment_time: '10:30',
    type: 'follow_up',
    reason: 'Deworming follow-up',
    status: 'pending',
    notes: null,
    updated_at: '2026-07-08T08:30:00Z',
  },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: 201,
    pet_id: 1,
    veterinarian_id: 2,
    appointment_id: 101,
    diagnosis: 'Healthy; rabies booster administered.',
    treatment_notes: 'Monitor injection site. Keep regular annual booster schedule.',
    visit_date: '2026-07-10',
    follow_up_date: '2027-07-10',
    weight_at_visit: 12.4,
  },
  {
    id: 202,
    pet_id: 2,
    veterinarian_id: 3,
    appointment_id: 102,
    diagnosis: 'Healthy wellness exam.',
    treatment_notes: 'Continue balanced diet and hydration.',
    visit_date: '2026-07-14',
    follow_up_date: '2027-01-14',
    weight_at_visit: 4.1,
  },
];

export const vaccinations: Vaccination[] = [
  {
    id: 301,
    pet_id: 1,
    veterinarian_id: 2,
    vaccine_name: 'Rabies Booster',
    date_administered: '2026-07-10',
    next_due_date: '2027-07-10',
    notes: 'Annual booster.',
  },
  {
    id: 302,
    pet_id: 1,
    veterinarian_id: 2,
    vaccine_name: '5-in-1 DHPP',
    date_administered: '2026-04-12',
    next_due_date: '2027-04-12',
    notes: null,
  },
  {
    id: 303,
    pet_id: 2,
    veterinarian_id: 3,
    vaccine_name: 'FVRCP',
    date_administered: '2026-05-04',
    next_due_date: '2027-05-04',
    notes: null,
  },
];

export const prescriptions: Prescription[] = [
  {
    id: 401,
    pet_id: 1,
    medical_record_id: 201,
    veterinarian_id: 2,
    date_prescribed: '2026-07-10',
    medicine: 'Multivitamin syrup',
    dosage: '5 mL once daily',
    quantity: 1,
    instructions: 'Give after meals for 7 days.',
  },
];

export const labResults: LabResult[] = [
  {
    id: 501,
    pet_id: 1,
    lab_request_id: 601,
    test_name: 'CBC',
    status: 'completed',
    result_details: 'Within normal range.',
    file_attachment: 'lab-results/bantay-cbc.pdf',
    date_released: '2026-06-21',
  },
  {
    id: 502,
    pet_id: 2,
    lab_request_id: 602,
    test_name: 'Fecalysis',
    status: 'processing',
    result_details: null,
    file_attachment: null,
    date_released: null,
  },
];

export const notifications: AppNotification[] = [
  {
    id: 701,
    user_id: currentUser.id,
    type: 'vaccination',
    channel: 'both',
    message: "Bantay's Rabies Booster is due in 2 weeks.",
    read_at: null,
    scheduled_at: '2026-06-26T08:00:00Z',
    sent_at: '2026-06-26T08:00:00Z',
    created_at: '2026-06-26T08:00:00Z',
  },
  {
    id: 702,
    user_id: currentUser.id,
    type: 'appointment',
    channel: 'push',
    message: 'Your appointment for Mimi is confirmed for Jul 14 at 2:00 PM.',
    read_at: '2026-07-02T10:30:00Z',
    scheduled_at: null,
    sent_at: '2026-07-02T10:00:00Z',
    created_at: '2026-07-02T10:00:00Z',
  },
  {
    id: 703,
    user_id: currentUser.id,
    type: 'lab_result',
    channel: 'both',
    message: "Bantay's CBC result is ready to view.",
    read_at: null,
    scheduled_at: null,
    sent_at: '2026-06-21T15:15:00Z',
    created_at: '2026-06-21T15:15:00Z',
  },
];

export const serviceOptions: {
  type: AppointmentType;
  label: string;
  icon: string;
  color: string;
}[] = [
  { type: 'consultation', label: 'Consultation', icon: 'medical', color: palette.green },
  { type: 'follow_up', label: 'Follow-up', icon: 'calendar', color: palette.blue },
  { type: 'vaccination', label: 'Vaccination', icon: 'eyedrop', color: palette.yellow },
  { type: 'grooming', label: 'Grooming', icon: 'cut', color: palette.purple },
  { type: 'surgery', label: 'Surgery', icon: 'pulse', color: palette.red },
];

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00`));

export const formatShortDate = (isoDate: string) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00`));

export const formatTime = (time: string) => {
  const [hourValue, minuteValue] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hourValue, minuteValue, 0, 0);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const getAge = (birthdate: string) => {
  const birth = new Date(`${birthdate}T00:00:00`);
  const now = new Date('2026-07-14T00:00:00');
  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }

  return `${Math.max(age, 0)} yrs`;
};

export const findPet = (petId: number) => pets.find((pet) => pet.id === petId);
export const findVet = (vetId: number) => vets.find((vet) => vet.id === vetId);

export const getServiceLabel = (type: AppointmentType) =>
  serviceOptions.find((service) => service.type === type)?.label ?? type;
