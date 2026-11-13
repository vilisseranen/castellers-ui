<template>
  <div>
    <p class="title is-5">{{ $t("dues.adminTitle") }}</p>

    <div class="field">
      <label class="label">{{ $t("dues.season") }}</label>
      <div class="control">
        <div class="select">
          <select v-model.number="season" @change="onSeasonChange">
            <option v-for="s in seasons" :key="s" :value="s">
              {{ seasonLabel(s) }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Amounts and dates of the collections of the season -->
    <div class="box" v-if="loaded && (!collections.length || editing)">
      <p class="subtitle is-6">
        {{
          collections.length
            ? $t("dues.editCollections")
            : $t("dues.createCollections")
        }}
      </p>
      <div
        class="columns is-mobile is-vcentered is-variable is-1 dues-form-row"
        v-for="row in form"
        :key="row.kind"
      >
        <div class="column is-3">
          <strong>{{ $t("dues.kindsShort." + row.kind) }}</strong>
        </div>
        <div class="column is-3">
          <input
            class="input"
            type="number"
            min="0"
            step="1"
            inputmode="decimal"
            v-model.number="row.dollars"
            :aria-label="$t('dues.amount')"
          />
        </div>
        <div class="column is-6">
          <input
            class="input"
            type="date"
            v-model="row.date"
            :aria-label="$t('dues.dueDate')"
          />
        </div>
      </div>
      <p class="help mb-3">{{ $t("dues.collectionsHelp") }}</p>
      <div class="buttons">
        <button
          class="button is-info"
          :disabled="saving"
          @click="saveCollections"
        >
          {{ $t("dues.saveButton") }}
        </button>
        <button class="button" v-if="collections.length" @click="cancelEdit">
          {{ $t("general.cancel") }}
        </button>
      </div>
    </div>
    <div class="dues-summary" v-else-if="loaded">
      <p>
        <span class="dues-summary-item" v-for="c in collections" :key="c.uuid">
          <strong>{{ $t("dues.kindsShort." + c.kind) }}</strong>
          {{ formatAmount(c.amount) }} · {{ formatDate(c.dueDate) }}
        </span>
      </p>
      <p>
        <a role="button" @click="startEdit">{{ $t("dues.editCollections") }}</a>
      </p>
    </div>

    <div v-if="collections.length">
      <div class="tabs mt-4">
        <ul>
          <li :class="{ 'is-active': tab === 'members' }">
            <a role="button" @click="showTab('members')">{{
              $t("dues.tabMembers")
            }}</a>
          </li>
          <li :class="{ 'is-active': tab === 'log' }">
            <a role="button" @click="showTab('log')">{{ $t("dues.tabLog") }}</a>
          </li>
        </ul>
      </div>

      <!-- Members and their dues -->
      <div v-if="tab === 'members'">
        <div class="field">
          <div class="control is-expanded">
            <input
              class="input"
              type="search"
              v-model="searchQuery"
              :placeholder="$t('members.searchPlaceholder')"
              autocomplete="off"
            />
          </div>
        </div>
        <div class="field">
          <label class="checkbox dues-filter">
            <input type="checkbox" v-model="onlyToPay" />
            {{ $t("dues.onlyToPay") }}
          </label>
          <label class="checkbox dues-filter">
            <input type="checkbox" v-model="showPaused" />
            {{ $t("dues.showPaused") }}
          </label>
        </div>
        <p class="is-size-7 has-text-grey mb-2">
          {{ $t("dues.memberCount", { count: filteredMembers.length }) }}
        </p>

        <div
          class="dues-member"
          v-for="member in filteredMembers"
          :key="member.uuid"
        >
          <a
            class="dues-member-header"
            role="button"
            :aria-expanded="openMemberUuid === member.uuid ? 'true' : 'false'"
            @click="toggleMember(member)"
          >
            <span class="dues-member-name">
              {{ member.firstName }} {{ member.lastName }}
              <span class="tag is-light" v-if="member.status === 'paused'">{{
                $t("dues.paused")
              }}</span>
            </span>
            <span class="tags dues-member-tags">
              <span
                class="tag"
                v-for="c in collections"
                :key="c.uuid"
                :class="statusClass(member, c)"
                :title="$t('dues.status.' + displayStatus(member, c))"
              >
                {{ $t("dues.kindsShort." + c.kind) }}
              </span>
            </span>
          </a>

          <div class="box dues-editor" v-if="openMemberUuid === member.uuid">
            <div class="field" v-for="c in collections" :key="c.uuid">
              <label class="label is-small">
                {{ $t("dues.kinds." + c.kind) }} ·
                {{ formatAmount(c.amount) }}
              </label>
              <div class="buttons has-addons">
                <button
                  class="button is-small"
                  v-for="action in actions"
                  :key="action"
                  :class="{
                    'is-info is-selected': draft[c.uuid] === action,
                  }"
                  @click="draft[c.uuid] = action"
                >
                  {{ $t("dues.actions." + action) }}
                </button>
              </div>
            </div>
            <div class="field">
              <button class="button is-small is-light" @click="markWholeYear">
                {{ $t("dues.wholeYear") }}
              </button>
            </div>
            <p class="notification is-warning is-light" v-if="cercleMissing">
              {{ $t("dues.cercleWarning") }}
            </p>
            <div class="field">
              <label class="label is-small">{{ $t("dues.note") }}</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  maxlength="500"
                  v-model="note"
                  :placeholder="$t('dues.notePlaceholder')"
                />
              </div>
            </div>
            <div class="field">
              <button
                class="button is-info"
                :disabled="saving || !draftHasChanges"
                @click="saveMember(member)"
              >
                {{ $t("dues.saveButton") }}
              </button>
            </div>
            <p class="subtitle is-6 mt-4 mb-2">{{ $t("dues.history") }}</p>
            <dues-log-component
              :entries="memberLog"
              :show-member="false"
            ></dues-log-component>
          </div>
        </div>
      </div>

      <!-- Journal -->
      <div v-if="tab === 'log'">
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="logFilters.member" @change="reloadLog">
                <option value="">{{ $t("dues.logAllMembers") }}</option>
                <option v-for="m in members" :key="m.uuid" :value="m.uuid">
                  {{ m.firstName }} {{ m.lastName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="logFilters.collection" @change="reloadLog">
                <option value="">{{ $t("dues.logAllCollections") }}</option>
                <option v-for="c in collections" :key="c.uuid" :value="c.uuid">
                  {{ $t("dues.kinds." + c.kind) }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="logFilters.actor" @change="reloadLog">
                <option value="">{{ $t("dues.logAllActors") }}</option>
                <option v-for="m in admins" :key="m.uuid" :value="m.uuid">
                  {{ m.firstName }} {{ m.lastName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <dues-log-component :entries="log"></dues-log-component>
        <div class="field mt-4" v-if="logHasMore">
          <button class="button" :disabled="loadingLog" @click="loadMoreLog">
            {{ $t("dues.logMore") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import duesHelper from "../api/duesHelper";
import DuesLogComponent from "../components/DuesLog-Component.vue";

const LOG_PAGE_SIZE = 50;

export default {
  name: "dues-view",
  components: {
    DuesLogComponent,
  },
  data() {
    return {
      season: duesHelper.currentSeason(),
      allCollections: [],
      loaded: false,
      editing: false,
      form: [],
      members: [],
      // "memberUuid:collectionUuid" -> status
      states: {},
      tab: "members",
      searchQuery: "",
      onlyToPay: false,
      showPaused: false,
      openMemberUuid: "",
      draft: {},
      note: "",
      memberLog: [],
      log: [],
      logFilters: { member: "", collection: "", actor: "" },
      logHasMore: false,
      loadingLog: false,
      saving: false,
      actions: ["unpaid", "paid", "exempt"],
    };
  },
  computed: {
    ...mapGetters(["type"]),
    collections() {
      return this.allCollections.filter((c) => c.season === this.season);
    },
    // Seasons that can be selected: those that exist, the current one and the
    // next one, so that it can be prepared in advance.
    seasons() {
      const current = duesHelper.currentSeason();
      const seasons = new Set([current, current + 1]);
      this.allCollections.forEach((c) => seasons.add(c.season));
      return Array.from(seasons).sort((a, b) => b - a);
    },
    admins() {
      return this.members.filter((m) => m.type === "admin");
    },
    filteredMembers() {
      const self = this;
      const q = this.searchQuery.trim().toLowerCase();
      return this.members.filter(function (m) {
        if (m.status === "paused" && !self.showPaused) {
          return false;
        }
        if (q) {
          const first = String(m.firstName || "").toLowerCase();
          const last = String(m.lastName || "").toLowerCase();
          if (!`${first} ${last}`.includes(q)) {
            return false;
          }
        }
        if (self.onlyToPay) {
          return self.collections.some(
            (c) => self.displayStatus(m, c) === "toPay"
          );
        }
        return true;
      });
    },
    draftHasChanges() {
      return this.changedCollections().length > 0;
    },
    // A due of the colla is being ticked while the membership of the Cercle is
    // not settled for the season: the rules ask for the Cercle first.
    cercleMissing() {
      const self = this;
      const cercle = this.collections.find((c) => c.kind === "cercle");
      if (!cercle || this.draft[cercle.uuid] !== "unpaid") {
        return false;
      }
      return this.collections.some(
        (c) => c.kind !== "cercle" && self.draft[c.uuid] === "paid"
      );
    },
  },
  mounted() {
    if (this.type !== "admin") {
      this.$router.push({ name: "Events" });
      return;
    }
    this.loadCollections();
    this.loadMembers();
    this.loadStates();
  },
  methods: {
    ...mapActions({
      getCollections: "dues/getCollections",
      setCollections: "dues/setCollections",
      getStates: "dues/getStates",
      record: "dues/record",
      getLog: "dues/getLog",
      getPayingMembers: "dues/getPayingMembers",
    }),
    fail(error) {
      this.$root.$notifyNOK(this.$t("general.notifyFailure"));
      console.log(error);
    },
    async loadCollections() {
      try {
        const response = await this.getCollections();
        this.allCollections = response.data || [];
        this.loaded = true;
        this.resetForm();
      } catch (error) {
        this.fail(error);
      }
    },
    async loadMembers() {
      try {
        const response = await this.getPayingMembers();
        const members = response.data || [];
        members.sort(function (a, b) {
          const nameA = `${a.firstName} ${a.lastName}`;
          const nameB = `${b.firstName} ${b.lastName}`;
          return nameA.localeCompare(nameB);
        });
        this.members = members;
      } catch (error) {
        this.fail(error);
      }
    },
    async loadStates() {
      const season = this.season;
      try {
        const response = await this.getStates(season);
        if (season !== this.season) {
          return;
        }
        const states = {};
        (response.data || []).forEach(function (s) {
          states[`${s.memberUuid}:${s.collectionUuid}`] = s.status;
        });
        this.states = states;
      } catch (error) {
        this.fail(error);
      }
    },
    onSeasonChange() {
      this.editing = false;
      this.states = {};
      this.closeMember();
      this.logFilters.collection = "";
      this.resetForm();
      this.loadStates();
      if (this.tab === "log") {
        this.reloadLog();
      }
    },
    showTab(tab) {
      this.tab = tab;
      if (tab === "log") {
        this.reloadLog();
      }
    },

    // Collections
    resetForm() {
      this.form = duesHelper.collectionForm(this.season, this.collections);
    },
    startEdit() {
      this.resetForm();
      this.editing = true;
    },
    cancelEdit() {
      this.editing = false;
      this.resetForm();
    },
    async saveCollections() {
      const collections = this.form.map(function (row) {
        return {
          kind: row.kind,
          amount: Math.round(Number(row.dollars) * 100),
          dueDate: duesHelper.fromDateInput(row.date),
        };
      });
      const invalid = collections.some(
        (c) => !Number.isFinite(c.amount) || c.amount < 0 || c.dueDate <= 0
      );
      if (invalid) {
        this.$root.$notifyNOK(this.$t("dues.collectionsInvalid"));
        return;
      }
      this.saving = true;
      try {
        await this.setCollections({ season: this.season, collections });
        this.editing = false;
        await this.loadCollections();
        this.$root.$notifyOK(this.$t("general.notifySuccess"));
      } catch (error) {
        this.fail(error);
      } finally {
        this.saving = false;
      }
    },

    // States
    status(member, collection) {
      return this.states[`${member.uuid}:${collection.uuid}`] || "unpaid";
    },
    displayStatus(member, collection) {
      return duesHelper.displayStatus(
        this.status(member, collection),
        collection.dueDate
      );
    },
    statusClass(member, collection) {
      return duesHelper.statusClass(this.displayStatus(member, collection));
    },

    // Recording for one member
    closeMember() {
      this.openMemberUuid = "";
      this.draft = {};
      this.note = "";
      this.memberLog = [];
    },
    toggleMember(member) {
      if (this.openMemberUuid === member.uuid) {
        this.closeMember();
        return;
      }
      this.openMember(member);
    },
    openMember(member) {
      const self = this;
      const draft = {};
      this.collections.forEach(function (c) {
        draft[c.uuid] = self.status(member, c);
      });
      this.draft = draft;
      this.note = "";
      this.memberLog = [];
      this.openMemberUuid = member.uuid;
      this.loadMemberLog(member.uuid);
    },
    async loadMemberLog(memberUuid) {
      try {
        const response = await this.getLog({
          member: memberUuid,
          season: this.season,
        });
        if (memberUuid === this.openMemberUuid) {
          this.memberLog = response.data || [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    markWholeYear() {
      const self = this;
      this.collections.forEach(function (c) {
        if (duesHelper.COLLA_KINDS.includes(c.kind)) {
          self.draft[c.uuid] = "paid";
        }
      });
    },
    // Collections whose selected state differs from the recorded one.
    changedCollections() {
      const self = this;
      const member = this.members.find((m) => m.uuid === this.openMemberUuid);
      if (!member) {
        return [];
      }
      return this.collections.filter(
        (c) =>
          self.draft[c.uuid] && self.draft[c.uuid] !== self.status(member, c)
      );
    },
    async saveMember(member) {
      const self = this;
      const changed = this.changedCollections();
      this.saving = true;
      try {
        // One request per state, so that a whole year paid at once is recorded
        // together.
        for (const action of this.actions) {
          const collectionUuids = changed
            .filter((c) => self.draft[c.uuid] === action)
            .map((c) => c.uuid);
          if (collectionUuids.length > 0) {
            await this.record({
              memberUuid: member.uuid,
              collectionUuids,
              action,
              note: this.note.trim(),
            });
          }
        }
        this.$root.$notifyOK(this.$t("general.notifySuccess"));
        this.note = "";
      } catch (error) {
        this.fail(error);
      } finally {
        this.saving = false;
      }
      // Whatever happened, show what is recorded now. After a failure the
      // selection and the note are kept, so that saving can be tried again.
      await this.loadStates();
      if (this.openMemberUuid === member.uuid) {
        this.loadMemberLog(member.uuid);
      }
    },

    // Journal
    async fetchLog(offset) {
      this.loadingLog = true;
      try {
        const response = await this.getLog({
          season: this.season,
          member: this.logFilters.member,
          collection: this.logFilters.collection,
          actor: this.logFilters.actor,
          limit: LOG_PAGE_SIZE,
          offset,
        });
        const entries = response.data || [];
        this.log = offset === 0 ? entries : this.log.concat(entries);
        this.logHasMore = entries.length === LOG_PAGE_SIZE;
      } catch (error) {
        this.fail(error);
      } finally {
        this.loadingLog = false;
      }
    },
    reloadLog() {
      this.log = [];
      this.fetchLog(0);
    },
    loadMoreLog() {
      this.fetchLog(this.log.length);
    },

    // Display
    seasonLabel(season) {
      return duesHelper.seasonLabel(season);
    },
    formatAmount(cents) {
      return duesHelper.formatAmount(cents, this.$i18n.locale);
    },
    formatDate(timestamp) {
      return duesHelper.formatDate(timestamp, this.$i18n.locale);
    },
  },
};
</script>

<style scoped>
.dues-form-row {
  margin-bottom: 0;
}
.dues-summary-item {
  display: block;
}
.dues-filter {
  display: block;
  padding: 0.15rem 0;
}
.dues-member {
  border-bottom: 1px solid #ededed;
}
.dues-member-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem 0.75rem;
  padding: 0.6rem 0;
  color: inherit;
}
.dues-member-name {
  font-weight: 600;
}
.dues-member-tags {
  margin-bottom: 0;
  flex-wrap: nowrap;
}
.dues-member-tags .tag {
  margin-bottom: 0;
}
.dues-editor {
  margin: 0.25rem 0 1rem;
}
</style>
