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
export default {
  name: 'Login',
  setup (): any {
    return {
      intra_url: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a0180e44fbdd685d1e0f4566d64cd26295af63c2f88a6a356866c14836ac0cf4&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback&response_type=code'
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
