
import React, { useState } from 'react';
import { SubjectType, GradeType } from '@/types';
import { useSubjects } from '@/contexts/SubjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash, Edit, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type GradesTabProps = {
  subject: SubjectType;
};

const GradesTab = ({ subject }: GradesTabProps) => {
  const { addGrade, updateGrade, deleteGrade, calculateGradeAverage } = useSubjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeType | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    score: 0,
    totalPoints: 100,
    weight: 10,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      score: 0,
      totalPoints: 100,
      weight: 10,
    });
    setEditingGrade(null);
  };

  const handleOpenForm = (grade?: GradeType) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({
        name: grade.name,
        score: grade.score,
        totalPoints: grade.totalPoints,
        weight: grade.weight,
      });
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGrade) {
      updateGrade(subject.id, editingGrade.id, formData);
    } else {
      addGrade(subject.id, formData);
    }
    
    handleCloseForm();
  };

  const averageGrade = calculateGradeAverage(subject.grades);
  const totalWeight = subject.grades.reduce((sum, grade) => sum + grade.weight, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Grades</h2>
        <Button onClick={() => handleOpenForm()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Grade</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary/50 p-4 rounded-md text-center">
              <h3 className="text-sm font-medium text-muted-foreground">Current Average</h3>
              <p className="text-3xl font-bold">
                {subject.grades.length > 0 ? `${averageGrade.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-md text-center">
              <h3 className="text-sm font-medium text-muted-foreground">Highest Grade</h3>
              <p className="text-3xl font-bold">
                {subject.grades.length > 0 
                  ? `${Math.max(...subject.grades.map(g => (g.score / g.totalPoints) * 100)).toFixed(1)}%` 
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-md text-center">
              <h3 className="text-sm font-medium text-muted-foreground">Weight Tracked</h3>
              <p className="text-3xl font-bold">
                {subject.grades.length > 0 ? `${totalWeight}%` : '0%'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {subject.grades.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead className="text-right">Weighted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subject.grades.map(grade => {
                  const percentage = (grade.score / grade.totalPoints) * 100;
                  const weightedValue = (percentage * grade.weight) / 100;
                  
                  return (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">{grade.name}</TableCell>
                      <TableCell className="text-right">
                        {grade.score}/{grade.totalPoints} ({percentage.toFixed(1)}%)
                      </TableCell>
                      <TableCell className="text-right">{grade.weight}%</TableCell>
                      <TableCell className="text-right">{weightedValue.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenForm(grade)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Grade</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{grade.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteGrade(subject.id, grade.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-medium mb-2">No grades yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Add your first grade to start tracking your academic progress in this subject.
            </p>
            <Button onClick={() => handleOpenForm()} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Your First Grade</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Grade Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
            <DialogDescription>
              {editingGrade 
                ? "Update the details of your grade."
                : "Enter the details of your grade."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Grade Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Midterm Exam, Quiz 1"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="score">Your Score</Label>
                <Input
                  id="score"
                  name="score"
                  type="number"
                  min="0"
                  value={formData.score}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalPoints">Total Points</Label>
                <Input
                  id="totalPoints"
                  name="totalPoints"
                  type="number"
                  min="1"
                  value={formData.totalPoints}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">
                Weight (%)
                <span className="ml-1 text-xs text-muted-foreground">
                  How much this counts toward your final grade
                </span>
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min="0"
                max="100"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingGrade ? 'Update Grade' : 'Add Grade'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradesTab;
