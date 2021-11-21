<template>
  <div>
    <p class="title is-5">{{ $t("members.title") }}</p>
    <b-field>
      <button class="button field is-info" @click="addMember">
        <span class="icon">
          <i class="fa fa-user-plus"></i>
        </span>
        <span>{{ $t("members.addMember") }}</span>
      </button>
    </b-field>

    <b-field>
      <b-radio-button
        v-on:input="filterMembers"
        v-model="membersType"
        native-value="member,admin"
        type="is-success is-light is-outlined"
      >
        <span>{{ $t("members.memberTypePlural") }}</span>
      </b-radio-button>
      <b-radio-button
        v-on:input="filterMembers"
        v-model="membersType"
        native-value="guest"
        type="is-warning is-light is-outlined"
      >
        <span>{{ $t("members.guestTypePlural") }}</span>
      </b-radio-button>
    </b-field>

    <b-field>
      <b-radio-button
        v-on:input="filterMembers"
        v-model="membersStatus"
        native-value="active"
        type="is-success is-light is-outlined"
      >
        <span>{{ $t("members.activeStatus") }}</span>
      </b-radio-button>
      <b-radio-button
        v-on:input="filterMembers"
        v-model="membersStatus"
        native-value="created"
        type="is-info is-light is-outlined"
      >
        <span>{{ $t("members.createdStatus") }}</span>
      </b-radio-button>
      <b-radio-button
        v-on:input="filterMembers"
        v-model="membersStatus"
        native-value="paused"
        type="is-warning is-light is-outlined"
      >
        <span>{{ $t("members.pausedStatus") }}</span>
      </b-radio-button>
      <b-radio-button
        v-on:input="filterMembers"
        v-model="membersStatus"
        native-value="deleted"
        type="is-danger is-light is-outlined"
      >
        <span>{{ $t("members.deletedStatus") }}</span>
      </b-radio-button>
    </b-field>

    <b-table
      :data="members"
      striped
      default-sort="firstName"
      sort-icon="arrow-up"
      icon-pack="fa"
    >
      <b-table-column
        key="firstName"
        field="firstName"
        :label="$t('members.firstName')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.firstName }}
      </b-table-column>
      <b-table-column
        key="lastName"
        field="lastName"
        :label="$t('members.lastName')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.lastName }}</b-table-column
      >
      <b-table-column
        key="roles"
        field="roles"
        :label="$t('members.roles')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.roles }}</b-table-column
      >
      <b-table-column
        key="extra"
        field="extra"
        :label="$t('members.extra')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.extra }}</b-table-column
      >
      <b-table-column
        key="type"
        field="type"
        :label="$t('members.type')"
        searchable
        sortable
        v-slot="props"
      >
        <span v-if="props.row.type === 'guest'">{{
          $t("members.guestType")
        }}</span>
        <span v-if="props.row.type === 'member'">{{
          $t("members.memberType")
        }}</span>
        <span v-if="props.row.type === 'admin'">{{
          $t("members.adminType")
        }}</span>
      </b-table-column>
      <b-table-column
        key="actions"
        :label="$t('general.actions')"
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
import { mapActions, mapGetters, mapState } from "vuex";
import { memberMixin } from "../mixins/members.js";

export default {
  mixins: [memberMixin],
  data() {
    return {
      membersType: "member,admin",
      membersStatus: "active",
    };
  },
  computed: {
    ...mapGetters(["uuid", "type"]),
    ...mapState({
      members: (state) => state.members.members,
    }),
  },
  mounted() {
    this.getMembers({
      type: this.membersType,
      status: this.membersStatus,
    });
  },
  methods: {
    filterMembers() {
      this.getMembers({
        type: this.membersType,
        status: this.membersStatus,
      });
    },
    ...mapActions({
      getMembers: "members/getMembers",
    }),
    addMember() {
      this.$router.push({ name: "MemberAdd" });
    },
    editMemberUuid(memberUuid) {
      this.$router.push({ path: `/memberEdit/${memberUuid}` });
    },
    removeUser(member) {
      this.deleteUser(member)
        .then(function () {
          this.getMembers({
            type: this.membersType,
            status: this.membersStatus,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
