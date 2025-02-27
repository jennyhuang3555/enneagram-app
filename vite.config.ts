import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import xlsx from 'xlsx';
import crypto from 'crypto';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middleware: [
      async (req, res, next) => {
        if (req.url === '/api/convert-quiz' && req.method === 'POST') {
          try {
            const XLSX = await import('xlsx');
            const fs = await import('fs/promises');
            const path = await import('path');

            // Read Excel files from /public directory
            const round1Data = XLSX.readFile('public/Quiz-triad-1.xlsx');
            const round2Data = XLSX.readFile('public/Quiz-triad-2.xlsx');
            const tieBreakerData = XLSX.readFile('public/Quiz-tiebreaker.xlsx');

            const quizData = {
              triadRound1: processTriadQuestions(round1Data),
              triadRound2: processTriadRound2Questions(round2Data, [1, 2, 3]),
              tieBreakers: processTieBreakers(tieBreakerData)
            };

            // Write to public directory
            await fs.writeFile(
              path.join(process.cwd(), 'public/data/quiz-questions.json'),
              JSON.stringify(quizData, null, 2)
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Quiz questions converted successfully' }));
          } catch (error) {
            console.error('Error converting quiz questions:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to convert quiz questions' }));
          }
        } else if (req.url === '/data/quiz-questions.json') {
          try {
            const filePath = path.join(process.cwd(), 'public', 'data', 'quiz-questions.json');
            const content = fs.readFileSync(filePath);
            
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Content-Length': content.length,
              'Cache-Control': 'no-cache'
            });
            
            return res.end(content);
          } catch (error) {
            console.error('Error serving quiz-questions.json:', error);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Quiz data not found' }));
          }
        } else {
          next();
        }
      }
    ],
    proxy: {
      '/api/convert-quiz': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.method === 'POST') {
              handleConvertQuiz(req, res);
            }
          });
        },
      },
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "enneaboost": path.resolve(__dirname, "./enneaboost/src"),
    },
  },
  publicDir: 'public'
}));

async function handleConvertQuiz(req: any, res: any) {
  try {
    const round1Data = xlsx.readFile('public/Quiz-triad-1.xlsx');
    const round2Data = xlsx.readFile('public/Quiz-triad-2.xlsx');
    const tieBreakerData = xlsx.readFile('public/Quiz-tiebreaker.xlsx');

    const quizData = {
      triadRound1: processTriadQuestions(round1Data),
      triadRound2: processTriadRound2Questions(round2Data, [1, 2, 3]),
      tieBreakers: processTieBreakers(tieBreakerData)
    };

    // Ensure directory exists
    const dir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file synchronously
    const filePath = path.join(dir, 'quiz-questions.json');
    fs.writeFileSync(filePath, JSON.stringify(quizData, null, 2));
    
    console.log('Quiz data written to:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    console.log('File size:', fs.statSync(filePath).size);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Quiz questions converted successfully' }));
  } catch (error) {
    console.error('Error converting quiz questions:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Failed to convert quiz questions',
      details: error instanceof Error ? error.message : String(error)
    }));
  }
}

function processTriadQuestions(workbook: xlsx.WorkBook) {
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  console.log('First row data:', jsonData[0]); // Let's see the column names
  
  // Group statements by Question Number
  const questionGroups = new Map();
  jsonData.forEach((row: any) => {
    const questionNum = row['Question Number'];
    if (!questionGroups.has(questionNum)) {
      questionGroups.set(questionNum, []);
    }
    questionGroups.get(questionNum).push({
      text: row.Statements,
      type: parseInt(row.Types || '0') // Changed from Type to Types
    });
  });

  // Convert grouped data to final format
  return Array.from(questionGroups.values()).map(statements => ({
    id: crypto.randomUUID(),
    text: "Select in order of what you most agree with",
    options: statements.map(statement => ({
      id: crypto.randomUUID(),
      text: statement.text,
      type: statement.type
    }))
  }));
}

function processTriadRound2Questions(workbook: xlsx.WorkBook, topTypes: number[]) {
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  
  // Group statements by Question Number
  const questionGroups = new Map();
  jsonData.forEach((row: any) => {
    const questionNum = row['Question Number'];
    const type = parseInt(row.Types || '0');
    
    // Only include statements for top 3 types
    if (!topTypes.includes(type)) return;
    
    if (!questionGroups.has(questionNum)) {
      questionGroups.set(questionNum, []);
    }
    questionGroups.get(questionNum).push({
      text: row.Statements,
      type: type
    });
  });

  // Convert grouped data to final format
  return Array.from(questionGroups.values())
    .filter(statements => statements.length === 3) // Ensure we have all 3 top types
    .map(statements => ({
      id: crypto.randomUUID(),
      text: "Select in order of what you most agree with",
      options: statements.map(statement => ({
        id: crypto.randomUUID(),
        text: statement.text,
        type: statement.type
      }))
    }));
}

function processTieBreakers(workbook: xlsx.WorkBook) {
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  
  // Group statements by Question Number
  const questionGroups = new Map();
  jsonData.forEach((row: any) => {
    const questionNum = row['Question Number'];
    const type = parseInt(row.Types || '0');
    
    if (!questionGroups.has(questionNum)) {
      questionGroups.set(questionNum, []);
    }
    questionGroups.get(questionNum).push({
      text: row.Statements,
      type: type
    });
  });

  return Array.from(questionGroups.values()).map(statements => ({
    id: crypto.randomUUID(),
    text: "Select which statement you most agree with",
    options: statements
  }));
}
