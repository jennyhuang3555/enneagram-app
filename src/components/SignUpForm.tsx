import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface SignUpFormProps {
  onSuccess: () => void;
  quizScores?: { [key: string]: number };
}

const SignUpForm = ({ onSuccess, quizScores }: SignUpFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password || !name) {
        throw new Error('Please fill in all fields');
      }

      const user = await signUp(email, password, name);
      
      toast({
        title: "Check your email",
        description: "We've sent you a verification link.",
        duration: 5000,
      });

      navigate('/verify-email', { state: { email } });
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      toast({
        title: "Error",
        description: err.message || 'An error occurred during sign up',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Create Your Account
        </h2>
        <p className="text-base text-gray-600 text-center">
          Sign up to save your results and track your progress
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-base p-4 placeholder:text-sm placeholder:text-gray-400"
          />
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-base p-4 placeholder:text-sm placeholder:text-gray-400"
          />
          <Input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-base p-4 placeholder:text-sm placeholder:text-gray-400"
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SignUpForm; 