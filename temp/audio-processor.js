class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferSize = 4096;
        this.buffer = new Float32Array(this.bufferSize);
        this.bufferIndex = 0;
        
        this.noiseThreshold = 0.015;
        this.voiceThreshold = 0.03;
        this.silenceFrames = 0;
        this.maxSilenceFrames = 10;
        this.isVoiceActive = false;
        this.isPaused = false;
        
        this.noiseProfile = new Float32Array(128).fill(0);
        this.noiseProfileIndex = 0;
        this.noiseProfileReady = false;
        
        this.previousSamples = new Float32Array(this.bufferSize).fill(0);
        
        this.preRollBuffer = [];
        this.maxPreRollBuffers = 5; // Increased from 3 to capture more of the start
        
        this.justResumed = false;
        this.resumedFrameCount = 0;
        this.resumedFrameThreshold = 100; // Be extra sensitive for ~3 seconds after resume
        
        this.port.onmessage = (event) => {
            if (event.data.type === 'set-voice-threshold') {
                this.voiceThreshold = event.data.value;
            } else if (event.data.type === 'set-noise-threshold') {
                this.noiseThreshold = event.data.value;
            } else if (event.data.type === 'pause') {
                this.isPaused = true;
                console.log('AudioProcessor: Input paused');
            } else if (event.data.type === 'resume') {
                this.isPaused = false;
                // Reset VAD state when resuming but KEEP pre-roll buffer
                this.isVoiceActive = false;
                this.silenceFrames = 0;
                // Reset noise profile to quickly adapt to new environment
                this.noiseProfile.fill(0);
                this.noiseProfileIndex = 0;
                this.noiseProfileReady = false;
                // Be extra sensitive for the first ~1 second after resume
                this.justResumed = true;
                this.resumedFrameCount = 0;
                // Don't clear preRollBuffer - it may contain the start of speech
                console.log('AudioProcessor: Input resumed - VAD and noise profile reset, sensitivity boosted');
            }
        };
    }
    
    calculateRMS(samples) {
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
            sum += samples[i] * samples[i];
        }
        return Math.sqrt(sum / samples.length);
    }
    
    calculateDB(rms) {
        if (rms <= 0 || isNaN(rms)) return -Infinity;
        const db = 20 * Math.log10(rms);
        return isNaN(db) ? -Infinity : db;
    }
    
    updateNoiseProfile(samples) {
        const rms = this.calculateRMS(samples);
        this.noiseProfile[this.noiseProfileIndex] = rms;
        this.noiseProfileIndex = (this.noiseProfileIndex + 1) % this.noiseProfile.length;
        
        if (this.noiseProfileIndex === 0) {
            this.noiseProfileReady = true;
        }
    }
    
    getNoiseFloor() {
        if (!this.noiseProfileReady) {
            return this.noiseThreshold;
        }
        
        const sorted = Array.from(this.noiseProfile).sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length * 0.25)];
    }
    
    applySpectralSubtraction(samples) {
        const output = new Float32Array(samples.length);
        const noiseFloor = this.getNoiseFloor();
        
        for (let i = 0; i < samples.length; i++) {
            const signal = Math.abs(samples[i]);
            
            if (signal < noiseFloor * 2) {
                output[i] = 0;
            } else {
                const cleaned = signal - noiseFloor;
                output[i] = samples[i] >= 0 ? cleaned : -cleaned;
            }
        }
        
        return output;
    }
    
    applyHighPassFilter(samples) {
        const output = new Float32Array(samples.length);
        const alpha = 0.95;
        
        output[0] = samples[0];
        for (let i = 1; i < samples.length; i++) {
            output[i] = alpha * (output[i-1] + samples[i] - this.previousSamples[i]);
        }
        
        this.previousSamples.set(samples);
        return output;
    }
    
    applyNoiseGate(samples, rms) {
        const noiseFloor = this.getNoiseFloor();
        const adaptiveThreshold = Math.max(this.noiseThreshold, noiseFloor * 1.8);
        
        if (rms < adaptiveThreshold) {
            return new Float32Array(samples.length);
        }
        
        return samples;
    }
    
    detectVoice(rms) {
        const noiseFloor = this.getNoiseFloor();
        
        // Gradual sensitivity boost that fades over time
        let adaptiveVoiceThreshold;
        if (this.justResumed) {
            this.resumedFrameCount++;
            
            // Gradually fade the boost from 30% to 100% over 3 seconds
            // Frame 0-100: boost from 0.3x to 1.0x (very sensitive at first!)
            const boostProgress = Math.min(this.resumedFrameCount / this.resumedFrameThreshold, 1.0);
            const boostMultiplier = 0.3 + (0.7 * boostProgress); // 0.3 → 1.0
            
            adaptiveVoiceThreshold = this.voiceThreshold * boostMultiplier;
            
            if (this.resumedFrameCount % 20 === 0) {
                console.log(`AudioProcessor: Boosted threshold: ${adaptiveVoiceThreshold.toFixed(4)} (${(boostMultiplier * 100).toFixed(0)}% of normal, RMS: ${rms.toFixed(4)})`);
            }
            
            if (this.resumedFrameCount > this.resumedFrameThreshold) {
                this.justResumed = false;
                console.log('AudioProcessor: Sensitivity boost ended, returning to adaptive threshold');
            }
        } else {
            // Normal adaptive threshold
            const multiplier = 2.0;
            adaptiveVoiceThreshold = Math.max(this.voiceThreshold, noiseFloor * multiplier);
        }
        
        const wasActive = this.isVoiceActive;
        
        if (rms > adaptiveVoiceThreshold) {
            if (!this.isVoiceActive) {
                this.isVoiceActive = true;
                if (this.justResumed) {
                    console.log('AudioProcessor: Voice detected with boost!');
                }
                return { justActivated: true, isActive: true };
            }
            this.isVoiceActive = true;
            this.silenceFrames = 0;
        } else if (this.isVoiceActive) {
            this.silenceFrames++;
            if (this.silenceFrames > this.maxSilenceFrames) {
                this.isVoiceActive = false;
                this.preRollBuffer = [];
            }
        } else {
            this.updateNoiseProfile(this.buffer);
        }
        
        return { justActivated: false, isActive: this.isVoiceActive };
    }
    
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const inputChannel = input[0];
            
            for (let i = 0; i < inputChannel.length; i++) {
                this.buffer[this.bufferIndex] = inputChannel[i];
                this.bufferIndex++;
                
                if (this.bufferIndex >= this.bufferSize) {
                    const rms = this.calculateRMS(this.buffer);
                    const db = this.calculateDB(rms);
                    const voiceStatus = this.detectVoice(rms);
                    
                    this.port.postMessage({
                        type: 'voice-level',
                        rms: rms,
                        db: db,
                        isActive: voiceStatus.isActive,
                        noiseFloor: this.getNoiseFloor(),
                        isPaused: this.isPaused
                    });
                    
                    if (!this.isPaused) {
                        let processedBuffer = this.buffer;
                        
                        const int16Buffer = new Int16Array(this.bufferSize);
                        for (let j = 0; j < this.bufferSize; j++) {
                            const s = Math.max(-1, Math.min(1, processedBuffer[j]));
                            int16Buffer[j] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        }
                        
                        if (voiceStatus.justActivated && this.preRollBuffer.length > 0) {
                            for (const preRollBuffer of this.preRollBuffer) {
                                this.port.postMessage(preRollBuffer);
                            }
                            this.preRollBuffer = [];
                        }
                        
                        if (voiceStatus.isActive) {
                            this.port.postMessage(int16Buffer.buffer);
                        } else {
                            this.preRollBuffer.push(int16Buffer.buffer);
                            if (this.preRollBuffer.length > this.maxPreRollBuffers) {
                                this.preRollBuffer.shift();
                            }
                        }
                    }
                    
                    this.bufferIndex = 0;
                }
            }
        }
        
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);
