
import { IntroPage } from "@/components/IntroPage";
import { useToast } from "@/hooks/use-toast";

const CoreMotivationIntro = () => {
  const { toast } = useToast();
  
  const handleStart = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!",
    });
  };

  return (
    <IntroPage
      title="Understand Your Core Motivation"
      description="✨ Discover how your **core motivation shapes your life.**\n\n🔍 **What truly drives you?**\nWhere does it show up?\nHow does it guide you?\n\n🪑 Find yourself a **quiet, comfortable place.**\n⏰ Set aside **at least 10 minutes** for this session."
      onStart={handleStart}
      imagePath="/placeholder.svg"
    />
  );
};

export default CoreMotivationIntro;
