// Synthesizes a luxury crystal chime notification using the Web Audio API
export function playChimeSound(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    
    // Primary harmonic chord for a luxury bell/chime
    const frequencies = [880, 1320, 1760, 2640]; // A5, E6, A6, E7
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);

      gain.gain.setValueAtTime(0, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + i * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + i * 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.04);
      osc.stop(now + 1.4 + i * 0.1);
    });
  } catch (err) {
    console.warn('Audio alert not supported or blocked by user gesture policy', err);
  }
}
