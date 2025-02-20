import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

// src/pages/VerifyEmail.tsx
const VerifyEmail = () => {
    const location = useLocation();
    const email = location.state?.email;
  
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-gray-600">
            We've sent a verification link to:<br/>
            <span className="font-medium">{email}</span>
          </p>
          <p className="text-sm text-gray-500">
            Click the link in your email to complete your registration and access your results.
          </p>
        </Card>
      </div>
    );
  };

export default VerifyEmail;