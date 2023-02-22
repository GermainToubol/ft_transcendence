<template>
	<Friends :key="componentKey" @refresh="forceRerender"/>
  </template>
  
  <script lang="ts">
  import Friends from '../components/Friends.vue'
  import { ref } from 'vue'
  
  export default {
	name: 'FriendVue',
	components: {
	  Friends
	},
	data() {
    return {
      componentKey: 0,
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    }
  }
}
  </script>
  