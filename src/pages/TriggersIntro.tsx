
import { IntroPage } from "@/components/IntroPage";
import { useToast } from "@/hooks/use-toast";

const TriggersIntro = () => {
  const { toast } = useToast();
  
  const handleStart = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!",
    });
  };

  return (
    <IntroPage
      title="Work With Your Triggers"
      description="✨ Transform challenging moments into **opportunities for growth.**\n\n🔍 **What situations challenge you most?**\nHow do you typically respond?\nWhat patterns do you notice?\n\n🪑 Find yourself a **quiet, comfortable place.**\n⏰ Set aside **at least 10 minutes** for this session."
      onStart={handleStart}
      imagePath="/placeholder.svg"
    />
  );
};

export default TriggersIntro;
