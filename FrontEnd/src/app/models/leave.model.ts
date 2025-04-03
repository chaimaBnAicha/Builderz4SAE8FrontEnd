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
  start_date: Date | string;
  end_date: Date | string;
  reason: string;
  documentAttachement: string;
  type: LeaveType;
  status: LeaveStatus;
} 
 
