<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import Draw from '../Draw';
import useJwtStore from '@/stores/store';
import { BACK_SERVER } from '@/config';

const jwtstore = useJwtStore();
let socket = ref(null as unknown);
let game = ref({} as HTMLCanvasElement);
let context = ref({} as CanvasRenderingContext2D);
let playground = ref(null as unknown);
let message = ref('' as String);

onMounted(() => {
    socket.value = io(BACK_SERVER, {
        path: '/game/',
        query: {
            'accessToken': jwtstore.$state.token,
            'role': 'player',
        },
    });
    if (game && game.value) {
        context.value = game.value.getContext("2d");
        drawWaiting();
        
        drawGame();

		
        
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
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if(event.key === "w") {
                (socket.value as Socket).emit("KeyUp");
            }
            if(event.key === "s") {
                (socket.value as Socket).emit("KeyDown");
            }
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if(event.key === "w") {
                (socket.value as Socket).emit("KeyUpUnpressed");
            }
            if(event.key === "s") {
                (socket.value as Socket).emit("KeyDownUnpressed");
            }
        });
    }
});

onUnmounted(() => {
   if (socket != null) {
    (socket.value as Socket).disconnect();
   }
});

function drawWaiting() {
    (socket.value as Socket).on('WaitingForPlayer', (data) => {
    playground.value = data.playground;
    console.log('WAIT')
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

function msg() {
	(socket.value as Socket).on('msg', (data) => {
	console.log(data)
    });
}

function drawGame() {
    (socket.value as Socket).on('updatePlayground', (data) => {
	console.log('GAME')
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

</script>

<template>
  <div>
    <div id="div-canvas">
        <canvas id="responsive-canvas" ref="game"></canvas>
        <p class="mt-8 text-xl" style="color:aquamarine; text-align: center;">{{ message }}</p>
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