import type { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

    res.status(200).json({ message: 'Quiz questions converted successfully' });
  } catch (error) {
    console.error('Error converting quiz questions:', error);
    res.status(500).json({ message: 'Error converting quiz questions', error });
  }
}

// Include the same processing functions here... 