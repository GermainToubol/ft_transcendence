<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../../stores/store";
import { BACK_SERVER } from "../../config";

const jwtstore = useJwtStore();
export default {
    data() {
        return {
            authcode: "",
        }
    },
    methods: {
        async ValidityState() {
            const test: {token: string} = await axios.post(
                `${BACK_SERVER}/api/2fa/verify`,
                {code: this.authcode},
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
            jwtstore.setToken(test.token)
			localStorage.token = test.token
            router.push('/');
        }
    }
}
</script>

<template>
	<label>Coucou</label><input id="code" v-model="authcode" type="text"/>
    <button @click="ValidityState">coucou {{ authcode }}</button>
</template>
