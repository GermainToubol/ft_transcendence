<template>
<div class="row items-center fixed-center">
  <div class="col-5"></div>
  <div class="col-auto">
  <q-card flat bordered class="login-card" dark>
      <q-card-section>
        <div class="text-h6">Welcome to Transcendence !</div>
      </q-card-section>
      <q-card-actions vertical>
        <q-btn color="primary" icon="login" label="Login with 42" :href="intra_url"></q-btn>
      </q-card-actions>
    </q-card>
  </div>
  <div class="col-5"></div>
</div>
</template>

<script lang="ts">
import { INTRA_PATH } from '@/config'
import store from '../store'

export default {
  name: 'Login',
  setup (): any {
    return {
      intra_url: INTRA_PATH,
      store: store
    }
  },
  async mounted () {
    await store.dispatch('validateToken')
    if (store.getters.isAuthenticated === true) {
      this.$router.push('/')
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
