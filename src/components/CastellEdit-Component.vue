<template>
  <div>
    <p class="title is-3" v-if="actionLabel === 'update'">
      {{ $t("castells.update") }}
    </p>
    <p class="title is-3" v-if="actionLabel === 'create'">
      {{ $t("castells.create") }}
    </p>
    <div class="columns is-multiline">
      <div class="field column is-3" v-if="!readonly">
        <fieldset disabled>
          <label class="label">{{ $t("general.id") }}</label>
          <div class="control is-expanded">
            <input class="input" type="text" v-model="currentCastell.uuid" />
          </div>
        </fieldset>
      </div>
      <div class="field column is-7">
        <label class="label" v-bind:class="{ required: !readonly }">{{
          $t("general.name")
        }}</label>
        <div class="control is-expanded">
          <input
            :disabled="readonly ? true : false"
            class="input"
            type="text"
            :placeholder="$t('castells.nameDescription')"
            v-model="currentCastell.name"
          />
        </div>
      </div>
      <div class="field column is-2">
        <label class="label" v-bind:class="{ required: !readonly }">{{
          $t("castells.type")
        }}</label>
        <o-dropdown v-model="currentType" aria-role="list">
          <template #trigger>
            <o-button
              :label="currentCastell.type || $t('castells.type')"
              type="is-primary"
              icon-pack="fa"
              icon-right="caret-down"
            />
          </template>

          <o-dropdown-item
            v-for="(type, index) in types"
            :key="index"
            :value="type"
            aria-role="listitem"
          >
            {{ type }}
          </o-dropdown-item>
        </o-dropdown>
      </div>
      <div class="field column is-12">
        <label class="label">{{ $t("castells.associatedWith") }}</label>
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select v-model="selectedEventUuid" :disabled="readonly">
              <option value="">{{ $t("castells.notAttached") }}</option>
              <option
                v-for="event in eventsForSelection"
                :value="event.uuid"
                :key="event.uuid"
              >
                {{ event.label }}
              </option>
            </select>
          </div>
        </div>
        <p class="help" v-if="eventToSave">
          {{ $t("castells.eventNotSaved") }}
        </p>
      </div>
      <div class="column is-12 buttons">
        <button
          type="submit"
          class="button is-info"
          @click.prevent="editCastellModel()"
        >
          {{
            this.currentCastell.uuid === ""
              ? $t("castells.createModelButton")
              : $t("castells.updateModelButton")
          }}
        </button>
        <button
          type="submit"
          class="button is-warning"
          v-if="this.currentCastell.uuid"
          @click.prevent="copyCastellModelModal()"
        >
          {{ $t("castells.copy") }}
        </button>
        <button
          type="submit"
          class="button is-danger"
          v-if="this.currentCastell.uuid"
          @click.prevent="deleteCastellModel(currentCastell)"
        >
          {{ $t("castells.deleteModelButton") }}
        </button>
      </div>
    </div>
    <castell :castell="this.currentCastell" ref="drawing"></castell>
  </div>
</template>

<script>
import Castell from "./CastellsDrawing-Component.vue";
import { mapActions, mapState } from "vuex";
import { castellMixin } from "../mixins/castells.js";
import CastellCopyModal from "./modals/CastellCopy-Modal.vue";
import api from "../api/castellers";
import helper from "../api/dateTimeHelper";

export default {
  mixins: [castellMixin],
  components: {
    Castell,
  },
  props: {
    readonly: Boolean,
  },
  data() {
    return {
      castell: {},
      currentCastell: {},
      currentType: "",
      isCopyModalActive: false,
      copyProps: {},
      // Events that can be selected, and the one selected.
      // The castell is attached to it when it is saved.
      events: [],
      selectedEventUuid: "",
    };
  },
  computed: {
    ...mapState({
      types: (state) => state.castells.types.sort(),
      positions: (state) => state.castells.positions,
    }),
    actionLabel: function () {
      return this.currentCastell.uuid ? "update" : "create";
    },
    // uuid of the event the castell is attached to on the server
    savedEventUuid: function () {
      const event = this.currentCastell.event;
      return (event && event.uuid) || "";
    },
    // true when the selected event is not saved yet
    eventToSave: function () {
      return this.selectedEventUuid !== this.savedEventUuid;
    },
    eventsForSelection: function () {
      const events = this.events.map((event) => ({
        uuid: event.uuid,
        label: this.formattedEvent({
          name: event.name,
          start: event.startDate,
        }),
      }));
      // The event of the castell may not be in the list (a past event for instance)
      if (
        this.savedEventUuid &&
        !events.some((event) => event.uuid === this.savedEventUuid)
      ) {
        events.unshift({
          uuid: this.savedEventUuid,
          label: this.formattedEvent(this.currentCastell.event),
        });
      }
      return events;
    },
  },
  mounted() {
    this.getTypes();
    this.loadEvents();
    this.loadModel(this.$route.params.uuid);
  },
  methods: {
    ...mapActions({
      getTypes: "castells/getCastellsTypeList",
      getPositions: "castells/getCastellTypePositions",
      editModel: "castells/editCastellModel",
      getModel: "castells/getCastellModel",
      getParticipation: "events/getEventParticipation",
      attachCastellModel: "castells/attachCastellModel",
      detachCastellModel: "castells/detachCastellModel",
    }),
    loadEvents() {
      const self = this;
      api
        .getEvents({ page: 0, limit: 12 })
        .then(function (response) {
          self.events = response.data;
        })
        .catch((err) => console.log(err));
    },
    // Load who comes to the selected event, to show it in the list of members and in the drawing
    loadParticipation(eventUuid) {
      const self = this;
      if (!eventUuid) {
        self.currentCastell = Object.assign({}, self.currentCastell, {
          castellers: undefined,
        });
        return;
      }
      this.getParticipation({ eventUuid: eventUuid })
        .then(function (response) {
          // The selection may have changed while we were waiting
          if (self.selectedEventUuid === eventUuid) {
            self.currentCastell = Object.assign({}, self.currentCastell, {
              castellers: response.data,
            });
          }
        })
        .catch((err) => console.log(err));
    },
    // Attach the castell to the selected event, if it is not the one it is attached to
    async saveEvent(modelUuid) {
      if (!this.eventToSave) {
        return;
      }
      if (this.savedEventUuid) {
        await this.detachCastellModel({
          modelUuid: modelUuid,
          eventUuid: this.savedEventUuid,
        });
      }
      if (this.selectedEventUuid) {
        await this.attachCastellModel({
          modelUuid: modelUuid,
          eventUuid: this.selectedEventUuid,
        });
      }
    },
    async editCastellModel() {
      this.currentCastell["position_members"] =
        this.$refs.drawing.positionsMembers; // add the list of members from the child
      const isNew = !this.currentCastell.uuid;
      let uuid;
      try {
        const response = await this.editModel(this.currentCastell);
        uuid = response.data.uuid;
      } catch (error) {
        this.$root.$notifyNOK(this.$t("general.notifyFailure"));
        console.log(error);
        return;
      }
      // The castell is saved. If the event cannot be saved, we still show the
      // saved castell: saving a new castell again would create it twice.
      try {
        await this.saveEvent(uuid);
        this.$root.$notifyOK(this.$t("general.notifySuccess"));
      } catch (error) {
        this.$root.$notifyNOK(this.$t("castells.eventSaveFailure"));
        console.log(error);
      }
      if (isNew) {
        this.$router.push({ path: `/castellEdit/${uuid}` });
      } else {
        this.loadModel(uuid);
      }
    },
    deleteCastellModel(castell) {
      const self = this;
      this.deleteCastell(castell)
        .then(function () {
          self.$router.push({ path: `/castells` });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    loadModel(uuid) {
      if (uuid) {
        const self = this;
        this.getModel(uuid)
          .then(function (response) {
            const c = response.data;
            self.getPositions(response.data.type).then(function (response) {
              c.positions = response.data.positions;
              self.currentCastell = c;
              const eventUuid = (c.event && c.event.uuid) || "";
              if (self.selectedEventUuid === eventUuid) {
                self.loadParticipation(eventUuid);
              } else {
                self.selectedEventUuid = eventUuid; // the watcher loads the participation
              }
            });
          })
          .catch((err) => console.log(err));
      }
    },
    copyCastellModelModal() {
      this.$oruga.modal.open({
        trapFocus: true,
        component: CastellCopyModal,
        props: {
          originalName: this.currentCastell.name,
          originalUuid: this.currentCastell.uuid,
          newName: this.$t("castells.copyOf") + " " + this.currentCastell.name,
        },
      });
    },
    formattedEvent(event) {
      if (event && event.name && event.start) {
        return [
          event.name,
          this.$t("events.onThe").toLowerCase(),
          helper.extractDate(event.start),
        ].join(" ");
      }
      return this.$t("castells.notAttached");
    },
  },
  // List of positions in a castell of this type
  watch: {
    currentType: function (type) {
      if (type) {
        const self = this;
        this.getPositions(type).then(function (response) {
          self.currentCastell = Object.assign({}, self.currentCastell, {
            positions: response.data.positions,
            type: response.data.name,
          });
        });
      }
    },
    selectedEventUuid: function (eventUuid) {
      this.loadParticipation(eventUuid);
    },
    "$route.params.uuid": function (uuid) {
      this.loadModel(uuid);
    },
  },
};
</script>
