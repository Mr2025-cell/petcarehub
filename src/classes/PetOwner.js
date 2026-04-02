import { User } from './User';

export class PetOwner extends User {
  constructor(firstName, lastName, email, password, address = '') {
    super(firstName, lastName, email, password, 'PetOwner');
    this.address = address;
    this.pets = [];
    this.emergencyContacts = [];
  }

  addPet(petId) {
    if (!this.pets.includes(petId)) {
      this.pets.push(petId);
    }
  }

  addEmergencyContact(name, phone) {
    this.emergencyContacts.push({ name, phone });
  }

  getProfileInfo() {
    return {
      ...super.getProfileInfo(),
      address: this.address,
      petsCount: this.pets.length
    };
  }
}
