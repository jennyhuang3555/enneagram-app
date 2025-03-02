import { collection, addDoc, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
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
  userName?: string;
  userEmail?: string;
}

export const saveQuizResults = async (results: Partial<QuizResult>) => {
  try {
    const cleanResults = {
      ...results,
      userId: results.userId || null,
      createdAt: new Date().toISOString(),
      userName: results.userName || null,
      userEmail: results.userEmail || null
    };

    const quizResults = collection(db, 'quiz_results');
    
    // If we have an email, use it as the document ID
    if (results.userEmail) {
      const docRef = doc(quizResults, results.userEmail);
      await setDoc(docRef, cleanResults);
      return docRef.id;
    } else {
      // If no email (anonymous quiz), create with auto-generated ID
      const docRef = await addDoc(quizResults, cleanResults);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving quiz results:', error);
    throw error;
  }
};

export const linkQuizResultsToUser = async (tempId: string, userId: string, userName?: string, userEmail?: string) => {
  try {
    const quizResults = collection(db, 'quiz_results');
    const q = query(quizResults, where('temp_id', '==', tempId));
    const querySnapshot = await getDocs(q);
    
    // Use Promise.all to wait for all updates to complete
    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, {
        userId: userId,
        userName: userName || null,
        userEmail: userEmail || null,
        updatedAt: new Date().toISOString() // Add timestamp for tracking
      })
    );
    
    await Promise.all(updatePromises);
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