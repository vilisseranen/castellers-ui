<template>
  <div>
    <!-- Choice of the collection, in the form of the event -->
    <div v-if="editable">
      <label class="label">{{ $t("eventDues.switch") }}</label>
      <o-field>
        <o-switch v-model="enabled" variant="info"></o-switch>
      </o-field>
      <div v-if="enabled">
        <div class="field" v-if="choices.length">
          <div class="control">
            <div class="select is-fullwidth">
              <select
                :value="modelValue"
                :aria-label="$t('eventDues.switch')"
                @change="$emit('update:modelValue', $event.target.value)"
              >
                <option v-for="c in choices" :key="c.uuid" :value="c.uuid">
                  {{ label(c) }}
                </option>
              </select>
            </div>
          </div>
          <p class="help">{{ $t("eventDues.help") }}</p>
        </div>
        <p class="help" v-else>
          {{ $t("eventDues.noCollections") }}
          <router-link :to="{ name: 'Dues' }">{{
            $t("routes.dues")
          }}</router-link>
        </p>
      </div>
    </div>

    <!-- Notice shown to everyone who can see the event -->
    <div class="dues-notice media" v-else-if="collection">
      <div class="media-left">
        <span class="icon is-large has-text-link" aria-hidden="true">
          <i class="fas fa-coins fa-2x"></i>
        </span>
      </div>
      <div class="media-content">
        <p class="title is-6">
          {{ $t("dues.kinds." + collection.kind) }} ·
          {{ formatAmount(collection.amount) }}
        </p>
        <p class="content">
          {{ $t("eventDues.notice") }}
          <span v-if="ownStatus === 'paid'">{{ $t("eventDues.ownPaid") }}</span>
          <span v-else-if="ownStatus === 'exempt'">{{
            $t("eventDues.ownExempt")
          }}</span>
          <router-link v-else :to="{ name: 'DuesInfo' }">{{
            $t("routes.duesInfo")
          }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import duesHelper from "../api/duesHelper";

// Dues collected at an event: the choice of the collection when the event is
// edited, a notice otherwise. The value is the UUID of the collection, or an
// empty string when no dues are collected at the event.
export default {
  name: "event-dues-component",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      collections: [],
      // The switch was turned on, even if no collection could be chosen.
      switchOn: false,
      // Own state for the collection: "paid", "exempt", "unpaid", or "" when
      // it is not known or dues do not apply.
      ownStatus: "",
    };
  },
  computed: {
    ...mapGetters(["uuid", "type"]),
    collection() {
      return this.collections.find((c) => c.uuid === this.modelValue) || null;
    },
    // Collections that can be chosen: those of the current season and of the
    // next one, plus the one already chosen if it is older.
    choices() {
      const self = this;
      const current = duesHelper.currentSeason();
      return this.collections
        .filter(
          (c) =>
            c.season === current ||
            c.season === current + 1 ||
            c.uuid === self.modelValue
        )
        .sort((a, b) => a.dueDate - b.dueDate);
    },
    enabled: {
      get: function () {
        return this.modelValue !== "" || this.switchOn;
      },
      set: function (value) {
        this.switchOn = value;
        if (!value) {
          this.$emit("update:modelValue", "");
          return;
        }
        if (this.modelValue === "" && this.choices.length) {
          this.$emit("update:modelValue", this.suggestion().uuid);
        }
      },
    },
  },
  watch: {
    modelValue() {
      this.loadOwnStatus();
    },
  },
  mounted() {
    // Dues are only known to members who are logged in.
    if (!this.uuid) {
      return;
    }
    const self = this;
    this.getCollections()
      .then(function (response) {
        self.collections = response.data || [];
      })
      .catch((error) => console.log(error));
    this.loadOwnStatus();
  },
  methods: {
    ...mapActions({
      getCollections: "dues/getCollections",
      getMemberDues: "dues/getMemberDues",
    }),
    // The collection proposed when the switch is turned on: the next one to
    // come, or the last one when they are all past.
    suggestion() {
      const now = Date.now() / 1000;
      const week = 7 * 24 * 60 * 60;
      const next = this.choices.find((c) => c.dueDate >= now - week);
      return next || this.choices[this.choices.length - 1];
    },
    loadOwnStatus() {
      this.ownStatus = "";
      const collectionUuid = this.modelValue;
      const paysDues = this.type === "member" || this.type === "admin";
      if (this.editable || !collectionUuid || !this.uuid || !paysDues) {
        return;
      }
      const self = this;
      this.getMemberDues(this.uuid)
        .then(function (response) {
          if (collectionUuid !== self.modelValue) {
            return;
          }
          const due = (response.data || []).find(
            (d) => d.collection.uuid === collectionUuid
          );
          self.ownStatus = due ? due.status : "";
        })
        .catch((error) => console.log(error));
    },
    label(collection) {
      const kind = this.$t("dues.kinds." + collection.kind);
      const season = duesHelper.seasonLabel(collection.season);
      return `${kind} ${season} · ${this.formatAmount(collection.amount)}`;
    },
    formatAmount(cents) {
      return duesHelper.formatAmount(cents, this.$i18n.locale);
    },
  },
};
</script>

<style scoped>
.dues-notice {
  align-items: flex-start;
  padding: 0.75rem 1rem;
  background-color: #eff5fb;
  border-left: 4px solid #3273dc;
  border-radius: 4px;
}
.dues-notice .media-left {
  margin-right: 1rem;
}
.dues-notice .title {
  margin-bottom: 0.35rem;
}
.dues-notice .content {
  margin-bottom: 0;
}
</style>
