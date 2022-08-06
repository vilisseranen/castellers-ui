<template>
  <div>
    <form action="">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t("castells.attach") }}</p>
          <button type="button" class="delete" @click="$emit('close')" />
        </header>
        <section class="modal-card-body">
          <o-field :label="$t('castells.modelName')">
            <o-input type="string" v-model="oName" disabled> </o-input>
          </o-field>
        </section>
        <section class="modal-card-body">
          <o-field :label="$t('castells.selectEvent')">
            <o-select v-model="selectedEvent">
              <option
                v-for="event in eventsForSelection"
                :value="event.uuid"
                :key="event.uuid"
              >
                {{ event.name }}
              </option>
            </o-select>
          </o-field>
        </section>
        <footer class="modal-card-foot">
          <o-button :label="$t('general.cancel')" @click="$emit('close')" />
          <o-button
            v-if="eventFormattedName"
            :label="$t('castells.detachButton')"
            variant="warning"
            @click="detachCastell()"
          />
          <o-button
            v-if="selectedEvent"
            :label="$t('castells.attachButton')"
            variant="info"
            @click="attachCastell()"
          />
        </footer>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import notifications from "../../mixins/notifications";

export default {
  mixins: [notifications],
  props: {
    name: String,
    uuid: String,
    eventFormattedName: String,
    eventUuid: String,
  },
  data() {
    return { selectedEvent: this.eventUuid, oName: this.name };
  },
  mounted() {
    this.$store.dispatch("events/getEvents");
  },
  computed: {
    ...mapState({
      events: (state) => state.events.events.sort(),
    }),
    eventsForSelection: function () {
      const eventsForSelection = [];
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].uuid !== this.eventUuid) {
          eventsForSelection.push({
            name: this.formattedEvent(this.events[i]),
            uuid: this.events[i].uuid,
          });
        }
      }
      eventsForSelection.push({
        name: this.eventFormattedName,
        uuid: this.eventUuid,
      });
      return eventsForSelection;
    },
  },
  methods: {
    ...mapActions({
      attachCastellModel: "castells/attachCastellModel",
      detachCastellModel: "castells/detachCastellModel",
    }),
    async attachCastell() {
      const self = this;
      // dettach event if any
      if (this.eventUuid) {
        await this.detachCastellModel({
          modelUuid: this.uuid,
          eventUuid: this.eventUuid,
        });
      }
      this.attachCastellModel({
        modelUuid: this.uuid,
        eventUuid: this.selectedEvent,
      })
        .then(function () {
          self.$notifyOK(self.$t("general.notifySuccess"));
          self.$emit("loadModel", self.uuid);
          self.$emit("close");
        })
        .catch(function (error) {
          console.log(error);
          self.$notifyNOK(self.$t("general.notifyFailure"));
        });
    },
    async detachCastell() {
      const self = this;
      this.detachCastellModel({
        modelUuid: this.uuid,
        eventUuid: this.eventUuid,
      })
        .then(function () {
          self.$notifyOK(self.$t("general.notifySuccess"));
          self.$emit("loadModel", self.uuid);
          self.$emit("close");
        })
        .catch(function (error) {
          console.log(error);
          self.$notifyNOK(self.$t("general.notifyFailure"));
        });
    },
    formattedEvent(event) {
      if (event && event.name && event.date) {
        return [
          event.name,
          this.$t("events.onThe").toLowerCase(),
          event.date,
        ].join(" ");
      }
      return this.$t("castells.notAttached");
    },
  },
};
</script>
