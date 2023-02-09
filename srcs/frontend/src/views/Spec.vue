<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import Draw from '../Draw';
import useJwtStore from '@/stores/store';
import { BACK_SERVER } from '@/config';
import router from '@/router';

const jwtstore = useJwtStore();
let socket = ref(null as unknown);
let game = ref({} as HTMLCanvasElement);
let context = ref({} as CanvasRenderingContext2D);
let playground = ref(null as unknown);
let message = ref('' as String);
let end = ref(false as boolean);

onMounted(() => {
    socket.value = io(BACK_SERVER, {
        path: '/game/',
        query: {
            'accessToken': jwtstore.$state.token,
            'role': 'spectator',
			'roomname': router.currentRoute.value.query.roomname,
        },
    });
    if (game && game.value) {
        context.value = game.value.getContext("2d");

		tokenError();

		alreadyPlaying();

        drawWaiting();
        
        drawGame();

		drawInterruptedGame();

		missingOpponent();

		endGame();
        
        window.addEventListener('resize', () => {
            game.value.width = game.value.offsetWidth;
            game.value.height = game.value.width * 0.6;
            Draw.updatePlayground(
                playground.value,
                context.value,
                game.value.width,
                game.value.height,
                playground.value.player1,
                playground.value.player2,
                );
            });
    }
});

onUnmounted(() => {
   if (socket != null) {
    (socket.value as Socket).disconnect();
   }
});

function drawWaiting() {
    (socket.value as Socket).on('waitingForPlayer', (data) => {
		playground.value = data.playground;
		if (playground.value != null) {
				game.value.width = game.value.offsetWidth;
				game.value.height = game.value.width * 0.6;
				message.value = 'Player: ' + data.player + ' is ' + data.message;
				Draw.updatePlayground(
					playground.value,
					context.value,
					game.value.width,
					game.value.height,
					playground.value.player1,
					playground.value.player2,
				);
        }
    });
}

function drawGame() {
    (socket.value as Socket).on('updatePlayground', (data) => {
		playground.value = data.playground;
		if (playground.value != null) {
				game.value.width = game.value.offsetWidth;
				game.value.height = game.value.width * 0.6;
				Draw.updatePlayground(
					playground.value,
					context.value,
					game.value.width,
					game.value.height,
					playground.value.player1,
					playground.value.player2,
				);
        }
        message.value = '';
    });
}

function drawInterruptedGame() {
    (socket.value as Socket).on('interruptedGame', (data) => {
		playground.value = data.playground;
		if (playground.value != null) {
				game.value.width = game.value.offsetWidth;
				game.value.height = game.value.width * 0.6;
				Draw.updatePlayground(
					playground.value,
					context.value,
					game.value.width,
					game.value.height,
					playground.value.player1,
					playground.value.player2,
				);
        }
    });
}

function endGame() {
	(socket.value as Socket).on('endGame', (data) => {
		const { winner, loser} = data;
		if (winner && loser) {
            message.value = winner + ' wins against ' + loser;
			end.value = true;
        }
    });
}

function missingOpponent() {
	(socket.value as Socket).on('missingOpponent', (data) => {
		message.value = data.message;
    });
}

function alreadyPlaying() {
	(socket.value as Socket).on('alreadyPlaying', (data) => {
		router.push('/');
    });
}

function tokenError() {
	(socket.value as Socket).on('tokenError', (data) => {
		router.push('/');
    });
}

</script>

<template>
  <div>
    <div id="div-canvas">
        <canvas id="responsive-canvas" ref="game"></canvas>
        <p class="mt-8 text-xl" style="color:aquamarine; text-align: center;">{{ message }}</p>
    </div>
	<div v-if="end">
		<nav>
			<RouterLink to="/">Home</RouterLink>
		</nav>
	</div>
    </div>
</template>

<style scoped>
#div-canvas{
  width: auto;
  max-width: 1200px;
  height: auto;
  max-height: 1200px;
  margin: 0 auto;
}

canvas#responsive-canvas {
  width: 100%;
  position: relative;
}
</style>