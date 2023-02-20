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
export default {
  name: 'Login',
  setup (): any {
    return {
      intra_url: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d5f93b42e0d0ca5aa92dba079e52b3c30eff46e08e31f5c9aaceb2b8e999b8cc&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback&response_type=code'
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
