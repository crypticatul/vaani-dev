
import { useState, useRef } from 'react';
import { WebRTCState, WebRTCClient } from './types';

export interface WebRTCRefs {
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  micStreamRef: React.MutableRefObject<MediaStream | null>;
  audioContextRef: React.MutableRefObject<AudioContext | null>;
  realtimeClientRef: React.MutableRefObject<WebRTCClient | null>;
}

export const useWebRTCState = (): [WebRTCState, React.Dispatch<React.SetStateAction<string>>, React.Dispatch<React.SetStateAction<string>>, React.Dispatch<React.SetStateAction<boolean>>, React.Dispatch<React.SetStateAction<boolean>>, WebRTCRefs] => {
  // State for WebRTC
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [aiResponse, setAIResponse] = useState<string>('');
  
  // Refs for WebRTC connections
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const realtimeClientRef = useRef<WebRTCClient | null>(null);
  
  const state: WebRTCState = {
    isListening,
    isProcessing,
    transcript,
    aiResponse,
  };
  
  const refs: WebRTCRefs = {
    mediaRecorderRef,
    micStreamRef,
    audioContextRef,
    realtimeClientRef,
  };
  
  return [state, setTranscript, setAIResponse, setIsProcessing, setIsListening, refs];
};
