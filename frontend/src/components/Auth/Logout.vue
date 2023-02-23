<script lang="ts">
import useJwtStore from "../../stores/store";
import { BACK_SERVER } from "../../config";
import router from "@/router";
import axios from "axios";

const jwtstore = useJwtStore();
export default {
	async mounted() {
		await axios.get(
                `${BACK_SERVER}/api/auth/logout`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            })
		localStorage.token = ''
		router.push('/login');
	}
};
</script>

<template>
</template>
