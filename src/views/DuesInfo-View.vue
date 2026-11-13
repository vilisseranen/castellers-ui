<template>
  <div>
    <p class="title is-4">{{ $t("duesInfo.title") }}</p>
    <p class="mb-4">{{ $t("duesInfo.intro") }}</p>

    <div class="box" v-if="collections.length">
      <p class="subtitle is-5">
        {{ $t("dues.season") }} {{ seasonLabel(season) }}
      </p>
      <table class="table is-fullwidth dues-info-table">
        <tbody>
          <tr v-for="c in collections" :key="c.uuid">
            <td>
              <strong>{{ $t("dues.kinds." + c.kind) }}</strong>
              <br />
              <span class="is-size-7 has-text-grey">
                {{ formatDate(c.dueDate) }}
              </span>
            </td>
            <td class="has-text-right dues-info-amount">
              {{ formatAmount(c.amount) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>{{ $t("duesInfo.total") }}</th>
            <th class="has-text-right dues-info-amount">
              {{ formatAmount(total) }}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="notification is-light" v-else-if="loaded">
      {{ $t("duesInfo.noCollections") }}
    </div>

    <div class="content">
      <p class="title is-5">{{ $t("duesInfo.howTitle") }}</p>
      <p v-if="interacEmail">
        {{ $t("duesInfo.howInterac") }}
        <strong>{{ interacEmail }}</strong>
      </p>
      <p v-if="interacEmail">{{ $t("duesInfo.howMessage") }}</p>
      <p>
        {{
          interacEmail
            ? $t("duesInfo.howInPerson")
            : $t("duesInfo.howNoInterac")
        }}
      </p>

      <div v-if="collaTotal > 0">
        <p class="title is-5">{{ $t("duesInfo.yearTitle") }}</p>
        <p>
          {{ $t("duesInfo.yearText", { amount: formatAmount(collaTotal) }) }}
        </p>
      </div>

      <p class="title is-5">{{ $t("duesInfo.newTitle") }}</p>
      <p>
        {{
          cercle
            ? $t("duesInfo.newText", { amount: formatAmount(cercle.amount) })
            : $t("duesInfo.newTextNoAmount")
        }}
      </p>
      <p>{{ $t("duesInfo.newRenewal") }}</p>

      <p class="title is-5">{{ $t("duesInfo.whoTitle") }}</p>
      <p>{{ $t("duesInfo.whoText") }}</p>

      <p class="title is-5">{{ $t("duesInfo.mineTitle") }}</p>
      <p>
        {{ $t("duesInfo.mineText") }}
        <router-link
          v-if="uuid"
          :to="{ name: 'MemberEdit', params: { uuid: uuid } }"
          >{{ $t("duesInfo.mineLink") }}</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import duesHelper from "../api/duesHelper";

export default {
  name: "dues-info-view",
  data() {
    return {
      season: duesHelper.currentSeason(),
      collections: [],
      interacEmail: "",
      loaded: false,
    };
  },
  computed: {
    ...mapGetters(["uuid"]),
    // All four collections of the season.
    total() {
      return this.collections.reduce((sum, c) => sum + c.amount, 0);
    },
    // The three dues of the colla, for those who pay the year at once.
    collaTotal() {
      return duesHelper.collaTotal(this.collections);
    },
    cercle() {
      return this.collections.find((c) => c.kind === "cercle") || null;
    },
  },
  mounted() {
    const self = this;
    this.getCollections(this.season)
      .then(function (response) {
        self.collections = response.data || [];
      })
      .catch((error) => console.log(error))
      .finally(function () {
        self.loaded = true;
      });
    this.getSettings()
      .then(function (response) {
        self.interacEmail = (response.data || {}).interacEmail || "";
      })
      .catch((error) => console.log(error));
  },
  methods: {
    ...mapActions({
      getCollections: "dues/getCollections",
      getSettings: "dues/getSettings",
    }),
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
.dues-info-table td,
.dues-info-table th {
  vertical-align: middle;
}
.dues-info-amount {
  white-space: nowrap;
}
</style>
