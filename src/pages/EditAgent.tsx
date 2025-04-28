
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import AgentForm from '@/components/agents/AgentForm';
import { toast } from 'sonner';

const EditAgent = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getAgent } = useVoiceAgent();
  
  const agent = id ? getAgent(id) : undefined;
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
    
    // If agent doesn't exist, show error and redirect
    if (id && !agent) {
      toast.error('Agent not found');
      navigate('/agents');
    }
  }, [user, navigate, id, agent]);
  
  // If user is not logged in or agent is not found, don't render the content
  if (!user || !agent) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 neon-text">Edit Voice Agent</h1>
        <p className="text-muted-foreground">
          Update your voice agent's details and capabilities
        </p>
      </div>
      
      <AgentForm mode="edit" existingAgent={agent} />
    </div>
  );
};

export default EditAgent;
