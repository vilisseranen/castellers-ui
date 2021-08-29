<template>
  <div>
    <p class="title is-3">
      {{ $t("castells.title") }}
    </p>
    <b-field>
      <button class="button field is-info" @click="addCastellModel">
        <span class="icon">
          <i class="fa fa-plus"></i>
        </span>
        <span>{{ $t("castells.create") }}</span>
      </button>
    </b-field>
    <b-table :data="castellModels" sort-icon="arrow-up" icon-pack="fa" striped>
      <b-table-column
        key="name"
        field="name"
        :label="$t('castells.model_name')"
        v-slot="props"
        sortable
        searchable
        >{{ props.row.name }}
      </b-table-column>
      <b-table-column
        key="type"
        field="type"
        :label="$t('castells.type')"
        sortable
        searchable
        v-slot="props"
        >{{ props.row.type }}
      </b-table-column>
      <b-table-column
        key="actions"
        :label="$t('general.actions')"
        v-slot="props"
      >
        <a href="#">
          <span
            class="icon has-text-info"
            v-on:click="editCastellModel(props.row.uuid)"
          >
            <i class="fa fa-edit"></i>
          </span>
        </a>
        <a href="#">
          <span
            class="icon has-text-danger"
            v-on:click="deleteCastellModel(props.row)"
          >
            <i class="fa fa-times"></i>
          </span>
        </a>
      </b-table-column>
    </b-table>
  </div>
</template>

<style scoped>
.tag {
  cursor: pointer;
}
</style>

<script>
import { mapActions, mapState } from "vuex";
import { castellMixin } from "../mixins/castells.js";

export default {
  mixins: [castellMixin],
  components: {},
  computed: {
    ...mapState({
      castellTypes: (state) => state.castells.types,
      castellModels: (state) => state.castells.models,
    }),
  },
  mounted() {
    this.getTypes();
    this.getModels();
  },
  methods: {
    ...mapActions({
      deleteModel: "castells/deleteCastellModel",
      getTypes: "castells/getCastellsTypeList",
      getModels: "castells/getCastellModels",
    }),
    addCastellModel() {
      this.$router.push({ name: "CastellAdd" });
    },
    editCastellModel(uuid) {
      this.$router.push({ path: `/castellEdit/${uuid}` });
    },
    deleteCastellModel(castell) {
      const self = this;
      this.deleteCastell(castell)
        .then(function () {
          self.getModels();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
