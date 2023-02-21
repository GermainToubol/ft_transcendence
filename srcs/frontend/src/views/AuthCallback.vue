<script lang="ts">
import router from '@/router'
import { useRoute } from 'vue-router'
import { useStore } from '../store'
import Form2FA from '../components/Form2FA.vue'
import { ref } from '@vue/reactivity'

export default {
  name: 'AuthCallback',
  components: {
    Form2FA
  },
  setup (): any {
    return {
      route: useRoute(),
      store: useStore(),
      card2FA: ref(false),
      alert2fa: ref(false),
      qrCode: ref(''),
      code: ''
    }
  },
  async mounted (): Promise<void> {
    const response = await this.store.dispatch('login', { code: this.route.query.code })
    if (response.is2faEnabled === true || response.enable2fa === true) {
      this.card2FA = true
    } else if (response.token) {
      router.push('/')
    }
  },
  methods: {
    goToHome (value) {
      if (value === true) {
        router.push('/')
      }
    }
  }
}
</script>

<template>
<div>
  <Form2FA v-model="card2FA" v-if="card2FA" :qrCode="qrCode" @close="card2FA=false" @verified="goToHome" @alert="alert2fa=true" />
  <div v-else class="fixed-center">
    <q-circular-progress
      indeterminate
      rounded
      size="50px"
      color="white"
      class="q-ma-md"
    />
  </div>
  <q-dialog v-model="alert2fa">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Invalid code.
        </q-card-section>
      </q-card>
    </q-dialog>
</div>
</template>
