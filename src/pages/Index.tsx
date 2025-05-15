
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubjects } from '@/contexts/SubjectContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';

const Index = () => {
  const { subjects, calculateGradeAverage } = useSubjects();

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Welcome to UniClass AI Helper</h1>
        <p className="text-muted-foreground">
          Manage your university subjects, track grades, and get AI-powered study assistance all in one place.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Subjects</h2>
          <Button asChild variant="outline">
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
              const filesCount = subject.files.length;

              return (
                <Link to={`/subjects/${subject.id}`} key={subject.id}>
                  <Card className="h-full hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <div 
                        className="w-full h-2 rounded-full mb-2" 
                        style={{ backgroundColor: subject.color }} 
                      />
                      <CardTitle className="truncate">{subject.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-2">
                      <p className="text-muted-foreground line-clamp-2 h-10">
                        {subject.description || 'No description'}
                      </p>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Grade</span>
                          <span className="text-sm font-bold">
                            {hasGrades ? `${average.toFixed(1)}%` : 'No grades'}
                          </span>
                        </div>
                        <Progress 
                          value={hasGrades ? average : 0} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 text-sm text-muted-foreground">
                      <div className="w-full flex justify-between">
                        <span>{subject.grades.length} {subject.grades.length === 1 ? 'grade' : 'grades'}</span>
                        <span>{filesCount} {filesCount === 1 ? 'file' : 'files'}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">AI Study Helper</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            title="Document Analysis" 
            description="Upload your lecture notes and get AI-powered summaries and key points."
          />
          <FeatureCard 
            title="Practice Questions" 
            description="Generate custom practice questions based on your course materials."
          />
          <FeatureCard 
            title="Study Plans" 
            description="Get personalized study plans based on your notes and upcoming exams."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default Index;
