
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSubjects } from '@/contexts/SubjectContext';
import { useAI } from '@/contexts/AIContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash, Plus, File, Book, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import GradesTab from '@/components/GradesTab';
import FilesTab from '@/components/FilesTab';
import AIAssistantTab from '@/components/AIAssistantTab';

const SubjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSubjectById, updateSubject, deleteSubject } = useSubjects();
  const { generateAIResponse, messages, isLoading } = useAI();

  const subject = getSubjectById(id!);
  
  const [notes, setNotes] = useState(subject?.notes || '');
  const [saving, setSaving] = useState(false);

  if (!subject) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
        <p className="text-muted-foreground mb-6">
          This subject may have been deleted or doesn't exist.
        </p>
        <Button asChild>
          <Link to="/subjects">Back to Subjects</Link>
        </Button>
      </div>
    );
  }

  const handleSaveNotes = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    updateSubject(id!, { notes });
    setSaving(false);
  };

  const handleDeleteSubject = () => {
    deleteSubject(id!);
    navigate('/subjects');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/subjects" className="text-sm text-muted-foreground hover:text-foreground">
              Subjects
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium truncate">{subject.name}</span>
          </div>
          <h1 className="text-3xl font-bold mt-1">{subject.name}</h1>
          {subject.professor && (
            <p className="text-muted-foreground">Professor: {subject.professor}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to={`/subjects/${id}/edit`} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-1">
                <Trash className="h-4 w-4" />
                <span>Delete</span>
              </Button>
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
                  onClick={handleDeleteSubject} 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div 
        className="w-full h-2 rounded-full" 
        style={{ backgroundColor: subject.color }} 
      />

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Subject Notes</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveNotes} 
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Grade Overview</h3>
                  {subject.grades.length > 0 ? (
                    <>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Average</span>
                        <span className="font-medium">
                          {useSubjects().calculateGradeAverage(subject.grades).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={useSubjects().calculateGradeAverage(subject.grades)} className="h-2" />
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No grades entered yet.</p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Files</h3>
                  {subject.files.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-sm">
                        {subject.files.length} {subject.files.length === 1 ? 'file' : 'files'} uploaded
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs bg-secondary rounded px-2 py-1">
                          {subject.files.filter(f => f.type === 'lecture').length} lectures
                        </div>
                        <div className="text-xs bg-secondary rounded px-2 py-1">
                          {subject.files.filter(f => f.type === 'notes').length} notes
                        </div>
                        <div className="text-xs bg-secondary rounded px-2 py-1">
                          {subject.files.filter(f => f.type === 'exam').length} exams
                        </div>
                        <div className="text-xs bg-secondary rounded px-2 py-1">
                          {subject.files.filter(f => f.type === 'other').length} other
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">AI Assistant</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Ask UniClass AI to help you learn better:
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start text-left" 
                        onClick={() => {
                          const message = "Summarize the key points from my notes";
                          generateAIResponse(subject.id, message, subject.notes);
                          navigate(`/subjects/${subject.id}?tab=ai-assistant`);
                        }}
                      >
                        📝 Summarize my notes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start text-left"
                        onClick={() => {
                          const message = "Create a study plan for this subject";
                          generateAIResponse(subject.id, message, subject.notes);
                          navigate(`/subjects/${subject.id}?tab=ai-assistant`);
                        }}
                      >
                        📅 Create a study plan
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start text-left"
                        onClick={() => {
                          const message = "Generate practice questions based on my notes";
                          generateAIResponse(subject.id, message, subject.notes);
                          navigate(`/subjects/${subject.id}?tab=ai-assistant`);
                        }}
                      >
                        ❓ Generate practice questions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="grades">
          <GradesTab subject={subject} />
        </TabsContent>
        
        <TabsContent value="files">
          <FilesTab subject={subject} />
        </TabsContent>
        
        <TabsContent value="ai-assistant">
          <AIAssistantTab subject={subject} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectDetailPage;
