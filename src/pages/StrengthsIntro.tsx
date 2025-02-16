
import { IntroPage } from "@/components/IntroPage";
import { useToast } from "@/hooks/use-toast";

const StrengthsIntro = () => {
  const { toast } = useToast();
  
  const handleStart = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!",
    });
  };

  return (
    <IntroPage
      title="Harness Your Natural Strengths"
      description="✨ Learn to leverage your **innate capabilities and talents.**\n\n🔍 **What are your unique gifts?**\nHow do they show up in your life?\nHow can you amplify them?\n\n🪑 Find yourself a **quiet, comfortable place.**\n⏰ Set aside **at least 10 minutes** for this session."
      onStart={handleStart}
      imagePath="/lovable-uploads/8edef14d-b3a6-4775-a880-f90577fcc3d2.png"
    />
  );
};

export default StrengthsIntro;
