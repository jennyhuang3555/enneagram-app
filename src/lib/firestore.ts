import { collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { QuestionResponse } from '@/types/quiz';

interface QuizResult {
  temp_id: string;
  scores: { [key: string]: number };
  responses: QuestionResponse[];
  dominant_type: string;
  second_type: string;
  third_type: string;
  userId: string | null;
  createdAt: string;
}

export const saveQuizResults = async (results: Partial<QuizResult>) => {
  try {
    // Remove undefined values and ensure userId is null if not present
    const cleanResults = {
      ...results,
      userId: results.userId || null,
      createdAt: new Date().toISOString()
    };

    const quizResults = collection(db, 'quiz_results');
    const docRef = await addDoc(quizResults, cleanResults);
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz results:', error);
    throw error;
  }
};

export const linkQuizResultsToUser = async (tempId: string, userId: string) => {
  try {
    const quizResults = collection(db, 'quiz_results');
    const q = query(quizResults, where('temp_id', '==', tempId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        userId: userId
      });
    });
  } catch (error) {
    console.error('Error linking results:', error);
    throw error;
  }
};

const handleQuizComplete = async (
  newScores: { [key: string]: number }, 
  quizResponses: QuestionResponse[]
) => {
  try {
    const temp_id = localStorage.getItem('temp_id') || crypto.randomUUID();
    localStorage.setItem('temp_id', temp_id);
    
    const sortedTypes = Object.entries(newScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([type]) => type);

    const resultsToStore = {
      temp_id,
      scores: newScores,
      responses: quizResponses,
      dominant_type: sortedTypes[0]?.replace('type', '') || '',
      second_type: sortedTypes[1]?.replace('type', '') || '',
      third_type: sortedTypes[2]?.replace('type', '') || '',
      userId: null // Always set to null initially
    };

    await saveQuizResults(resultsToStore);
    setStep(user ? 'results' : 'signup');
  } catch (error) {
    console.error('Error saving results:', error);
    toast({
      title: "Error",
      description: "Failed to save your results. Please try again.",
      variant: "destructive"
    });
  }
}; 