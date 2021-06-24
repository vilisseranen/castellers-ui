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
          <label class="label">ID</label>
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
        <b-dropdown v-model="currentCastell.type" aria-role="list">
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
    </div>

    <castell :castell="this.currentCastell"></castell>
  </div>
</template>

<script>
import Castell from "../components/Castells.vue";
import { mapActions, mapState } from "vuex";
import Vue from "vue";

export default {
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
    };
  },
  computed: {
    ...mapState({
      types: (state) => state.castells.types.sort(),
      positions: (state) => state.castells.positions,
    }),

    actionLabel: function () {
      return this.castell.uuid ? "update" : "create";
    },
  },
  mounted() {
    this.getTypes();
  },
  methods: {
    ...mapActions({
      getTypes: "castells/getCastellsTypeList",
      getPositions: "castells/getCastellTypePositions",
    }),
  },
  watch: {
    "currentCastell.type": function (type) {
      if (type) {
        const self = this;
        this.getPositions(type).then(function (response) {
          Vue.set(self.currentCastell, "positions", response.data.positions);
        });
      }
    },
  },
};
</script>
