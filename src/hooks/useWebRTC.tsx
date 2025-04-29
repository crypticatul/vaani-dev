
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { OpenAIRealtimeWS } from 'openai/beta/realtime/ws';

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
  const realtimeClientRef = useRef<any>(null);
  
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
        if (realtimeClientRef.current && realtimeClientRef.current.socket.readyState === WebSocket.OPEN) {
          // Send audio data
          realtimeClientRef.current.send({
            type: "audio_data",
            data: event.data,
          });
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
    
    // Close WebSocket connection
    if (realtimeClientRef.current) {
      realtimeClientRef.current.close();
      realtimeClientRef.current = null;
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
      
      // Create WebSocket with custom implementation
      const ws = new WebSocket(wsUrl);
      
      // Create a simple client to mimic OpenAIRealtimeWS behavior
      const realtimeClient = {
        socket: ws,
        send: (message: any) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
          }
        },
        close: () => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        },
        callbacks: new Map(),
        on: function(eventType: string, callback: Function) {
          this.callbacks.set(eventType, callback);
        }
      };
      
      realtimeClientRef.current = realtimeClient;
      
      ws.onopen = () => {
        console.log('WebSocket connection established with Azure OpenAI');
        setIsProcessing(true);
        
        // Initialize session with proper format
        realtimeClient.send({
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            model: azureOpenAIDeploymentName,
          }
        });
        
        // Create conversation message
        realtimeClient.send({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{ type: "input_text", text: "Please assist the user" }],
          }
        });
        
        // Start response generation
        realtimeClient.send({ type: "response.create" });
      };
      
      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log('WebSocket message received:', response);
          
          // Handle different message types based on Azure OpenAI Realtime API
          switch(response.type) {
            case "session.created":
              console.log("Session created successfully with Azure OpenAI", response.session);
              break;
              
            case "response.audio_transcript.delta":
              // Handle interim transcription results
              const transcriptText = response.delta || '';
              setTranscript(prev => prev + transcriptText);
              if (onTranscript) {
                onTranscript(transcriptText, false);
              }
              break;
              
            case "response.text.delta":
              // Handle partial AI response
              const responseText = response.delta || '';
              setAIResponse(prev => prev + responseText);
              if (onAIResponse) {
                onAIResponse(responseText, false);
              }
              break;
              
            case "response.text.done":
              // Final transcript
              if (onTranscript && transcript) {
                onTranscript(transcript, true);
              }
              break;
              
            case "response.done":
              // Complete AI response
              if (onAIResponse && aiResponse) {
                onAIResponse(aiResponse, true);
              }
              setIsProcessing(false);
              break;
              
            case "error":
              console.error('WebSocket error response:', response.error);
              toast.error(response.error?.message || "An error occurred with the voice service");
              stopListening();
              break;
              
            default:
              // Handle other response types
              console.log('Unhandled response type:', response.type);
          }
          
          // If there's a registered callback for this event type, call it
          const callback = realtimeClient.callbacks.get(response.type);
          if (callback) {
            callback(response);
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
