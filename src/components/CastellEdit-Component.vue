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
          <input
            disabled
            class="input"
            type="text"
            :placeholder="$t('castells.nameDescription')"
            :value="formattedEvent(currentCastell.event)"
          />
        </div>
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
          class="button is-success"
          v-if="this.currentCastell.uuid"
          @click.prevent="attachCastellModelModal()"
        >
          {{ $t("castells.attach") }}
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
import CastellAttachModal from "./modals/CastellAttach-Modal.vue";
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
      isAttachModalActive: false,
      copyProps: {},
      attachProps: {},
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
  },
  mounted() {
    this.getTypes();
    this.loadModel(this.$route.params.uuid);
  },
  methods: {
    ...mapActions({
      getTypes: "castells/getCastellsTypeList",
      getPositions: "castells/getCastellTypePositions",
      editModel: "castells/editCastellModel",
      getModel: "castells/getCastellModel",
      getParticipation: "events/getEventParticipation",
    }),
    editCastellModel() {
      const self = this;
      this.currentCastell["position_members"] =
        this.$refs.drawing.positionsMembers; // add the list of members from the child
      this.editModel(this.currentCastell)
        .then(function (response) {
          self.$root.$notifyOK(self.$t("general.notifySuccess"));
          if (!self.currentCastell.uuid) {
            self.$router.push({ path: `/castellEdit/${response.data.uuid}` });
          }
        })
        .catch(function (error) {
          self.$root.$notifyNOK(self.$t("general.notifyFailure"));
          console.log(error);
        });
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
              if (self.currentCastell.event && self.currentCastell.event.uuid) {
                self
                  .getParticipation({
                    eventUuid: self.currentCastell.event.uuid,
                  })
                  .then(function (response) {
                    self.currentCastell["castellers"] = response.data;
                  });
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
    attachCastellModelModal() {
      this.$oruga.modal.open({
        trapFocus: true,
        component: CastellAttachModal,
        props: {
          name: this.currentCastell.name,
          uuid: this.currentCastell.uuid,
          eventFormattedName: this.formattedEvent(this.currentCastell.event),
          eventUuid: this.currentCastell.event.uuid,
        },
        events: {
          loadModel: this.loadModel,
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
    "$route.params.uuid": function (uuid) {
      this.loadModel(uuid);
    },
  },
};
</script>
