
import { ArrowRight, Mic, Zap, Globe, Brain, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        <div className="absolute inset-0 wave-pattern opacity-5" />
        
        <div className="container px-4 py-32 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6 font-bold text-glow">
              Create Voice AI Agents
              <br />
              <span className="text-primary">In Minutes</span>
            </h1>
            
            <p className="mb-8 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Deploy intelligent voice agents powered by Azure OpenAI to your website.
              Engage users with natural conversations and boost interaction.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-btn animate-pulse-glow"
                onClick={() => navigate('/dashboard')}
              >
                Get Started
                <ArrowRight className="ml-2" />
              </Button>
            </div>

            <div className="mt-12 sound-wave justify-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="animate-waveform" />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-accent/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-center mb-16 text-glow">
            Powerful Features for Your
            <span className="text-primary"> Voice AI</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <feature.icon className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-16 text-glow">
            Create Your Agent in
            <span className="text-primary"> Three Steps</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center neo-glow">
                  <span className="text-2xl font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              className="gradient-btn"
              onClick={() => navigate('/dashboard')}
            >
              Create Your Agent Now
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: Mic,
    title: "Natural Voice Interactions",
    description: "Engage users with human-like voice conversations powered by Azure OpenAI."
  },
  {
    icon: Brain,
    title: "Custom Knowledge Base",
    description: "Train your agent with specific knowledge from documents or websites."
  },
  {
    icon: Zap,
    title: "Real-time Responses",
    description: "Lightning-fast responses with WebRTC and Azure's real-time API."
  },
  {
    icon: Globe,
    title: "Easy Integration",
    description: "Deploy to any website with a simple embed code."
  },
  {
    icon: Cloud,
    title: "Cloud Processing",
    description: "Leverage Azure's powerful cloud infrastructure for processing."
  }
];

const steps = [
  {
    title: "Create Your Agent",
    description: "Define your agent's personality, knowledge base, and voice characteristics."
  },
  {
    title: "Configure Settings",
    description: "Set up Azure OpenAI credentials and customize agent behavior."
  },
  {
    title: "Deploy & Engage",
    description: "Get your embed code and start engaging with users instantly."
  }
];

export default Landing;
