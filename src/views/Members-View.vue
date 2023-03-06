<template>
  <div>
    <p class="title is-5">{{ $t("members.title") }}</p>
    <o-field>
      <button class="button field is-info" @click="addMember">
        <span class="icon">
          <i class="fa fa-user-plus"></i>
        </span>
        <span>{{ $t("members.addMember") }}</span>
      </button>
    </o-field>

    <member-filter
      :types="this.memberTypes"
      :statuses="this.memberStatuses"
      @filterMembers="filterMembers"
    ></member-filter>

    <o-table
      :data="members"
      striped
      default-sort="firstName"
      sort-icon="arrow-up"
      icon-pack="fa"
    >
      <o-table-column
        key="firstName"
        field="firstName"
        :label="$t('members.firstName')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.firstName }}
      </o-table-column>
      <o-table-column
        key="lastName"
        field="lastName"
        :label="$t('members.lastName')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.lastName }}</o-table-column
      >
      <o-table-column
        key="roles"
        field="roles"
        :label="$t('members.roles')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.roles }}</o-table-column
      >
      <o-table-column
        key="extra"
        field="extra"
        :label="$t('members.extra')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.extra }}</o-table-column
      >
      <o-table-column
        key="type"
        field="type"
        :label="$t('members.type')"
        searchable
        sortable
        v-slot="props"
      >
        <span v-t="`members.` + props.row.type + `Type`"></span>
      </o-table-column>
      <o-table-column
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
      </o-table-column>
      <o-table-column
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
          <span class="icon has-text-danger" @click="removeUser(props.row)">
            <i class="fa fa-user-slash"></i>
          </span>
        </a>
      </o-table-column>
    </o-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { memberMixin } from "../mixins/members.js";
import MemberFilter from "../components/MemberFilter-Component.vue";

export default {
  components: { MemberFilter },
  mixins: [memberMixin],
  data: function () {
    return {
      memberTypes: ["admin,member,canalla"],
      memberStatuses: ["active"],
      test: "toto",
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
      const self = this;
      this.deleteUser(member)
        .then(function () {
          self.getMembers({
            type: self.memberTypes.join(","),
            status: self.memberStatuses.join(","),
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
