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
			 channels:[],
			 message: "",
			 channelName: "",
			 chatid: 0,
			 picked: 0,
			 banlogin: "",
			 adminlogin: "",
		 }
	 },
	 methods: {
		 getChannelMsg(channel: number) {
			 fetch(`${BACK_SERVER}/chat/${channel}`)
				 .then((response) => response.json())
			     .then((cc) => {
					 cc.forEach((el) => {
						 el.channel = channel;
						 console.log(el)
						 this.messages.push(el)})
				 })
			 .catch((err) => console.log(err))
		 },
		 getChannels() {
			 fetch(`${BACK_SERVER}/chat`)
				 .then((response) => response.json())
				 .then((cc) => {
					 cc.forEach((elem) => {
						 this.channels.push(elem);
						 this.getChannelMsg(elem.id);
						 if (cc) {
							 this.chatid = cc[0].id;
						 }
					 })
				 })
				 .catch((err) => console.log(err))
		 },
		 sendMessage() {
			 const payload = {content: this.message, channel: this.chatid};
			 if (this.message.length == 3 || this.message.length > 255) {
				 console.log("invalid message")
				 return;
			 }
			 socket.emit("sendMessage", payload)
			 this.message = "";
		 },
		 createChannel() {
			 const newChannel = {
				 channelName: this.channelName,
				 channelLevel: Number(this.picked),
			 };
			 console.log(newChannel)
			 socket.emit('addChannel', newChannel);
			 this.channelName = "";
		 },
		 updateSelectedChannel(chan: number) {
			 this.chatid = chan;
		 },
		 banChatter() {
			 const message = {
				 banLogin: this.banlogin,
				 channelId: this.chatid,
			 }
			 socket.emit("banChatter", message);
			 this.banlogin = "";
		 },
		 unbanChatter() {
			 const message = {
				 banLogin: this.banlogin,
				 channelId: this.chatid,
			 }
			 socket.emit("unbanChatter", message);
			 this.banlogin = "";
		 },
		 adminChatter() {
			 const message = {
				 banLogin: this.adminlogin,
				 channelId: this.chatid,
			 }
			 socket.emit("adminChatter", message);
			 this.adminlogin = "";
		 },
		 unadminChatter() {
			 const message = {
				 banLogin: this.adminlogin,
				 channelId: this.chatid,
			 }
			 socket.emit("unadminChatter", message);
			 this.adminlogin = "";
		 }
	 },
	 computed: {
		 chanmsg: function() {
			 return this.messages.filter((msg) => {return msg.channel === this.chatid});
		 },
	 },
	 mounted() {
		 socket = io(BACK_SERVER, {
			 path: '/chatsocket',
			 auth: {
				 'accessToken': jwtstore.$state.token,
			 },
			 extraHeaders: {
				  Authorization: `Bearer ${jwtstore.$state.token}`
			 },
		 })
		 this.getChannels();
		 socket.on('recvMessage', (message) => {
			 message.channel = message.channel.id
			 this.messages.push(message);
		 })
		 socket.on('updateChannel', (channel) => {
			 this.channels.push(channel);
		 })
		 socket.on('badMessage', (message) => {
			 console.log(message);
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
	<button v-for="chan in channels" @click="updateSelectedChannel(chan.id)">{{chan.channelName}}({{chan.id}})</button>
	<ul><li v-for="item in chanmsg">{{item.authorUsername}}({{item.authorLogin}}) {{ item.content }}</li></ul>
	<div>
		<input v-model.trim="message" type="text"/><button @click="sendMessage">Send</button>
	</div>
	<div>
		<input v-model.trim="channelName" type="text"/><button @click="createChannel">Create channel</button>
	</div>
	<div>
		<input type="radio" id="zero" value=0 v-model=picked>
		<label for="one">Public</label>
		<br>
		<input type="radio" id="one" value=1 v-model=picked>
		<label for="one">Protected</label>
		<br>
		<input type="radio" id="two" value=2 v-model=picked>
		<label for="two">Private</label>
		<br>
		<span>Picked: {{ picked }}</span>
	</div>
	<div>
		<input v-model.trim="banlogin" type="text"/>
		<button @click="banChatter">Ban</button>
		<button @click="unbanChatter">UnBan</button>
	</div>
	<div>
		<input v-model.trim="adminlogin" type="text"/>
		<button @click="adminChatter">Adm</button>
		<button @click="unadminChatter">UnAdm</button>
	</div>
</template>
