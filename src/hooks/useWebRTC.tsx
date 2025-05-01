
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Define allowed Azure OpenAI model types for TypeScript
type AzureOpenAIModelType = 
  | "gpt-4o-mini-realtime-preview" 
  | "gpt-4o-realtime-preview" 
  | "gpt-4o-realtime-preview-2024-10-01"
  | "gpt-4o-realtime-preview-2024-12-17"
  | "gpt-4o-mini-realtime-preview-2024-12-17";

interface UseWebRTCProps {
  azureOpenAIApiKey?: string;
  azureOpenAIEndpoint?: string;
  azureOpenAIApiVersion?: string;
  azureOpenAIDeploymentName?: string;
  azureOpenAIModel?: AzureOpenAIModelType;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAIResponse?: (text: string, isFinal: boolean) => void;
}

export function useWebRTC({
  azureOpenAIApiKey,
  azureOpenAIEndpoint,
  azureOpenAIApiVersion,
  azureOpenAIDeploymentName,
  azureOpenAIModel = "gpt-4o-realtime-preview",
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
  
  // Helper for detecting supported MIME types
  const getSupportedMimeType = () => {
    const possibleTypes = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    
    for (const type of possibleTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log(`Browser supports MIME type: ${type}`);
        return type;
      }
    }
    
    console.error('No supported MIME types found');
    return 'audio/webm'; // Default fallback
  };
  
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
      let micStream: MediaStream;
      try {
        // Request microphone access directly
        micStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } 
        });
        micStreamRef.current = micStream;
      } catch (error) {
        console.error('Microphone access error:', error);
        setIsListening(false);
        throw new Error('Microphone access is required for voice interactions');
      }
      
      // Create audio context
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      // Create media recorder with best supported MIME type
      const supportedMimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(micStream, {
        mimeType: supportedMimeType,
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up WebSocket connection to Azure OpenAI
      setupWebSocket();
      
      // Start recording
      mediaRecorder.start(250);
      
      // Handle audio data
      mediaRecorder.ondataavailable = async (event) => {
        if (realtimeClientRef.current) {
          const ws = realtimeClientRef.current.socket;
          if (ws && ws.readyState === WebSocket.OPEN) {
            // Send raw audio bytes
            const arrayBuffer = await event.data.arrayBuffer();
            ws.send(arrayBuffer);
          }
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
      if (!azureOpenAIDeploymentName) {
        throw new Error("No deployment name provided");
      }

      // Connect to Azure OpenAI Realtime API
      const wsUrl = `${azureOpenAIEndpoint.replace(/^http/, 'ws')}/openai/realtime?api-version=${azureOpenAIApiVersion}&deployment=${azureOpenAIDeploymentName}&api-key=${azureOpenAIApiKey}`;
      
      console.log("Connecting to WebSocket URL:", wsUrl.replace(azureOpenAIApiKey, "[REDACTED]"));
      
      // Create WebSocket with custom implementation
      const ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';
      
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
            model: azureOpenAIModel,
            voice: {
              type: "text-to-speech"
            }
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
          if (event.data instanceof ArrayBuffer) {
            // This is likely a binary audio chunk
            console.log("Received binary audio data");
            return;
          }
          
          const response = JSON.parse(event.data);
          console.log('WebSocket message received:', response);
          
          // Handle different message types based on Azure OpenAI Realtime API
          switch(response.type) {
            case "session.created":
              console.log("Session created successfully with Azure OpenAI", response.session);
              break;

            case "session.updated":
              console.log("Session updated with Azure OpenAI", response.session);
              break;

            case "conversation.item.created":
              console.log("Conversation item created", response.item);
              break;

            case "response.created":
              console.log("Response created", response.response);
              // Initialize new AI response
              setAIResponse('');
              if (onAIResponse) {
                onAIResponse('', false);
              }
              break;

            case "rate_limits.updated":
              console.log("Rate limits updated", response.rate_limits);
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
              
            case "response.output_item.added":
              // Handle output item added
              console.log("Response output item added", response.item);
              break;

            case "response.content_part.added":
              // Handle content part added
              const contentPart = response.item?.text ?? response.delta ?? '';
              if (!contentPart) {
                console.debug("Unexpected content_part format", response);
              }
              setAIResponse(prev => prev + contentPart);
              if (onAIResponse) {
                onAIResponse(contentPart, false);
              }
              break;

            case "response.audio.delta":
              // Handle streaming audio chunk
              const audioPayload = response.item?.payload ?? response.payload ?? '';
              if (!audioPayload) {
                console.debug("Unexpected audio.delta format", response);
              } else if (audioContextRef.current) {
                try {
                  const audioData = Uint8Array.from(atob(audioPayload), c => c.charCodeAt(0)).buffer;
                  audioContextRef.current.decodeAudioData(audioData).then(decodedData => {
                    const source = audioContextRef.current.createBufferSource();
                    source.buffer = decodedData;
                    source.connect(audioContextRef.current.destination);
                    source.start();
                  }).catch(err => console.error('Error decoding audio data:', err));
                } catch (error) {
                  console.error('Error processing audio chunk:', error);
                }
              }
              break;

            case "error":
              console.error('WebSocket error response:', response.error);
              toast.error(response.error?.message || "An error occurred with the voice service");
              stopListening();
              break;
            
            default:
              // No action for other response types
              console.log(`Unhandled message type: ${response.type}`, response);
              break;
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
