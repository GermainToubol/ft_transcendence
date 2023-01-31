<script lang="ts">
import router from "@/router";
import axios from "axios";
import { ref } from "vue";
import useJwtStore from "../stores/store";
import { BACK_SERVER } from "../config";
import type { roomsInterface } from "../interfaces/room.interface";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
			room: {},
			test: {}
        }
    },

	async mounted(){
		const ret = await axios.get(
			`${BACK_SERVER}/history`,
			{
				headers: {
					Authorization: `Bearer ${jwtstore.$state.token}`,
				}
		}).then((t) => t.data)
		if (this.room)
			this.room = ret
		const re = await axios.get(
			`${BACK_SERVER}/user/leaderboard`,
			{
				headers: {
					Authorization: `Bearer ${jwtstore.$state.token}`,
				}
		}).then((t) => t.data)
		this.test = re
    },
}
</script>

<template>
	<div>
		HISTORIQUE DES PARTIES à mettre en forme
        {{ room }}
	</div>
	<div>
		LEADERBOARD à mettre en forme
		{{ test }}
	</div>
</template>