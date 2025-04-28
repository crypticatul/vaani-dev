
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AgentForm from '@/components/agents/AgentForm';

const CreateAgent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // If user is not logged in, don't render the content
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 neon-text">Create Voice Agent</h1>
        <p className="text-muted-foreground">
          Configure your AI voice agent's details and capabilities
        </p>
      </div>
      
      <AgentForm mode="create" />
    </div>
  );
};

export default CreateAgent;
