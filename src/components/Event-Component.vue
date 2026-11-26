<template>
  <div class="column is-3">
    <div class="card" :class="{ 'is-cancelled': cancelled }">
      <header class="event-cancelled-banner" v-if="cancelled">
        <span class="icon is-small">
          <i class="fas fa-ban"></i>
        </span>
        <span class="event-cancelled-label">{{ $t("events.cancelled") }}</span>
        <span v-if="event.cancelReason">
          · {{ $t("events.cancelReasons." + event.cancelReason) }}</span
        >
      </header>
      <article class="card-content">
        <div class="content">
          <router-link
            :to="
              memberType === 'admin'
                ? { name: 'eventEdit', params: { uuid: event.uuid } }
                : { name: 'eventShow', params: { uuid: event.uuid } }
            "
          >
            <div>
              <strong class="event-name">{{ event.name }}</strong>
              <span v-if="memberType === 'admin'">
                ({{ event.attendance }} {{ registeredLabel }})</span
              >
              <br />
              <small
                >{{ $t("events.onThe") }} {{ event.date }}
                {{ $t("events.from") }} {{ event.start }} {{ $t("events.to") }}
                {{ event.end }}</small
              >
              <br />
              <small
                class="event-cancel-note"
                v-if="cancelled && event.cancelNote"
              >
                {{ event.cancelNote }}
              </small>
              <br />
              <div class="tags">
                <span
                  class="tag is-success"
                  v-if="event.participation == 'yes'"
                  >{{ $t("events.participationYes") }}</span
                >
                <span
                  class="tag is-danger"
                  v-if="event.participation == 'no'"
                  >{{ $t("events.participationNo") }}</span
                >
                <span
                  class="tag is-presentation"
                  v-if="event.type == 'presentation'"
                  >{{ $t("events.presentation") }}</span
                >
                <span class="tag is-practice" v-if="event.type == 'practice'">{{
                  $t("events.practice")
                }}</span>
                <span class="tag is-social" v-if="event.type == 'social'">{{
                  $t("events.social")
                }}</span>
                <span class="tag is-music" v-if="event.type == 'music'">
                  <span class="icon is-small">
                    <i class="fas fa-music"></i>
                  </span>
                  <span>{{ $t("events.music") }}</span>
                </span>
                <span
                  class="tag is-uniform"
                  v-if="event.uniformRequired == 1"
                  :title="$t('events.uniformRequiredHelp')"
                >
                  <span class="icon is-small">
                    <i class="fas fa-tshirt"></i>
                  </span>
                  <span>{{ $t("events.uniform") }}</span>
                </span>
                <span
                  class="tag is-dues"
                  v-if="event.duesCollectionUuid"
                  :title="$t('eventDues.tagHelp')"
                >
                  <span class="icon is-small">
                    <i class="fas fa-coins"></i>
                  </span>
                  <span>{{ $t("eventDues.tag") }}</span>
                </span>
              </div>
            </div>
          </router-link>
        </div>
        <nav class="level is-mobile" v-if="memberType === 'admin'">
          <div class="level-left">
            <a class="level-item" v-on:click="edit(event.uuid)">
              <span class="icon has-text-info">
                <i class="fas fa-edit"></i>
              </span>
            </a>
            <a
              class="level-item"
              v-if="!cancelled"
              v-on:click="$emit('cancel', event)"
              :title="$t('events.cancelEvent')"
              :aria-label="$t('events.cancelEvent')"
            >
              <span class="icon has-text-warning-dark">
                <i class="fas fa-ban"></i>
              </span>
            </a>
            <a
              class="level-item"
              v-if="cancelled"
              v-on:click="$emit('restore', event)"
              :title="$t('events.restoreEvent')"
              :aria-label="$t('events.restoreEvent')"
            >
              <span class="icon has-text-success">
                <i class="fas fa-undo"></i>
              </span>
            </a>
            <a class="level-item" v-on:click="remove(event)">
              <span class="icon has-text-danger">
                <i class="fas fa-trash"></i>
              </span>
            </a>
          </div>
        </nav>
      </article>
      <footer
        class="card-footer"
        v-if="!cancelled && (memberType === 'admin' || memberType === 'member')"
      >
        <a class="card-footer-item" v-on:click="participate(event.uuid, 'yes')">
          <span class="icon">
            <i class="fas fa-check has-text-success"></i>
          </span>
        </a>
        <a class="card-footer-item" v-on:click="participate(event.uuid, 'no')">
          <span class="icon">
            <i class="fas fa-times has-text-danger"></i>
          </span>
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    event: Object,
    memberType: String,
  },
  emits: ["participate", "edit", "remove", "cancel", "restore"],
  computed: {
    // A cancelled event stays in the list: it must be obvious that it does
    // not take place, and nobody answers for it anymore.
    cancelled() {
      return this.event.cancelled === 1;
    },
    registeredLabel() {
      if (this.event.attendance >= 2) {
        return this.$t("events.registered_plural");
      } else {
        return this.$t("events.registered");
      }
    },
  },
  methods: {
    participate(eventUuid, participation) {
      this.$emit("participate", eventUuid, participation);
    },
    edit(eventUuid) {
      this.$emit("edit", eventUuid);
    },
    remove(event) {
      this.$emit("remove", event);
    },
  },
};
</script>

<style scoped>
.event-cancelled-banner {
  background-color: hsl(348, 86%, 43%);
  color: #fff;
  padding: 0.4rem 0.75rem;
  border-radius: 0.25rem 0.25rem 0 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.event-cancelled-label {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.card.is-cancelled {
  box-shadow: 0 0 0 2px hsl(348, 86%, 43%);
}
.card.is-cancelled .event-name {
  text-decoration: line-through;
}
.card.is-cancelled .card-content .content {
  opacity: 0.7;
}
.event-cancel-note {
  display: block;
  margin-top: 0.25rem;
  font-style: italic;
}
</style>
