
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import AgentCard from '@/components/agents/AgentCard';
import { Skeleton } from '@/components/ui/skeleton';

const Agents = () => {
  const navigate = useNavigate();
  const { agents, loading } = useVoiceAgent();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter agents based on search term
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Create new agent
  const handleCreateAgent = () => {
    navigate('/agents/create');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 neon-text">My Voice Agents</h1>
          <p className="text-muted-foreground">
            Manage and deploy your AI voice agents
          </p>
        </div>
        
        <Button onClick={handleCreateAgent} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search agents..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(4).fill(null).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-[220px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        filteredAgents.length > 0 ? (
          // Agent cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          // No agents or no search results
          <div className="text-center p-12 border border-dashed rounded-lg">
            {searchTerm ? (
              <div>
                <p className="text-lg font-medium mb-2">No matching agents found</p>
                <p className="text-muted-foreground mb-4">
                  Try a different search term or clear your search
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">You don't have any agents yet</p>
                <p className="text-muted-foreground mb-4">
                  Create your first voice agent to get started
                </p>
                <Button onClick={handleCreateAgent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agent
                </Button>
              </div>
            )}
          </div>
        )
      )}
  </motion.div>
  );
};

export default Agents;
