<template>
  <div>
    <q-card id="div-canvas" flat bordered dark>
        <canvas id="responsive-canvas" ref="game"></canvas>
        <p class="mt-8 text-xl" style="color:aquamarine; text-align: center;">{{ message }}</p>
    </q-card>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import store from '../store'
import router from '@/router'

import Draw from '../Draw'
import { BACK_SERVER } from '@/config'

export default {
  setup (): any {
    return {
      name: 'Game',
      store: store,
      router: router,
      socket: null,
      game: ref({} as HTMLCanvasElement),
      context: ref({} as CanvasRenderingContext2D),
      playground: ref(null as unknown),
      message: ref('' as string),
      end: ref(false as boolean)
    }
  },
  mounted (): void {
    this.socket = io(BACK_SERVER, {
      path: '/game',
      transports: ['websocket'],
      query: {
        accessToken: this.store.getters.getToken,
        role: 'player',
        mode: 'normal'
      },
      auth: {
        accessToken: this.store.getters.getToken
      }
    })
    console.log(this.socket)
    if (this.game) {
      this.context = this.game.getContext('2d')
      this.tokenError()
      this.alreadyPlaying()
      this.drawWaiting()
      this.drawGame()
      this.drawInterruptedGame()
      this.endGame()
      this.abortedGame()

      window.addEventListener('resize', () => {
        this.game.width = this.game.offsetWidth
        this.game.height = this.game.width * 0.6
        Draw.updatePlayground(
          this.playground,
          this.context,
          this.game.width,
          this.game.height,
          this.playground.player1,
          this.playground.player2
        )
      })
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'w') {
          (this.socket as Socket).emit('KeyUp')
        }
        if (event.key === 's') {
          (this.socket as Socket).emit('KeyDown')
        }
      })
      window.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.key === 'w') {
          (this.socket as Socket).emit('KeyUpUnpressed')
        }
        if (event.key === 's') {
          (this.socket as Socket).emit('KeyDownUnpressed')
        }
      })
    }
  },
  beforeUnmount () {
    if (this.socket != null) {
      this.socket.disconnect()
    }
  },
  methods: {
    abortedGame () {
      (this.socket as Socket).on('abortedGame', (data) => {
        const { winner, loser } = data
        if (winner && loser) {
          this.message = 'The game was aborted : ' + loser + ' run away against ' + winner
          this.end = true
        }
      })
    },
    drawWaiting () {
      (this.socket as Socket).on('waitingForPlayer', (data) => {
        console.log('SALUT')
        this.playground = data.playground
        if (this.playground != null) {
          this.game.width = this.game.offsetWidth
          this.game.height = this.game.width * 0.6
          this.message = 'Player: ' + data.player + ' is ' + data.message
          Draw.updatePlayground(
            this.playground,
            this.context,
            this.game.width,
            this.game.height,
            this.playground.player1,
            this.playground.player2
          )
        }
      })
    },
    drawGame () {
      (this.socket as Socket).on('updatePlayground', (data) => {
        this.playground = data.playground
        if (this.playground != null) {
          this.game.width = this.game.offsetWidth
          this.game.height = this.game.width * 0.6
          Draw.updatePlayground(
            this.playground,
            this.context,
            this.game.width,
            this.game.height,
            this.playground.player1,
            this.playground.player2
          )
        }
        this.message = ''
      })
    },
    drawInterruptedGame () {
      (this.socket as Socket).on('interruptedGame', (data) => {
        this.playground = data.playground
        if (this.playground != null) {
          this.game.width = this.game.offsetWidth
          this.game.height = this.game.width * 0.6
          Draw.updatePlayground(
            this.playground,
            this.context,
            this.game.width,
            this.game.height,
            this.playground.player1,
            this.playground.player2
          )
        }
      })
    },
    endGame () {
      (this.socket as Socket).on('endGame', (data) => {
        console.log(data)
        const { winner, loser } = data
        if (winner && loser) {
          this.message = winner + ' wins against ' + loser
        }
        if (this.playground != null) {
          this.game.width = this.game.offsetWidth
          this.game.height = this.game.width * 0.6
          Draw.updatePlayground(
            this.playground,
            this.context,
            this.game.width,
            this.game.height,
            this.playground.player1,
            this.playground.player2
          )
        }
      })
    },
    alreadyPlaying () {
      (this.socket as Socket).on('alreadyPlaying', (data) => {
        router.push('/')
      })
    },
    tokenError () {
      (this.socket as Socket).on('tokenError', (data) => {
        this.router.push('/')
      })
    }
  }
}
</script>

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
