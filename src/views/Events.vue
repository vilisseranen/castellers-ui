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
      <nav class="pagination" role="navigation" aria-label="pagination">
        <a
          class="pagination-previous"
          v-on:click="previousPage()"
          v-if="type === 'admin' || pagination.page > 0"
          >&#xab;</a
        >
        <a class="pagination-previous" v-on:click="pageToday()">{{
          $t("events.today")
        }}</a>
        <a class="pagination-next" v-on:click="nextPage()">&#xbb;</a>
      </nav>
    </div>
    <div class="columns is-multiline">
      <event
        v-for="event in events"
        v-bind:key="event.uuid"
        v-bind:event="event"
        v-bind:memberType="type"
        v-on:participate="participate"
        v-on:remove="removeEvent"
        v-on:edit="editEvent"
      ></event>
    </div>
    <div class="columns is-centered" v-if="events.length === 0">
      <div class="column">
        <p class="has-text-centered title is-3">
          {{ $t("events.noEventToDisplay") }}
        </p>
      </div>
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
  data: function() {
    return {
      eventsToListen: {}
    };
  },
  computed: {
    ...mapState({
      events: state => state.events.events,
      pagination: state => state.events.pagination
    }),
    ...mapGetters(["uuid", "type", "action"])
  },
  mounted() {
    this.$store.dispatch("events/getEvents");
    this.checkAction();
  },
  methods: {
    ...mapMutations(["setAction"]),
    ...mapActions({
      participateEvent: "events/participateEvent",
      changePagination: "events/changePagination"
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
    },
    previousPage() {
      if (
        this.pagination.page >= 0 ||
        (this.events.length === this.pagination.limit &&
          this.pagination.page < 0)
      ) {
        var pagination = this.pagination;
        pagination.page = pagination.page - 1;
        this.changePagination(pagination);
      }
    },
    nextPage() {
      if (
        this.pagination.page < 0 ||
        (this.events.length === this.pagination.limit &&
          this.pagination.page >= 0)
      ) {
        var pagination = this.pagination;
        pagination.page = pagination.page + 1;
        this.changePagination(pagination);
      }
    },
    pageToday() {
      var pagination = this.pagination;
      pagination.page = 0;
      this.changePagination(pagination);
    }
  }
};
</script>
