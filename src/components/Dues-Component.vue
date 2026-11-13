<template>
  <div class="box" v-if="seasons.length">
    <p class="title is-4">
      {{ own ? $t("dues.myTitle") : $t("dues.title") }}
    </p>
    <div v-for="s in seasons" :key="s.season" class="dues-season">
      <p class="subtitle is-5" v-if="s.current">
        {{ $t("dues.season") }} {{ seasonLabel(s.season) }}
      </p>
      <p v-else>
        <a
          role="button"
          :aria-expanded="isExpanded(s.season) ? 'true' : 'false'"
          @click="toggle(s.season)"
        >
          <span class="icon is-small">
            <i
              class="fa"
              :class="
                isExpanded(s.season) ? 'fa-chevron-down' : 'fa-chevron-right'
              "
            ></i>
          </span>
          {{ $t("dues.season") }} {{ seasonLabel(s.season) }}
        </a>
      </p>
      <table
        class="table is-fullwidth dues-table"
        v-if="s.current || isExpanded(s.season)"
      >
        <tbody>
          <tr v-for="d in s.dues" :key="d.collection.uuid">
            <td>
              <strong>{{ $t("dues.kinds." + d.collection.kind) }}</strong>
              <br />
              <span class="is-size-7 has-text-grey">
                {{ formatDate(d.collection.dueDate) }}
              </span>
            </td>
            <td class="has-text-right dues-amount">
              {{ formatAmount(d.collection.amount) }}
            </td>
            <td class="has-text-right">
              <span class="tag" :class="statusClass(d)">{{
                $t("dues.status." + displayStatus(d))
              }}</span>
              <br v-if="d.updatedAt && d.status !== 'unpaid'" />
              <span
                class="is-size-7 has-text-grey"
                v-if="d.updatedAt && d.status !== 'unpaid'"
              >
                {{ formatDate(d.updatedAt) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="notification is-info is-light" v-if="showAttendance">
      <p>
        {{
          $t(own ? "dues.attendanceOwn" : "dues.attendanceOther", {
            count: attendance.count,
            date: formatDate(attendance.firstVisit),
          })
        }}
      </p>
      <p>
        {{ $t("dues.cercleFirst", { amount: formatAmount(cercleDue.amount) }) }}
      </p>
    </div>
    <p class="is-size-7 has-text-grey" v-if="own">
      {{ $t("dues.memberHelp") }}
    </p>
    <p class="mt-2">
      <router-link :to="{ name: 'DuesInfo' }">{{
        $t("routes.duesInfo")
      }}</router-link>
    </p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import duesHelper from "../api/duesHelper";

export default {
  name: "dues-component",
  props: {
    memberUuid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dues: [],
      expanded: {},
      attendance: { firstVisit: 0, count: 0 },
    };
  },
  computed: {
    ...mapGetters(["uuid"]),
    own() {
      return this.memberUuid === this.uuid;
    },
    // The collection of the Cercle of the current season, when the member has
    // not settled it and is not exempt.
    cercleDue() {
      const current = duesHelper.currentSeason();
      const due = this.dues.find(
        (d) =>
          d.collection.season === current &&
          d.collection.kind === "cercle" &&
          d.status === "unpaid"
      );
      return due ? due.collection : null;
    },
    // Members who have not joined the Cercle yet see how many times they came.
    showAttendance() {
      return Boolean(this.cercleDue) && this.attendance.count > 0;
    },
    // The current season first, then the past seasons in which something was
    // recorded for this member. A past season with nothing recorded is left
    // out: the member may not have been there yet.
    seasons() {
      const current = duesHelper.currentSeason();
      const bySeason = {};
      this.dues.forEach(function (d) {
        const season = d.collection.season;
        if (!bySeason[season]) {
          bySeason[season] = [];
        }
        bySeason[season].push(d);
      });
      return Object.keys(bySeason)
        .map(Number)
        .filter(function (season) {
          if (season === current) {
            return true;
          }
          return (
            season < current && bySeason[season].some((d) => d.updatedAt > 0)
          );
        })
        .sort((a, b) => b - a)
        .map(function (season) {
          return {
            season,
            current: season === current,
            dues: bySeason[season],
          };
        });
    },
  },
  watch: {
    memberUuid(newUuid) {
      this.load(newUuid);
    },
  },
  mounted() {
    this.load(this.memberUuid);
  },
  methods: {
    ...mapActions({
      getMemberDues: "dues/getMemberDues",
      getMemberAttendance: "dues/getMemberAttendance",
    }),
    load(uuid) {
      this.dues = [];
      this.expanded = {};
      this.attendance = { firstVisit: 0, count: 0 };
      if (!uuid) {
        return;
      }
      const self = this;
      this.getMemberAttendance(uuid)
        .then(function (response) {
          if (uuid === self.memberUuid && response.data) {
            self.attendance = {
              firstVisit: response.data.firstVisit || 0,
              count: response.data.count || 0,
            };
          }
        })
        .catch(function () {
          // Without it, the dues are shown as if the first visit was unknown.
        });
      this.getMemberDues(uuid)
        .then(function (response) {
          // The answer may arrive after another member was selected.
          if (uuid === self.memberUuid) {
            self.dues = response.data || [];
          }
        })
        .catch(function () {
          self.dues = [];
        });
    },
    isExpanded(season) {
      return Boolean(this.expanded[season]);
    },
    toggle(season) {
      this.expanded[season] = !this.expanded[season];
    },
    seasonLabel(season) {
      return duesHelper.seasonLabel(season);
    },
    displayStatus(d) {
      return duesHelper.displayStatus(
        d.status,
        d.collection,
        this.attendance.firstVisit
      );
    },
    statusClass(d) {
      return duesHelper.statusClass(this.displayStatus(d));
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
.dues-season {
  margin-bottom: 1rem;
}
.dues-table td {
  vertical-align: middle;
}
.dues-amount {
  white-space: nowrap;
}
</style>
