<template>
  <div>
    <p class="title is-5">{{ $t("events.title") }}</p>
    <div class="columns">
      <b-field class="column" v-if="type === 'admin'">
        <button class="button field is-info" @click="addEvent">
          <span class="icon">
            <i class="fa fa-calendar-plus"></i>
          </span>
          <span>{{ $t("events.create") }}</span>
        </button>
      </b-field>
      <!-- <b-field grouped class="column" position="is-right">
        <b-switch v-model="showPractices" type="is-info">{{
          $t("events.showPractices")
        }}</b-switch>
        <b-switch v-model="showPresentations" type="is-warning">{{
          $t("events.showPresentations")
        }}</b-switch>
      </b-field> -->
    </div>
    <div class="columns is-multiline">
      <event
        v-for="(event, uuid) in events.events"
        v-bind:key="uuid"
        v-bind:event="event"
        v-bind:memberType="type"
        v-on:participate="participate"
        v-on:remove="removeEvent"
        v-on:edit="editEvent"
      ></event>
    </div>
  </div>
</template>

<script>
import Event from "../components/Event.vue";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { eventMixin } from "../mixins/events.js";

export default {
  mixins: [eventMixin],
  components: {
    Event
  },
  computed: {
    ...mapState(["events"]),
    ...mapGetters(["uuid", "type", "action"])
  },
  mounted() {
    this.$store.dispatch("events/getEvents");
    this.checkAction();
  },
  methods: {
    ...mapMutations(["setAction"]),
    ...mapActions({
      participateEvent: "events/participateEvent"
    }),
    checkAction() {
      // This page handles actions to participate to an event
      if ("a" in this.$route.query && this.$route.query.a === "participate") {
        this.participate(
          this.$route.query.e,
          this.$route.query.p,
          this.$route.query.t,
          this.$route.query.u
        );
      }
    },
    participate(eventUuid, participation, token, userUuid) {
      var self = this;
      this.participateEvent({ eventUuid, participation, token, userUuid })
        .then(function() {
          self.$store.dispatch("events/getEvent", eventUuid);
          self.$notifyOK(self.$t("events.participationOK"));
        })
        .catch(function() {
          self.$notifyNOK(self.$t("events.participationNOK"));
        });
    },
    addEvent() {
      this.$router.push({ name: "EventAdd" });
    },
    editEvent(eventUuid) {
      this.$router.push({ path: `/eventEdit/${eventUuid}` });
    },
    removeEvent(practice) {
      var self = this;
      this.deleteEvent(practice)
        .then(function() {
          self.listEvents();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
