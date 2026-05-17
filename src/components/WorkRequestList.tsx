import { WorkRequest } from '@/types';
import styles from './WorkRequestList.module.css';

interface Props {
  requests: WorkRequest[];
  onSelect: (id: number) => void;
}

export default function WorkRequestList({ requests, onSelect }: Props) {
  if (requests.length === 0) {
    return <div className={styles.empty}>No work requests found.</div>;
  }

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case 'High': return styles.priorityHigh;
      case 'Medium': return styles.priorityMedium;
      case 'Low': return styles.priorityLow;
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'New': return styles.statusNew;
      case 'InProgress': return styles.statusInProgress;
      case 'Blocked': return styles.statusBlocked;
      case 'Completed': return styles.statusCompleted;
      default: return '';
    }
  };

  return (
    <div className={styles.grid}>
      {requests.map((request) => (
        <div key={request.id} className={styles.card} onClick={() => onSelect(request.id)}>
          <div className={styles.cardHeader}>
            <h3 className={styles.title}>{request.title}</h3>
            <span className={`${styles.badge} ${getPriorityClass(request.priority)}`}>
              {request.priority}
            </span>
          </div>
          <div className={styles.clientName}>{request.clientName}</div>
          <div className={styles.cardFooter}>
            <span className={`${styles.statusBadge} ${getStatusClass(request.status)}`}>
              {request.status.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className={styles.date}>Due: {new Date(request.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
