<template>
  <div>
    <edit-profile-form
      :user="user"
      v-on:editUser="initializeApp"
    ></edit-profile-form>
  </div>
</template>
<script>
import EditProfileForm from "../components/EditProfileForm-Component.vue";
import { mapActions } from "vuex";

export default {
  components: {
    EditProfileForm,
  },
  data() {
    const self = this;
    const initialized = true;
    const updating = false;
    const user = { roles: [], type: "admin", language: "fr" };
    this.getInitialize().then(function (response) {
      if (response.status === 204) {
        self.initialized = false;
      } else {
        self.$router.push("login");
      }
    });
    return {
      user,
      initialized,
      updating,
    };
  },
  methods: {
    ...mapActions({
      getInitialize: "initialization/getInitialize",
      initialize: "initialization/initialize",
    }),
    initializeApp(user) {
      const self = this;
      self.updating = true;
      this.initialize(user).then(function (response) {
        self.updating = false;
        self.user = response.data;
        if (response.status === 201) {
          self.$root.$notifyOK(
            "The application is now initialized ! You will receive an email with your infos."
          );
        } else {
          self.updating = false;
          self.$root.$notifyNOK(
            "There was an error during the application initialization."
          );
        }
      });
    },
  },
};
</script>
<style></style>
