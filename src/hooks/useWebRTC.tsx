
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface UseWebRTCProps {
  azureOpenAIApiKey?: string;
  azureOpenAIEndpoint?: string;
  azureOpenAIApiVersion?: string;
  azureOpenAIDeploymentName?: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAIResponse?: (text: string, isFinal: boolean) => void;
}

export function useWebRTC({
  azureOpenAIApiKey,
  azureOpenAIEndpoint,
  azureOpenAIApiVersion,
  azureOpenAIDeploymentName,
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
    if (!azureOpenAIApiKey || !azureOpenAIEndpoint || !azureOpenAIDeploymentName) {
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
    try {
      // Connect to Azure OpenAI Realtime API
      const wsUrl = `${azureOpenAIEndpoint}&api-key=${azureOpenAIApiKey}`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connection established with Azure OpenAI');
        setIsProcessing(true);
        
        // Use the correct message type for Azure OpenAI Realtime API
        // No initial configuration message is needed for Azure OpenAI Realtime v2024-10-01-preview
        // The API automatically sets up the session when the WebSocket connection is established
      };
      
      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log('WebSocket message received:', response);
          
          // Handle different message types based on Azure OpenAI Realtime API
          if (response.type === "session.created") {
            console.log("Session created successfully with Azure OpenAI");
            
            // Send message to start audio processing
            const startMessage = {
              type: "audio_data",
            };
            
            // No need to send JSON, just send audio data directly
          } else if (response.type === "speech.interim") {
            // Handle interim transcription results
            const text = response.text || '';
            setTranscript(text);
            if (onTranscript) {
              onTranscript(text, false);
            }
          } else if (response.type === "speech.final") {
            // Handle final transcription results
            const text = response.text || '';
            setTranscript(text);
            if (onTranscript) {
              onTranscript(text, true);
            }
          } else if (response.type === "response.partial") {
            // Handle partial AI response
            const text = response.content || '';
            setAIResponse(text);
            if (onAIResponse) {
              onAIResponse(text, false);
            }
          } else if (response.type === "response.complete") {
            // Handle complete AI response
            const text = response.content || '';
            setAIResponse(text);
            if (onAIResponse) {
              onAIResponse(text, true);
            }
            setIsProcessing(false);
          } else if (response.type === "error") {
            console.error('WebSocket error response:', response.error);
            toast.error(response.error?.message || "An error occurred with the voice service");
            stopListening();
          }
          
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error("Connection error with Azure OpenAI");
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
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      toast.error("Failed to connect to Azure OpenAI");
      stopListening();
    }
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
