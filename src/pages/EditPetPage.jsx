import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, Dog, Camera, X } from 'lucide-react';
import styles from './AddPetPage.module.css';

function EditPetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    weight: '',
    specialInstructions: '',
    primaryVet: {
      name: '',
      clinicName: '',
      phoneNumber: ''
    }
  });

  useEffect(() => {
    const savedPets = JSON.parse(localStorage.getItem('userPets') || '[]');
    const pet = savedPets.find(p => String(p.id) === String(id));
    
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || 'Dog',
        breed: pet.breed || '',
        age: pet.age || '',
        weight: pet.weight || '',
        specialInstructions: pet.specialInstructions || '',
        primaryVet: {
          name: pet.primaryVet?.name || '',
          clinicName: pet.primaryVet?.clinicName || '',
          phoneNumber: pet.primaryVet?.phoneNumber || ''
        }
      });
      setPhotoPreview(pet.profileImageUrl || null);
    }
  }, [id]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const savedPets = JSON.parse(localStorage.getItem('userPets') || '[]');
    
    const updatedPets = savedPets.map(pet => 
      String(pet.id) === String(id) 
        ? { 
            ...pet, 
            ...formData,
            age: parseInt(formData.age) || 0,
            weight: parseInt(formData.weight) || 0,
            profileImageUrl: photoPreview || pet.profileImageUrl,
            updatedAt: new Date().toISOString()
          }
        : pet
    );
    
    localStorage.setItem('userPets', JSON.stringify(updatedPets));
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back
        </button>
        
        <div className={styles.header}>
          <Dog size={40} className={styles.headerIcon} />
          <h1>Edit {formData.name || 'Pet'}</h1>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Photo Upload Section */}
          <div className={styles.photoSection}>
            <label className={styles.photoLabel}>Pet Photo</label>
            <div className={styles.photoUploadContainer}>
              {photoPreview ? (
                <div className={styles.photoPreview}>
                  <img src={photoPreview} alt="Pet preview" className={styles.previewImage} />
                  <button type="button" className={styles.removePhotoBtn} onClick={removePhoto}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className={styles.photoPlaceholder}>
                  <Camera size={32} />
                  <span>Upload photo</span>
                </div>
              )}
              <input
                type="file"
                id="petPhoto"
                accept="image/*"
                onChange={handlePhotoUpload}
                className={styles.photoInput}
              />
              <label htmlFor="petPhoto" className={styles.photoUploadBtn}>
                Choose Image
              </label>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Pet Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter pet name"
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Species</label>
              <select name="species" value={formData.species} onChange={handleChange}>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g., Golden Retriever"
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Weight (lbs)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Special Instructions / Medical Notes</label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows="3"
              placeholder="Allergies, medications, behavioral notes..."
            />
          </div>
          
          <h3 className={styles.sectionTitle}>Primary Veterinarian (Optional)</h3>
          
          <div className={styles.formGroup}>
            <label>Vet Name</label>
            <input
              type="text"
              name="primaryVet.name"
              value={formData.primaryVet.name}
              onChange={handleChange}
              placeholder="Dr. Smith"
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Clinic Name</label>
              <input
                type="text"
                name="primaryVet.clinicName"
                value={formData.primaryVet.clinicName}
                onChange={handleChange}
                placeholder="Clinic name"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="primaryVet.phoneNumber"
                value={formData.primaryVet.phoneNumber}
                onChange={handleChange}
                placeholder="555-1234"
              />
            </div>
          </div>
          
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EditPetPage;