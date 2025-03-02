import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Quiz from '@/pages/quiz';
import Login from '@/pages/login';
import SignUp from '@/pages/signup';
import Dashboard from '@/pages/dashboard';
import HomeMain from './pages/index';
import { useAuth } from '@/contexts/AuthContext';
import Logout from '@/pages/logout';
import TypeDeepDive from './pages/type-deepdive';
import QuizProfile from '@/pages/quiz-profile';
import AICoachPrep from "@/pages/ai-coach-prep";
import AIChatScreen from '@/pages/ai-chat';
import CentresPage from './pages/centres';
import GrowthPathPage from '@/pages/growth-path';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeMain />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/type-deepdive/:typeNumber" element={<TypeDeepDive />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <QuizProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-coach" 
            element={
              <ProtectedRoute>
                <AICoachPrep />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-chat" 
            element={
              <ProtectedRoute>
                <AIChatScreen />
              </ProtectedRoute>
            } 
          />
          <Route path="/centres/:typeNumber" element={<CentresPage />} />
          <Route 
            path="/growth-paths/core-fear/:typeNumber" 
            element={<GrowthPathPage pathType="core-fear" />} 
          />
          <Route 
            path="/growth-paths/triggers/:typeNumber" 
            element={<GrowthPathPage pathType="triggers" />} 
          />
          <Route 
            path="/growth-paths/spiritual-gift/:typeNumber" 
            element={<GrowthPathPage pathType="spiritual-gift" />} 
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;