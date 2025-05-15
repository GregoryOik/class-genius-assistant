
import React, { useState } from 'react';
import { SubjectType, FileType } from '@/types';
import { useSubjects } from '@/contexts/SubjectContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { File, Trash, Upload, FileText, FileX } from 'lucide-react';
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
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FilesTabProps = {
  subject: SubjectType;
};

const fileTypes = [
  { value: 'notes', label: 'Notes' },
  { value: 'lecture', label: 'Lecture' },
  { value: 'exam', label: 'Exam' },
  { value: 'other', label: 'Other' },
];

const FilesTab = ({ subject }: FilesTabProps) => {
  const { addFile, deleteFile } = useSubjects();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'notes' as FileType['type'],
  });
  
  const [file, setFile] = useState<File | null>(null);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleSelectType = (value: FileType['type']) => {
    setFormData(prev => ({
      ...prev,
      type: value,
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Auto-fill name from filename if empty
      if (!formData.name) {
        setFormData(prev => ({
          ...prev,
          name: e.target.files![0].name,
        }));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would upload the file to a server/storage
    // For now, we'll create a fake URL for demonstration
    const fakeUrl = URL.createObjectURL(new Blob([file]));
    
    addFile(subject.id, {
      name: formData.name,
      type: formData.type,
      url: fakeUrl,
    });
    
    setIsUploadOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      type: 'notes',
    });
    setFile(null);
  };
  
  const filteredFiles = subject.files.filter(file => {
    if (activeFilter === 'all') return true;
    return file.type === activeFilter;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Files</h2>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              <span>Upload File</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Upload a file for this subject. Supported formats include PDFs, documents, and images.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Select File</Label>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">File Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Lecture Notes Week 1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">File Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={value => handleSelectType(value as FileType['type'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a file type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  Upload File
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="lecture">Lectures</TabsTrigger>
          <TabsTrigger value="exam">Exams</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter}>
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map(file => (
                <Card key={file.id} className="relative group overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary p-3 rounded-md">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="space-y-1 flex-1">
                        <h3 className="font-medium truncate pr-8">{file.name}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="capitalize">{file.type}</span>
                          <span>{format(new Date(file.uploadedAt), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteFile(subject.id, file.id);
                        }}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileX className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No files found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {activeFilter === 'all' 
                    ? "You haven't uploaded any files for this subject yet."
                    : `You haven't uploaded any ${activeFilter} files for this subject.`}
                </p>
                <Button 
                  onClick={() => setIsUploadOpen(true)} 
                  className="flex items-center gap-1"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilesTab;
