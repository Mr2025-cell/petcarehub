# 🐾 Pet Care Hub

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646cff)
![License](https://img.shields.io/badge/license-MIT-green)

## About The Project

**Pet Care Hub** is an all-in-one mobile-first website application designed for connecting responsible pet owners to reliable pet sitters. Be it for regular dog walking services, cat sitting while you are out of town, or even giving medicine to your pet animal, Pet Care Hub has got you covered.

### The Problem We Solve

Many pet owners face problems with coordinating care among different people, including relatives, friends, or professionals. Information gets mixed in messages, tasks are not executed, and it is impossible to know whether the care was given to your pet or not. Moreover, caregivers do not have instructions and cannot document their work.

### Our Idea

Pet Care Hub will offer:

- **Shared care plans** to ensure all information about care procedures and schedules is known;
- **GPS tracking** of the pet's walks in real time;
- **Evidence photos** that confirm tasks were fulfilled, for example, a walk;
- **Support offline mode** to record data even in case of lacking an Internet connection;
- **Secure booking procedure** to establish a contact between owners and professionals.

---

## Main Characteristics

### For Pet Owners

- Create a pet profile with information regarding health issues or emergencies;
- Develop a customized care plan with recurring tasks;
- Search for professionals and evaluate their reviews;
- Make bookings and track their execution on a map;
- Get notifications and pictures from caregivers in real time.

### For Caregivers

- Specify your availability and hourly fees
- Get booking requests from pet owners
- Access daily checklist with step-by-step instructions
- Begin GPS-enabled sessions (even works offline)
- Complete task with mandatory photo upload for walks
- Establish your professional standing with feedbacks and reviews

### Security Features

- Emergency SOS with alerts sent to emergency contacts
- Display medical alerts while on session
- Session-based GPS sharing that stops once session is over
- Verification of caregiver’s credentials (ID check and background check)
- Secure payments system with tokenization

### Administrator Dashboard

- Approve caregiver credentials
- Control user accounts (suspension/deactivation)
- Resolve review disputes

---

## 🛠️ Built With

- **Frontend:** React 18, Vite, React Router DOM
- **State Management:** Redux, React Redux
- **Styling:** CSS Modules, Lucide React Icons
- **Mapping:** Leaflet, React Leaflet
- **Backend Services:** Firebase (Authentication, Firestore, Realtime Database)
- **Offline Storage:** localforage
- **Language:** JavaScript (ES6+)

---

## Project Structure

pet-care-hub/
├── public/ # Static assets (images, favicon)
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── Button.jsx
│ │ ├── Card.jsx
│ │ ├── Layout.jsx
│ │ ├── Toast.jsx
│ │ ├── OfflineIndicator.jsx
│ │ └── TaskList.jsx
│ ├── pages/ # Full page views
│ │ ├── LoginPage.jsx
│ │ ├── Register.jsx
│ │ ├── OwnerDashboard.jsx
│ │ ├── MinderDashboard.jsx
│ │ ├── PetProfilePage.jsx
│ │ ├── AddPetPage.jsx
│ │ ├── EditPetPage.jsx
│ │ ├── PetsListPage.jsx
│ │ ├── CarePlanEditor.jsx
│ │ ├── SearchCaregiversPage.jsx
│ │ ├── BookingManager.jsx
│ │ ├── BookingsPage.jsx
│ │ ├── ActiveSession.jsx
│ │ ├── TrackCaregiverPage.jsx
│ │ ├── ProfilePage.jsx
│ │ ├── AdminDashboard.jsx
│ │ └── ComingSoonPage.jsx
│ ├── classes/ # OOP domain models
│ │ ├── User.js
│ │ ├── PetOwner.js
│ │ ├── PetCaregiver.js
│ │ ├── Admin.js
│ │ ├── Pet.js
│ │ ├── MedicalAlert.js
│ │ ├── EmergencyContact.js
│ │ ├── CarePlan.js
│ │ ├── CareTask.js
│ │ ├── TaskCompletion.js
│ │ ├── Booking.js
│ │ ├── Availability.js
│ │ ├── Payment.js
│ │ ├── TrackingSession.js
│ │ └── GPSCoordinate.js
│ ├── services/ # API and business logic
│ │ ├── authService.js
│ │ ├── gpsService.js
│ │ ├── marketplaceService.js
│ │ └── firebase.js
│ ├── context/ # React context providers
│ │ └── AuthContext.jsx
│ ├── store/ # Redux store
│ │ └── store.js
│ ├── data/ # Mock data (fallback)
│ │ └── mockData.js
│ ├── utils/ # Helper functions
│ │ └── validation.js
│ ├── App.jsx
│ └── main.jsx
├── acceptance-tests/ # Test documentation
│ └── acceptance-tests.md
├── .gitignore
├── package.json
└── README.md

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mr2025-cell/petcarehub.git
   cd petcarehub
   ```
2. Install dependencies: npm install
3. Set up Firebase (optional - the app works with localStorage for prototyping)

Create a Firebase project at firebase.google.com

Enable Email/Password authentication

Create a Realtime Database or Firestore

Copy your Firebase config to src/services/config.js

4. Start the development server: npm run dev
5. Open the browser to http://localhost:5173

=========================================
Testing the Application:
Role Email Password
Pet Owner owner@example.com Password123!
Pet Caregiver caregiver@example.com Password123!

Pet Owner’s User Path
Sign Up as a Pet Owner → Add Pet → Plan Care for Pet → Find Caregivers → Make an Appointment

Pet Caregiver’s User Path
Sign Up as a Pet Caregiver → Schedule Available Time → Accept Appointment Request → Begin GPS Tracking → Take Pictures While Completing Tasks

Live Location Tracking User Path
Start GPS session by the caregiver and activate location tracking → See caregiver’s current location on the map → End GPS tracking and stop location sharing

Offline Mode User Path
The caregiver loses internet connection while walking the dog → Offline mode is shown in the app → GPS locations are stored on device → Connect to internet automatically.syncs
=========================================
Team Contibution:
Pet Care Hub’s success can be attributed to the hard work of everyone involved in the project. Mr2025-cell was responsible for the project leadership and development of UC5 (Active Care Session) and UC7 (Admin Dashboard). This comprised real-time GPS location tracking with offline capability, owner live location tracking, photo upload after the completion of walking the dog, and full-fledged admin dashboard to manage users and content. He also addressed the bugs such as “Add New Pet” and “Edit Profile,” made the page for the “My Pets” list, and solved the booking issues to make sure everything integrated smoothly.

As a frontend developer, kartikeyapro1 laid down the groundwork of the entire application. This included creating the login and registration forms for authentication, dashboards based on different roles (owners and caregivers), toast notification for user interaction, and a fully responsive navigation bar for both desktop and mobile platforms.

ThanadolKamwongsa emphasized the care planning process as the backend developer, developing the whole care plan generation and management system, which includes the ability to create repetitive activities, schedule tasks with the option to choose specific times of the day, and seamlessly integrate the care plans into the pet profile and the caregiver dashboard.

Ali Tauqir created the marketplace component as the marketplace developer, designing the booking process from scratch, which includes searching for caregivers through filters, managing their availability, creating and canceling bookings, and generating payment stubs to illustrate the monetization process of the platform.

Sunny-1118 helped design the user interface as the UI developer, designing the pet profile viewing page to display all pet details, including medical alerts and emergency contacts.

# This team has successfully delivered an entirely functional pet care marketplace that covers all the required components.

Furtur Enhancements:
Future Improvements
Live chat during appointments between pet owners and caregivers

Credit card transactions through Stripe payments

Notifications for booking confirmation and SOS messages

Discounts on multiple pets and promotional codes

# Analytics for caregivers' income, appointment completion percentage, and repeat clients

Acknowledgements:
React
Vite
Leaflet
Firebase
Lucide Icons
