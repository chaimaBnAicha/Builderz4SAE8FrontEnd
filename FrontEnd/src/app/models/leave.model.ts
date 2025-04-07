export enum LeaveType {
  SICK = 'Sick',
  UNPAID = 'Unpaid',
  EMERGENCY = 'Emergency'
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Leave {
  id: number;
  start_date: Date;
  end_date: Date;
  type: string;
  reason: string;
  status: string;
  documentAttachement?: string;
  isDownloading?: boolean;
  downloadError?: boolean;
} 
 
