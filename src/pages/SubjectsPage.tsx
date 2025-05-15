
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubjects } from '@/contexts/SubjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plus, Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SubjectsPage = () => {
  const { subjects, deleteSubject, calculateGradeAverage } = useSubjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Subjects</h1>
        <Button asChild>
          <Link to="/subjects/new" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </Link>
        </Button>
      </div>

      {subjects.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">No subjects yet</h3>
              <p className="text-muted-foreground">
                Add your first subject to get started with UniClass AI Helper
              </p>
            </div>
            <Button asChild>
              <Link to="/subjects/new">Add Your First Subject</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const average = calculateGradeAverage(subject.grades);
            const hasGrades = subject.grades.length > 0;

            return (
              <Card key={subject.id} className="overflow-hidden">
                <div 
                  className="w-full h-2" 
                  style={{ backgroundColor: subject.color }} 
                />
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="truncate">{subject.name}</CardTitle>
                    {subject.professor && (
                      <p className="text-sm text-muted-foreground">
                        Prof. {subject.professor}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Open menu</span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                            fill="currentColor"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/subjects/${subject.id}/edit`} className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          <span>Edit Subject</span>
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Delete Subject</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {subject.name}? This action cannot be undone.
                              All grades, files, and notes associated with this subject will be lost.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteSubject(subject.id)} 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subject.description || 'No description'}
                  </p>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Grade</span>
                      <span className="font-medium">{hasGrades ? `${average.toFixed(1)}%` : 'No grades'}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      {hasGrades && (
                        <div
                          className={`h-full ${getGradeColor(average)}`}
                          style={{ width: `${Math.min(average, 100)}%` }}
                        ></div>
                      )}
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link to={`/subjects/${subject.id}`}>View Subject</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500';
  if (grade >= 80) return 'bg-uniclass-green';
  if (grade >= 70) return 'bg-uniclass-blue';
  if (grade >= 60) return 'bg-uniclass-yellow';
  return 'bg-uniclass-red';
};

export default SubjectsPage;
