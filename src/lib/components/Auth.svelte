<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	let loading = false;
	let email: string;
	let submitted = false;
	let password: string;
	let usingPassword = false;

	const handleNormalLogin = async () => {
		if (usingPassword) {
			try {
				loading = true;
				const { error } = await supabase.auth.signIn({ email, password });
				if (error) throw error;
				submitted = true;
			} catch (e: any) {
				alert(e.error_description || e.message);
				alert(e.message);
			} finally {
				loading = false;
			}
		} else {
			try {
				loading = true;
				const { error } = await supabase.auth.signIn(
					{ email },
					{ redirectTo: window.location.origin }
				);
				if (error) throw error;
				alert('Check your email for the login link!');
				submitted = true;
			} catch (e: any) {
				alert(e.error_description || e.message);
				alert(e.message);
			} finally {
				loading = false;
			}
		}
	};

	async function signInWithGoogle() {
		const { user, session, error } = await supabase.auth.signIn({
			provider: 'google'
		});
	}
</script>

<form on:submit|preventDefault={handleNormalLogin}>
	<div class="grid gap-6 px-4 pt-8 pb-4 text-center">
		{#if submitted}
			<div class="text-sm text-gray-600">Check your email for the login link!</div>
		{:else}
			<h1 class="text-2xl">Log In</h1>
			<p><label for="email">Sign in via a link sent to your email address</label></p>
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
			{#if usingPassword}
				<div class="w-full">
					<input
						id="password"
						class="w-full"
						name="password"
						type="password"
						placeholder="Password"
						bind:value={password}
					/>
				</div>
			{/if}
			<div class="place-self-center">
				<input
					type="submit"
					value={loading ? 'Loading' : usingPassword ? 'Sign in' : 'Send magic link'}
					disabled={loading}
				/>
			</div>
			<div class="w-full">
				<button
					class="text-xs shadow-none border-none hover:underline font-normal"
					type="button"
					on:click={() => (usingPassword = !usingPassword)}
				>
					{usingPassword
						? "click here to sign in using a 'magic link' instead"
						: 'click here to sign in using your password instead'}
				</button>
			</div>
		{/if}
	</div>
</form>

<form on:submit|preventDefault={signInWithGoogle} class="border-t p-2">
	<div class="mx-auto w-fit py-2">
		<input type="submit" value={loading ? 'Loading' : 'Sign in with Google'} disabled={loading} />
	</div>
</form>
