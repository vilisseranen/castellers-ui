<template>
  <div>
    <p class="has-text-grey" v-if="entries.length === 0">
      {{ $t("dues.logEmpty") }}
    </p>
    <div class="dues-log-entry" v-for="entry in entries" :key="entry.id">
      <p>
        <span class="tag" :class="actionClass(entry.action)">{{
          $t("dues.logActions." + entry.action)
        }}</span>
        <strong>
          {{ $t("dues.kinds." + entry.kind) }}
          {{ seasonLabel(entry.season) }}
        </strong>
        <span v-if="showMember"> · {{ entry.memberName || unknown }}</span>
      </p>
      <p class="is-size-7 has-text-grey">
        {{ formatDateTime(entry.createdAt) }} · {{ $t("dues.logBy") }}
        {{ entry.actorName || unknown }}
      </p>
      <p class="is-size-7" v-if="entry.note">
        <em>{{ entry.note }}</em>
      </p>
    </div>
  </div>
</template>

<script>
import duesHelper from "../api/duesHelper";

export default {
  name: "dues-log-component",
  props: {
    entries: {
      type: Array,
      default: () => [],
    },
    // The name of the member is left out when the journal is about one member.
    showMember: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    unknown() {
      return this.$t("dues.unknownMember");
    },
  },
  methods: {
    seasonLabel(season) {
      return duesHelper.seasonLabel(season);
    },
    formatDateTime(timestamp) {
      return duesHelper.formatDateTime(timestamp, this.$i18n.locale);
    },
    actionClass(action) {
      if (action === "paid") {
        return "is-success";
      }
      if (action === "exempt") {
        return "is-light";
      }
      return "is-warning";
    },
  },
};
</script>

<style scoped>
.dues-log-entry {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ededed;
}
.dues-log-entry:last-child {
  border-bottom: none;
}
.dues-log-entry .tag {
  margin-right: 0.4rem;
}
</style>
