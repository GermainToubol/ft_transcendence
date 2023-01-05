<script lang="ts">
import axios from "axios";
import useJwtStore from "../stores/store";

const jwtstore2 = useJwtStore();
export default {
    created() {
        console.log(jwtstore2.$state.token)
    }
}
</script>


<template>
  <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a0180e44fbdd685d1e0f4566d64cd26295af63c2f88a6a356866c14836ac0cf4&redirect_uri=http%3A%2F%2Flocalhost%3A3500%2Fcallback&response_type=code">
    <button>Log in with 42</button>
  </a>
</template>