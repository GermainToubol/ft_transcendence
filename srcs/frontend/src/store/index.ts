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
    },
    getAvatar (state) {
      return state.avatar
    }
  },
  actions: {
    async setPseudo (context, pseudo: string) {
      const response = await axios.post(`${BACK_SERVER}/user/setpseudo`,
        { pseudo: pseudo },
        {
          headers: { Authorization: `Bearer ${this.state.token}` }
        })
        .then((t) => t.data)
      if (response) {
        context.commit('SETPSEUDO', {
          pseudo: pseudo
        })
        return pseudo
      }
      return null
    },
    async setAvatar (context, avatar: any) {
      const response = await axios.post(`${BACK_SERVER}/user/avatar`,
        avatar,
        {
          headers: { Authorization: `Bearer ${this.state.token}` }
        })
        .then((t) => t.data)
      if (response) {
        context.commit('SETAVATAR', {
          avatar: `${BACK_SERVER}/local-files/${response}`
        })
        return avatar
      }
      return null
    },
    async login (context, params) {
      const response = await axios.get(`${BACK_SERVER}/auth/login`, {
        params: { code: params.code }
      })
        .then((t) => t.data)
      context.commit('AUTHENTICATED', {
        pseudo: response.pseudo,
        token: response.token,
        login: response.login,
        avatar: response.avatar !== 0 ? `${BACK_SERVER}/local-files/${response.avatar}` : 'http://sitedemonstre.e-monsite.com/medias/site/logos/39bpdyn_seirjfulq1azt-o0sgw.jpg'
      })
      return response
    },
    async logout (context) {
      const response = await axios.get(`${BACK_SERVER}/auth/logout`, {
        headers: { Authorization: `Bearer ${localStorage.token}` }
      })
      context.commit('DEAUTHENTICATE')
      localStorage.token = ''
      return response
    },
    async validateToken (context) {
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
        token: localStorage.token,
        avatar: response.avatarId !== null ? `${BACK_SERVER}/local-files/${response.avatarId}` : 'http://sitedemonstre.e-monsite.com/medias/site/logos/39bpdyn_seirjfulq1azt-o0sgw.jpg'
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
        context.commit('AUTHENTICATED', {
          pseudo: this.state.pseudo,
          login: this.state.login,
          token: response.data.token,
          avatar: this.state.avatar
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
      state.avatar = params.avatar
      state.token = params.token
      localStorage.token = params.token
    },
    DEAUTHENTICATE (state) {
      state.token = ''
      state.isAuthenticated = false
    },
    SETDOUBLEFA (state, params) {
      state.doubleFA = params.is2fa
    },
    SETPSEUDO (state, params) {
      state.pseudo = params.pseudo
    },
    SETAVATAR (state, params) {
      state.avatar = params.avatar
    }
  }
})

export default store

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}
