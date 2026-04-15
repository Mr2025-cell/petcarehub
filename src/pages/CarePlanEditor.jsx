import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CarePlan } from '../classes/CarePlan';
import { Task as CareTask } from "../classes/CareTask";
import { mockPets } from '../data/mockData';
import { Plus, Trash2, Save, ArrowLeft, CalendarCheck, X, Pencil } from 'lucide-react';
import styles from './CarePlanEditor.module.css';

// predefined plan names for dropdown
const planOptions = [
  'Daily Walks',
  'Medication Schedule',
  'Feeding Routine',
  'Grooming Schedule',
  'Vet Appointments',
  'Training Sessions',
  'Vaccination Schedule',
  'Exercise Plan',
];

// predefined task names for dropdown (user can still type custom)
const taskOptions = [
  'Walk',
  'Feed',
  'Give medicine',
  'Brush teeth',
  'Bath',
  'Grooming',
  'Vet visit',
  'Training session',
  'Play time',
  'Clean litter box',
  'Nail trimming',
  'Weight check',
];

// get care plans from localStorage
function getPlansFromStorage() {
  const data = localStorage.getItem('petminder_careplans');
  return data ? JSON.parse(data) : [];
}

// get tasks from localStorage
function getTasksFromStorage() {
  const data = localStorage.getItem('petminder_tasks');
  return data ? JSON.parse(data) : [];
}

// save care plans to localStorage
function savePlansToStorage(plans) {
  localStorage.setItem('petminder_careplans', JSON.stringify(plans));
}

// save tasks to localStorage
function saveTasksToStorage(tasks) {
  localStorage.setItem('petminder_tasks', JSON.stringify(tasks));
}

export function CarePlanEditor() {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists = edit mode, otherwise = create new
  const [searchParams] = useSearchParams();
  const isEditMode = !!id;

  // care plan form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [petId, setPetId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // tasks in this plan
  const [tasks, setTasks] = useState([]);

  // existing plans for the selected pet
  const [existingPlans, setExistingPlans] = useState([]);

  // modal state for editing existing plan
  const [editModal, setEditModal] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editStatus, setEditStatus] = useState('active');

  // error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // pre-select pet from URL query param (e.g. /care-plans/new?petId=pet1)
  useEffect(() => {
    const petIdFromUrl = searchParams.get('petId');
    if (petIdFromUrl && !isEditMode) {
      setPetId(petIdFromUrl);
    }
  }, [searchParams, isEditMode]);

  // load existing plans for the selected pet
  useEffect(() => {
    if (petId) {
      const allPlans = getPlansFromStorage();
      const petPlans = allPlans.filter(p => p.petId === petId);
      setExistingPlans(petPlans);
    } else {
      setExistingPlans([]);
    }
  }, [petId]);

  // load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const plans = getPlansFromStorage();
      const plan = plans.find(p => p.id === id);
      if (plan) {
        setTitle(plan.title);
        setDescription(plan.description);
        setPetId(plan.petId);
        setStartDate(plan.startDate);
        setEndDate(plan.endDate);

        // load tasks for this plan
        const allTasks = getTasksFromStorage();
        const planTasks = allTasks.filter(t => t.carePlanId === id);
        setTasks(planTasks);
      }
    }
  }, [id, isEditMode]);

  // open edit modal with plan data
  function openEditModal(plan) {
    setEditModal(plan);
    setEditTitle(plan.title);
    setEditDesc(plan.description || '');
    setEditStart(plan.startDate);
    setEditEnd(plan.endDate);
    setEditStatus(plan.status || 'active');
  }

  // save changes from modal
  function handleModalSave() {
    if (!editTitle) return;
    if (editEnd && editStart && new Date(editEnd) <= new Date(editStart)) {
      return;
    }

    let plans = getPlansFromStorage();
    plans = plans.map(p => {
      if (p.id === editModal.id) {
        return { ...p, title: editTitle, description: editDesc, startDate: editStart, endDate: editEnd, status: editStatus };
      }
      return p;
    });
    savePlansToStorage(plans);

    // refresh existing plans list
    const petPlans = plans.filter(p => p.petId === petId);
    setExistingPlans(petPlans);
    setEditModal(null);
  }

  // delete plan from modal
  function handleModalDelete() {
    let plans = getPlansFromStorage();
    plans = plans.filter(p => p.id !== editModal.id);
    savePlansToStorage(plans);

    // also remove tasks for this plan
    let allTasks = getTasksFromStorage();
    allTasks = allTasks.filter(t => t.carePlanId !== editModal.id);
    saveTasksToStorage(allTasks);

    // refresh existing plans list
    const petPlans = plans.filter(p => p.petId === petId);
    setExistingPlans(petPlans);
    setEditModal(null);
  }

  // add a new blank task row to the list
  function handleAddEmptyTask() {
    const task = new CareTask(id || 'temp', '', '', '08:00', false, 'daily');
    setTasks([...tasks, task]);
    setError('');
  }

  // update a field on an existing task row
  function handleUpdateTask(taskId, updates) {
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t)));
  }

  // remove a task from the list
  function handleRemoveTask(taskId) {
    setTasks(tasks.filter(t => t.id !== taskId));
  }

  // save the care plan and all tasks
  function handleSave() {
    // validate form
    if (!title.trim()) {
      setError('Please enter a care plan name.');
      return;
    }
    if (!petId) {
      setError('Please select a pet.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please enter both start and end dates.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date.');
      return;
    }

    let plans = getPlansFromStorage();
    let allTasks = getTasksFromStorage();
    let planId;

    if (isEditMode) {
      // update existing plan
      planId = id;
      plans = plans.map(p => {
        if (p.id === id) {
          return { ...p, title, description, petId, startDate, endDate };
        }
        return p;
      });

      // remove old tasks for this plan, then add updated ones
      allTasks = allTasks.filter(t => t.carePlanId !== id);
    } else {
      // create a new plan
      const newPlan = new CarePlan(petId, title, description, startDate, endDate);
      planId = newPlan.id;
      plans.push(newPlan);
    }

    // drop empty task rows, then update carePlanId for all remaining tasks
    const validTasks = tasks.filter(t => t.title && t.title.trim() !== '');
    const updatedTasks = validTasks.map(t => ({ ...t, carePlanId: planId }));
    allTasks = [...allTasks, ...updatedTasks];

    // update tasks array inside the plan object
    plans = plans.map(p => {
      if (p.id === planId) {
        return { ...p, tasks: updatedTasks.map(t => t.id) };
      }
      return p;
    });

    // save everything to localStorage
    savePlansToStorage(plans);
    saveTasksToStorage(allTasks);

    setSuccess('Saved successfully!');
    setError('');

    // go back to dashboard after 1 second
    setTimeout(() => {
      navigate('/');
    }, 1000);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <h2>{isEditMode ? 'Edit Care Plan' : 'Create New Care Plan'}</h2>
      </div>

      {error && <div className={styles.errorMsg}>{error}</div>}
      {success && <div className={styles.successMsg}>{success}</div>}

      {/* Care Plan Form */}
      <Card className={styles.formCard}>
        <h3>Care Plan Details</h3>
        <div className={styles.form}>
          <div className={styles.field}>
            <label>Plan Name</label>
            <select value={title} onChange={e => setTitle(e.target.value)}>
              <option value="">-- Select a plan --</option>
              {planOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe this care plan..."
            />
          </div>

          <div className={styles.field}>
            <label>Select Pet</label>
            <select value={petId} onChange={e => setPetId(e.target.value)}>
              <option value="">-- Select --</option>
              {mockPets.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species} - {pet.breed})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dateRow}>
            <div className={styles.field}>
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Existing plans for this pet */}
      {petId && existingPlans.length > 0 && (
        <Card className={styles.formCard}>
          <h3><CalendarCheck size={18} /> Existing Plans for {mockPets.find(p => p.id === petId)?.name}</h3>
          <div className={styles.taskList}>
            {existingPlans.map(plan => (
              <div key={plan.id} className={styles.taskItem}>
                <div className={styles.taskInfo}>
                  <strong>{plan.title}</strong>
                  <span>{plan.description || 'No description'}</span>
                  <span className={styles.taskMeta}>
                    {plan.startDate} — {plan.endDate} | Status: {plan.status || 'active'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(plan)}
                >
                  <Pencil size={14} /> Edit
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tasks Section */}
      <Card className={styles.formCard}>
        <h3>Tasks in this Plan</h3>

        {tasks.length === 0 && (
          <p className={styles.emptyText}>No tasks yet — click "Add another task" below.</p>
        )}

        {tasks.length > 0 && (
          <div className={styles.taskList}>
            {tasks.map((task, index) => (
              <div key={task.id} className={styles.taskEditRow}>
                <div className={styles.taskRowHeader}>
                  <strong>Task {index + 1}</strong>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleRemoveTask(task.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={styles.form}>
                  <div className={styles.field}>
                    <label>Task Name</label>
                    <select
                      value={task.title}
                      onChange={e => handleUpdateTask(task.id, { title: e.target.value })}
                    >
                      <option value="">-- Select a task --</option>
                      {taskOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label>Description</label>
                    <input
                      type="text"
                      value={task.description}
                      onChange={e => handleUpdateTask(task.id, { description: e.target.value })}
                      placeholder="e.g. Walk around the park for 30 mins"
                    />
                  </div>

                  <div className={styles.dateRow}>
                    <div className={styles.field}>
                      <label>Time</label>
                      <input
                        type="time"
                        value={task.timeOfDay}
                        onChange={e => handleUpdateTask(task.id, { timeOfDay: e.target.value })}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Recurring</label>
                      <div className={styles.checkboxRow}>
                        <input
                          type="checkbox"
                          checked={task.isRecurring}
                          onChange={e => handleUpdateTask(task.id, { isRecurring: e.target.checked })}
                          id={`recurring-${task.id}`}
                        />
                        <label htmlFor={`recurring-${task.id}`}>This is a recurring task</label>
                      </div>
                    </div>

                    {task.isRecurring && (
                      <div className={styles.field}>
                        <label>Frequency</label>
                        <select
                          value={task.recurrence}
                          onChange={e => handleUpdateTask(task.id, { recurrence: e.target.value })}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" onClick={handleAddEmptyTask}>
          <Plus size={16} /> Add another task
        </Button>
      </Card>

      {/* Save / Cancel buttons */}
      <div className={styles.bottomActions}>
        <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
        <Button onClick={handleSave}>
          <Save size={16} /> Save Care Plan
        </Button>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className={styles.modalOverlay} onClick={() => setEditModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Edit Care Plan</h3>
              <button className={styles.closeBtn} onClick={() => setEditModal(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.field}>
                <label>Plan Name</label>
                <select value={editTitle} onChange={e => setEditTitle(e.target.value)}>
                  <option value="">-- Select a plan --</option>
                  {planOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Description</label>
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Describe this care plan..."
                />
              </div>

              <div className={styles.dateRow}>
                <div className={styles.field}>
                  <label>Start Date</label>
                  <input type="date" value={editStart} onChange={e => setEditStart(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>End Date</label>
                  <input type="date" value={editEnd} onChange={e => setEditEnd(e.target.value)} />
                </div>
              </div>
            </div>

            <div className={styles.statusToggle}>
              <label>Status</label>
              <button
                className={editStatus === 'active' ? styles.statusActive : styles.statusPaused}
                onClick={() => setEditStatus(editStatus === 'active' ? 'paused' : 'active')}
              >
                {editStatus === 'active' ? '● Active' : '● Paused'}
              </button>
            </div>

            <div className={styles.modalActions}>
              <Button variant="danger" size="sm" onClick={handleModalDelete}>
                <Trash2 size={14} /> Delete Plan
              </Button>
              <div className={styles.modalRight}>
                <Button variant="secondary" size="sm" onClick={() => setEditModal(null)}>Cancel</Button>
                <Button size="sm" onClick={handleModalSave}>
                  <Save size={14} /> Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
