export enum LeaveType {
  SICK = 'SICK',
  UNPAID = 'UNPAID',
  EMERGENCY = 'EMERGENCY'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Leave {
  id: number;
  start_date: Date;
  end_date: Date;
  reason: string;
  documentAttachement: string;
  type: LeaveType;
  status: LeaveStatus;
} 
 
