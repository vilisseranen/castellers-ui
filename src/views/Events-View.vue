<template>
  <div>
    <p class="title is-5">{{ $t("events.title") }}</p>
    <div class="columns">
      <o-field class="column" v-if="type === 'admin'">
        <button class="button field is-info" @click="addEvent">
          <span class="icon">
            <i class="fa fa-calendar-plus"></i>
          </span>
          <span>{{ $t("events.create") }}</span>
        </button>
      </o-field>
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
    <div class="field is-grouped is-grouped-multiline events-filter">
      <span class="has-text-weight-bold">{{ $t("events.filterShow") }}</span>
      <o-checkbox
        variant="practice"
        :model-value="filter.practice"
        @update:model-value="(shown) => setFilter({ kind: 'practice', shown })"
      >
        {{ $t("events.filterPractice") }}
      </o-checkbox>
      <o-checkbox
        variant="music"
        :model-value="filter.music"
        @update:model-value="(shown) => setFilter({ kind: 'music', shown })"
      >
        {{ $t("events.filterMusic") }}
      </o-checkbox>
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
import Event from "../components/Event-Component.vue";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { eventMixin } from "../mixins/events.js";

export default {
  mixins: [eventMixin],
  components: {
    Event,
  },
  data: function () {
    return {
      eventsToListen: {},
    };
  },
  computed: {
    ...mapState({
      events: (state) => state.events.events,
      pagination: (state) => state.events.pagination,
    }),
    ...mapGetters(["uuid", "type", "action"]),
    ...mapGetters({ filter: "events/filter" }),
  },
  mounted() {
    const self = this;
    this.$store.dispatch("events/getEvents");
    // The rehearsals of the musicians are shown by default to the musicians:
    // an admin may have made the member a musician since they logged in.
    if (this.uuid) {
      this.$store
        .dispatch("refreshMusician")
        .then(function (changed) {
          if (changed) {
            self.$store.dispatch("events/getEvents");
          }
        })
        .catch(function () {});
    }
  },
  methods: {
    ...mapMutations(["setAction"]),
    ...mapActions({
      participateEvent: "events/participateEvent",
      changePagination: "events/changePagination",
      setFilter: "events/setFilter",
    }),
    participate(eventUuid, participation, token, userUuid) {
      const self = this;
      const memberUuid = this.uuid;
      this.participateEvent({
        memberUuid,
        eventUuid,
        participation,
        token,
        userUuid,
      })
        .then(function () {
          self.$store.dispatch("events/getEvent", { uuid: eventUuid });
          self.$root.$notifyOK(self.$t("events.participationOK"));
        })
        .catch(function () {
          self.$root.$notifyNOK(self.$t("events.participationNOK"));
        });
    },
    addEvent() {
      this.$router.push({ name: "EventAdd" });
    },
    editEvent(eventUuid) {
      this.$router.push({ path: `/eventEdit/${eventUuid}` });
    },
    removeEvent(practice) {
      const self = this;
      this.deleteEvent(practice)
        .then(function () {
          self.$store.dispatch("events/getEvents");
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    previousPage() {
      if (
        this.pagination.page >= 0 ||
        (this.events.length === this.pagination.limit &&
          this.pagination.page < 0)
      ) {
        const pagination = this.pagination;
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
        const pagination = this.pagination;
        pagination.page = pagination.page + 1;
        this.changePagination(pagination);
      }
    },
    pageToday() {
      const pagination = this.pagination;
      pagination.page = 0;
      this.changePagination(pagination);
    },
  },
};
</script>

<style scoped>
.events-filter {
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.25rem;
  margin-bottom: 1.5rem;
}
</style>
