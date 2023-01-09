<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../stores/store";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
			pseudo: "",
			pseudoOK: true,
        }
    },
    methods: {
        async SetPseudo() {
            const ret = await axios.post(
                "http://localhost:3000/user/setpseudo",
                 {pseudo: this.pseudo},
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
			if (ret)
			{
				jwtstore.setPseudo(this.pseudo);
				router.push('/');
			}
			else
			{
				this.pseudoOK = false;
			}
        }
    }
}
</script>

<template>
	<div v-if="pseudoOK">
		<input id="pseudo" v-model="pseudo" type="text"/>
		<button @click="SetPseudo">coucou {{ pseudo }}</button>
	</div>
	<div v-else>
		<input id="pseudo" v-model="pseudo" type="text"/>
		<button @click="SetPseudo">ALREADY USED BY SOMEONE {{ pseudo }}</button>
	</div>
</template>