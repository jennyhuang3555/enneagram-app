import * as XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface TriadQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    type: number;
  }[];
}

interface QuizData {
  triadRound1: TriadQuestion[];
  triadRound2: TriadQuestion[];
  tieBreakers: TriadQuestion[];
}

function convertExcelToQuizFormat() {
  try {
    // Read all Excel files
    const round1Data = XLSX.readFile('Quiz-triad-1.xlsx');
    const round2Data = XLSX.readFile('Quiz-triad-2.xlsx');
    const tieBreakerData = XLSX.readFile('Quiz-tiebreaker.xlsx');

    const quizData: QuizData = {
      triadRound1: processTriadQuestions(round1Data),
      triadRound2: processTriadQuestions(round2Data),
      tieBreakers: processTieBreakers(tieBreakerData)
    };

    // Write to JSON file
    writeFileSync(
      join(__dirname, '../data/quiz-questions.json'),
      JSON.stringify(quizData, null, 2)
    );

    console.log('Quiz questions converted successfully!');
  } catch (error) {
    console.error('Error converting quiz questions:', error);
  }
}

function processTriadQuestions(workbook: XLSX.WorkBook): TriadQuestion[] {
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Sort by question number first
  const sortedData = jsonData.sort((a: any, b: any) => 
    parseInt(a['Question number']) - parseInt(b['Question number'])
  );

  // Group statements by question number
  const questionGroups = sortedData.reduce((acc: any, row: any) => {
    const qNum = row['Question number'];
    if (!acc[qNum]) acc[qNum] = [];
    acc[qNum].push({
      statement: row['Statement'],
      type: parseInt(row['Type'])
    });
    return acc;
  }, {});

  // Convert groups to questions
  return Object.entries(questionGroups).map(([questionNum, statements]: [string, any[]]) => ({
    id: crypto.randomUUID(),
    questionNumber: parseInt(questionNum),
    text: "Select in order of what you most agree with",
    options: statements.map(s => ({
      id: crypto.randomUUID(),
      text: s.statement,
      type: s.type
    }))
  }));
}

function processTieBreakers(workbook: XLSX.WorkBook): TriadQuestion[] {
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  return jsonData.map((row: any) => ({
    id: crypto.randomUUID(),
    text: "Select which statement you most agree with",
    options: [
      {
        id: crypto.randomUUID(),
        text: row.Statement1,
        type: parseInt(row.Type1)
      },
      {
        id: crypto.randomUUID(),
        text: row.Statement2,
        type: parseInt(row.Type2)
      }
    ]
  }));
}

convertExcelToQuizFormat(); 