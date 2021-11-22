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
    <b-table
      :data="castellModels"
      sort-icon="arrow-up"
      icon-pack="fa"
      striped
      :default-sort="[this.castellSort.field, this.castellSort.order]"
      @sort="onSort"
    >
      <b-table-column
        key="name"
        field="name"
        :label="$t('castells.modelName')"
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
        key="event"
        field="event.name"
        :label="$t('events.event')"
        searchable
        sortable
        v-slot="props"
      >
        {{ props.row.event.name }}
      </b-table-column>
      <b-table-column
        key="date"
        field="event.start"
        :label="$t('events.date')"
        searchable
        sortable
        v-slot="props"
      >
        {{ formattedDate(props.row.event) }}
      </b-table-column>
      <b-table-column
        key="actions"
        :label="$t('general.actions')"
        v-slot="props"
      >
        <router-link
          :to="{ name: 'castellEdit', params: { uuid: props.row.uuid } }"
        >
          <span class="icon has-text-info">
            <i class="fa fa-edit"></i>
          </span>
        </router-link>
        <a>
          <span
            class="icon has-text-info"
            v-on:click="copyCastellModelModal(props.row)"
          >
            <i class="fa fa-copy"></i>
          </span>
        </a>
        <a>
          <span
            class="icon has-text-danger"
            v-on:click="deleteCastellModel(props.row)"
          >
            <i class="fa fa-times"></i>
          </span>
        </a>
      </b-table-column>
    </b-table>
    <b-modal
      v-model="isCopyModalActive"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-label="Copy castell"
      aria-modal
    >
      <template #default="props">
        <castell-copy-modal
          v-bind="copyProps"
          @close="props.close"
        ></castell-copy-modal>
      </template>
    </b-modal>
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
import CastellCopyModal from "../components/CastellCopyModal.vue";

import helper from "../api/dateTimeHelper";

export default {
  mixins: [castellMixin],
  components: { CastellCopyModal },
  data() {
    return {
      isCopyModalActive: false,
      copyProps: {
        originalName: "",
        originalUuid: "",
        newName: "",
      },
    };
  },
  computed: {
    ...mapState({
      castellTypes: (state) => state.castells.types,
      castellModels: (state) => state.castells.models,
      castellSort: (state) => state.castells.sort,
    }),
  },
  mounted() {
    this.getTypes();
    this.getModels();
  },
  methods: {
    ...mapActions({
      getTypes: "castells/getCastellsTypeList",
      getModels: "castells/getCastellModels",
    }),
    addCastellModel() {
      this.$router.push({ name: "CastellAdd" });
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
    copyCastellModelModal(castell) {
      this.isCopyModalActive = true;
      this.copyProps.originalName = castell.name;
      this.copyProps.originalUuid = castell.uuid;
      this.copyProps.newName = this.$t("castells.copyOf") + " " + castell.name;
    },
    formattedDate(event) {
      if (event && event.start) {
        return helper.extractDate(event.start);
      }
      return "";
    },
    onSort(field, order) {
      const sort = { field: field, order: order };
      this.$store.commit("castells/setSort", sort);
    },
  },
};
</script>
