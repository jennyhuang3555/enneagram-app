
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const DeepDive = () => {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const sections = [
    {
      title: "Worldview & Motivation",
      content: "The core lens through which this type views and approaches life, seeking to maintain a sense of security and certainty through understanding and preparation. This fundamental drive shapes how they gather information and analyze situations, always working to create a stable foundation from which to operate.",
      expandedContent: "This fundamental orientation shapes how the individual perceives threats and opportunities, influencing their default responses to new situations. They often approach life with a methodical mindset, preferring to gather information and analyze potential outcomes before taking action. This careful approach stems from a deep-seated need to feel prepared and avoid uncertainty, though it can sometimes lead to overthinking or decision paralysis. The drive for security often manifests as a detailed understanding of systems and patterns, creating both profound insights and potential blindspots where their assumptions go unchallenged. This orientation can become both their greatest strength and their most significant limitation, depending on how flexibly they can hold their perspective.",
      gradient: "bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10"
    },
    {
      title: "Ideal Self",
      content: "The image of perfection this type strives towards, often serving as both inspiration and a source of internal pressure. This idealized version of themselves represents not just who they aspire to be, but often who they believe they must become to feel truly secure and worthy.",
      expandedContent: "This idealized self-image acts as an internal compass, guiding personal development while sometimes creating unrealistic expectations. The pursuit of this ideal can be both motivating and challenging, as it represents not just who they want to become, but often who they believe they must become to be worthy. This dynamic relationship with the ideal self can drive significant personal growth while also potentially leading to patterns of self-criticism and perfectionism. The gap between their current self and ideal self becomes both a source of motivation and anxiety, creating a complex dynamic that influences their decisions and relationships. This tension often leads to remarkable achievements but can also create patterns of chronic dissatisfaction and self-judgment that need to be consciously addressed for healthy development.",
      gradient: "bg-gradient-to-br from-orange-200/10 via-purple-500/10 to-blue-400/10"
    },
    {
      title: "Core Fixation",
      content: "The central pattern of attention and preoccupation that characterizes this type's habitual way of engaging with the world. This persistent focus becomes their default lens for interpreting experiences and making decisions, often operating below the threshold of conscious awareness.",
      expandedContent: "This persistent focus shapes their perception and response patterns, acting as both a lens through which they view reality and a filter that can limit their experience. The fixation often emerges from early life experiences and becomes a default strategy for managing anxiety and uncertainty. While it may have served a protective function initially, it can become restrictive and self-perpetuating without conscious awareness and intervention. The fixation operates like a cognitive filter, highlighting certain aspects of experience while diminishing others, creating a self-reinforcing pattern that shapes their worldview and behavioral responses. This pattern becomes both a source of expertise and a limitation, requiring conscious work to expand beyond its constraints while maintaining its gifts.",
      gradient: "bg-gradient-to-br from-blue-400/10 via-orange-200/10 to-purple-500/10"
    },
    {
      title: "High Side",
      content: "The gifts and positive qualities that emerge when this type is healthy and balanced, contributing unique value to the world. In this state, their natural tendencies become genuine strengths rather than compensatory mechanisms, allowing them to offer their best to others and their environment.",
      expandedContent: "When operating from this elevated state, they access their full potential and natural talents, offering their best contributions to others and their environment. This represents the integration of their core qualities with mature development, where their natural tendencies become genuine strengths rather than compensatory mechanisms. Their unique perspective and abilities can serve as powerful tools for positive change and impact. In this state, they maintain their characteristic strengths while gaining the flexibility to adapt their approach when needed. Their insights become more nuanced and their actions more effective, creating positive ripple effects in their relationships and work. This integration allows them to mentor others while continuing their own growth journey.",
      gradient: "bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10"
    },
    {
      title: "Low Side",
      content: "The challenges and reactive patterns that manifest when this type is stressed or unbalanced. During these periods, their typical patterns become more rigid and extreme, often leading to self-defeating behaviors and increased inner tension that affects both themselves and their relationships.",
      expandedContent: "During periods of stress or imbalance, their typical patterns become more rigid and extreme, often leading to self-defeating behaviors and increased inner tension. These reactive patterns can create cycles of frustration and disconnection, both internally and in relationships with others. Understanding these low-side manifestations is crucial for recognizing early warning signs and implementing effective self-care strategies. The amplification of their core patterns under stress can create self-reinforcing cycles that become increasingly difficult to break without conscious intervention. These periods often reveal the shadow aspects of their personality type, offering valuable insights for growth even as they create temporary setbacks and relationship challenges.",
      gradient: "bg-gradient-to-br from-orange-200/10 via-purple-500/10 to-blue-400/10"
    },
    {
      title: "Spiritual Lesson",
      content: "The core insight and transformative understanding that offers a path to growth and liberation for this type. This essential teaching points to the heart of their growth journey, offering a way beyond the limitations of their typical patterns and toward greater inner freedom.",
      expandedContent: "This essential teaching points to the heart of their growth journey, offering a way beyond the limitations of their typical patterns. It often involves embracing what feels counterintuitive or threatening to their usual way of being. The lesson usually requires facing core fears and letting go of long-held beliefs about what creates security and fulfillment. This transformation process leads to greater inner freedom and authentic expression. The journey often involves paradoxical truths that challenge their fundamental assumptions about life and themselves. Through this process, they discover that their greatest growth often comes through embracing what they've most strongly resisted, leading to a more integrated and balanced way of being.",
      gradient: "bg-gradient-to-br from-blue-400/10 via-orange-200/10 to-purple-500/10"
    }
  ];

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
              Type Deep Dive
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-white/90 font-georgia"
            >
              Explore the core patterns and growth path of your type
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`rounded-2xl shadow-lg overflow-hidden ${section.gradient}`}
            >
              <div className="p-8 md:p-12 backdrop-blur-sm">
                <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  <p className="text-lg text-black/80 font-georgia leading-relaxed">
                    {section.content}
                  </p>
                  <AnimatePresence initial={false}>
                    {expandedSections.includes(index) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-lg text-black/80 font-georgia leading-relaxed pt-4">
                          {section.expandedContent}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => toggleSection(index)}
                    className="flex items-center gap-2 text-purple-500 hover:text-purple-600 transition-colors"
                  >
                    <span className="text-sm font-georgia">
                      {expandedSections.includes(index) ? "Read less" : "Read more"}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedSections.includes(index) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DeepDive;
