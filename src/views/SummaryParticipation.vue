<template>
  <div>
    <p class="title is-5">
      {{ $t("summary.title") }}
    </p>

    <member-filter
      :types="this.memberTypes"
      :statuses="this.memberStatuses"
      v-on:input="this.filterMembers"
    ></member-filter>

    <b-table
      class="summaryTable table-is-narrow"
      :data="summaryParticipants"
      :mobile-cards="false"
      :selected.sync="selected"
      icon-pack="fa"
    >
      <template>
        <b-table-column
          v-for="column in columns"
          v-bind:key="column.field"
          :field="column.field"
          :label="column.label"
          :width="column.width"
          :sortable="column.sortable"
          :subheading="column.subheading"
          class="is-size-7"
        >
          <template slot="header" slot-scope="{ column }">
            <span class="is-size-7">
              {{ column.label }}
            </span>
          </template>

          <template slot="subheading" slot-scope="{ column }">
            <span class="is-size-7">
              {{ column.subheading }}
            </span>
          </template>

          <template v-slot="props">
            <span
              v-bind:class="{
                'has-text-weight-bold':
                  props.row['name'] === $t('summary.total'),
              }"
            >
              {{ props.row[column.field] }}
            </span>
          </template>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import MemberFilter from "../components/MemberFilter.vue";

export default {
  components: { MemberFilter },
  data() {
    return {
      selected: null,
      eventsParticipants: [],
      memberTypes: ["admin,member"],
      memberStatuses: ["active"],
    };
  },
  mounted() {
    this.getMembers({
      type: this.memberTypes.join(","),
      status: this.memberStatuses.join(","),
    });
    this.getEventsParticipation();
  },

  computed: {
    ...mapState({
      events: (state) => state.events.events,
      members: (state) => state.members.members,
    }),
    ...mapGetters(["uuid", "type"]),
    columns: function () {
      const columns = [
        {
          field: "name",
          label: this.$t("general.name"),
          width: 150,
          sortable: true,
          subheading: this.$t("summary.total"),
        },
      ];
      if (this.events) {
        for (const id in this.events) {
          columns.push({
            field: this.events[id].uuid,
            label: [this.events[id].name, this.events[id].date].join(" "),
            subheading: this.countEventParticipants(this.events[id]),
            width: 25,
            sortable: true,
          });
        }
      }
      return columns;
    },
    summaryParticipants: function () {
      const participantsArray = [];
      for (let m = 0; m < this.members.length; m++) {
        const memberLine = {
          name: [this.members[m].firstName, this.members[m].lastName].join(" "),
        };
        for (let e = 0; e < this.events.length; e++) {
          let answer = "-";
          // check in members this member participation
          if (this.events[e].members) {
            for (let p = 0; p < this.events[e].members.length; p++) {
              if (this.events[e].members[p].uuid === this.members[m].uuid) {
                // Participation for current member
                if (this.events[e].members[p].participation === "yes") {
                  answer = this.$t("general.yes");
                } else if (this.events[e].members[p].participation === "no") {
                  answer = this.$t("general.no");
                }
                // Presence for current member (only for past events)
                if (this.events[e].startDate < Date.now() / 1000) {
                  if (
                    this.events[e].members[p].presence === "yes" ||
                    (this.events[e].members[p].participation === "yes" &&
                      this.events[e].members[p].presence !== "no")
                  ) {
                    answer += " / " + this.$t("general.yes");
                  } else {
                    answer += " / " + this.$t("general.no");
                  }
                }
              }
            }
          }
          memberLine[this.events[e].uuid] = answer;
        }
        participantsArray.push(memberLine);
      }
      return participantsArray;
    },
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
      getEventsParticipation: "events/getEventsParticipation",
    }),
    countEventParticipants(event) {
      let total = 0;
      if (event.members) {
        for (let m = 0; m < event.members.length; m++) {
          if (
            event.members[m].presence === "yes" ||
            (event.members[m].participation === "yes" &&
              event.members[m].presence !== "no")
          ) {
            total++;
          }
        }
      }
      return total;
    },
  },
};
</script>
