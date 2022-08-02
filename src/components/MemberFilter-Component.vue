<template>
  <div style="margin-bottom: 10px">
    <div class="field">
      <o-checkbox
        @change="filterMembers"
        v-model="memberTypes"
        nativeValue="admin,member"
        variant="success"
      >
        <span>{{ $t("members.memberTypePlural") }}</span>
      </o-checkbox>
      <o-checkbox
        @change="filterMembers"
        v-model="memberTypes"
        nativeValue="guest"
        variant="warning"
      >
        <span>{{ $t("members.guestTypePlural") }}</span>
      </o-checkbox>
    </div>

    <div class="field">
      <o-checkbox
        @change="filterMembers"
        v-model="memberStatuses"
        native-value="active"
        variant="success"
      >
        <span>{{ $t("members.activeStatusPlural") }}</span>
      </o-checkbox>
      <o-checkbox
        @change="filterMembers(types, statuses)"
        v-model="memberStatuses"
        native-value="created"
        variant="info"
      >
        <span>{{ $t("members.createdStatusPlural") }}</span>
      </o-checkbox>
      <o-checkbox
        @change="filterMembers"
        v-model="memberStatuses"
        native-value="paused"
        variant="warning"
      >
        <span>{{ $t("members.pausedStatusPlural") }}</span>
      </o-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["filterMembers"],
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
      var memberTypes = this.memberTypes;
      var memberStatuses = this.memberStatuses;
      this.$emit("filterMembers", {
        types: memberTypes,
        statuses: memberStatuses,
      });
    },
  },
};
</script>
