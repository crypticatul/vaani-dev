
import { useParams, useNavigate } from 'react-router-dom';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import AgentForm from '@/components/agents/AgentForm';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const EditAgent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAgent } = useVoiceAgent();
  
  const agent = id ? getAgent(id) : undefined;
  
  useEffect(() => {
    // If agent doesn't exist, show error and redirect
    if (id && !agent) {
      toast.error('Agent not found');
      navigate('/agents');
    }
  }, [navigate, id, agent]);
  
  // If agent is not found, don't render the content
  if (!agent) {
    return null;
  }

  return (
    <motion.div 
      className="container mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 neon-text">Edit Voice Agent</h1>
        <p className="text-muted-foreground">
          Update your voice agent's details and capabilities
        </p>
      </div>
      
      <AgentForm mode="edit" existingAgent={agent} />
    </motion.div>
  );
};

export default EditAgent;
