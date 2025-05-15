
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubjects } from '@/contexts/SubjectContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const colorOptions = [
  { name: 'Blue', value: '#4A90E2' },
  { name: 'Green', value: '#27AE60' },
  { name: 'Purple', value: '#9B59B6' },
  { name: 'Orange', value: '#F39C12' },
  { name: 'Red', value: '#EB5757' },
  { name: 'Teal', value: '#1ABC9C' },
];

const SubjectFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addSubject, updateSubject, getSubjectById } = useSubjects();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    professor: '',
    color: '#4A90E2',
    notes: '',
  });

  const [errors, setErrors] = useState({
    name: '',
  });

  useEffect(() => {
    if (isEditing) {
      const subject = getSubjectById(id!);
      if (subject) {
        setFormData({
          name: subject.name,
          description: subject.description,
          professor: subject.professor || '',
          color: subject.color,
          notes: subject.notes,
        });
      } else {
        // Subject not found, redirect to subjects page
        navigate('/subjects');
      }
    }
  }, [isEditing, id, getSubjectById, navigate]);

  const validateForm = () => {
    const newErrors = {
      name: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is being typed in
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing) {
      updateSubject(id!, {
        name: formData.name,
        description: formData.description,
        professor: formData.professor,
        color: formData.color,
        notes: formData.notes,
      });
    } else {
      addSubject({
        name: formData.name,
        description: formData.description,
        professor: formData.professor,
        color: formData.color,
        notes: formData.notes,
        grades: [],
        files: [],
      });
    }

    navigate('/subjects');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Subject' : 'Add New Subject'}
      </h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Update Subject Information' : 'Subject Information'}</CardTitle>
            <CardDescription>
              Fill in the details about your subject.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Subject Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Introduction to Computer Science"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="professor">Professor</Label>
              <Input
                id="professor"
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                placeholder="e.g. Dr. Smith"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the subject"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subject Color</Label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color.value
                        ? 'ring-2 ring-offset-2 ring-primary'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorChange(color.value)}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Initial Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any initial notes or reminders"
                rows={5}
              />
            </div>
            
            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/subjects')}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default SubjectFormPage;
