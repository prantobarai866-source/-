export type DeadlineStatus = 'open' | 'upcoming' | 'closed';

export interface AdmissionDeadline {
  id: string;
  universityId: string;
  universityNameBn: string;
  shortName: string;
  unitCode: string;
  category: string;
  applicationStartDate: string; // ISO date e.g. "2026-11-15"
  applicationEndDate: string; // ISO date e.g. "2026-12-10"
  admitCardDate?: string;
  examDate: string; // ISO date or date range
  applicationFee: string; // e.g. "১২০০ টাকা"
  applyUrl: string;
  circularUrl?: string;
  status: DeadlineStatus;
  importantNoticeBn?: string;
}
