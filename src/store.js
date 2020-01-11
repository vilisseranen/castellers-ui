import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      uuid: '',
      code: '',
      type: ''
    },
    locale: ''
  },
  mutations: {
    authenticate (state, payload) {
      state.auth.uuid = payload.uuid
      state.auth.code = payload.code
      state.auth.type = payload.type
      state.locale = payload.language
    },
    disconnect (state) {
      state.auth.uuid = ''
      state.auth.code = ''
      state.auth.type = ''
    }
  },
  getters: {
    uuid: (state) => state.auth.uuid,
    code: (state) => state.auth.code,
    type: (state) => state.auth.type,
    language: (state) => state.locale
  }
})
