import { useParams, useNavigate } from "react-router-dom";
import { mockPets } from "../data/mockData";
import {
  Dog,
  Syringe,
  Info,
  ArrowLeft,
  TriangleAlert,
  Phone,
} from "lucide-react";
import styles from "./PetProfilePage.module.css";

function PetProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const pet = mockPets.find((p) => String(p.id) === String(id));

  if (!pet) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1>Pet not found</h1>
          <p>No matching pet for id: {id}</p>
          <button className={styles.backButton} onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Fallback values in case these fields are not yet in mock data
  const medicalAlerts =
    pet.medicalAlerts && pet.medicalAlerts.length > 0
      ? pet.medicalAlerts
      : pet.specialInstructions
        ? [pet.specialInstructions]
        : ["No medical alerts recorded."];

  const emergencyContact = pet.emergencyContact || {
    name: "Seonhwa Oh",
    relationship: "Owner",
    phoneNumber: "07000 000000",
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
          Back
        </button>

        <div className={styles.header}>
          <div className={styles.imageWrapper}>
            {pet.profileImageUrl ? (
              <img
                src={pet.profileImageUrl}
                alt={pet.name}
                className={styles.petImage}
              />
            ) : (
              <div className={styles.placeholder}>
                <Dog size={60} />
              </div>
            )}
          </div>

          <div className={styles.headerText}>
            <h1>{pet.name}</h1>
            <p className={styles.subtitle}>
              {pet.breed} • {pet.age} years old
            </p>
            <span className={styles.weightBadge}>{pet.weight} lbs</span>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoBox}>
            <h3>Basic Info</h3>
            <p><strong>Name:</strong> {pet.name}</p>
            <p><strong>Breed:</strong> {pet.breed}</p>
            <p><strong>Age:</strong> {pet.age}</p>
            <p><strong>Weight:</strong> {pet.weight} lbs</p>
          </div>

          <div className={styles.infoBox}>
            <h3><Syringe size={18} /> Primary Vet</h3>
            <p><strong>Name:</strong> {pet.primaryVet?.name || "N/A"}</p>
            <p><strong>Clinic:</strong> {pet.primaryVet?.clinicName || "N/A"}</p>
            <p><strong>Phone:</strong> {pet.primaryVet?.phoneNumber || "N/A"}</p>
          </div>

          <div className={styles.infoBox}>
            <h3><TriangleAlert size={18} /> Medical Alerts</h3>
            <ul className={styles.alertList}>
              {medicalAlerts.map((alert, index) => (
                <li key={index} className={styles.alertItem}>
                  {alert}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.infoBox}>
            <h3><Phone size={18} /> Emergency Contact</h3>
            <p><strong>Name:</strong> {emergencyContact.name}</p>
            <p><strong>Relationship:</strong> {emergencyContact.relationship}</p>
            <p><strong>Phone:</strong> {emergencyContact.phoneNumber}</p>
          </div>

          <div className={styles.infoBoxFull}>
            <h3><Info size={18} /> Special Notes</h3>
            <p>{pet.specialInstructions || "No special notes available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetProfilePage;