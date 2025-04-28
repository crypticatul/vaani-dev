
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import AgentPreview from '@/components/agents/AgentPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter, 
} from '@/components/ui/dialog';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from 'react';

const AgentPreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getAgent } = useVoiceAgent();
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  
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
  
  const handleCopyEmbedCode = () => {
    if (agent.embedCode) {
      navigator.clipboard.writeText(agent.embedCode);
      toast.success('Embed code copied to clipboard');
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-8 gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/agents')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-1 neon-text">{agent.name}</h1>
          <p className="text-muted-foreground">
            Preview your voice agent and test its capabilities
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="lg:col-span-4">
          <AgentPreview agent={agent} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
            <h2 className="text-lg font-medium mb-4">Agent Configuration</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Voice Type</p>
                <p className="text-sm text-muted-foreground">
                  {agent.gender === 'male' ? 'Male Voice' : 
                  agent.gender === 'female' ? 'Female Voice' : 'Neutral Voice'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">System Prompt</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {agent.systemPrompt}
                </p>
              </div>
              
              {agent.knowledgeBase && agent.knowledgeBase.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Knowledge Base</p>
                  <p className="text-sm text-muted-foreground">
                    {agent.knowledgeBase.length} {agent.knowledgeBase.length === 1 ? 'source' : 'sources'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <Button variant="outline" onClick={() => navigate(`/agents/edit/${agent.id}`)}>
                Edit Configuration
              </Button>
              
              <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Embed Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Embed "{agent.name}" on your website</DialogTitle>
                    <DialogDescription>
                      Copy and paste this code into your website's HTML to add this voice agent.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <ScrollArea className="h-[200px] rounded-md border p-4 bg-muted/30">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                      {agent.embedCode}
                    </pre>
                  </ScrollArea>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEmbedDialogOpen(false)}>Close</Button>
                    <Button onClick={handleCopyEmbedCode}>
                      Copy Code
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
            <h2 className="text-lg font-medium mb-4">Instructions</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the "Hold to Speak" button to start speaking to the agent. When you're done, click "Stop Listening".
              </p>
              <p className="text-sm text-muted-foreground">
                This is a preview of how your agent will function when embedded on your website. You can customize the agent's behavior by editing its configuration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPreviewPage;
