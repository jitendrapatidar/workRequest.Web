import { useState, useEffect } from 'react';
import styles from './WorkRequestDetails.module.css';
import { WorkRequest, Status } from '@/types';

interface Props {
  requestId: number;
  onClose: () => void;
  onUpdated: () => void;
  apiBase: string;
}

export default function WorkRequestDetails({ requestId, onClose, onUpdated, apiBase }: Props) {
  const [request, setRequest] = useState<WorkRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [requestId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/work-requests/${requestId}`);
      if (res.ok) {
        setRequest(await res.json());
      } else {
        setError('Failed to load request details.');
      }
    } catch (err) {
      setError('An error occurred loading details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${apiBase}/work-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRequest(prev => prev ? { ...prev, status: newStatus } : null);
        onUpdated();
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('Error updating status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`${apiBase}/work-requests/${requestId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newNote })
      });
      
      if (res.ok) {
        const addedNote = await res.json();
        setRequest(prev => prev ? {
          ...prev, 
          notes: [...(prev.notes || []), addedNote]
        } : null);
        setNewNote('');
        onUpdated(); // Optional: updates the main list if notes count was shown
      } else {
        alert('Failed to add note.');
      }
    } catch (err) {
      alert('Error adding note.');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal}>Loading...</div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal}>{error || 'Not found'}</div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>{request.title}</h2>
            <span className={styles.idBadge}>#{request.id}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.content}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Client</label>
              <p>{request.clientName}</p>
            </div>
            <div className={styles.detailItem}>
              <label>Priority</label>
              <p>{request.priority}</p>
            </div>
            <div className={styles.detailItem}>
              <label>Status</label>
              <select 
                value={request.status} 
                onChange={handleStatusChange}
                disabled={updatingStatus}
                className={styles.statusSelect}
              >
                <option value="New">New</option>
                <option value="InProgress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className={styles.detailItem}>
              <label>Due Date</label>
              <p>{new Date(request.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <label>Description</label>
            <p>{request.description || <em className={styles.emptyText}>No description provided.</em>}</p>
          </div>

          <div className={styles.notesSection}>
            <h3>Notes</h3>
            <div className={styles.notesList}>
              {request.notes && request.notes.length > 0 ? (
                request.notes.map(note => (
                  <div key={note.id} className={styles.noteItem}>
                    <p>{note.text}</p>
                    <span className={styles.noteDate}>
                      {new Date(note.createdDate).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className={styles.emptyNotes}>No notes yet.</div>
              )}
            </div>

            <div className={styles.addNoteBox}>
              <textarea 
                value={newNote} 
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                rows={3}
              />
              <button 
                onClick={handleAddNote} 
                disabled={savingNote || !newNote.trim()}
                className={styles.addNoteBtn}
              >
                {savingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
