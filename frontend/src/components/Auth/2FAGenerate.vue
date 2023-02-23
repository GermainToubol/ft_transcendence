<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../../stores/store";
import { BACK_SERVER } from "../../config";

const jwtstore = useJwtStore();
export default {
    data() {
        return {
            qrcode: "",
        }
    },
    methods: {
        async ValidityState() {
            const test = await axios.get(
                `${BACK_SERVER}/api/2fa/generate`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
			this.qrcode = test;
        }
    }
}
</script>

<template>
		<div v-if="qrcode">DONT FORGET TO SCAN BEFORE LEAVING THIS PAGE<img v-bind:src="qrcode" /></div>
 		<div v-else>Oh no 😢<button @click="ValidityState">coucou</button></div>
</template>
