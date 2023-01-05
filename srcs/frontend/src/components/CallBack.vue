<script lang="ts">
import axios from "axios";
import useJwtStore from "../stores/store";

export default {
    async created() {
        const test: {token: string, enable2fa: boolean} = await axios.get(`http://localhost:3000/auth?code=${this.$route.query.code}`).then((t) => t.data);
        console.log(this.$useJwtStore)
    }
}
</script>

<template>
    <div>Salut!</div>
  </template>