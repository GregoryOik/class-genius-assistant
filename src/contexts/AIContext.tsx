
import React, { createContext, useContext, useState } from 'react';
import { ChatMessageType } from '@/types';
import { toast } from '@/hooks/use-toast';

type AIContextType = {
  messages: Record<string, ChatMessageType[]>;
  addMessage: (subjectId: string, content: string, role: 'user' | 'assistant') => void;
  clearMessages: (subjectId: string) => void;
  generateAIResponse: (subjectId: string, message: string, subjectNotes: string) => Promise<void>;
  isLoading: boolean;
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Record<string, ChatMessageType[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (subjectId: string, content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessageType = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      role,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [subjectId]: [...(prev[subjectId] || []), newMessage]
    }));
  };

  const clearMessages = (subjectId: string) => {
    setMessages(prev => ({
      ...prev,
      [subjectId]: []
    }));
  };

  // Simulate AI response
  const generateAIResponse = async (subjectId: string, message: string, subjectNotes: string) => {
    setIsLoading(true);
    
    // Add the user message
    addMessage(subjectId, message, 'user');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      let response = '';
      
      // Simulated AI responses based on message content
      if (message.toLowerCase().includes('summarize') || message.toLowerCase().includes('summary')) {
        response = `Here's a summary of your notes:\n\n${subjectNotes ? 'Based on your notes, the key points are...' : 'You don\'t have any notes for this subject yet. Add some notes to get a meaningful summary!'}\n\nWould you like me to help you organize these points into a study guide?`;
      } 
      else if (message.toLowerCase().includes('question') || message.toLowerCase().includes('quiz')) {
        response = "Here are 3 practice questions based on your materials:\n\n1. Explain the core concepts discussed in the lecture and how they relate to the course objectives.\n\n2. Compare and contrast the different methodologies presented in the course materials.\n\n3. How would you apply these concepts to solve a real-world problem in this field?";
      }
      else if (message.toLowerCase().includes('plan') || message.toLowerCase().includes('study')) {
        response = "Here's a personalized study plan for you:\n\n1. Review your lecture notes (2 hours)\n2. Complete practice problems from chapters 3-5 (3 hours)\n3. Create flashcards for key terms (1 hour)\n4. Join a study group to discuss complex topics (2 hours)\n5. Take a practice exam under timed conditions (1.5 hours)\n\nWould you like me to break this down into a daily schedule?";
      }
      else if (message.toLowerCase().includes('explain') || message.toLowerCase().includes('help')) {
        response = "I'd be happy to explain this topic! Based on your course materials, this concept involves several important principles that build upon each other.\n\nThe key thing to understand is how these elements work together in a system. Think of it like building blocks where each concept supports the next.\n\nWould you like me to provide some examples to make this clearer?";
      }
      else {
        response = "I'm your AI assistant for this subject. I can help you with:\n\n• Summarizing your notes and documents\n• Creating practice questions\n• Explaining difficult concepts\n• Developing personalized study plans\n\nWhat would you like help with today?";
      }
      
      // Add the AI response
      addMessage(subjectId, response, 'assistant');
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    messages,
    addMessage,
    clearMessages,
    generateAIResponse,
    isLoading
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
