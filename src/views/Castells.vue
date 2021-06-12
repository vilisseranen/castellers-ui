<template>
  <div>
    <p class="title is-3">
      {{ $t("castells.title") }}
    </p>
    <b-field>
      <button class="button field is-info" @click="addCastell">
        <span class="icon">
          <i class="fa fa-plus"></i>
        </span>
        <span>{{ $t("castells.addCastell") }}</span>
      </button>
    </b-field>
    <b-table><!-- List of castells --></b-table>
  </div>
</template>

<style scoped>
.tag {
  cursor: pointer;
}
</style>

<script>
import { mapState } from "vuex";

export default {
  components: {},
  computed: {
    ...mapState({
      castellTypes: (state) => state.castells.types,
    }),
  },
  mounted() {
    this.$store.dispatch("castells/getCastellsTypeList");
  },
  methods: {
    addCastell() {
      this.$router.push({ name: "CastellAdd" });
    },
  },
};
</script>
