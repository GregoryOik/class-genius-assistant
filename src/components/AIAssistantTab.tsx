
import React, { useState, useEffect, useRef } from 'react';
import { SubjectType, ChatMessageType } from '@/types';
import { useAI } from '@/contexts/AIContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal } from 'lucide-react';

type AIAssistantTabProps = {
  subject: SubjectType;
};

const AIAssistantTab = ({ subject }: AIAssistantTabProps) => {
  const { messages, generateAIResponse, isLoading } = useAI();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subjectMessages = messages[subject.id] || [];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [subjectMessages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    generateAIResponse(subject.id, input.trim(), subject.notes);
    setInput('');
  };
  
  const renderSuggestions = () => {
    const suggestions = [
      "Summarize my notes for this subject",
      "Create a study plan for my next exam",
      "Generate 5 practice questions",
      "Explain the concept of [topic]",
      "What are the key points I should focus on?",
    ];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start h-auto py-2 text-left"
            onClick={() => {
              generateAIResponse(subject.id, suggestion, subject.notes);
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Study Assistant</CardTitle>
          <CardDescription>
            Your personal AI tutor for {subject.name}. Ask questions about your notes,
            request summaries, or get help with difficult concepts.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card className="border-0 shadow-none">
        <CardContent className="p-0 h-[60vh] flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {subjectMessages.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <h3 className="text-xl font-medium">Welcome to your AI Study Assistant!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    I can help you learn better by analyzing your notes, creating
                    study plans, and answering questions about your subject.
                  </p>
                  <h4 className="font-medium mt-6">Try asking me:</h4>
                  {renderSuggestions()}
                </div>
              ) : (
                <>
                  {subjectMessages.map((message) => (
                    <Message key={message.id} message={message} />
                  ))}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Ask your AI assistant something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="loader" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Message = ({ message }: { message: ChatMessageType }) => {
  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[85%] ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary'
        }`}
      >
        <div className="whitespace-pre-line">{message.content}</div>
      </div>
    </div>
  );
};

export default AIAssistantTab;
