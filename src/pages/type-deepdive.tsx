import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { typeDescriptions } from '@/data/typeDescriptions';
import { TYPE_NAMES } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TypeDeepDive = () => {
  const { typeNumber } = useParams();
  const navigate = useNavigate();
  const cleanTypeNumber = typeNumber?.replace('type', '');
  const typeKey = `type${cleanTypeNumber}`;
  const typeDesc = typeDescriptions[typeKey as keyof typeof typeDescriptions];
  const typeName = TYPE_NAMES[typeKey as keyof typeof TYPE_NAMES];

  if (!typeDesc) {
    return <div>Type not found</div>;
  }

  return (
    <div className="min-h-screen bg-white relative p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
      
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
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {typeDesc.title}
          </h2>

          <div className="space-y-8 mt-8">
            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                In a Nutshell
              </h3>
              <p className="text-base text-gray-600">{typeDesc.inNutshell}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Motivation and Core Fears
              </h3>
              <p className="text-base text-gray-600">{typeDesc.motivationAndFears}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Worldview and Focus of Attention
              </h3>
              <p className="text-base text-gray-600">{typeDesc.worldview}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Growth Path
              </h3>
              <p className="text-base text-gray-600 mb-4">{typeDesc.growthDescription}</p>
              <ul className="list-disc pl-6 space-y-2">
                {typeDesc.growthQuestions.map((question, index) => (
                  <li key={index} className="text-base text-gray-600">{question}</li>
                ))}
              </ul>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TypeDeepDive; 