<template>
  <div>
    <p class="title is-3">
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
                  props.row['name'] === $t('summary.total')
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
      eventsParticipants: []
    };
  },
  mounted() {
    this.$store.dispatch("events/getEventsParticipation");
  },

  computed: {
    ...mapState(["events"]),
    ...mapGetters(["uuid", "type"]),
    columns: function() {
      var columns = [
        {
          field: "name",
          label: this.$t("summary.name"),
          width: 150,
          sortable: true,
          subheading: this.$t("summary.total")
        }
      ];
      const events = this.events.events;
      if (events) {
        var count = 1;
        for (var id in events) {
          columns.push({
            field: events[id].uuid,
            label: [events[id].name, events[id].date].join(" "),
            subheading: this.countEventParticipants(events[id]),
            width: 25,
            sortable: true
          });
          count++;
          if (count > 10) {
            break;
          }
        }
      }
      return columns;
    },
    summaryParticipants: function() {
      var participantsById = {};
      var participantsArray = [];
      const events = this.events.events;
      for (var uuid in events) {
        if (events[uuid].members) {
          for (var m = 0; m < events[uuid].members.length; m++) {
            participantsById[events[uuid].members[m].uuid] = participantsById[
              events[uuid].members[m].uuid
            ] || {
              name: [
                events[uuid].members[m].firstName,
                events[uuid].members[m].lastName
              ].join(" ")
            };
            var answer = "-";
            if (events[uuid].members[m].participation === "yes") {
              answer = this.$t("summary.yes");
            } else if (events[uuid].members[m].participation === "no") {
              answer = this.$t("summary.no");
            }
            participantsById[events[uuid].members[m].uuid][uuid] = answer;
          }
        }
      }
      for (var participant in participantsById) {
        participantsArray.push(participantsById[participant]);
      }
      for (var p = 0; p < participantsArray.length; p++) {
        let participation = 0;
        let totalEvents = 0;
        for (var event in participantsArray[p]) {
          if (event !== "name") {
            totalEvents++;
            if (participantsArray[p][event] === this.$t("summary.yes")) {
              participation++;
            }
          }
        }
        if (p === participantsArray.length - 1) {
          participantsArray[p].summary = "";
        } else {
          participantsArray[p].summary = participation + "/" + totalEvents;
        }
      }
      return participantsArray;
    }
  },
  methods: {
    countEventParticipants(event) {
      var total = 0;
      if (event.members) {
        for (var m = 0; m < event.members.length; m++) {
          if (event.members[m].participation === "yes") {
            total++;
          }
        }
      }
      return total;
    }
  }
};
</script>
