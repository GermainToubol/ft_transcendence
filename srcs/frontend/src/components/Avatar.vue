<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../stores/store";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
			avatar: "",
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
	<div v-if=!verified>
		You can't be here
	</div>
	<div v-else>
		A faire demain
	</div>
</template>