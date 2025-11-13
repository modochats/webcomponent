# Voice Detection Tuning Guide

## Quick Reference for Voice Transfer Settings

### When Voice is Not Being Detected

**Problem**: User's voice is not captured or requires very loud speech

**Solutions**:
1. **Lower voiceThreshold** (currently 0.08)
   - Try: 0.05 - 0.07 for quieter environments
   - Location: `audio.processor.voiceThreshold`

2. **Lower silenceThreshold** (currently 0.05)
   - Try: 0.03 - 0.04 for more continuous capture
   - Location: `audio.processor.silenceThreshold`

3. **Increase maxPreRollBuffers** (currently 5)
   - Try: 7-10 to capture more of speech start
   - Location: `audio.processor.maxPreRollBuffers`

### When Too Much Background Noise is Captured

**Problem**: System captures ambient noise, fan noise, keyboard clicks

**Solutions**:
1. **Raise voiceThreshold** (currently 0.08)
   - Try: 0.10 - 0.15 for noisy environments
   - Location: `audio.processor.voiceThreshold`

2. **Raise silenceThreshold** (currently 0.05)
   - Try: 0.08 - 0.12 to filter out more noise
   - Location: `audio.processor.silenceThreshold`

3. **Increase noiseThreshold** (currently 0.01)
   - Try: 0.015 - 0.02 for stricter noise gate
   - Location: Audio processor constructor

### When Voice is Cut Off Mid-Sentence

**Problem**: Speech detection stops during natural pauses

**Solutions**:
1. **Increase minSilenceFrames** (currently 8)
   - Try: 10-15 to allow longer pauses
   - Location: `audio.processor.minSilenceFrames`

2. **Lower silenceThreshold** (currently 0.05)
   - Try: 0.03 - 0.04 to be less aggressive
   - Location: `audio.processor.silenceThreshold`

### When There's Lag/Delay in Audio Transmission

**Problem**: Voice reaches server too slowly

**Solutions**:
1. **Reduce minBufferSize** (currently 32000)
   - Try: 24000 - 28000 for faster sending
   - Location: `audio.minBufferSize`
   - Warning: Too low may cause choppy audio

2. **Reduce targetChunks** (currently 16)
   - Try: 12-14 for more aggressive streaming
   - Location: `audio.targetChunks`
   - Warning: May increase network overhead

### When First Words After AI Response are Missed

**Problem**: Beginning of user's response after AI finishes is cut off

**Solutions**:
1. **Reduce resumeDelay** (currently 150ms)
   - Try: 100-120ms for faster mic reactivation
   - Location: `audio.resumeDelay`
   - Warning: May capture end of AI audio

2. **Increase maxPreRollBuffers** (currently 5)
   - Try: 7-10 to capture more pre-voice audio
   - Location: `audio.processor.maxPreRollBuffers`

3. **Adjust resumedFrameThreshold** (currently 80)
   - Try: 60-70 for longer sensitivity boost
   - Location: Audio processor constructor

## Configuration Locations

### Main Configuration (Recommended)
**File**: `src/services/voice-agent/model.ts`
```typescript
audio: {
  processor: {
    voiceThreshold: 0.08,      // Voice detection sensitivity
    silenceThreshold: 0.05,    // Silence detection threshold
    minSilenceFrames: 8,       // Frames before silence detected
    maxPreRollBuffers: 5,      // Pre-roll buffer size
    sampleRate: 16000
  },
  minBufferSize: 32000,        // Min bytes before sending
  targetChunks: 16,            // Target chunk count
  resumeDelay: 150            // Delay before mic resumes (ms)
}
```

### SDK Defaults
**File**: `client-sdk/src/types/config.ts`
- Same parameters as above
- Applied when no custom config provided

### Audio Processor (Advanced)
**File**: `client/audio-processor.js`, `temp/audio-processor.js`, `client-sdk/dist/esm/audio-processor.js`
```javascript
constructor() {
  this.noiseThreshold = 0.01;      // Noise gate threshold
  this.voiceThreshold = 0.08;      // Voice detection
  this.maxSilenceFrames = 8;       // Silence detection
  this.resumedFrameThreshold = 80; // Post-resume boost duration
}
```

## Testing Your Changes

After making changes, always:

1. **Rebuild the SDK**:
```bash
cd client-sdk
npm run build
```

2. **Test Scenarios**:
   - Normal volume speech
   - Quiet speech
   - Fast speech with short pauses
   - Long pauses mid-sentence
   - First response after AI speaks
   - Noisy environment

3. **Monitor Console**:
   - Look for "Voice detected" messages
   - Check RMS and dB values
   - Verify "Boosted threshold" logs after resume

## Typical Value Ranges

| Parameter | Min | Optimal | Max | Notes |
|-----------|-----|---------|-----|-------|
| voiceThreshold | 0.03 | 0.08 | 0.20 | Higher = less sensitive |
| silenceThreshold | 0.02 | 0.05 | 0.15 | Higher = more aggressive |
| minSilenceFrames | 5 | 8 | 20 | Higher = longer pauses allowed |
| minBufferSize | 16000 | 32000 | 60000 | Higher = more latency |
| targetChunks | 8 | 16 | 30 | Higher = more latency |
| resumeDelay | 50 | 150 | 500 | Higher = more time to clear |

## Environment-Specific Presets

### Quiet Office
```typescript
voiceThreshold: 0.06
silenceThreshold: 0.04
minSilenceFrames: 10
```

### Noisy Environment
```typescript
voiceThreshold: 0.12
silenceThreshold: 0.10
minSilenceFrames: 6
```

### Fast Conversation
```typescript
voiceThreshold: 0.08
silenceThreshold: 0.05
minSilenceFrames: 6
minBufferSize: 24000
targetChunks: 12
resumeDelay: 100
```

### High Quality (Lower Latency)
```typescript
voiceThreshold: 0.08
silenceThreshold: 0.05
minSilenceFrames: 8
minBufferSize: 28000
targetChunks: 14
resumeDelay: 150
```

## Debugging Tips

1. **Enable Debug Logging**:
```typescript
logging: {
  level: LogLevel.DEBUG,
  enableConsole: true
}
```

2. **Monitor Voice Metrics Event**:
```typescript
client.on(EventType.VOICE_METRICS, (event) => {
  console.log(`RMS: ${event.rms}, dB: ${event.db}, Active: ${event.isActive}`);
});
```

3. **Check Audio Processor Logs**:
   - Look for threshold values in console
   - Monitor noise floor calculations
   - Check sensitivity boost behavior

## Common Issues & Solutions

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| No voice detected | Threshold too high | Lower voiceThreshold to 0.05-0.06 |
| Constant detection | Threshold too low | Raise voiceThreshold to 0.10-0.12 |
| Choppy audio | Buffer too small | Increase minBufferSize to 40000 |
| Delayed transmission | Buffer too large | Decrease minBufferSize to 28000 |
| First word missing | Resume too slow | Decrease resumeDelay to 100ms |
| Cut mid-sentence | Silence frames too low | Increase minSilenceFrames to 10-12 |

## Performance Impact

- **Lower thresholds** = More CPU usage (more audio processing)
- **Smaller buffers** = More network requests (but lower latency)
- **More chunks** = Higher memory usage
- **Longer preroll** = More memory for buffering

## Best Practices

1. Start with defaults (they're optimized for most cases)
2. Change one parameter at a time
3. Test thoroughly after each change
4. Document why you changed a value
5. Consider environment-specific configs
6. Always rebuild SDK after config changes

