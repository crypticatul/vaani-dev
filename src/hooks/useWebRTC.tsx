
import { useEffect } from 'react';
import { toast } from 'sonner';

// Import types
import { AzureOpenAIModelType, AzureOpenAIVoiceType, UseWebRTCProps, UseWebRTCReturn } from './webrtc/types';

// Import utility functions
import { getSupportedMimeType, setupMicrophoneStream } from './webrtc/audioUtils';
import { createWebSocketClient } from './webrtc/wsClient';
import { useWebRTCState } from './webrtc/useWebRTCState';

export type { AzureOpenAIVoiceType } from './webrtc/types';

export function useWebRTC({
  azureOpenAIApiKey,
  azureOpenAIEndpoint,
  azureOpenAIApiVersion,
  azureOpenAIDeploymentName,
  azureOpenAIModel = "gpt-4o-realtime-preview",
  voiceId = "alloy", // Default to 'alloy' as the neutral voice
  onTranscript,
  onAIResponse,
}: UseWebRTCProps): UseWebRTCReturn {
  // Get state and refs from the state hook
  const [
    { isListening, isProcessing, transcript, aiResponse },
    setTranscript,
    setAIResponse,
    setIsProcessing,
    setIsListening,
    { mediaRecorderRef, micStreamRef, audioContextRef, realtimeClientRef }
  ] = useWebRTCState();
  
  // Function to start listening
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
      const micStream = await setupMicrophoneStream();
      micStreamRef.current = micStream;
      
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
      const realtimeClient = createWebSocketClient(
        azureOpenAIEndpoint,
        azureOpenAIApiVersion || '2025-04-01-preview',
        azureOpenAIDeploymentName,
        azureOpenAIApiKey,
        azureOpenAIModel,
        voiceId,
        audioContextRef.current,
        onTranscript,
        onAIResponse,
        setTranscript,
        setAIResponse,
        setIsProcessing,
        setIsListening,
        stopListening
      );
      
      if (!realtimeClient) {
        throw new Error("Failed to create WebSocket client");
      }
      
      realtimeClientRef.current = realtimeClient;
      
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
