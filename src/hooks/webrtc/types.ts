
// Define allowed Azure OpenAI model types for TypeScript
export type AzureOpenAIModelType = 
  | "gpt-4o-mini-realtime-preview" 
  | "gpt-4o-realtime-preview" 
  | "gpt-4o-realtime-preview-2024-10-01"
  | "gpt-4o-realtime-preview-2024-12-17"
  | "gpt-4o-mini-realtime-preview-2024-12-17";

// Define valid Azure OpenAI voice IDs
export type AzureOpenAIVoiceType = 
  | "alloy" 
  | "echo" 
  | "fable" 
  | "onyx" 
  | "nova" 
  | "shimmer"
  | "sage"
  | "coral"
  | "ash"
  | "ballad"
  | "verse";

// Interface for the WebRTC hook props
export interface UseWebRTCProps {
  azureOpenAIApiKey?: string;
  azureOpenAIEndpoint?: string;
  azureOpenAIApiVersion?: string;
  azureOpenAIDeploymentName?: string;
  azureOpenAIModel?: AzureOpenAIModelType;
  voiceId?: AzureOpenAIVoiceType;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAIResponse?: (text: string, isFinal: boolean) => void;
}

// Interface for WebRTC state
export interface WebRTCState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  aiResponse: string;
}

// Interface for WebRTC client
export interface WebRTCClient {
  socket: WebSocket;
  send: (message: any) => void;
  close: () => void;
  callbacks: Map<string, Function>;
  on: (eventType: string, callback: Function) => void;
}

// Return type for useWebRTC hook
export interface UseWebRTCReturn extends WebRTCState {
  startListening: () => Promise<void>;
  stopListening: () => void;
}
