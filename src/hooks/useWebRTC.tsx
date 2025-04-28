
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface UseWebRTCProps {
  azureOpenAIApiKey?: string;
  azureOpenAIEndpoint?: string;
  azureOpenAIApiVersion?: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAIResponse?: (text: string, isFinal: boolean) => void;
}

export function useWebRTC({
  azureOpenAIApiKey,
  azureOpenAIEndpoint,
  azureOpenAIApiVersion,
  onTranscript,
  onAIResponse,
}: UseWebRTCProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  
  // Refs for WebRTC connections
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  
  const startListening = async () => {
    if (!azureOpenAIApiKey || !azureOpenAIEndpoint) {
      toast.error("Azure OpenAI credentials are required");
      return;
    }
    
    try {
      setIsListening(true);
      setTranscript('');
      setAIResponse('');
      
      // Get microphone access
      const micStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      micStreamRef.current = micStream;
      
      // Create audio context
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(micStream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up WebSocket connection to Azure OpenAI
      setupWebSocket();
      
      // Start recording
      mediaRecorder.start(250);
      
      // Handle audio data
      mediaRecorder.ondataavailable = (event) => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
          webSocketRef.current.send(event.data);
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('Media Recorder error:', event);
        toast.error("Error with audio recording");
        stopListening();
      };
      
      toast.success("Listening...");
      
    } catch (error) {
      console.error("Error starting WebRTC:", error);
      toast.error("Failed to access microphone");
      setIsListening(false);
    }
  };
  
  const stopListening = () => {
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop microphone stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    
    // Close WebSocket
    if (webSocketRef.current) {
      webSocketRef.current.close();
      webSocketRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsListening(false);
    setIsProcessing(false);
  };
  
  const setupWebSocket = () => {
    // This is a mock implementation since we don't have the actual Azure OpenAI WebRTC endpoint
    // In a real implementation, you would connect to the Azure OpenAI realtime API endpoint
    
    const mockWebSocket = {
      readyState: WebSocket.OPEN,
      send: (data: any) => {
        // Simulate processing audio
        setIsProcessing(true);
        
        // Simulate transcription after a short delay
        setTimeout(() => {
          const mockTranscript = "This is a simulated transcript from Azure OpenAI.";
          setTranscript(mockTranscript);
          if (onTranscript) {
            onTranscript(mockTranscript, true);
          }
          
          // Simulate AI response
          setTimeout(() => {
            const mockResponse = "This is a simulated AI response from Azure OpenAI's GPT-4o Realtime API.";
            setAIResponse(mockResponse);
            if (onAIResponse) {
              onAIResponse(mockResponse, true);
            }
            setIsProcessing(false);
          }, 1000);
        }, 500);
      },
      close: () => {
        console.log('WebSocket closed');
      }
    } as unknown as WebSocket;
    
    webSocketRef.current = mockWebSocket;
    
    // In a real implementation, you would have code like this:
    /*
    const wsUrl = `${azureOpenAIEndpoint}/openai/gpt-4o-realtime/completions?api-version=${azureOpenAIApiVersion}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      
      // Send initial configuration
      ws.send(JSON.stringify({
        type: 'config',
        api_key: azureOpenAIApiKey,
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        
        if (response.type === 'transcript') {
          setTranscript(response.text);
          if (onTranscript) {
            onTranscript(response.text, response.is_final);
          }
        }
        
        if (response.type === 'response') {
          setAIResponse(response.text);
          if (onAIResponse) {
            onAIResponse(response.text, response.is_final);
          }
        }
        
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error("Connection error");
      stopListening();
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      if (isListening) {
        toast.info("Connection closed");
        stopListening();
      }
    };
    
    webSocketRef.current = ws;
    */
  };
  
  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);
  
  return {
    isListening,
    isProcessing,
    transcript,
    aiResponse,
    startListening,
    stopListening,
  };
}
