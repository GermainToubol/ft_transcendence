import { defineStore } from 'pinia'

const useJwtStore = defineStore('jwt', {
  state() {
    return {
      token: '',
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
  },
});

export default useJwtStore;