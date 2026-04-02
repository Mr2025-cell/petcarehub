import { User } from './User';

export class PetCaregiver extends User {
  constructor(firstName, lastName, email, password, hourlyRate = 0, bio = '') {
    super(firstName, lastName, email, password, 'PetCaregiver');
    this.hourlyRate = hourlyRate;
    this.bio = bio;
    this.isVerified = false;
    this.qualifications = [];
    this.averageRating = 0;
  }

  addQualification(docName) {
    this.qualifications.push(docName);
  }

  setVerified(status) {
    this.isVerified = status;
  }

  getProfileInfo() {
    return {
      ...super.getProfileInfo(),
      hourlyRate: this.hourlyRate,
      bio: this.bio,
      verified: this.isVerified
    };
  }
}
