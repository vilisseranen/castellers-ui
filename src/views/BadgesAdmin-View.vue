<template>
  <div>
    <p class="title is-5">{{ $t("badges.adminTitle") }}</p>

    <div class="field">
      <label class="label">{{ $t("badges.selectBadge") }}</label>
      <div class="control">
        <div class="select">
          <select v-model="selectedBadgeUuid" @change="onBadgeChange">
            <option value="">{{ $t("badges.selectBadgePlaceholder") }}</option>
            <optgroup
              v-for="s in series"
              :key="s.uuid"
              :label="$t('badges.series.' + s.code + '.name')"
            >
              <option
                v-for="badge in s.badges"
                :key="badge.uuid"
                :value="badge.uuid"
              >
                {{ $t("badges.items." + badge.code + ".name") }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>

    <div class="box" v-if="selectedBadge">
      <div class="media">
        <div class="media-left">
          <img
            :src="`/static/badges/${selectedBadge.image}`"
            class="selected-badge-image"
            :alt="$t('badges.items.' + selectedBadge.code + '.name')"
          />
        </div>
        <div class="media-content">
          <p class="title is-5">
            {{ $t("badges.items." + selectedBadge.code + ".name") }}
          </p>
          <p>{{ $t("badges.items." + selectedBadge.code + ".description") }}</p>
        </div>
      </div>
    </div>

    <div v-if="selectedBadgeUuid">
      <div class="field">
        <div class="control is-expanded">
          <input
            class="input"
            type="search"
            v-model="memberSearchQuery"
            :placeholder="$t('members.searchPlaceholder')"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="member-list">
        <label
          class="checkbox member-row"
          v-for="member in filteredMembers"
          :key="member.uuid"
        >
          <input type="checkbox" v-model="checked[member.uuid]" />
          {{ member.firstName }} {{ member.lastName }}
        </label>
      </div>

      <div class="field mt-4">
        <label class="checkbox">
          <input type="checkbox" v-model="notifyByEmail" />
          {{ $t("badges.notifyByEmail") }}
        </label>
      </div>

      <div class="field mt-4">
        <button
          class="button is-info"
          :disabled="saving || !hasChanges"
          @click="save"
        >
          {{ $t("badges.saveButton") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "badges-admin-view",
  data() {
    return {
      selectedBadgeUuid: "",
      initialHolders: [],
      checked: {},
      memberSearchQuery: "",
      notifyByEmail: false,
      saving: false,
    };
  },
  computed: {
    ...mapGetters(["type"]),
    ...mapState({
      series: (state) => state.badges.series,
      members: (state) => state.members.members,
    }),
    selectedBadge() {
      for (const s of this.series) {
        const found = s.badges.find((b) => b.uuid === this.selectedBadgeUuid);
        if (found) {
          return found;
        }
      }
      return null;
    },
    filteredMembers() {
      const q = this.memberSearchQuery.trim().toLowerCase();
      if (!q) {
        return this.members;
      }
      return this.members.filter((m) => {
        const first = String(m.firstName || "").toLowerCase();
        const last = String(m.lastName || "").toLowerCase();
        return `${first} ${last}`.includes(q);
      });
    },
    hasChanges() {
      return this.membersToAdd.length > 0 || this.membersToRemove.length > 0;
    },
    membersToAdd() {
      return this.members
        .filter(
          (m) => this.checked[m.uuid] && !this.initialHolders.includes(m.uuid)
        )
        .map((m) => m.uuid);
    },
    membersToRemove() {
      return this.members
        .filter(
          (m) => !this.checked[m.uuid] && this.initialHolders.includes(m.uuid)
        )
        .map((m) => m.uuid);
    },
  },
  mounted() {
    if (this.type !== "admin") {
      this.$router.push({ name: "Events" });
      return;
    }
    this.getBadges().catch(function () {});
    this.getMembers({ type: "admin,member,canalla", status: "active" });
  },
  methods: {
    ...mapActions({
      getBadges: "badges/getBadges",
      getBadgeMembers: "badges/getBadgeMembers",
      assignBadge: "badges/assignBadge",
      removeBadge: "badges/removeBadge",
      getMembers: "members/getMembers",
    }),
    onBadgeChange() {
      this.checked = {};
      this.initialHolders = [];
      if (!this.selectedBadgeUuid) {
        return;
      }
      const self = this;
      this.getBadgeMembers(this.selectedBadgeUuid)
        .then(function (response) {
          const holders = response.data || [];
          self.initialHolders = holders;
          const checked = {};
          self.members.forEach(function (m) {
            checked[m.uuid] = holders.includes(m.uuid);
          });
          self.checked = checked;
        })
        .catch(function () {
          self.$root.$notifyNOK(self.$t("general.notifyFailure"));
        });
    },
    async save() {
      const self = this;
      this.saving = true;
      const badgeUuid = this.selectedBadgeUuid;
      const toAdd = this.membersToAdd;
      const toRemove = this.membersToRemove;
      try {
        if (toAdd.length > 0) {
          await this.assignBadge({
            badgeUuid,
            memberUuids: toAdd,
            notifyByEmail: this.notifyByEmail,
          });
        }
        if (toRemove.length > 0) {
          await this.removeBadge({ badgeUuid, memberUuids: toRemove });
        }
        this.$root.$notifyOK(this.$t("general.notifySuccess"));
        this.onBadgeChange();
      } catch (error) {
        this.$root.$notifyNOK(this.$t("general.notifyFailure"));
        console.log(error);
      } finally {
        self.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.member-list {
  max-height: 420px;
  overflow-y: auto;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  padding: 0.75rem;
}
.member-row {
  display: block;
  padding: 0.25rem 0;
}
.selected-badge-image {
  width: 96px;
  height: 96px;
  object-fit: contain;
}
</style>
