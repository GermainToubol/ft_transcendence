<template>
  <div class="q-pa-md">
    <q-card flat dark>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Games On Going</q-toolbar-title>
      </q-toolbar>
      <q-list>
        <div v-for="game in games" v-bind:key="game.playerOne">
          <q-item>
            <q-item-section>{{ game.playerOne }} VS {{ game.playerTwo }}</q-item-section>
            <q-item-section side>
              <q-btn color="secondary">Spectate</q-btn>
            </q-item-section>
          </q-item>
          <q-separator />
        </div>
      </q-list>
    </q-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GamesOnGoing',
  setup (): any {
    return {
      games: [
        { playerOne: 'iouali', playerTwo: 'emcariot' },
        { playerOne: 'iouali', playerTwo: 'jdupont' },
        { playerOne: 'iouali', playerTwo: 'emcariot' },
        { playerOne: 'iouali', playerTwo: 'emcariot' },
        { playerOne: 'iouali', playerTwo: 'emcariot' }
      ]
    }
  }
}
</script>
