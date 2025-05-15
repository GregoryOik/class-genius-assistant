
export type GradeType = {
  id: string;
  name: string;
  score: number;
  totalPoints: number;
  weight: number;
};

export type FileType = {
  id: string;
  name: string;
  url: string;
  type: 'notes' | 'exam' | 'lecture' | 'other';
  uploadedAt: string;
};

export type SubjectType = {
  id: string;
  name: string;
  description: string;
  color: string;
  professor?: string;
  notes: string;
  grades: GradeType[];
  files: FileType[];
  createdAt: string;
};

export type ChatMessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
};
