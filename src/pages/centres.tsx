import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { centreDescriptions } from "@/data/centreDescriptions";
import { TYPE_CENTERS } from "@/lib/constants";

const CentresPage = () => {
  const { typeNumber } = useParams();
  const navigate = useNavigate();

  // Determine which center this type belongs to
  const getCenterForType = (type: string) => {
    for (const [center, types] of Object.entries(TYPE_CENTERS)) {
      if (types.includes(type)) {
        return center;
      }
    }
    return null;
  };

  const center = getCenterForType(typeNumber || "");
  const description = centreDescriptions[typeNumber || ""]?.[center as keyof typeof centreDescriptions[string]];

  if (!description) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {description.title}
          </h2>

          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Overview
              </h3>
              <p className="text-base text-gray-600">{description.centerOverview}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Type Expression
              </h3>
              <p className="text-base text-gray-600">{description.typeInContext}</p>
              <p className="text-base text-gray-600 mt-4">{description.typeComparison}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Mental Pattern
              </h3>
              <p className="text-base text-gray-600">{description.mentalPattern}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Core Struggle
              </h3>
              <p className="text-base text-gray-600">{description.coreStruggle}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Common Phrases
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {description.commonPhrases.map((phrase, index) => (
                  <li key={index} className="text-base text-gray-600">{phrase}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Hidden Fears
              </h3>
              <p className="text-base text-gray-600">{description.hiddenFears}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Key Challenge
              </h3>
              <p className="text-base text-gray-600">{description.keyChallenge}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Spiritual Lesson
              </h3>
              <p className="text-base text-gray-600">{description.spiritualLesson}</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CentresPage; 