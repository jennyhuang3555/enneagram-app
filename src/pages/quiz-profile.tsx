import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from "@/lib/firebase";
import { TYPE_NAMES, TYPE_COLORS } from "@/lib/constants";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { useNavigate } from "react-router-dom";

const db = getFirestore(app);

const QuizProfile = () => {
  const { user } = useAuth();
  const [quizResults, setQuizResults] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!user) return;
      
      try {
        const quizResults = collection(db, 'quiz_results');
        const q = query(quizResults, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setQuizResults(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    fetchQuizResults();
  }, [user]);

  if (!quizResults) {
    return <div>Loading...</div>;
  }

  // Prepare chart data
  const chartData = Object.entries(TYPE_COLORS)
    .map(([type, color]) => ({
      name: `Type ${type.replace('type', '')}`,
      value: quizResults.scores[type] || 0,
      normalizedValue: quizResults.scores[type] || 0,
      color: color,
      isDominant: type === `type${quizResults.dominant_type}`
    }))
    .sort((a, b) => {
      const typeA = parseInt(a.name.replace('Type ', ''));
      const typeB = parseInt(b.name.replace('Type ', ''));
      return typeA - typeB;
    });

  // Calculate normalized values
  const maxScore = Math.max(...chartData.map(item => item.value));
  const minScore = Math.min(...chartData.map(item => item.value));
  const range = maxScore - minScore || 1;

  chartData.forEach(item => {
    const normalizedValue = ((item.value - minScore) / range) * 90;
    item.normalizedValue = Math.max(5, normalizedValue);
  });

  return (
    <div className="min-h-screen bg-white relative p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Your Enneagram Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-6 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
            onClick={() => navigate(`/type-deepdive/type${quizResults.dominant_type}`)}
          >
            <div className="mb-4">🎯</div>
            <h4 className="font-semibold mb-2">Primary Type</h4>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              Type {quizResults.dominant_type}
            </p>
            <p className="text-xl text-purple-500">
              {TYPE_NAMES[quizResults.dominant_type]}
            </p>
          </Card>

          <Card 
            className="p-6 bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer"
            onClick={() => navigate(`/type-deepdive/type${quizResults.second_type}`)}
          >
            <div className="mb-4">💫</div>
            <h4 className="font-semibold mb-2">Secondary Type</h4>
            <p className="text-3xl font-bold text-pink-600 mb-1">
              Type {quizResults.second_type}
            </p>
            <p className="text-xl text-pink-500">
              {TYPE_NAMES[quizResults.second_type]}
            </p>
          </Card>

          <Card 
            className="p-6 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
            onClick={() => navigate(`/type-deepdive/type${quizResults.third_type}`)}
          >
            <div className="mb-4">✨</div>
            <h4 className="font-semibold mb-2">Third Type</h4>
            <p className="text-3xl font-bold text-indigo-600 mb-1">
              Type {quizResults.third_type}
            </p>
            <p className="text-xl text-indigo-500">
              {TYPE_NAMES[quizResults.third_type]}
            </p>
          </Card>
        </div>

        <Card className="p-8">
          <div className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 0, bottom: 0, left: 60 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={60}
                  tick={{ fill: '#666', fontSize: 14 }}
                />
                <Bar
                  dataKey="normalizedValue"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizProfile; 