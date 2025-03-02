import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { typeDescriptions } from '@/data/typeDescriptions';
import { TYPE_NAMES } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TypeDeepDive = () => {
  const { typeNumber } = useParams();
  const navigate = useNavigate();
  const typeDesc = typeDescriptions[typeNumber || "1"];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-500 via-blue-400 to-orange-200 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-normal text-white mb-6 font-georgia"
            >
              Type {typeNumber}: {typeDesc.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Worldview & Motivation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Worldview & Motivation
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {typeDesc.worldviewAndMotivation}
            </p>
          </div>
        </motion.section>

        {/* Ideal Self */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Ideal Self
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {typeDesc.idealSelf}
            </p>
          </div>
        </motion.section>

        {/* Core Fixation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Core Fixation
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {typeDesc.coreFixation}
            </p>
          </div>
        </motion.section>

        {/* High Side */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              High Side
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {typeDesc.highSide}
            </p>
          </div>
        </motion.section>

        {/* Low Side */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Low Side
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {typeDesc.lowSide}
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default TypeDeepDive; 