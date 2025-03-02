import { motion } from "framer-motion";

export default function SessionTopics() {
  const topics = [
    "Understanding Core Patterns",
    "Emotional Intelligence",
    "Personal Growth",
    "Relationship Dynamics"
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-normal text-center mb-12"
        >
          Session Topics
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topics.map((topic, index) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-medium mb-2">{topic}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 