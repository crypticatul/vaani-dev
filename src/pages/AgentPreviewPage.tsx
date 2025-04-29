import { useParams } from 'react-router-dom';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import AgentPreview from '@/components/agents/AgentPreview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AgentPreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getAgent } = useVoiceAgent();
  
  const agent = id ? getAgent(id) : undefined;
  
  // For demo purposes, create a fallback agent if none is found
  const demoAgent = {
    id: 'demo',
    name: 'Demo Assistant',
    systemPrompt: 'You are a helpful assistant.',
    gender: 'neutral',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as const;
  
  const currentAgent = agent || demoAgent;

  return (
    <motion.div 
      className="container mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 neon-text">Voice Agent Preview</h1>
        <p className="text-muted-foreground mb-6">
          Test your voice agent in real-time
        </p>
        
        {!agent && id !== 'demo' && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Agent not found</AlertTitle>
            <AlertDescription>
              The requested agent could not be found. Showing a demo agent instead.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AgentPreview agent={currentAgent} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Click the "Hold to Speak" button to start talking</li>
              <li>Speak clearly into your microphone</li>
              <li>The AI will respond once you finish speaking</li>
              <li>Click "Stop Listening" when you're done</li>
            </ol>
          </div>
          
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Agent Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="block font-medium">{currentAgent.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Voice Type:</span>
                <span className="block font-medium capitalize">{currentAgent.gender} Voice</span>
              </div>
              <div>
                <span className="text-muted-foreground">System Prompt:</span>
                <p className="block font-medium mt-1 text-sm bg-muted p-3 rounded">
                  {currentAgent.systemPrompt || "Be a helpful assistant."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentPreviewPage;
