<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	let loading = false;
	let email: string;
	let submitted = false;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
			submitted = true;
		} catch (e: any) {
			alert(e.error_description || e.message);
			alert(e.message);
		} finally {
			loading = false;
		}
	};
</script>

<form on:submit|preventDefault={handleLogin}>
	<div class="grid gap-6 py-8 px-4 text-center">
		{#if submitted}
			<div class="text-sm text-gray-600">Check your email for the login link!</div>
		{:else}
			<h1 class="text-2xl">Log In</h1>
			<p><label for="email">Sign in via a link sent your email address</label></p>
			<div class="w-full">
				<input
					id="email"
					class="w-full"
					name="email"
					type="email"
					placeholder="example@example.com"
					bind:value={email}
				/>
			</div>
			<div class="place-self-center">
				<input type="submit" value={loading ? 'Loading' : 'Send magic link'} disabled={loading} />
			</div>
		{/if}
	</div>
</form>
