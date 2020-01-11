<template>
  <div>
    <edit-profile-form :user="user" v-on:editUser="editUser" v-on:deleteUser="removeUser"></edit-profile-form>
  </div>
</template>

<script>
import EditProfileForm from '../components/EditProfileForm.vue'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { memberMixin } from '../mixins/members.js'

export default {
  mixins: [memberMixin],
  components: {
    EditProfileForm
  },
  data () {
    return {
      user: { roles: [], type: 'member', language: 'fr' } // defaults are set here
    }
  },
  mounted () {
    this.loadUser(this.$route.params.uuid)
  },
  computed: {
    ...mapGetters(['uuid', 'code', 'type'])
  },
  methods: {
    editUser (user) {
      var self = this
      self.updating = true
      if (user.uuid !== undefined) {
        var url
        if (self.type === 'admin') {
          url = `/api/admins/${self.uuid}/members/${user.uuid}`
        } else {
          url = `/api/members/${user.uuid}`
        }
        axios.put(
          url,
          user,
          { headers: { 'X-Member-Code': this.code } }
        ).then(function (response) {
          self.updating = false
          self.$notifyOK(self.$t('members.notifySuccess'))
          self.$emit('updateUser', response.data.uuid)
        }).catch(function (error) {
          self.updating = false
          self.$notifyNOK(self.$t('members.notifyFailure'))
          console.log(error)
        })
      } else {
        axios.post(
          `/api/admins/${this.uuid}/members`,
          user,
          { headers: { 'X-Member-Code': this.code } }
        ).then(function (response) {
          self.updating = false
          self.$notifyOK(self.$t('members.notifySuccess'))
          self.$emit('updateUser', response.data.uuid)
        }).catch(function (error) {
          self.updating = false
          self.$notifyNOK(self.$t('members.notifyFailure'))
          console.log(error)
        })
      }
    },

    loadUser (uuid) {
      if (uuid) {
        var self = this
        var url
        if (self.type === 'admin') {
          url = `/api/admins/${this.uuid}/members/${uuid}`
        } else {
          url = `/api/members/${this.uuid}`
        }
        axios.get(
          url, { headers: { 'X-Member-Code': this.code } }
        ).then(function (response) {
          self.user = response.data
          self.$router.push({ path: `/memberEdit/${self.user.uuid}` })
        }).catch(err => console.log(err))
      }
    },
    removeUser (member) {
      var self = this
      this.deleteUser(member)
        .then(function () { self.$router.push({ path: `/members` }) })
        .catch(function (error) { console.log(error) })
    }
  }
}
</script>
<style>
</style>
