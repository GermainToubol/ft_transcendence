<script setup lang="ts">
 import { io, Socket } from 'socket.io-client';
 import { onMounted, onUnmounted, ref } from 'vue';

 import useJwtStore from '@/stores/store';
 import { BACK_SERVER } from '@/config';

 const jwtstore = useJwtStore();
 let socket = ref(null as unknown);
 let message = ref('' as String);

 onMounted(() => {
	 socket = io(BACK_SERVER, {
		 path: '/chat',
		 query: {
			 'accessToken': jwtstore.$state.token,
		 }
	 })
 });

 onUnmounted(() => {
	 if (socket != null) {
		 socket.disconnect();
   }
 });
</script>


<template>
	<ul id="messages"></ul>
	<form id="form" action="">
      <input id="input" autocomplete="off" /><button>Send</button>
    </form>
</template>
