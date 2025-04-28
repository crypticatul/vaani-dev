
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Conversations",
      description: "Create intelligent voice agents that understand and respond naturally"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and data protection for your peace of mind"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time responses with minimal latency for smooth interactions"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient-bg overflow-hidden">
        <div className="sound-wave-bg" />
        <div className="wave-pattern" />
        
        <motion.div
          className="container mx-auto px-4 text-center z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00FFC2] via-[#00B4DB] to-[#BD00FF]"
            variants={itemVariants}
          >
            Voice AI Agent Creator
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Create sophisticated AI voice agents that understand, learn, and engage naturally with your users.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => navigate('/dashboard')}
              className="gradient-btn text-white px-8 py-6 text-lg rounded-full hover:scale-105 transform transition-all duration-300"
            >
              Get Started
            </Button>
          </motion.div>
          
          <motion.div 
            className="scroll-down-btn"
            variants={itemVariants}
            whileHover={{ y: 5 }}
          >
            <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
          </motion.div>
        </motion.div>

        {/* Purple gradient blobs */}
        <div className="purple-blob w-96 h-96 top-20 left-20 opacity-30" />
        <div className="purple-blob w-96 h-96 bottom-20 right-20 opacity-30" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              Powerful Features
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
