import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SignUpForm from "@/components/SignUpForm";

const SignUp = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
      
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-2xl p-12 space-y-8 animate-fade-in bg-white/95 backdrop-blur rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Create Your Account
          </h2>
          <p className="text-xl text-gray-600 text-center">
            Join us to track your progress and save your results
          </p>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp; 