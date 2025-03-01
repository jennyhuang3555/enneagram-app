import xlsx from 'xlsx';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertQuizQuestions() {
  try {
    // Read all quiz files
    const excelPath1 = join(__dirname, '../../Quiz-triad-1.xlsx');
    const excelPath2 = join(__dirname, '../../Quiz-triad-2.xlsx');
    const excelPath3 = join(__dirname, '../../quiz-tiebreaker.xlsx');

    const workbook1 = xlsx.readFile(excelPath1);
    const workbook2 = xlsx.readFile(excelPath2);
    const workbook3 = xlsx.readFile(excelPath3);

    const jsonData1 = xlsx.utils.sheet_to_json(workbook1.Sheets[workbook1.SheetNames[0]]);
    const jsonData2 = xlsx.utils.sheet_to_json(workbook2.Sheets[workbook2.SheetNames[0]]);
    const jsonData3 = xlsx.utils.sheet_to_json(workbook3.Sheets[workbook3.SheetNames[0]]);

    const quizData = {
      round1: {
        questions: processRound1Questions(jsonData1),
        resultRanges: createResultRanges()
      },
      round2: {
        questions: [], // Populated dynamically
        rawQuestions: jsonData2
      },
      round3: {
        questions: [], // Populated dynamically
        rawQuestions: jsonData3
      }
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

function processRound1Questions(jsonData) {
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

  return Object.entries(questionGroups).map(([questionNumber, statements]) => ({
    id: `q${questionNumber}`,
    questionNumber: parseInt(questionNumber),
    text: "Select in order of what you most agree with",
    options: statements.map((statement, index) => ({
      id: `q${questionNumber}_opt${index + 1}`,
      text: statement.statement,
      type: statement.type.replace('Type ', '')
    }))
  })).sort((a, b) => a.questionNumber - b.questionNumber);
}

function createResultRanges() {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `type${i + 1}`,
    category: `type${i + 1}`,
    minScore: 0,
    maxScore: 36,
    title: `Type ${i + 1}`,
    description: `Type ${i + 1} Description`
  }));
}

convertQuizQuestions(); 