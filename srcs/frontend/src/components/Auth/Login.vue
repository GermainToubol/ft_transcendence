<script lang="ts">
import useJwtStore from "../../stores/store";
import { RouterLink, RouterView } from 'vue-router'

const jwtstore = useJwtStore();
export default {
	data() {
        return {
            verified: false,
        }
    },
	async mounted() {
		if (await jwtstore.validateToken(jwtstore.$state.token).then((t) => t))
			this.verified = true;
	},
}
</script>

<template>
	<div v-if="verified">You are already logged-in</div>
	<div v-else>
		<a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b4f39a7072067aaad128fceab9acb89eacf241f34949950be3e51384bf81dd0a&redirect_uri=http%3A%2F%2Flocalhost%3A3500%2Fcallback&response_type=code">
		  <button>Log in with 42</button>
		</a>
	</div>
</template>