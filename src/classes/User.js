export class User {
  constructor(firstName, lastName, email, password, role) {
    this.id = crypto.randomUUID();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password; // In a real app, this would be hashed
    this.role = role;
    this.createdAt = new Date().toISOString();
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getProfileInfo() {
    return {
      name: this.getFullName(),
      email: this.email,
      role: this.role,
      joined: this.createdAt
    };
  }
}
