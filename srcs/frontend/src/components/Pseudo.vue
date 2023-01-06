<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../stores/store";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
			pseudo: "",
            verified: false,
        }
    },
	async mounted() {
		if (await jwtstore.validateToken(jwtstore.$state.token).then((t) => t))
			this.verified = true;
	},
    methods: {
        async SetPseudo() {
            await axios.post(
                "http://localhost:3000/user/setpseudo",
                 {pseudo: this.pseudo},
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then();
            jwtstore.setPseudo(this.pseudo);
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
		<input id="pseudo" v-model="pseudo" type="text"/>
		<button @click="SetPseudo">coucou {{ pseudo }}</button>
	</div>
</template>