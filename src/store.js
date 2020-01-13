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
    action: {
      type: '',
      objectUUID: '',
      payload: ''
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
    },
    setAction (state, payload) {
      state.action.type = payload.type
      state.action.objectUUID = payload.objectUUID
      state.action.payload = payload.payload
    },
    setLanguage (state, locale) {
      state.locale = locale
    }
  },
  getters: {
    uuid: (state) => state.auth.uuid,
    code: (state) => state.auth.code,
    type: (state) => state.auth.type,
    language: (state) => state.locale,
    action: (state) => state.action
  }
})
