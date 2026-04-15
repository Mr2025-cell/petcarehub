import React, { useState } from 'react';
import TaskCompletion from '../classes/TaskCompletion';
import './TaskList.module.css';

const TaskList = ({ tasks, sessionId, onTaskCompleted }) => {
  const [completions, setCompletions] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const isOverdue = (task) => {
    if (completions[task.taskId]) return false;
    const scheduledTime = new Date(task.scheduledTime);
    return scheduledTime < new Date();
  };

  const handlePhotoUpload = (task, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentTask(task);
        setSelectedPhoto(reader.result);
        setShowPhotoModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmCompletion = () => {
    if (currentTask) {
      const completion = new TaskCompletion(currentTask.taskId, currentTask.type);
      completion.complete(selectedPhoto, 'Task completed');
      
      setCompletions(prev => ({
        ...prev,
        [currentTask.taskId]: completion
      }));
      
      onTaskCompleted(currentTask, completion);
      
      setShowPhotoModal(false);
      setSelectedPhoto(null);
      setCurrentTask(null);
    }
  };

  const completeSimpleTask = (task) => {
    const completion = new TaskCompletion(task.taskId, task.type);
    completion.complete(null, 'Task completed');
    
    setCompletions(prev => ({
      ...prev,
      [task.taskId]: completion
    }));
    
    onTaskCompleted(task, completion);
  };

  return (
    <div className="task-list">
      <h3>Today's Tasks</h3>
      
      {tasks.length === 0 && (
        <p className="no-tasks">No tasks scheduled for today</p>
      )}
      
      <div className="tasks-container">
        {tasks.map(task => {
          const completed = completions[task.taskId];
          const overdue = isOverdue(task);
          
          return (
            <div 
              key={task.taskId} 
              className={`task-item ${completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
            >
              <div className="task-info">
                <span className="task-type">{task.type}</span>
                <span className="task-instructions">{task.instructions}</span>
                <span className="task-time">
                  Due: {new Date(task.scheduledTime).toLocaleTimeString()}
                </span>
                {overdue && !completed && (
                  <span className="overdue-badge">Overdue!</span>
                )}
              </div>
              
              {!completed && (
                <div className="task-actions">
                  {task.type === 'walk' ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handlePhotoUpload(task, e)}
                        className="photo-input"
                        id={`photo-${task.taskId}`}
                      />
                      <label 
                        htmlFor={`photo-${task.taskId}`} 
                        className="btn-photo"
                      >
                        📸 Take Photo
                      </label>
                    </>
                  ) : (
                    <button 
                      onClick={() => completeSimpleTask(task)}
                      className="btn-complete"
                    >
                      ✓ Complete
                    </button>
                  )}
                </div>
              )}
              
              {completed && (
                <div className="completed-badge">
                  ✓ Completed at {new Date(completed.completedAt).toLocaleTimeString()}
                  {completed.photoUrl && (
                    <img 
                      src={completed.photoUrl} 
                      alt="Completion proof" 
                      className="completion-photo-thumb"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {showPhotoModal && (
        <div className="modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Confirm Photo</h4>
            {selectedPhoto && (
              <img src={selectedPhoto} alt="Task proof" className="modal-photo" />
            )}
            <p>Is this photo correct for task completion?</p>
            <div className="modal-buttons">
              <button onClick={confirmCompletion} className="btn-confirm">
                Confirm
              </button>
              <button onClick={() => setShowPhotoModal(false)} className="btn-cancel">
                Retake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;