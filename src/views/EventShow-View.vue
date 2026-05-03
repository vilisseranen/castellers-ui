<template>
  <div>
    <o-field v-if="type === 'admin'">
      <router-link
        class="button is-info"
        :to="{ name: 'eventEdit', params: { uuid: $route.params.uuid } }"
      >
        {{ $t("events.editEvent") }}
      </router-link>
    </o-field>
    <event-edit readonly></event-edit>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventEdit from "../components/EventEdit-Component.vue";

export default {
  components: { EventEdit },
  computed: {
    ...mapGetters(["type"]),
  },
};
</script>
