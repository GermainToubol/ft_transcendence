<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../stores/store";

const jwtstore = useJwtStore();
export default {
    data() {
        return {
            authcode: "",
        }
    },
    methods: {
        async ValidityState() {
            console.log(this.authcode)
            console.log(jwtstore.$state.token)
            const test: {token: string} = await axios.post(
                "http://localhost:3000/2fa/verify",
                 {key: 'gtoubol', code: this.authcode},
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
            console.log(test);
            jwtstore.setToken(test.token)
            console.log(jwtstore.$state.token)
            router.push('/about');
        }
    }
}
</script>

<template>
        <label>Coucou</label><input id="code" v-model="authcode" type="text"/>
        <button @click="ValidityState">coucou {{ authcode }}</button>
</template>