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
		 }
	 },
	 methods: {
		 getChannelMsg(channel: number) {
			 fetch(`${BACK_SERVER}/chat/${channel}`)
				 .then((response) => response.json())
			     .then((cc) => {
					 cc.forEach((el) => {
						 el.channel = channel;
						 this.messages.push(el)})
				 })
			 .catch((err) => console.log(err))
		 },
		 getChannels() {
			 fetch(`${BACK_SERVER}/chat`)
				 .then((response) => response.json())
				 .then((cc) => {
					 console.log(cc)
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
			 console.log(payload)
			 socket.emit("sendMsg", payload)
			 this.message = "";
		 },
		 createChannel() {
			 const newChannel = {
				 channelName: this.channelName,
				 channelLevel: this.picked,
			 };
			 socket.emit('addChan', newChannel);
			 this.channelName = "";
		 },
		 updateSelectedChannel(chan: number) {
			 this.chatid = chan;
		 },
	 },
	 computed: {
		 chanmsg: function() {
			 return this.messages.filter((msg) => {return msg.channel === this.chatid});
		 },
	 },
	 mounted() {
		 socket = io(BACK_SERVER, {
			 path: '/chatsocket',
			 query: {
				 'accessToken': jwtstore.$state.token,
			 }
		 })
		 this.getChannels();
		 socket.on('recMsg', (message) => {
			 message.channel = message.channel.id
			 this.messages.push(message);
		 })
		 socket.on('updateChan', (channel) => {
			 this.channels.push(channel);
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
	<ul><li v-for="item in chanmsg">{{item.channel}} - {{ item.content }}</li></ul>
	<div>
		<input v-model="message" type="text"/><button @click="sendMessage">Send</button>
	</div>
	<div>
		<input v-model="channelName" type="text"/><button @click="createChannel">Create channel</button>
	</div>
	<div>
		<input type="radio" id="zero" value=0 v-model="picked">
		<label for="one">Public</label>
		<br>
		<input type="radio" id="one" value=1 v-model="picked">
		<label for="one">Protected</label>
		<br>
		<input type="radio" id="two" value=2 v-model="picked">
		<label for="two">Private</label>
		<br>
		<span>Picked: {{ picked }}</span>
	</div>
</template>
