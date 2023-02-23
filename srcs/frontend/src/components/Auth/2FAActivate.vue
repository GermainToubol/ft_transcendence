<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../../stores/store";
import { BACK_SERVER } from "../../config";

const jwtstore = useJwtStore();
export default {
    methods: {
        async Enable() {
            const test = await axios.get(
                `${BACK_SERVER}/api/2fa/enable`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
			router.push('/login/2fa');
        },
		async Disable() {
            const test = await axios.get(
                `${BACK_SERVER}/api/2fa/disable`,
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
	<div>
        <button @click="Enable">Enable</button>
		<button @click="Disable">Disable</button>
	</div>
</template>
