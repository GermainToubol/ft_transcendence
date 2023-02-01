<template>
<div class="row items-center fixed-center">
  <div class="col-5"></div>
  <div class="col-auto">
  <q-card flat bordered class="login-card bg-grey-1">
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

export default {
  name: 'Login',
  setup (): any {
    return {
      intra_url: INTRA_PATH
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
