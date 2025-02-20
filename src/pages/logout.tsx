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
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8">
        <p>Logging you out...</p>
      </Card>
    </div>
  );
};

export default Logout; 