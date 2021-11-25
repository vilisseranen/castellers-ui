<template>
  <div style="margin-bottom: 10px">
    <b-field>
      <b-checkbox-button
        v-on:input="filterMembers"
        v-model="memberTypes"
        native-value="admin,member"
        type="is-success is-light is-outlined"
      >
        <span>{{ $t("members.memberTypePlural") }}</span>
      </b-checkbox-button>
      <b-checkbox-button
        v-on:input="filterMembers"
        v-model="memberTypes"
        native-value="guest"
        type="is-warning is-light is-outlined"
      >
        <span>{{ $t("members.guestTypePlural") }}</span>
      </b-checkbox-button>
    </b-field>

    <b-field>
      <b-checkbox-button
        v-on:input="filterMembers"
        v-model="memberStatuses"
        native-value="active"
        type="is-success is-light is-outlined"
      >
        <span>{{ $t("members.activeStatus") }}</span>
      </b-checkbox-button>
      <b-checkbox-button
        v-on:input="filterMembers"
        v-model="memberStatuses"
        native-value="created"
        type="is-info is-light is-outlined"
      >
        <span>{{ $t("members.createdStatus") }}</span>
      </b-checkbox-button>
      <b-checkbox-button
        v-on:input="filterMembers"
        v-model="memberStatuses"
        native-value="paused"
        type="is-warning is-light is-outlined"
      >
        <span>{{ $t("members.pausedStatus") }}</span>
      </b-checkbox-button>
      <b-checkbox-button
        v-on:input="filterMembers"
        v-model="memberStatuses"
        native-value="deleted"
        type="is-danger is-light is-outlined"
      >
        <span>{{ $t("members.deletedStatus") }}</span>
      </b-checkbox-button>
    </b-field>
  </div>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      required: true,
    },
    statuses: {
      type: Array,
      required: true,
    },
  },
  data: function () {
    return {
      memberTypes: this.types,
      memberStatuses: this.statuses,
    };
  },
  methods: {
    filterMembers() {
      this.$emit("input", {
        types: this.memberTypes,
        statuses: this.memberStatuses,
      });
    },
  },
};
</script>
