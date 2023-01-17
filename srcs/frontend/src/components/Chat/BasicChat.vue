<script lang="ts">
 import { io, Socket } from 'socket.io-client';
 import { onMounted, onUnmounted, ref } from 'vue';

 import useJwtStore from '@/stores/store';
 import { BACK_SERVER } from '@/config';

 const jwtstore = useJwtStore();
 let socket = ref(null as unknown);

 export default {
	 data() {
		 return {
			 messages: [],
			 message: ""
		 }
	 },
	 methods: {
		 getMessages() {
			 fetch(`${BACK_SERVER}/chat`)
				 .then((response) => response.json())
			     .then((cc) => {
					 cc.forEach((el) => {this.messages.push(el)})
				 })
			 .catch((err) => console.log(err))
		 },
		 sendMessage() {
			 socket.emit("sendMsg", this.message)
			 this.message = "";
		 }
	 },
	 mounted() {
		 socket = io(BACK_SERVER, {
			 path: '/chat',
			 query: {
				 'accessToken': jwtstore.$state.token,
			 }
		 })
		 this.getMessages();
		 socket.on('recMsg', (message) => {
			 console.log(`message: ${message}`)
			 this.messages.push(message);
		 })
	 },
	 beforeUnmount() {
		 if (socket != null) {
			 socket.disconnect();
		 }
	 }
 }
</script>


<template>
	<li v-for="item in messages">{{ item.content }}</li>
	<input v-model="message" type="text"/><button @click="sendMessage">Send</button>
</template>
