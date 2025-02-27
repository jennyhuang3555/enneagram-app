import * as XLSX from 'xlsx';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function convertQuiz() {
  try {
    // Read Excel files from /public directory
    const round1Data = XLSX.readFile('public/Quiz-triad-1.xlsx');
    const round2Data = XLSX.readFile('public/Quiz-triad-2.xlsx');
    const tieBreakerData = XLSX.readFile('public/Quiz-tiebreaker.xlsx');

    const quizData = {
      triadRound1: processTriadQuestions(round1Data),
      triadRound2: processTriadQuestions(round2Data),
      tieBreakers: processTieBreakers(tieBreakerData)
    };

    // Write to public directory
    await writeFile(
      join(process.cwd(), 'public/data/quiz-questions.json'),
      JSON.stringify(quizData, null, 2)
    );

    return { success: true, message: 'Quiz questions converted successfully' };
  } catch (error) {
    console.error('Error converting quiz questions:', error);
    throw error;
  }
}

// Include the same processing functions here... 