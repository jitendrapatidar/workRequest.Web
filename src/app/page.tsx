"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { WorkRequest, WorkRequestResponse, Status } from '@/types';
import WorkRequestList from '@/components/WorkRequestList';
import CreateWorkRequestModal from '@/components/CreateWorkRequestModal';
import WorkRequestDetails from '@/components/WorkRequestDetails';

 
const API_BASE = 'http://localhost:7063/api'; 

export default function Home() {
  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      let url = `${API_BASE}/work-requests?page=1&pageSize=50`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data: WorkRequestResponse = await res.json();
        setRequests(data.items);
        setTotalItems(data.totalItems);
      }
    } catch (err) {
      console.error("Failed to fetch work requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, searchQuery]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Work Requests Tracker</h1>
          <button onClick={() => setIsCreateModalOpen(true)} className={styles.primaryButton}>
            + New Request
          </button>
        </div>
      </header>

      <section className={styles.controls}>
        <input 
          type="text" 
          placeholder="Search by title or client..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value as Status | '')}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="InProgress">In Progress</option>
          <option value="Blocked">Blocked</option>
          <option value="Completed">Completed</option>
        </select>
      </section>

      <div className={styles.content}>
        <WorkRequestList 
          requests={requests} 
          onSelect={(id) => setSelectedRequestId(id)} 
        />
      </div>

      {isCreateModalOpen && (
        <CreateWorkRequestModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreated={() => {
            setIsCreateModalOpen(false);
            fetchRequests();
          }} 
          apiBase={API_BASE}
        />
      )}

      {selectedRequestId && (
        <WorkRequestDetails 
          requestId={selectedRequestId} 
          onClose={() => setSelectedRequestId(null)} 
          onUpdated={() => fetchRequests()}
          apiBase={API_BASE}
        />
      )}
    </main>
  );
}
