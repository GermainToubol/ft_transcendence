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
        return
      }
      router.push('/login')
    }
  }
}
</script>

<template>
<div>
  <Form2FA v-model="card2FA" :qrCode="qrCode" @close="card2FA=false" @verified="goToHome" />
</div>
</template>
