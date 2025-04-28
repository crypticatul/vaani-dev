
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, ExternalLink, Code, BarChart } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not logged in, redirect to login page
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Return empty if user is not logged in (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 neon-text">
          VoiceAgent Weave
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
          Create powerful AI voice agents and deploy them anywhere with a simple embed code.
        </p>
        
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Button size="lg" onClick={() => navigate('/agents/create')} className="pulse-glow">
            Create Your First Agent
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/agents')}>
            View My Agents
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Create
            </CardTitle>
            <CardDescription>
              Build custom voice agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            Design AI voice agents with custom instructions, personalities, and knowledge bases.
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-secondary" />
              Deploy
            </CardTitle>
            <CardDescription>
              Embed on any website
            </CardDescription>
          </CardHeader>
          <CardContent>
            Get a simple HTML snippet to add your voice agent to any website in seconds.
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Engage
            </CardTitle>
            <CardDescription>
              Connect with users
            </CardDescription>
          </CardHeader>
          <CardContent>
            Provide natural, voice-based interactions powered by Azure OpenAI GPT-4o.
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Analyze
            </CardTitle>
            <CardDescription>
              Track performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            Monitor your agents' interactions, usage, and user satisfaction metrics.
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Your Agent</h3>
            <p className="text-muted-foreground">Define your agent's personality, knowledge, and voice characteristics.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-secondary">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Copy Embed Code</h3>
            <p className="text-muted-foreground">Get a customizable HTML snippet for your voice agent.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-accent">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Deploy Anywhere</h3>
            <p className="text-muted-foreground">Add the code to your website and engage users with voice AI.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.open('https://azure.microsoft.com/en-us/products/ai-services/openai-service', '_blank')}
          className="flex items-center gap-2"
        >
          Learn about Azure OpenAI
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
