<template>
  <badges-component :memberUuid="uuid" />
</template>

<script>
import { mapGetters } from "vuex";
import BadgesComponent from "../components/Badges-Component.vue";

export default {
  name: "my-badges-view",
  components: {
    BadgesComponent,
  },
  computed: {
    ...mapGetters(["uuid"]),
  },
  mounted() {
    if (!this.uuid) {
      this.$router.push({ name: "Login" });
    }
  },
};
</script>
