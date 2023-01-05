<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../stores/store";

const jwtstore = useJwtStore();
export default {
    async mounted() {
        const test: {token: string, enable2fa: boolean} = await axios.get(`http://localhost:3000/auth?code=${this.$route.query.code}`).then((t) => t.data);
        jwtstore.setToken(test.token)
        console.log(jwtstore.$state.token)
        if (test.enable2fa) {
            router.push('/login/2fa');
            return ;
        }
        router.push('/about');
    }
}
</script>

<template>
    <div>Salut!</div>
  </template>