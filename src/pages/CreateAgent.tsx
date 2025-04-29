
import AgentForm from '@/components/agents/AgentForm';
import { motion } from 'framer-motion';

const CreateAgent = () => {
  return (
    <motion.div 
      className="container mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 neon-text">Create Voice Agent</h1>
        <p className="text-muted-foreground">
          Configure your AI voice agent's details and capabilities
        </p>
      </div>
      
      <AgentForm mode="create" />
    </motion.div>
  );
};

export default CreateAgent;
