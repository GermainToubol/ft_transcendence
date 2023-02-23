<template>
  <div class="home">
    <User msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import User from '@/views/User.vue' // @ is an alias to /src

@Options({
  components: {
    User
  }
})
export default class Home extends Vue {}
</script>
