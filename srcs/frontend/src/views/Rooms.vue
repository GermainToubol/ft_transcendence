<script lang="ts">
import router from "@/router";
import axios from "axios";
import { ref } from "vue";
import useJwtStore from "../stores/store";
import { BACK_SERVER } from "../config";
import type { roomsInterface } from "../interfaces/any.interface";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
			room: ref({} as roomsInterface),
        }
    },

	async mounted(){
		const ret = await axios.get(
			`${BACK_SERVER}/rooms`,
			{
				headers: {
					Authorization: `Bearer ${jwtstore.$state.token}`,
				}
		}).then((t) => t.data);
		if (this.room)
			this.room = ret;
    },
	computed: {
		msg: function() {
			return this.room.rooms;
		}
	},
	methods: {
		specGame(name: String) {
			router.push(`/spec?roomname=${name}`)
		}
	}
}
</script>

<template>
	<div v-if="room.rooms">
			<button v-for="rooms in msg" @click="specGame(rooms.roomname)">
					{{ rooms.player1 }} vs {{ rooms.player2 }}
			</button>
	</div>
	<div v-else>
		No one is playing
	</div>
</template>