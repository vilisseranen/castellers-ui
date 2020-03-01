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
      sticky-header
      style="height: 80vh;"
    >
      <template slot-scope="props">
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

          <span
            v-bind:class="{
              'has-text-weight-bold': props.row['name'] === $t('summary.total')
            }"
          >
            {{ props.row[column.field] }}
          </span>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      eventsParticipants: [],
      events: [],
      selected: null
    };
  },
  mounted() {
    this.listEventsParticipants();
  },
  computed: {
    ...mapGetters(["uuid", "code", "type"]),
    columns: {
      get: function() {
        var columns = [
          {
            field: "name",
            label: this.$t("summary.name"),
            width: 150,
            sortable: true,
            subheading: this.$t("summary.total")
          }
        ];
        for (var id in this.events) {
          columns.push({
            field: this.events[id].uuid,
            label: [this.events[id].name, this.events[id].date].join(" "),
            subheading: this.countEventParticipants(this.events[id].uuid),
            width: 25
          });
        }
        return columns;
      }
    },
    summaryParticipants: {
      get: function() {
        var participantsById = {};
        var participantsArray = [];
        const events = this.eventsParticipants;
        for (var e = 0; e < events.length; e++) {
          const eventUuid = events[e].uuid;
          for (var m = 0; m < events[e].members.length; m++) {
            participantsById[events[e].members[m].uuid] = participantsById[
              events[e].members[m].uuid
            ] || {
              name: [
                events[e].members[m].firstName,
                events[e].members[m].lastName
              ].join(" ")
            };
            var answer = "-";
            if (events[e].members[m].participation === "yes") {
              answer = this.$t("summary.yes");
            } else if (events[e].members[m].participation === "no") {
              answer = this.$t("summary.no");
            }
            participantsById[events[e].members[m].uuid][eventUuid] = answer;
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
    }
  },
  methods: {
    countEventParticipants(eventUuid) {
      var total = 0;
      const events = this.eventsParticipants;
      for (var e = 0; e < events.length; e++) {
        if (events[e].uuid === eventUuid) {
          for (var m = 0; m < events[e].members.length; m++) {
            if (events[e].members[m].participation === "yes") {
              total++;
            }
          }
        }
      }
      return total;
    },
    listEventsParticipants() {
      this.eventsParticipants = [];
      var self = this;
      var url = `/api/admins/${self.uuid}/events`;
      let events;
      axios
        .get(url, { headers: { "X-Member-Code": self.code } })
        .then(function(response) {
          events = response.data;
          for (var i = 0; i < response.data.length; i++) {
            events[i].date = self.extractDate(events[i].startDate);
            events[i].start = self.extractTime(events[i].startDate);
            events[i].end = self.extractTime(events[i].endDate);
          }
          self.events = events;
          for (var id in events) {
            const event = events[id];
            var url = `/api/admins/${self.uuid}/events/${events[id].uuid}/members`;
            axios
              .get(url, { headers: { "X-Member-Code": self.code } })
              .then(function(response) {
                event.members = response.data;
                self.eventsParticipants.push(event);
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    },
    extractDate(timestamp) {
      var options = { year: "numeric", month: "2-digit", day: "2-digit" };
      var date = new Date(timestamp * 1000);
      return new Intl.DateTimeFormat("fr-FR", options).format(date);
    },
    extractTime(timestamp) {
      var options = { hour: "2-digit", minute: "2-digit" };
      var time = new Date(timestamp * 1000);
      return new Intl.DateTimeFormat("fr-FR", options).format(time);
    }
  }
};
</script>
