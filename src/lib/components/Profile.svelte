<script lang="ts">
	import { user } from '$lib/sessionStore';
	import { supabase } from '$lib/supabaseClient';
	import LoadingRing from './LoadingRing.svelte';

	let loading = true;
	let username: string;

	function getProfile(_node: any) {
		try {
			loading = true;
			supabase.auth.getUser().then((promise) => {
				const user = promise.data.user;

				supabase
					.from('profiles')
					.select(`username`)
					.eq('id', user?.id)
					.single()
					.then(({ data, error, status }) => {
						if (data?.username) {
							username = data.username;
						}
						if (error && status !== 406) throw error;
					});
			});
		} catch (error: any) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}

	async function updateProfile() {
		try {
			loading = true;
			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (!user) return;

			const updates = {
				id: user.id,
				username,
				updated_at: Date.now().toString()
			};

			let { error } = await supabase.from('profiles').upsert(updates);

			if (error) throw error;
		} catch (error: any) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}

	let signOutState: 'in' | 'out' | 'signingOut' = 'in';

	async function signOut() {
		try {
			signOutState = 'signingOut';
			loading = true;
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error: any) {
			alert(error.message);
		} finally {
			loading = false;
			signOutState = 'out';
		}
	}
</script>

{#if $user}
	<form use:getProfile on:submit|preventDefault={updateProfile} class="grid gap-6 py-8 px-4">
		<h1 class="text-2xl">Account Management</h1>
		{#if signOutState === 'in'}
			<div class="grid uppercase">
				<label for="email">Email</label>
				<input id="email" type="text" value={$user.email} disabled />
			</div>
			<div class="grid">
				<label for="username">Name</label>
				<input id="username" type="text" bind:value={username} />
			</div>

			<div>
				<input
					class="w-full"
					type="submit"
					value={loading ? 'Loading ...' : 'Update'}
					disabled={loading}
				/>
			</div>

			<div>
				<button id="signOutButton" class="w-full" on:click={signOut} disabled={loading}>
					Sign Out
				</button>
			</div>
		{:else if signOutState === 'signingOut'}
			<LoadingRing />
		{:else}
			<div class="text-sm text-gray-600">You have been signed out.</div>
			<a href="/account/login">Sign in again</a>
		{/if}
	</form>
{/if}

<style>
	#signOutButton {
		--_bg: linear-gradient(theme(colors.red.500/5), theme(colors.red.600));
		--_border: theme(colors.red.700 / 50%);
		--_text: theme(colors.red.50);
		--_ink-shadow: 0 1px 0 theme(colors.red.900);
		--_highlight: theme(colors.red.200);
	}
</style>
