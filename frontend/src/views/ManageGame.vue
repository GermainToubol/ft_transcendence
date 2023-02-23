<template>
<div>
  <div class="row">
    <div class="col-7">
      <LeaderBoard />
    </div>
    <div class="col-5">
      <PlayMenu />
    </div>
  </div>
  <div class="row">
    <div class="col-7">
      <History />
    </div>
    <div class="col-5">
      <GamesOnGoing />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import LeaderBoard from '../components/LeaderBoard.vue'
import PlayMenu from '../components/PlayMenu.vue'
import GamesOnGoing from '../components/GamesOnGoing.vue'
import History from '../components/History.vue'

export default {
  name: 'ManageGame',
  components: {
    LeaderBoard,
    PlayMenu,
    GamesOnGoing,
    History
  },
  setup (): any {
    return {

    }
  }
}
</script>
