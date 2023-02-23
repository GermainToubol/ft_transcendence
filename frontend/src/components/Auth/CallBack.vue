<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../../stores/store";
import { BACK_SERVER } from "../../config";

const jwtstore = useJwtStore();
export default {
    async mounted() {
		const ret: {token: string, enable2fa: boolean, pseudo: string, avatar: number} = await axios.get(`${BACK_SERVER}/api/auth/login?code=${this.$route.query.code}`).then((t) => t.data);
		if (!ret)
		{
			router.push('/login');
			return ;
		}
		jwtstore.setToken(ret.token)
		localStorage.token = ret.token
		jwtstore.setPseudo(ret.pseudo)
		if (ret.avatar != 0)
		jwtstore.setAvatar(`${BACK_SERVER}/api/local-files/${ret.avatar}`)
		else
		jwtstore.setAvatar("src/avatar/default.jpg")
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
