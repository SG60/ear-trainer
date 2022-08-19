<script>
	import { fade } from 'svelte/transition';
</script>

<div transition:fade class="loader">
	<div />
</div>

<style>
	div {
		--animation-length: 1s;
		--colour: theme('colors.lime.500' / 50%);
	}
	.loader div {
		animation: horizontalProgressBar var(--animation-length) linear
			infinite;

		background-color: var(--colour);
		height: 5px;
		left: 0;
		position: fixed;
		top: 0px;
		width: 50vw;
		z-index: 9999;
		/*translateX(50vw);*/
	}
	.loader:before {
		content: '';
		top: 0px;
		background-color: var(--colour);
		height: 5px;
		width: 50vw;
		position: fixed;
		animation: horizontalProgressBar2 var(--animation-length) linear
			infinite;
		left: 0px;
		transform: translateX(-50vw);
	}
	@keyframes horizontalProgressBar {
		0% {
			transform: translateX(50vw);
		}
		100% {
			transform: translateX(150vw);
		}
	}
	@keyframes horizontalProgressBar2 {
		0% {
			transform: translateX(-50vw);
		}
		100% {
			transform: translateX(50vw);
		}
	}
</style>
