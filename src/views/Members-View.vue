<template>
  <div>
    <p class="title is-5">{{ $t("members.title") }}</p>
    <o-field v-if="type === 'admin'">
      <button class="button field is-info" @click="addMember">
        <span class="icon">
          <i class="fa fa-user-plus"></i>
        </span>
        <span>{{ $t("members.addMember") }}</span>
      </button>
    </o-field>

    <member-filter
      v-if="type === 'admin'"
      :types="this.memberTypes"
      :statuses="this.memberStatuses"
      :withDeleted="true"
      @filterMembers="filterMembers"
    ></member-filter>

    <div class="field">
      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            class="input"
            type="search"
            v-model="memberSearchQuery"
            :placeholder="$t('members.searchPlaceholder')"
            autocomplete="off"
          />
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-light"
            @click="memberSearchQuery = ''"
            :disabled="!memberSearchQuery.trim()"
            :aria-label="$t('members.clearSearch')"
          >
            {{ $t("members.clearSearch") }}
          </button>
        </div>
      </div>
    </div>

    <o-table
      :data="filteredMembers"
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
        v-if="type === 'admin'"
        key="roles"
        field="roles"
        :label="$t('members.roles')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.roles }}</o-table-column
      >
      <o-table-column
        v-if="type === 'admin'"
        key="extra"
        field="extra"
        :label="$t('members.extra')"
        searchable
        sortable
        v-slot="props"
        >{{ props.row.extra }}</o-table-column
      >
      <o-table-column
        v-if="type === 'admin'"
        key="type"
        field="type"
        :label="$t('members.type')"
        searchable
        sortable
        v-slot="props"
      >
        <span v-text="$t(`members.` + props.row.type + `Type`)"></span>
      </o-table-column>
      <o-table-column
        v-if="type === 'admin'"
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
        <p
          class="help"
          v-if="props.row.status === 'deleted' && props.row.purgeAt"
        >
          {{ $t("members.purgeOn", { date: purgeDate(props.row) }) }}
        </p>
      </o-table-column>
      <o-table-column
        key="actions"
        :label="$t('general.actions')"
        v-slot="props"
      >
        <!-- A deleted member has no profile anymore: they can only be restored -->
        <a
          v-if="props.row.status === 'deleted'"
          :title="$t('members.restore')"
          :aria-label="$t('members.restore')"
          @click="restoreUser(props.row)"
        >
          <span class="icon has-text-success">
            <i class="fa fa-rotate-left"></i>
          </span>
          <span>{{ $t("members.restore") }}</span>
        </a>
        <template v-else>
          <router-link
            :to="{ name: 'MemberEdit', params: { uuid: props.row.uuid } }"
          >
            <span class="icon has-text-info">
              <i
                class="fa"
                :class="type === 'admin' ? 'fa-edit' : 'fa-eye'"
              ></i>
            </span>
          </router-link>
          <a v-if="type === 'admin'">
            <span class="icon has-text-danger" @click="removeUser(props.row)">
              <i class="fa fa-user-slash"></i>
            </span>
          </a>
        </template>
      </o-table-column>
    </o-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import api from "../api/castellers";
import helper from "../api/dateTimeHelper";
import { memberMixin } from "../mixins/members.js";
import MemberFilter from "../components/MemberFilter-Component.vue";

export default {
  components: { MemberFilter },
  mixins: [memberMixin],
  data: function () {
    return {
      memberTypes: ["admin,member,canalla"],
      memberStatuses: ["active"],
      // Filters in use, to list the same members again after a change
      currentTypes: "admin,member,canalla",
      currentStatuses: "active",
      memberSearchQuery: "",
    };
  },
  computed: {
    ...mapGetters(["uuid", "type"]),
    ...mapState({
      members: (state) => state.members.members,
    }),
    filteredMembers() {
      const q = this.memberSearchQuery.trim().toLowerCase();
      if (!q) {
        return this.members;
      }
      return this.members.filter((m) => {
        const first = String(m.firstName || "").toLowerCase();
        const last = String(m.lastName || "").toLowerCase();
        return (
          `${first} ${last}`.includes(q) ||
          first.includes(q) ||
          last.includes(q)
        );
      });
    },
  },
  mounted() {
    this.getMembers({
      type: this.memberTypes.join(","),
      status: this.memberStatuses.join(","),
    });
  },
  methods: {
    filterMembers(filters) {
      this.currentTypes = filters.types.join(",");
      this.currentStatuses = filters.statuses.join(",");
      this.refreshMembers();
    },
    refreshMembers() {
      return this.getMembers({
        type: this.currentTypes,
        status: this.currentStatuses,
      });
    },
    ...mapActions({
      getMembers: "members/getMembers",
    }),
    // Day when the data of a deleted member will be erased
    purgeDate(member) {
      return helper.extractDate(member.purgeAt);
    },
    restoreUser(member) {
      const self = this;
      api
        .restoreMember(member.uuid)
        .then(function () {
          self.$root.$notifyOK(
            self.$t("members.restoreOK", {
              name: [member.firstName, member.lastName].join(" "),
            })
          );
          self.refreshMembers();
        })
        .catch(function (error) {
          // 409: their email was given to another member in the meantime
          const conflict =
            error && error.response && error.response.status === 409;
          self.$root.$notifyNOK(
            self.$t(
              conflict ? "members.restoreEmailTaken" : "general.notifyFailure"
            )
          );
        });
    },
    addMember() {
      this.$router.push({ name: "MemberAdd" });
    },
    removeUser(member) {
      const self = this;
      this.deleteUser(member)
        .then(function () {
          self.refreshMembers();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
