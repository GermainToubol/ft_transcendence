<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../stores/store";
import { BACK_SERVER } from "../config";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
			avatar: "",
        }
    },
	methods: {
		uploadFile( event: any ) {
			this.avatar = event.target.files[0];
		},
		async submitFile() {
			const formData = new FormData();
			formData.append('file', this.avatar);
			const avatarId = await axios.post(`${BACK_SERVER}/user/avatar`, formData,
			{
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
			jwtstore.setAvatar(`${BACK_SERVER}/local-files/${avatarId}`);
            router.push('/');
		}
	}
}
</script>

<template>
	<div>
		<input type="file" @change="uploadFile( $event )">
        <button @click="submitFile">Upload!</button>
	</div>
</template>
