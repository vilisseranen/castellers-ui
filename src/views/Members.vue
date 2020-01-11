// TODO: use https://buefy.org/documentation/table#searchable
// See also https://github.com/buefy/buefy/issues/322

<template>
  <div class="box">
    <p class="title is-5">{{ $t('members.title') }}</p>
    <b-field>
      <button class="button field is-info" @click="addMember">
        <span class="icon">
          <i class="fa fa-user-plus"></i>
        </span>
        <span>{{ $t('members.addMember')}}</span>
      </button>
    </b-field>

    <b-table :data="members" striped>
      <template slot-scope="props">
        <b-table-column
          key="firstName"
          field="firstName"
          :label="$t('members.firstName')"
          searchable
        >{{props.row.firstName}}</b-table-column>
        <b-table-column
          key="lastName"
          field="lastName"
          :label="$t('members.lastName')"
          searchable
        >{{props.row.lastName}}</b-table-column>
        <b-table-column
          key="roles"
          field="roles"
          :label="$t('members.roles')"
          searchable
        >{{props.row.roles}}</b-table-column>
        <b-table-column
          key="extra"
          field="extra"
          :label="$t('members.extra')"
          searchable
        >{{props.row.extra}}</b-table-column>
        <b-table-column
          key="type"
          field="type"
          :label="$t('members.type')"
          searchable
        >{{props.row.type}}</b-table-column>

        <b-table-column key="actions" :label="$t('members.actions')">
          <a href="#">
            <span class="icon has-text-info" v-on:click="editMemberUuid(props.row.uuid)">
              <i class="fa fa-edit"></i>
            </span>
          </a>
          <a href="#">
            <span class="icon has-text-danger" v-on:click="removeUser(props.row)">
              <i class="fa fa-user-slash"></i>
            </span>
          </a>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { memberMixin } from '../mixins/members.js'

export default {
  mixins: [memberMixin],
  computed: {
    ...mapGetters(['uuid', 'code', 'type'])
  },
  data () {
    var members = []
    return {
      members
    }
  },
  mounted () {
    this.listMembers()
  },
  watch: {
    code: function () {
      this.listMembers()
    }
  },
  methods: {
    listMembers () {
      var self = this
      axios.get(
        `/api/admins/${this.uuid}/members`,
        { headers: { 'X-Member-Code': this.code } }
      ).then(function (response) {
        self.members = response.data
        for (var i = 0; i < self.members.length; i++) {
          self.members[i].type = self.$t('members.' + self.members[i].type + 'Type')
          self.members[i].roles = self.members[i].roles.join(', ')
        }
      }).catch(err => console.log(err))
    },
    addMember () {
      this.$router.push({ name: 'MemberAdd' })
    },
    editMemberUuid (memberUuid) {
      this.$router.push({ path: `/memberEdit/${memberUuid}` })
    },
    removeUser (member) {
      var self = this
      this.deleteUser(member)
        .then(function () { self.listMembers() })
        .catch(function (error) { console.log(error) })
    }
  }
}
</script>
