import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    
    console.log('Starting signup process with:', { email, name });
    setIsLoading(true);
    setIsSubmitDisabled(true);
    setError(null);

    try {
      if (!email || !password || !name) {
        throw new Error('Please fill in all fields');
      }

      console.log('Calling signUp function...');
      const result = await signUp(email, password, name);
      console.log('SignUp function completed:', result);
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      onSuccess();
    } catch (err: any) {
      console.error('Sign up error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        stack: err.stack
      });
      setError(err.message || 'An error occurred during sign up');
      toast({
        title: "Error",
        description: err.message || 'An error occurred during sign up',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Re-enable submit after 60 seconds
      setTimeout(() => setIsSubmitDisabled(false), 60000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl p-12 space-y-8 animate-fade-in bg-white/95 backdrop-blur">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Create Your Account
        </h2>
        <p className="text-xl text-gray-600 text-center">
          Sign up to save your results and track your progress
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-2xl p-6"
          />
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-2xl p-6"
          />
          <Input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-2xl p-6"
          />
          <Button 
            type="submit"
            disabled={isLoading || isSubmitDisabled}
            className="w-full text-xl py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {isLoading ? "Creating Account..." : 
             isSubmitDisabled ? "Please wait..." : 
             "Create Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SignUpForm; 