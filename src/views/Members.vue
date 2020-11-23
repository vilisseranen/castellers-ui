<template>
  <div class="box">
    <p class="title is-5">{{ $t("members.title") }}</p>
    <b-field>
      <button class="button field is-info" @click="addMember">
        <span class="icon">
          <i class="fa fa-user-plus"></i>
        </span>
        <span>{{ $t("members.addMember") }}</span>
      </button>
    </b-field>

    <b-table :data="members" striped>
      <b-table-column
        key="firstName"
        field="firstName"
        :label="$t('members.firstName')"
        searchable
        v-slot="props"
        >{{ props.row.firstName }}
      </b-table-column>
      <b-table-column
        key="lastName"
        field="lastName"
        :label="$t('members.lastName')"
        searchable
        v-slot="props"
        >{{ props.row.lastName }}</b-table-column
      >
      <b-table-column
        key="roles"
        field="roles"
        :label="$t('members.roles')"
        searchable
        v-slot="props"
        >{{ props.row.roles }}</b-table-column
      >
      <b-table-column
        key="extra"
        field="extra"
        :label="$t('members.extra')"
        searchable
        v-slot="props"
        >{{ props.row.extra }}</b-table-column
      >
      <b-table-column
        key="type"
        field="type"
        :label="$t('members.type')"
        searchable
        v-slot="props"
      >
        <span v-if="props.row.type === 'member'">{{
          $t("members.memberType")
        }}</span>
        <span v-if="props.row.type === 'admin'">{{
          $t("members.adminType")
        }}</span>
      </b-table-column>
      <b-table-column
        key="actions"
        :label="$t('members.actions')"
        v-slot="props"
      >
        <a href="#">
          <span
            class="icon has-text-info"
            v-on:click="editMemberUuid(props.row.uuid)"
          >
            <i class="fa fa-edit"></i>
          </span>
        </a>
        <a href="#">
          <span class="icon has-text-danger" v-on:click="removeUser(props.row)">
            <i class="fa fa-user-slash"></i>
          </span>
        </a>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { memberMixin } from "../mixins/members.js";

export default {
  mixins: [memberMixin],
  computed: {
    ...mapGetters(["uuid", "type"])
  },
  data() {
    var members = [];
    return {
      members
    };
  },
  mounted() {
    this.listMembers();
  },
  methods: {
    listMembers() {
      var self = this;
      this.$getMembers()
        .then(function(response) {
          self.members = response.data;
          for (var i = 0; i < self.members.length; i++) {
            self.members[i].roles = self.members[i].roles.join(", ");
          }
        })
        .catch(err => console.log(err));
    },
    addMember() {
      this.$router.push({ name: "MemberAdd" });
    },
    editMemberUuid(memberUuid) {
      this.$router.push({ path: `/memberEdit/${memberUuid}` });
    },
    removeUser(member) {
      var self = this;
      this.deleteUser(member)
        .then(function() {
          self.listMembers();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
