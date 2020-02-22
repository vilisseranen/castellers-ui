<template>
  <div class="column is-3">
    <div class="card">
      <article class="card-content">
        <div class="content">
          <div>
            <strong>{{ event.name }}</strong>
            <span v-if="memberType === 'admin'"
              >({{ event.attendance }} {{ registeredLabel }})</span
            >
            <br />
            <small
              >{{ $t("events.onThe") }} {{ event.date }}
              {{ $t("events.from") }} {{ event.start }} {{ $t("events.to") }}
              {{ event.end }}</small
            >
            <br />
            {{ event.description }}
            <br />
            <div class="tags">
              <span
                class="tag is-success"
                v-if="event.participation == 'yes'"
                >{{ $t("events.participationYes") }}</span
              >
              <span class="tag is-danger" v-if="event.participation == 'no'">{{
                $t("events.participationNo")
              }}</span>
              <span
                class="tag is-warning"
                v-if="event.type == 'presentation'"
                >{{ $t("events.presentation") }}</span
              >
              <span class="tag is-info" v-if="event.type == 'practice'">{{
                $t("events.practice")
              }}</span>
            </div>
          </div>
        </div>
        <nav class="level is-mobile" v-if="memberType === 'admin'">
          <div class="level-left">
            <a class="level-item" v-on:click="edit(event.uuid)">
              <span class="icon has-text-info">
                <i class="fas fa-edit"></i>
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
        v-if="memberType === 'admin' || memberType === 'member'"
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
    memberType: String
  },
  computed: {
    registeredLabel() {
      if (this.event.attendance >= 2) {
        return this.$t("events.registered_plural");
      } else {
        return this.$t("events.registered");
      }
    }
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
    }
  }
};
</script>
