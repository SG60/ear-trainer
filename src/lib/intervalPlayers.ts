import * as Tone from 'tone';
import { synth } from '$lib/synth';

export function playInterval(startNote: Tone.Unit.Frequency, interval: number) {
	console.log(`start: ${startNote} interval: ${interval}`);
	synth.triggerAttackRelease(startNote, '8n');
	synth.triggerAttackRelease(
		Tone.Frequency(startNote).transpose(interval).toFrequency(),
		'8n',
		'+8n'
	);
}

export function playVerticalInterval(startNote: Tone.Unit.Frequency, interval: number) {
	console.log(`start: ${startNote} interval: ${interval}`);
	synth.triggerAttackRelease(
		[startNote, Tone.Frequency(startNote).transpose(interval).toFrequency()],
		'3n'
	);
}
