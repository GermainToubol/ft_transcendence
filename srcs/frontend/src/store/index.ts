import axios from 'axios'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { BACK_SERVER } from '@/config'

export interface State {
  pseudo: string,
  login: string,
  avatar: string,
  token: string,
  doubleFA: boolean,
  isAuthenticated: boolean,
  url: string
}

export const key: InjectionKey<Store<State>> = Symbol('keyInjection')

export const store = createStore<State>({
  state: {
    pseudo: '',
    login: '',
    avatar: '',
    token: '',
    doubleFA: false,
    isAuthenticated: false,
    url: BACK_SERVER
  },
  getters: {
    getPseudo (state) {
      return state.pseudo
    },
    getToken (state) {
      return state.token
    },
    isAuthenticated (state) {
      return state.isAuthenticated
    },
    getDoubleFA (state) {
      return state.doubleFA
    }
  },
  actions: {
    async login (context, params) {
      const response = await axios.get(`${BACK_SERVER}/auth/login`, {
        params: { code: params.code }
      })
        .then((t) => t.data)
      console.log(response)
      context.commit('AUTHENTICATED', {
        pseudo: response.pseudo,
        token: response.token,
        login: response.login
      })
      return response
    },
    async logout (context) {
      const response = await axios.get(`${BACK_SERVER}/auth/logout`, {
        headers: { Authorization: `Bearer ${this.state.token}` }
      })
      context.commit('DEAUTHENTICATE')
      return response
    },
    async validateToken (context) {
      console.log(localStorage.token)
      const response = await axios.get(`${BACK_SERVER}/auth/validate`, {
        headers: { Authorization: `Bearer ${localStorage.token}` }
      }).then((t) => t.data)

      if (!response) {
        context.commit('DEAUTHENTICATE')
        return false
      }
      context.commit('AUTHENTICATED', {
        login: response.login,
        pseudo: response.usual_full_name,
        token: localStorage.token
      })
      context.commit('SETDOUBLEFA', { is2fa: response.is2faEnabled })
      return true
    },
    async verify2FA (context, params) {
      const response = await axios.post(
        `${BACK_SERVER}/2fa/verify`,
        {
          code: params.code,
          login: this.state.login
        },
        { headers: { Authorization: `Bearer ${this.state.token}` } }
      )
      if (response) {
        console.log(response)
        context.commit('AUTHENTICATED', {
          pseudo: this.state.pseudo,
          login: this.state.login,
          token: response.data.token
        })
      }
      return response
    },
    async enable2FA (context) {
      const response = await axios.get(`${BACK_SERVER}/2fa/enable`, {
        headers: { Authorization: `Bearer ${this.state.token}` }
      })
      context.commit('SETDOUBLEFA', { is2fa: true })
      return response
    },
    async disable2FA (context) {
      const response = await axios.get(`${BACK_SERVER}/2fa/disable`, {
        headers: { Authorization: `Bearer ${this.state.token}` }
      })
      context.commit('SETDOUBLEFA', { is2fa: false })
      return response
    }
  },
  mutations: {
    AUTHENTICATED (state, params) {
      state.isAuthenticated = true
      state.login = params.login
      state.pseudo = params.pseudo
      state.token = params.token
      localStorage.token = params.token
    },
    DEAUTHENTICATE (state) {
      state.token = ''
      localStorage.token = ''
      state.isAuthenticated = false
    },
    SETDOUBLEFA (state, params) {
      state.doubleFA = params.is2fa
    }
  }
})

export default store

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}
