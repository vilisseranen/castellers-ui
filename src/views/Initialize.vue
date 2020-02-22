<template>
  <div>
    <edit-profile-form
      :user="user"
      v-on:editUser="initializeApp"
    ></edit-profile-form>
  </div>
</template>
<script>
import EditProfileForm from "../components/EditProfileForm.vue";
import axios from "axios";

export default {
  components: {
    EditProfileForm
  },
  data() {
    var self = this;
    var initialized = true;
    var updating = false;
    var user = { roles: [], type: "admin", language: "fr" };
    axios.get("/api/initialize").then(function(response) {
      if (response.status === 204) {
        self.initialized = false;
      } else {
        self.$router.push("login");
      }
    });
    return {
      user,
      initialized,
      updating
    };
  },
  methods: {
    initializeApp(user) {
      var self = this;
      self.updating = true;
      axios.post("/api/initialize", user).then(function(response) {
        self.updating = false;
        self.user = response.data;
        if (response.status === 201) {
          self.$notifyOK(
            "The application is now initialized ! You will receive an email with your infos."
          );
        } else {
          self.updating = false;
          self.$notifyNOK(
            "There was an error during the application initialization."
          );
        }
      });
    }
  }
};
</script>
<style></style>
