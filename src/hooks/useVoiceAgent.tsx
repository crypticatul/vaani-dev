
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Types
export interface Agent {
  id: string;
  name: string;
  systemPrompt: string;
  gender: 'male' | 'female' | 'neutral';
  knowledgeBase?: string[];
  knowledgeBaseType?: 'url' | 'file' | 'text';
  embedCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface VoiceAgentContextType {
  agents: Agent[];
  createAgent: (agent: Omit<Agent, 'id' | 'embedCode' | 'createdAt' | 'updatedAt'>) => Promise<Agent>;
  updateAgent: (agent: Agent) => Promise<Agent>;
  deleteAgent: (id: string) => Promise<void>;
  getAgent: (id: string) => Agent | undefined;
  loading: boolean;
  error: string | null;
}

const VoiceAgentContext = createContext<VoiceAgentContextType | undefined>(undefined);

interface VoiceAgentProviderProps {
  children: ReactNode;
}

const generateEmbedCode = (agentId: string): string => {
  return `
<!-- Vaani.dev Embed Code -->
<script>
  (function(w, d, s, o) {
    var j = d.createElement(s);
    j.async = true;
j.src = 'https://cdn.vaani.dev/widget.js';
      j.onload = function() {
      w.VaaniDev.init({
        agentId: '${agentId}',
        position: 'bottom-right'
      });
    };
    var f = d.getElementsByTagName(s)[0];
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script');
</script>
<!-- End Vaani.dev Embed Code -->
  `;
};

export const VoiceAgentProvider = ({ children }: VoiceAgentProviderProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load agents from localStorage on component mount
  useEffect(() => {
    try {
      const storedAgents = localStorage.getItem('voice-agents');
      if (storedAgents) {
        setAgents(JSON.parse(storedAgents));
      }
    } catch (error) {
      console.error('Error loading agents from localStorage:', error);
      setError('Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save agents to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('voice-agents', JSON.stringify(agents));
    }
  }, [agents, loading]);

  const createAgent = async (newAgent: Omit<Agent, 'id' | 'embedCode' | 'createdAt' | 'updatedAt'>): Promise<Agent> => {
    setLoading(true);
    try {
      // Generate a unique ID for the agent
      const id = uuidv4();
      
      // Create the agent with embed code and timestamps
      const agent: Agent = {
        ...newAgent,
        id,
        embedCode: generateEmbedCode(id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add the agent to the list
      setAgents((prevAgents) => [...prevAgents, agent]);
      
      toast.success(`Agent "${agent.name}" created successfully`);
      return agent;
    } catch (error) {
      console.error('Error creating agent:', error);
      setError('Failed to create agent. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAgent = async (updatedAgent: Agent): Promise<Agent> => {
    setLoading(true);
    try {
      // Update the agent in the list
      const updated = { ...updatedAgent, updatedAt: new Date().toISOString() };
      
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === updatedAgent.id ? updated : agent
        )
      );
      
      toast.success(`Agent "${updatedAgent.name}" updated successfully`);
      return updated;
    } catch (error) {
      console.error('Error updating agent:', error);
      setError('Failed to update agent. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Find the agent to get its name for the toast message
      const agentToDelete = agents.find(agent => agent.id === id);
      
      // Remove the agent from the list
      setAgents((prevAgents) => prevAgents.filter((agent) => agent.id !== id));
      
      if (agentToDelete) {
        toast.success(`Agent "${agentToDelete.name}" deleted successfully`);
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError('Failed to delete agent. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAgent = (id: string): Agent | undefined => {
    return agents.find((agent) => agent.id === id);
  };

  return (
    <VoiceAgentContext.Provider
      value={{
        agents,
        createAgent,
        updateAgent,
        deleteAgent,
        getAgent,
        loading,
        error,
      }}
    >
      {children}
    </VoiceAgentContext.Provider>
  );
};

export const useVoiceAgent = () => {
  const context = useContext(VoiceAgentContext);
  if (context === undefined) {
    throw new Error('useVoiceAgent must be used within a VoiceAgentProvider');
  }
  return context;
};
