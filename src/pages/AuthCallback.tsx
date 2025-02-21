// src/pages/AuthCallback.tsx
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
  
    useEffect(() => {
      const handleEmailConfirmation = async () => {
        try {
          // First try to get the token from the URL fragment
          let access_token = null;
          let refresh_token = null;

          // Check URL fragment first
          if (window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            access_token = hashParams.get('access_token');
            refresh_token = hashParams.get('refresh_token');
          }

          // If not in fragment, check query parameters
          if (!access_token) {
            const queryParams = new URLSearchParams(window.location.search);
            access_token = queryParams.get('access_token');
            refresh_token = queryParams.get('refresh_token');
          }

          console.log("URL info:", {
            hash: window.location.hash,
            search: window.location.search,
            access_token: !!access_token
          });

          if (!access_token) {
            // If no token, try to get existing session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;
            if (!session) throw new Error('No session found');
            
            // Use the session we found
            access_token = session.access_token;
            refresh_token = session.refresh_token;
          }

          if (!access_token) throw new Error('No access token found');

          // Set the session with the tokens
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || '',
          });

          if (sessionError) throw sessionError;
          if (!session) throw new Error('No session found');

          // Link quiz results to user
          const temp_id = localStorage.getItem('temp_id');
          if (temp_id) {
            console.log("Linking quiz results with temp_id:", temp_id);
            const { error: updateError } = await supabase
              .from('quiz_results')
              .update({ 
                user_id: session.user.id,
                email: session.user.email 
              })
              .eq('temp_id', temp_id);

            if (updateError) {
              console.error('Error linking results:', updateError);
              throw updateError;
            }
            localStorage.removeItem('temp_id');
          }

          toast({
            title: "Success",
            description: "Email verified successfully! View your results in the dashboard.",
          });
          navigate('/dashboard');
        } catch (error: any) {
          console.error('Verification error:', error);
          toast({
            title: "Error",
            description: error.message || 'Failed to verify email',
            variant: "destructive",
          });
          // Instead of navigating to home, let's navigate to login
          navigate('/login');
        }
      };
  
      handleEmailConfirmation();
    }, [navigate, toast]);
  
    return (
      <div className="min-h-screen bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8">
            <p>Verifying your email...</p>
          </Card>
        </div>
      </div>
    );
  };

export default AuthCallback;