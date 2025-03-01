import xlsx from 'xlsx';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertQuizQuestions() {
  try {
    const excelPath = join(__dirname, '../../Quiz-triad-1.xlsx');
    console.log('Reading Excel file from:', excelPath);

    const workbook = xlsx.readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Group statements by question number
    const questionGroups = {};
    jsonData.forEach((row) => {
      const questionNumber = row['Question Number'];
      if (!questionGroups[questionNumber]) {
        questionGroups[questionNumber] = [];
      }
      questionGroups[questionNumber].push({
        statement: row['Statements'],
        type: row['Types']
      });
    });

    // Transform into quiz format
    const questions = Object.entries(questionGroups).map(([questionNumber, statements]) => ({
      id: crypto.randomUUID(),
      questionNumber: parseInt(questionNumber),
      text: "Select in order of what you most agree with",
      options: statements.map(statement => ({
        id: crypto.randomUUID(),
        text: statement.statement,
        type: statement.type
      }))
    }));

    const quizData = {
      questions: questions.sort((a, b) => a.questionNumber - b.questionNumber),
      resultRanges: [
        {
          id: "1",
          category: "type1",
          minScore: 0,
          maxScore: 36, // 12 questions * max 3 points
          title: "Type 1",
          description: "The Perfectionist"
        }
        // Other types will be added similarly
      ]
    };

    const outputPath = join(__dirname, '../data/quiz-questions.json');
    console.log('Writing JSON to:', outputPath);

    const dataDir = dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    writeFileSync(outputPath, JSON.stringify(quizData, null, 2));
    console.log('Quiz questions converted successfully!');
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error stack:', error.stack);
  }
}

convertQuizQuestions(); 