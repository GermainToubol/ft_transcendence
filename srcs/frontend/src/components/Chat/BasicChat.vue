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
			 mutelogin: "",
			 adminlogin: "",
			 password: "",
			 invitations: [],
			 invitedUser: "",
		 }
	 },
	 methods: {
		 getChannelMsg(channel: number) {
			 fetch(`${BACK_SERVER}/chat/${channel}`, {headers: {Authorization: `Bearer ${jwtstore.$state.token}`}})
				 .then((response) => response.json())
			     .then((cc) => {
					 cc.forEach((el) => {
						 el.channel = channel;
						 this.messages.push(el)})
				 })
				 .catch((err) => console.log(err))
		 },
		 getChannels() {
			 fetch(`${BACK_SERVER}/chat`, {headers: {Authorization: `Bearer ${jwtstore.$state.token}`}})
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
		 getInvitations() {
			 fetch(`${BACK_SERVER}/chat/invitations/me`, {headers: {Authorization: `Bearer ${jwtstore.$state.token}`}})
				 .then((response) => { console.log("qww", response); return response.json()})
				 .then((cc) => {
					 cc.forEach((elem) => {
						 console.log(elem)
						 this.invitations.push(elem);
					 })
				 })
		 },
		 sendMessage() {
			 const payload = {content: this.message, channel: this.chatid};
			 if (this.message.length > 255) {
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
				 password: this.password,
			 };
			 socket.emit('addChannel', newChannel);
			 this.channelName = "";
			 this.password = "";
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
		 muteChatter() {
			 const message = {
				 banLogin: this.mutelogin,
				 channelId: this.chatid,
			 }
			 socket.emit("muteChatter", message);
			 this.mutelogin = "";
		 },
		 unmuteChatter() {
			 const message = {
				 banLogin: this.mutelogin,
				 channelId: this.chatid,
			 }
			 socket.emit("unmuteChatter", message);
			 this.mutelogin = "";
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
		 },
		 setPassword() {
			 const message = {
				 channelId: this.chatid,
				 password: this.password,
			 }
			 socket.emit("setPassword", message);
			 this.password = "";
		 },
		 joinChannel() {
			 const message = {
				 channelId: this.chatid,
				 password: this.password,
			 }
			 socket.emit("joinChannel", message);
			 this.password = "";
		 },
		 inviteUser() {
			 const message = {
				 channelId: this.chatid,
				 userLogin: this.invitedUser,
			 }
			 socket.emit("inviteUser", message)
			 this.invitedUser = "";
		 },
		 acceptInvitation(id: number) {
			 if (id < 0 || id >= this.invitations.length)
			 return ;
			 const message = {
				 channelId: Number(this.invitations[id].id),
				 userLogin: "me"
			 }
			 console.log(message)
			 socket.emit("acceptInvitation", message);
		 },
		 refuseInvitation(id: number) {
			 if (id < 0 || id >= this.invitations.length)
			 return ;
			 const message = {
				 channelId: Number(this.invitations[id].id),
				 userLogin: "me"
			 }
			 console.log(message)
			 socket.emit("refuseInvitation", message);
		 }
	 },
	 computed: {
		 chanmsg: function() {
			 return this.messages.filter((msg) => {return msg.channel === this.chatid});
		 },
		 chanAdm: function(): boolean {
			 const arr = this.channels.filter((chan) => chan.id === this.chatid)
			 return arr.length >= 1 && arr[0].channelAdm;
		 },
		 currentChannel: function() {
			 return this.channels.find((chan) => chan.id == this.chatid)
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
		 this.getInvitations();
		 socket.on('recvMessage', (message) => {
			 message.channel = message.channel.id
			 this.messages.push(message);
		 })
		 socket.on('updateChannel', (channel) => {
			 this.channels.push(channel);
		 })
		 socket.on("retriveMessages", (message) => {
			 this.getChannelMsg(message);
		 })
		 socket.on('badMessage', (message) => {
			 console.log(message);
		 })
		 socket.on('updateAdmin', (message) => {
			 const index = this.channels.findIndex((chan) => chan.id === message.channelId)
			 console.log(message)
			 console.log(index)
			 if (index != -1)
				 this.channels[index].channelAdm = Boolean(message.adminStatus)
			 console.log(this.channels[index])
		 })
		 socket.on("addInvitation", (message) => {
			 this.invitations.push(message);
		 })
		 socket.on("popInvitation", (message) => {
			 const index = this.invitations.findIndex((chan) => chan.id == message.id);
			 if (index != -1) {
				 this.invitations.splice(index, 1);
			 }
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
	<div style="border: 1px solid red">
	<button v-for="chan in channels" @click="updateSelectedChannel(chan.id)">{{chan.channelName}}({{chan.id}})</button>
	<ul style="border: 1px solid red"><li v-for="item in chanmsg">{{item.authorUsername}}({{item.authorLogin}}) {{ item.content }}</li></ul>
	<div>
		<input v-model.trim="message" type="text"/><button @click="sendMessage">Send</button>
	</div>
	</div>
	<div style="border: 1px solid red">
		<input type="radio" id="zero" value=0 v-model=picked>
		<label for="one">Public</label>
		<br>
		<input type="radio" id="one" value=1 v-model=picked>
		<label for="one">Protected</label>
		<br>
		<input type="radio" id="two" value=2 v-model=picked>
		<label for="two">Private</label>
		<div>
			<input v-model.trim="channelName" type="text"/><button @click="createChannel">Create channel</button>
			<br><input v-if="picked == 1" v-model="password" type="text"/>
		</div>
	</div>
	<div>
		<input v-model="password" type="text"/>
		<button @click="joinChannel">Join Channel</button>
	</div>

	<!-- admin pannel -->
	<div v-if="chanAdm" style="border: 1px solid red">
		<div>
			<input v-model.trim="banlogin" type="text"/>
			<button @click="banChatter">Ban</button>
			<button @click="unbanChatter">UnBan</button>
		</div>
		<div>
			<input v-model.trim="mutelogin" type="text"/>
			<button @click="muteChatter">Mute</button>
			<button @click="unmuteChatter">UnMute</button>
		</div>
		<div>
			<input v-model.trim="adminlogin" type="text"/>
			<button @click="adminChatter">Adm</button>
			<button @click="unadminChatter">UnAdm</button>
		</div>
		<div>
			<input v-model="password" type="text"/>
			<button @click="setPassword">Set Password</button>
		</div>
	</div>

	<!-- Invitation pannel -->
	<div style="border: 1px solid red">
		<div v-if="currentChannel && currentChannel.channelStatus == 2 && chanAdm">
			<input v-model.trim="invitedUser" type="text">
			<button @click="inviteUser">invite</button>
		</div>
		<li v-for="(chan, id) in invitations">
			{{chan.channelName}}({{chan.id}})
			<button @click="acceptInvitation(id)">accept</button>
			<button @click="refuseInvitation(id)">refuse</button>
		</li>
	</div>
</template>
