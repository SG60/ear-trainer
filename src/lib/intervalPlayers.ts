import * as Tone from 'tone';
import type { Synth } from 'tone';
// import { synth } from '$lib/synth';

let synth: Synth;
await import('$lib/synth').then((mod) => ({ synth } = mod));

export function playInterval(startNote: Tone.Unit.Frequency, interval: number) {
	console.log(`start: ${startNote} interval: ${interval}`);
	synth.triggerAttackRelease(startNote, '8n');
	synth.triggerAttackRelease(
		Tone.Frequency(startNote).transpose(interval).toFrequency(),
		'8n',
		'+8n'
	);
}
