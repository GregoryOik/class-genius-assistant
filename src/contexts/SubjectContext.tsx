
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubjectType, GradeType, FileType } from '@/types';
import { toast } from '@/hooks/use-toast';

// Initial sample data
const initialSubjects: SubjectType[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    description: 'Fundamentals of computing, algorithms, and programming concepts',
    color: '#4A90E2',
    professor: 'Dr. Smith',
    notes: 'Remember to review the binary tree traversal methods for the midterm!',
    grades: [
      { id: '101', name: 'Midterm', score: 85, totalPoints: 100, weight: 30 },
      { id: '102', name: 'Assignment 1', score: 92, totalPoints: 100, weight: 15 },
    ],
    files: [
      { 
        id: '201', 
        name: 'Lecture 1 - Intro to Algorithms.pdf', 
        url: '#', 
        type: 'lecture', 
        uploadedAt: new Date().toISOString() 
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Calculus II',
    description: 'Advanced integration techniques and infinite series',
    color: '#27AE60',
    professor: 'Dr. Johnson',
    notes: 'Focus on convergence tests for the next quiz!',
    grades: [
      { id: '103', name: 'Quiz 1', score: 78, totalPoints: 100, weight: 20 },
      { id: '104', name: 'Homework 1-3', score: 90, totalPoints: 100, weight: 10 },
    ],
    files: [
      { 
        id: '202', 
        name: 'Integration by Parts Summary.pdf', 
        url: '#', 
        type: 'notes', 
        uploadedAt: new Date().toISOString() 
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
];

type SubjectContextType = {
  subjects: SubjectType[];
  addSubject: (subject: Omit<SubjectType, 'id' | 'createdAt'>) => void;
  updateSubject: (id: string, subject: Partial<SubjectType>) => void;
  deleteSubject: (id: string) => void;
  getSubjectById: (id: string) => SubjectType | undefined;
  addGrade: (subjectId: string, grade: Omit<GradeType, 'id'>) => void;
  updateGrade: (subjectId: string, gradeId: string, grade: Partial<GradeType>) => void;
  deleteGrade: (subjectId: string, gradeId: string) => void;
  addFile: (subjectId: string, file: Omit<FileType, 'id' | 'uploadedAt'>) => void;
  deleteFile: (subjectId: string, fileId: string) => void;
  calculateGradeAverage: (grades: GradeType[]) => number;
};

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<SubjectType[]>(() => {
    const savedSubjects = localStorage.getItem('uniClassSubjects');
    return savedSubjects ? JSON.parse(savedSubjects) : initialSubjects;
  });

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uniClassSubjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (subject: Omit<SubjectType, 'id' | 'createdAt'>) => {
    const newSubject = {
      ...subject,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setSubjects(prev => [...prev, newSubject]);
    toast({
      title: "Subject Created",
      description: `${subject.name} has been added to your subjects.`
    });
  };

  const updateSubject = (id: string, updatedFields: Partial<SubjectType>) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === id ? { ...subject, ...updatedFields } : subject
      )
    );
    toast({
      title: "Subject Updated",
      description: "Your changes have been saved."
    });
  };

  const deleteSubject = (id: string) => {
    const subjectName = subjects.find(s => s.id === id)?.name;
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    toast({
      title: "Subject Deleted",
      description: `${subjectName || 'Subject'} has been removed.`,
      variant: "destructive"
    });
  };

  const getSubjectById = (id: string) => {
    return subjects.find(subject => subject.id === id);
  };

  const addGrade = (subjectId: string, grade: Omit<GradeType, 'id'>) => {
    const newGrade = {
      ...grade,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId 
          ? { ...subject, grades: [...subject.grades, newGrade] } 
          : subject
      )
    );
    toast({
      title: "Grade Added",
      description: `${grade.name} has been added to your grades.`
    });
  };

  const updateGrade = (subjectId: string, gradeId: string, updatedGrade: Partial<GradeType>) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId 
          ? { 
              ...subject, 
              grades: subject.grades.map(grade => 
                grade.id === gradeId ? { ...grade, ...updatedGrade } : grade
              ) 
            } 
          : subject
      )
    );
  };

  const deleteGrade = (subjectId: string, gradeId: string) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId 
          ? { 
              ...subject, 
              grades: subject.grades.filter(grade => grade.id !== gradeId) 
            } 
          : subject
      )
    );
    toast({
      title: "Grade Deleted",
      description: "The grade has been removed."
    });
  };

  const addFile = (subjectId: string, file: Omit<FileType, 'id' | 'uploadedAt'>) => {
    const newFile = {
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date().toISOString()
    };
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId 
          ? { ...subject, files: [...subject.files, newFile] } 
          : subject
      )
    );
    toast({
      title: "File Added",
      description: `${file.name} has been uploaded.`
    });
  };

  const deleteFile = (subjectId: string, fileId: string) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId 
          ? { 
              ...subject, 
              files: subject.files.filter(file => file.id !== fileId) 
            } 
          : subject
      )
    );
    toast({
      title: "File Deleted",
      description: "The file has been removed."
    });
  };

  const calculateGradeAverage = (grades: GradeType[]) => {
    if (grades.length === 0) return 0;
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    grades.forEach(grade => {
      const percentage = (grade.score / grade.totalPoints) * 100;
      totalWeightedScore += percentage * grade.weight;
      totalWeight += grade.weight;
    });
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const value = {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    addGrade,
    updateGrade,
    deleteGrade,
    addFile,
    deleteFile,
    calculateGradeAverage
  };

  return (
    <SubjectContext.Provider value={value}>
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = (): SubjectContextType => {
  const context = useContext(SubjectContext);
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectProvider');
  }
  return context;
};
