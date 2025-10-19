// Cache for preloaded audio elements
const audioCache = new Map<string, HTMLAudioElement>();

const preloadAudio = (audioPath: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    if (audioCache.has(audioPath)) {
      resolve(audioCache.get(audioPath)!);
      return;
    }

    const audioElement = new Audio(audioPath);
    audioElement.volume = 0.5;
    audioElement.preload = "auto";

    audioElement.addEventListener("canplaythrough", () => {
      audioCache.set(audioPath, audioElement);
      resolve(audioElement);
    });

    audioElement.addEventListener("error", error => {
      reject(error);
    });

    // Start loading
    audioElement.load();
  });
};

const playAudio = async (audioPath: string) => {
  try {
    // Try to get preloaded audio or create new one
    let audioElement = audioCache.get(audioPath);

    if (!audioElement) {
      audioElement = new Audio(audioPath);
      audioElement.volume = 0.5;
      audioElement.preload = "auto";
    }

    // Play the audio
    await audioElement.play();
  } catch (error) {
    console.warn("Failed to play audio:", error);
    // Fallback: try to play a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (fallbackError) {
      console.warn("Audio fallback also failed:", fallbackError);
    }
  }
};

export {playAudio, preloadAudio};
