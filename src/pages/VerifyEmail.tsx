import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

// src/pages/VerifyEmail.tsx
const VerifyEmail = () => {
    const location = useLocation();
    const email = location.state?.email;
  
    return (
      <div className="min-h-screen bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20">
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 61,35 88,35 67,52 76,77 50,63 24,77 33,52 12,35 39,35" fill="currentColor"/></svg>')`,
              backgroundSize: '24px',
            }}
          />
        </div>

        <div className="min-h-screen flex items-center justify-center p-8">
          <Card className="w-full max-w-2xl p-12 space-y-8 animate-fade-in bg-white/95 backdrop-blur">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Check Your Email
            </h2>
            <p className="text-xl text-gray-600 text-center">
              We've sent a verification link to:<br/>
              <span className="font-medium">{email}</span>
            </p>
            <p className="text-base text-gray-500 text-center">
              Click the link in your email to complete your registration and access your results.
            </p>
          </Card>
        </div>
      </div>
    );
  };

export default VerifyEmail;