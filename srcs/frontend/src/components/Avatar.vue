<script lang="ts">
import router from "@/router";
import axios from "axios";
import useJwtStore from "../stores/store";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
			avatar: "",
            verified: false,
        }
    },
	async mounted() {
		if (await jwtstore.validateToken(jwtstore.$state.token).then((t) => t))
			this.verified = true;
	},
	methods: {
		uploadFile( event: any ) {
			this.avatar = event.target.files[0];
		},
		async submitFile() {
			const formData = new FormData();
			formData.append('file', this.avatar);
			const avatarId = await axios.post('http://localhost:3000/user/avatar', formData,
			{
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
			console.log('TST')
			console.log(avatarId)
			console.log("TST")
			jwtstore.setAvatar(`http://localhost:3000/local-files/${avatarId}`);
            router.push('/');
		}
	}
}
</script>

<template>
	<div v-if=!verified>
		You can't be here
	</div>
	<div v-else>
		<input type="file" @change="uploadFile( $event )">
        <button @click="submitFile">Upload!</button>
	</div>
</template>