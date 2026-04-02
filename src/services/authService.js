import { PetOwner } from '../classes/PetOwner';
import { PetCaregiver } from '../classes/PetCaregiver';

/**
 * Mock Auth Service — simulates async API requests & backend functionality.
 * Uses arrow functions to avoid 'this' binding issues inside setTimeout.
 */
const DELAY = 800;

// Standalone hash function (no 'this' binding needed)
function hashPasswordLocally(plaintext) {
  return btoa(plaintext + '_fakeSalt123');
}

export const authService = {

  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const userObj = localStorage.getItem('petminder_users');
          if (!userObj) {
            return reject(new Error('No accounts found. Please register first.'));
          }

          const db = JSON.parse(userObj);
          const user = db[email];

          if (!user) {
            return reject(new Error('Invalid email or password.'));
          }

          const hashedAttempt = hashPasswordLocally(password);
          if (user.password !== hashedAttempt) {
            return reject(new Error('Invalid email or password.'));
          }

          resolve(user);
        } catch (err) {
          reject(new Error('Something went wrong during login.'));
        }
      }, DELAY);
    });
  },

  async register(formData, role) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const dbString = localStorage.getItem('petminder_users');
          const db = dbString ? JSON.parse(dbString) : {};

          if (db[formData.email]) {
            return reject(new Error('An account with this email already exists.'));
          }

          let newUser;
          const securedPassword = hashPasswordLocally(formData.password);

          if (role === 'PetOwner') {
            newUser = new PetOwner(
              formData.firstName,
              formData.lastName,
              formData.email,
              securedPassword,
              formData.address
            );
          } else {
            newUser = new PetCaregiver(
              formData.firstName,
              formData.lastName,
              formData.email,
              securedPassword,
              Number(formData.hourlyRate) || 0,
              formData.bio
            );
          }

          db[newUser.email] = newUser;
          localStorage.setItem('petminder_users', JSON.stringify(db));

          resolve(newUser);
        } catch (err) {
          reject(new Error('Failed to register user. Try again.'));
        }
      }, DELAY);
    });
  },

  async resetPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const dbString = localStorage.getItem('petminder_users');
          const db = dbString ? JSON.parse(dbString) : {};

          if (!db[email]) {
            return reject(new Error('No account found with this email address.'));
          }

          // Simulate sending a reset email
          resolve({ message: `Password reset link sent to ${email}` });
        } catch (err) {
          reject(new Error('Failed to send reset email. Try again.'));
        }
      }, DELAY);
    });
  },

  async updateProfile(email, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const dbString = localStorage.getItem('petminder_users');
          const db = dbString ? JSON.parse(dbString) : {};

          if (!db[email]) {
            return reject(new Error('User not found.'));
          }

          // Merge updates into existing user data
          const updatedUser = { ...db[email], ...updates };
          db[email] = updatedUser;
          localStorage.setItem('petminder_users', JSON.stringify(db));

          resolve(updatedUser);
        } catch (err) {
          reject(new Error('Failed to update profile. Try again.'));
        }
      }, DELAY);
    });
  }
};
