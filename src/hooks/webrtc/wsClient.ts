
import { toast } from 'sonner';
import { WebRTCClient } from './types';
import { AzureOpenAIModelType, AzureOpenAIVoiceType } from './types';
import { processAudioChunk } from './audioUtils';

// Create a WebSocket client for Azure OpenAI
export const createWebSocketClient = (
  azureOpenAIEndpoint: string,
  azureOpenAIApiVersion: string,
  azureOpenAIDeploymentName: string,
  azureOpenAIApiKey: string,
  azureOpenAIModel: AzureOpenAIModelType,
  voiceId: AzureOpenAIVoiceType,
  audioContext: AudioContext | null,
  onTranscript: ((text: string, isFinal: boolean) => void) | undefined,
  onAIResponse: ((text: string, isFinal: boolean) => void) | undefined,
  setTranscript: React.Dispatch<React.SetStateAction<string>>,
  setAIResponse: React.Dispatch<React.SetStateAction<string>>,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>,
  stopListeningFn: () => void
): WebRTCClient | null => {
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
    const realtimeClient: WebRTCClient = {
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
    
    ws.onopen = () => {
      console.log('WebSocket connection established with Azure OpenAI');
      setIsProcessing(true);
      
      // Initialize session with the proper voice format for Azure OpenAI
      realtimeClient.send({
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          model: azureOpenAIModel,
          voice: voiceId // Use the valid Azure OpenAI voice ID
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
            if (onTranscript) {
              onTranscript(response.transcript || '', true);
            }
            break;
            
          case "response.done":
            // Complete AI response
            if (onAIResponse) {
              onAIResponse(response.aiResponse || '', true);
            }
            setIsProcessing(false);
            break;
            
          case "response.output_item.added":
            // Handle output item added
            console.log("Response output item added", response.item);
            break;

          case "response.content_part.added":
            // Handle content part added 
            console.log("Content part added", response.part);
            if (response.part?.type === "text") {
              const contentPart = response.part.text || '';
              setAIResponse(prev => prev + contentPart);
              if (onAIResponse) {
                onAIResponse(contentPart, false);
              }
            }
            break;
            
          case "response.content_part.done":
            // Content part is complete
            console.log("Content part completed", response);
            break;

          case "response.audio.delta":
            // Handle streaming audio chunk
            console.log("Audio delta received");
            
            // Extract audio payload from different possible locations
            let audioPayload = null;
            
            // Check for direct payload
            if (response.payload) {
              audioPayload = response.payload;
            } 
            // Check for payload in response.item
            else if (response.item?.payload) {
              audioPayload = response.item.payload;
            } 
            // Check for payload in response.part
            else if (response.part?.payload) {
              audioPayload = response.part.payload;
            }
            
            // Process audio if payload found and audioContext exists
            if (audioPayload && audioContext) {
              try {
                processAudioChunk(audioContext, audioPayload)
                  .catch(err => console.error('Error with audio processing:', err));
              } catch (err) {
                console.error('Failed to process audio payload:', err);
              }
            }
            break;
            
          case "response.audio.done":
            // Audio streaming is complete
            console.log("Audio stream ended");
            break;

          case "error":
            console.error('WebSocket error response:', response.error);
            toast.error(response.error?.message || "An error occurred with the voice service");
            stopListeningFn();
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
      stopListeningFn();
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      toast.info("Connection closed");
      setIsListening(false);
    };

    return realtimeClient;
  } catch (error) {
    console.error('Error setting up WebSocket:', error);
    toast.error("Failed to connect to Azure OpenAI");
    return null;
  }
};
