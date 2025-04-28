
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const History = () => {
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
        <h1 className="text-3xl font-bold mb-2 neon-text">Conversation History</h1>
        <p className="text-muted-foreground">
          View and analyze your agents' past conversations
        </p>
      </div>
      
      <div className="text-center p-12 border border-dashed rounded-lg">
        <p className="text-lg font-medium mb-2">Coming Soon</p>
        <p className="text-muted-foreground">
          This feature is currently under development.
        </p>
      </div>
    </div>
  );
};

export default History;
