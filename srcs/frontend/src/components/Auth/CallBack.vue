<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../../stores/store";

const jwtstore = useJwtStore();
export default {
    async mounted() {
        const ret: {token: string, enable2fa: boolean, pseudo: string} = await axios.get(`http://localhost:3000/auth/login?code=${this.$route.query.code}`).then((t) => t.data);
        jwtstore.setToken(ret.token)
		jwtstore.setPseudo(ret.pseudo)
		jwtstore.setAvatar("src/avatar/default.jpg")
		console.log(`TOKEN CALL BACK: ${jwtstore.$state.token}`)
		if (ret.enable2fa) {
            router.push('/login/2fa');
            return ;
        }
        router.push('/');
    }
}
</script>

<template>
  </template>