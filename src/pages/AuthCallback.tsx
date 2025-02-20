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
          const session_id = localStorage.getItem('quiz_session_id');
          if (session_id) {
            console.log("Updating quiz profile with session_id:", session_id);
            const { error: updateError } = await supabase
              .from('quiz_profile')
              .update({ 
                user_id: session.user.id,
                name: session.user.user_metadata?.name,
                email: session.user.email
              })
              .eq('session_id', session_id);

            if (updateError) {
              console.error('Error linking results:', updateError);
              throw updateError;
            }
            localStorage.removeItem('quiz_session_id');
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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p>Verifying your email...</p>
        </Card>
      </div>
    );
  };

export default AuthCallback;