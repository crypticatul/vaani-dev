import { useState, useEffect } from 'react';
import { Agent } from '@/hooks/useVoiceAgent';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Azure OpenAI credentials
const AZURE_OPENAI_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_DEPLOYMENT_NAME = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;
const AZURE_OPENAI_API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

interface AgentPreviewProps {
  agent: Agent;
}

const AgentPreview = ({ agent }: AgentPreviewProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<{type: 'user' | 'agent', text: string}[]>([]);
  
  // Handle transcript updates
  const handleTranscript = (text: string, isFinal: boolean) => {
    if (isFinal) {
      setMessages(prev => [...prev, { type: 'user', text }]);
    }
  };
  
  // Handle AI responses
  const handleAIResponse = (text: string, isFinal: boolean) => {
    if (isFinal) {
      setMessages(prev => [...prev, { type: 'agent', text }]);
    }
  };
  
  // Set up WebRTC with Azure OpenAI
  const {
    isListening,
    isProcessing,
    transcript,
    aiResponse,
    startListening,
    stopListening,
  } = useWebRTC({
    azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
    azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT,
    azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
    azureOpenAIDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME,
    onTranscript: handleTranscript,
    onAIResponse: handleAIResponse,
  });
  
  // Handle toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Add welcome message from agent
  useEffect(() => {
    setMessages([
      { 
        type: 'agent', 
        text: `Hello! I'm ${agent.name}, your AI assistant. How can I help you today?` 
      }
    ]);
  }, [agent]);
  
  return (
    <div className="flex flex-col h-[70vh] max-h-[800px]">
      <Card className="flex flex-col h-full glass-panel">
        <CardHeader className="border-b border-border/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {agent.name}
              <Badge variant="secondary" className="text-xs">
                {agent.gender === 'male' ? 'Male Voice' : 
                 agent.gender === 'female' ? 'Female Voice' : 'Neutral Voice'}
              </Badge>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-auto py-4 space-y-4 px-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground ml-4' 
                    : 'bg-muted text-foreground mr-4'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted text-foreground mr-4">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-foreground/60 rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {isListening && transcript && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-primary/50 text-primary-foreground ml-4 border border-primary animate-pulse">
                <p className="text-sm">{transcript}</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-border/50 py-3 px-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            className={`w-full relative ${isListening ? "" : "pulse-glow"}`}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Hold to Speak
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AgentPreview;
