<script lang="ts">
import useJwtStore from "../../stores/store";
import { INTRA_PATH } from "../../config";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
            verified: false,
			intra: INTRA_PATH,
        }
    },
	async mounted() {
		if (await jwtstore.validateToken(localStorage.token).then((t) => t))
			this.verified = true;
	},
};
</script>

<template>
	<div v-if="verified">You are already logged-in</div>
	<div v-else>
		<a :href="intra">
		  <button>Log in with 42</button>
		</a>
	</div>
</template>
