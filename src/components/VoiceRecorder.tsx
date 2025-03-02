import { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';
import { Mic, Square, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isDisabled?: boolean;
}

export const VoiceRecorder = ({ onTranscription, isDisabled }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
      });
      
      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    setIsRecording(false);
    setIsProcessing(true);

    recorderRef.current.stopRecording(async () => {
      const blob = recorderRef.current?.getBlob();
      if (!blob) return;

      try {
        const formData = new FormData();
        formData.append('file', blob, 'audio.wav');
        formData.append('model', 'whisper-1');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: formData,
        });

        const data = await response.json();
        onTranscription(data.text);
      } catch (error) {
        console.error('Transcription error:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        disabled={isDisabled || isProcessing}
        onClick={isRecording ? stopRecording : startRecording}
        variant="outline"
        size="icon"
        className="hover:bg-purple-50"
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-8 m-4 max-w-lg w-full shadow-2xl"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <Mic className="h-16 w-16 text-purple-600" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                  </motion.div>
                </div>
                
                <p className="text-xl font-medium text-gray-700">
                  Listening...
                </p>

                <Button
                  onClick={stopRecording}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 