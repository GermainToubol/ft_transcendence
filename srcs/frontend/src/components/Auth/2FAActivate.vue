<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../../stores/store";

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
    methods: {
        async Enable() {
            const test = await axios.get(
                "http://localhost:3000/2fa/enable",
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
			router.push('/');
        },
		async Disable() {
            const test = await axios.get(
                "http://localhost:3000/2fa/disable",
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
			router.push('/');
        }
    }
}
</script>

<template>
	<div v-if=!verified>
		You can't be here
	</div>
	<div v-else>
        <button @click="Enable">Enable</button>
		<button @click="Disable">Disable</button>
	</div>
</template>