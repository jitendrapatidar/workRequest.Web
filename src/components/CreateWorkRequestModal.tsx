import { useState } from 'react';
import styles from './CreateWorkRequestModal.module.css';
import { Priority, Status } from '@/types';

interface Props {
  onClose: () => void;
  onCreated: () => void;
  apiBase: string;
}

export default function CreateWorkRequestModal({ onClose, onCreated, apiBase }: Props) {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('New');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title || !clientName || !dueDate) {
      setError('Title, Client Name, and Due Date are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/work-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          clientName,
          description,
          priority,
          status,
          dueDate: new Date(dueDate).toISOString()
        })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.title || 'Failed to create work request');
      } else {
        onCreated();
      }
    } catch (err) {
      setError('An error occurred while creating the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>New Work Request</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          
          <div className={styles.formGroup}>
            <label>Client Name *</label>
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as Status)}>
                <option value="New">New</option>
                <option value="InProgress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Due Date *</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
          </div>
          
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Saving...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
