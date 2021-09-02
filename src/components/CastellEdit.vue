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
        <b-dropdown v-model="currentType" aria-role="list">
          <template #trigger>
            <b-button
              :label="currentCastell.type || $t('castells.type')"
              type="is-primary"
              icon-pack="fa"
              icon-right="caret-down"
            />
          </template>

          <b-dropdown-item
            v-for="(type, index) in types"
            :key="index"
            :value="type"
            aria-role="listitem"
          >
            {{ type }}
          </b-dropdown-item>
        </b-dropdown>
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
import Castell from "./CastellsDrawing.vue";
import { mapActions, mapState } from "vuex";
import { castellMixin } from "../mixins/castells.js";

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
    }),
    editCastellModel() {
      const self = this;
      self.$set(
        this.currentCastell,
        "position_members",
        this.$refs.drawing.positionsMembers
      ); // add the list of members from the child
      this.editModel(this.currentCastell)
        .then(function (response) {
          self.$notifyOK(self.$t("general.notifySuccess"));
          if (!self.currentCastell.uuid) {
            self.$router.push({ path: `/castellEdit/${response.data.uuid}` });
          }
        })
        .catch(function (error) {
          self.$notifyNOK(self.$t("general.notifyFailure"));
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
            });
          })
          .catch((err) => console.log(err));
      }
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
