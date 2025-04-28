
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Edit, Trash2, Copy, ExternalLink } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter, 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useVoiceAgent, Agent } from '@/hooks/useVoiceAgent';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const navigate = useNavigate();
  const { deleteAgent } = useVoiceAgent();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  
  const handleEdit = () => {
    navigate(`/agents/edit/${agent.id}`);
  };
  
  const handleDelete = async () => {
    try {
      await deleteAgent(agent.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };
  
  const handleCopyEmbedCode = () => {
    if (agent.embedCode) {
      navigator.clipboard.writeText(agent.embedCode);
      toast.success('Embed code copied to clipboard');
    }
  };
  
  const handlePreview = () => {
    navigate(`/agents/preview/${agent.id}`);
  };
  
  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case 'male':
        return <Badge className="bg-blue-500">Male</Badge>;
      case 'female':
        return <Badge className="bg-pink-500">Female</Badge>;
      case 'neutral':
        return <Badge className="bg-purple-500">Neutral</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="card-gradient overflow-hidden border border-primary/30 hover:shadow-md hover:shadow-primary/20 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span className="text-primary">{agent.name}</span>
          {getGenderBadge(agent.gender)}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Created {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-foreground/90 mb-2">{truncateText(agent.systemPrompt, 100)}</p>
        
        {agent.knowledgeBase && agent.knowledgeBase.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground font-medium">Knowledge Base:</p>
            <p className="text-xs text-muted-foreground">
              {agent.knowledgeBase.length} {agent.knowledgeBase.length === 1 ? 'source' : 'sources'}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-8" onClick={handleEdit}>
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon" className="h-8 w-8">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Agent</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{agent.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-8" onClick={handlePreview}>
            <MessageCircle className="h-3.5 w-3.5 mr-1" />
            Preview
          </Button>
          
          <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Embed
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
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Code
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
