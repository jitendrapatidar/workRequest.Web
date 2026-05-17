export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'New' | 'InProgress' | 'Blocked' | 'Completed';

export interface Note {
  id: number;
  text: string;
  createdDate: string;
}

export interface WorkRequest {
  id: number;
  title: string;
  clientName: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdDate: string;
  updatedDate: string;
  notes?: Note[];
}

export interface WorkRequestResponse {
  totalItems: number;
  page: number;
  pageSize: number;
  items: WorkRequest[];
}
