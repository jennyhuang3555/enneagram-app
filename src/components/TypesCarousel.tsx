import { motion } from "framer-motion";

export default function TypesCarousel() {
  const types = Array.from({ length: 9 }, (_, i) => ({
    number: i + 1,
    name: `Type ${i + 1}`,
    description: "Description coming soon..."
  }));

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-normal text-center mb-12"
        >
          The Nine Types
        </motion.h2>
        <div className="flex overflow-x-auto gap-6 pb-6">
          {types.map((type) => (
            <motion.div
              key={type.number}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-none w-80 bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-medium mb-2">{type.name}</h3>
              <p className="text-gray-600">{type.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 