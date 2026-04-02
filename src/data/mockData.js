export const mockPetOwners = [
  {
    id: 'owner1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    role: 'PetOwner',
    phoneNumber: '555-0101',
    address: '123 Maple Street',
    createdAt: new Date().toISOString()
  }
];

export const mockPetMinders = [
  {
    id: 'minder1',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@example.com',
    role: 'PetMinder',
    phoneNumber: '555-0202',
    bio: 'Experienced dog walker and cat whisperer.',
    hourlyRate: 25.0,
    averageRating: 4.8,
    totalReviews: 12,
    isVerified: true,
    createdAt: new Date().toISOString()
  }
];

export const mockPets = [
  {
    id: 'pet1',
    ownerId: 'owner1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 4,
    weight: 30,
    profileImageUrl: '/mock_dog.png',
    specialInstructions: 'Allergic to chicken. Loves belly rubs.',
    primaryVet: {
      name: 'Dr. Sarah',
      phoneNumber: '555-0999',
      clinicName: 'Downtown Vet Clinic'
    }
  },
  {
    id: 'pet2',
    ownerId: 'owner1',
    name: 'Luna',
    species: 'Cat',
    breed: 'Tabby',
    age: 2,
    weight: 10,
    profileImageUrl: '/mock_cat.png',
    specialInstructions: 'Very curious. Indoor only.',
    primaryVet: {
      name: 'Dr. Sarah',
      phoneNumber: '555-0999',
      clinicName: 'Downtown Vet Clinic'
    }
  }
];

export const mockCarePlans = [
  {
    id: 'plan1',
    petId: 'pet1',
    title: 'Daily Walks',
    description: 'Afternoon walks for Buddy',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    status: 'active'
  }
];

export const mockTasks = [
  {
    id: 'task1',
    carePlanId: 'plan1',
    title: '30 Min Walk',
    description: 'Walk around the local park.',
    isRecurring: true,
    timeOfDay: '14:00'
  }
];
