import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { linkQuizResultsToUser } from "@/lib/firestore";

interface SignUpFormProps {
  onSuccess?: () => void;
  quizScores?: { [key: string]: number };
}

const SignUpForm = ({ onSuccess, quizScores }: SignUpFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!email || !password || !firstName) {
        throw new Error('Please fill in all fields');
      }

      const user = await signUp(email, password, firstName);
      
      const temp_id = localStorage.getItem('temp_id');
      if (temp_id && user.uid) {
        await linkQuizResultsToUser(temp_id, user.uid, firstName, email);
        localStorage.removeItem('temp_id');
      }

      toast({
        title: "Account Created",
        description: "Please check your email to confirm your account.",
        duration: 5000,
      });

      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || 'An error occurred during sign up',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
        <Input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isLoading}
          className="text-lg p-4 placeholder:text-base placeholder:text-gray-400 w-full"
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="text-lg p-4 placeholder:text-base placeholder:text-gray-400 w-full"
        />
        <Input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="text-lg p-4 placeholder:text-base placeholder:text-gray-400 w-full"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-3/4 text-lg py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity mt-2"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Card>
  );
};

export default SignUpForm; 