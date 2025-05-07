
// Helper for detecting supported MIME types for audio recording
export const getSupportedMimeType = (): string => {
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

// Process audio chunk from base64 string
export const processAudioChunk = (
  audioContext: AudioContext, 
  base64Audio: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Decode base64 audio data
      const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
      
      // Process audio data with AudioContext
      audioContext.decodeAudioData(audioData)
        .then(decodedData => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedData;
          source.connect(audioContext.destination);
          source.start();
          resolve();
        })
        .catch(err => {
          console.error('Error decoding audio data:', err);
          reject(err);
        });
    } catch (error) {
      console.error('Error processing audio chunk:', error);
      reject(error);
    }
  });
};

// Setup audio recording from microphone
export const setupMicrophoneStream = async (): Promise<MediaStream> => {
  try {
    // Request microphone access directly
    const micStream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      } 
    });
    
    return micStream;
  } catch (error) {
    console.error('Microphone access error:', error);
    throw new Error('Microphone access is required for voice interactions');
  }
};
