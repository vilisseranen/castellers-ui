<template>
  <div class="box">
    <p class="title is-3">
      {{ $t("castells.list") }}
    </p>
    <b-field>
      <button class="button field is-info" @click="addCastell">
        <span class="icon">
          <i class="fas fa-plus-square"></i>
        </span>
        <span>{{ $t("castells.create") }}</span>
      </button>
    </b-field>
    <hr />
    <div class="columns">
      <div class="field column is-6">
        <p class="title is-4">{{ $t("castells.selectType") }}</p>
        <b-dropdown aria-role="list">
          <button
            class="button is-primary"
            slot="trigger"
            slot-scope="{ active }"
          >
            <span>{{ $t("castells.type") }}</span>
            <b-icon
              pack="fas"
              :icon="active ? 'sort-up' : 'sort-down'"
            ></b-icon>
          </button>

          <b-dropdown-item
            aria-role="listitem"
            v-bind:key="castellType"
            v-for="castellType in castellTypes"
            >{{ castellType }}</b-dropdown-item
          >
        </b-dropdown>
      </div>
      <div class="field column is-6">
        <p class="title is-4">{{ $t("castells.selectCastell") }}</p>
        <b-dropdown aria-role="list">
          <button
            class="button is-primary"
            slot="trigger"
            slot-scope="{ active }"
          >
            <span>{{ $t("castells.castell") }}</span>
            <b-icon
              pack="fas"
              :icon="active ? 'sort-up' : 'sort-down'"
            ></b-icon>
          </button>

          <b-dropdown-item
            aria-role="listitem"
            v-bind:key="castell"
            v-for="castell in castellList"
            >{{ castell }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <hr />
    <castell :castell="this.selectedCastell"></castell>
  </div>
</template>

<style scoped>
.tag {
  cursor: pointer;
}
</style>

<script>
import Castell from "../components/Castell.vue";

export default {
  components: {
    Castell
  },
  data() {
    return {
      selectedCastell: {
        uuid: "1234fsf4w4rw",
        type: "3d6",
        name: "3d6 - Saint Jordi 2020"
      },
      // TODO: retrieve via API
      castellTypes: ["2d5", "1d4", "3d6"],
      castellList: [
        "3d6 - Saint Jordi 2020",
        "1d4 - Saint Jordi",
        "2d5 - Pratique du 27/02/2020"
      ]
    };
  },
  computed: {
    actionLabel: function() {
      return this.castell.uuid ? "update" : "create";
    }
  },
  methods: {
    addCastell() {
      // TODO
    }
  }
};
</script>
