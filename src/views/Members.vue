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

    <member-filter
      :types="this.memberTypes"
      :statuses="this.memberStatuses"
      v-on:input="this.filterMembers"
    ></member-filter>

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
        <span v-t="`members.` + props.row.type + `Type`"></span>
      </b-table-column>
      <b-table-column
        key="status"
        field="status"
        :label="$t('members.status')"
        searchable
        sortable
        v-slot="props"
      >
        <span
          class="tag is-medium"
          v-bind:class="{
            'is-success': props.row.status === 'active',
            'is-info': props.row.status === 'created',
            'is-warning': props.row.status === 'paused',
            'is-danger': props.row.status === 'deleted',
          }"
          >{{ $t("members." + props.row.status + "Status") }}</span
        >
      </b-table-column>
      <b-table-column
        key="actions"
        :label="$t('general.actions')"
        v-slot="props"
      >
        <router-link
          :to="{ name: 'MemberEdit', params: { uuid: props.row.uuid } }"
        >
          <span class="icon has-text-info">
            <i class="fa fa-edit"></i>
          </span>
        </router-link>
        <a>
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
import MemberFilter from "../components/MemberFilter.vue";

export default {
  components: { MemberFilter },
  mixins: [memberMixin],
  data() {
    return {
      memberTypes: ["admin,member"],
      memberStatuses: ["active"],
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
      type: this.memberTypes.join(","),
      status: this.memberStatuses.join(","),
    });
  },
  methods: {
    filterMembers(filters) {
      this.getMembers({
        type: filters.types,
        status: filters.statuses,
      });
    },
    ...mapActions({
      getMembers: "members/getMembers",
    }),
    addMember() {
      this.$router.push({ name: "MemberAdd" });
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
