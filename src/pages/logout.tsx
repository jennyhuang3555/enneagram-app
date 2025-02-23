import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const Logout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        toast({
          title: "Logged out successfully",
          description: "Come back soon!",
        });
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      }
    };

    handleLogout();
  }, [signOut, navigate, toast]);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
      
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 space-y-4 animate-fade-in bg-white/95 backdrop-blur">
          <h2 className="text-2xl font-semibold text-center">Logging you out...</h2>
          <p className="text-gray-600 text-center">Please wait</p>
        </Card>
      </div>
    </div>
  );
};

export default Logout; 