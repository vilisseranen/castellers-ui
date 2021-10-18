<template>
  <div>
    <p class="title is-5">
      {{ $t("summary.title") }}
    </p>
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
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      selected: null,
      eventsParticipants: [],
    };
  },
  mounted() {
    this.$store.dispatch("events/getEventsParticipation");
    this.$store.dispatch("members/getMembers");
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
                // This is the current member
                if (this.events[e].members[p].participation === "yes") {
                  answer = this.$t("general.yes");
                } else if (this.events[e].members[p].participation === "no") {
                  answer = this.$t("general.no");
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
    countEventParticipants(event) {
      let total = 0;
      if (event.members) {
        for (let m = 0; m < event.members.length; m++) {
          if (event.members[m].participation === "yes") {
            total++;
          }
        }
      }
      return total;
    },
  },
};
</script>
