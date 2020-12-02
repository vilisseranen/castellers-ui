<template>
  <div>
    <edit-profile-form
      :user="user"
      v-on:editUser="editUser"
      v-on:deleteUser="removeUser"
    ></edit-profile-form>
  </div>
</template>

<script>
import EditProfileForm from "../components/EditProfileForm.vue";
import { mapActions, mapGetters } from "vuex";
import { memberMixin } from "../mixins/members.js";

export default {
  mixins: [memberMixin],
  components: {
    EditProfileForm
  },
  data() {
    return {
      user: { roles: [], type: "member", language: "fr", subscribed: 0 } // defaults are set here
    };
  },
  mounted() {
    this.loadUser(this.$route.params.uuid);
  },
  computed: {
    ...mapGetters(["uuid", "type"])
  },
  methods: {
    ...mapActions({
      getEvent: "getEvent",
      getMember: "getMember",
      editMember: "editMember"
    }),
    editUser(user) {
      var self = this;
      self.updating = true;
      this.editMember(user)
        .then(function(response) {
          self.updating = false;
          self.$notifyOK(self.$t("members.notifySuccess"));
          // If changing own profile, update language settings
          if (response.data.uuid === self.uuid) {
            self.$root.setLocale(response.data.language);
          }
          if (!user.uuid) {
            self.$router.push({ path: `/memberEdit/${response.data.uuid}` });
            self.loadUser(response.data.uuid);
          }
        })
        .catch(function(error) {
          self.updating = false;
          self.$notifyNOK(self.$t("members.notifyFailure"));
          console.log(error);
        });
    },

    loadUser(uuid) {
      if (uuid) {
        var self = this;
        this.getMember(uuid)
          .then(function(response) {
            self.user = response.data;
          })
          .catch(err => console.log(err));
      }
    },
    removeUser(member) {
      var self = this;
      this.deleteUser(member)
        .then(function() {
          self.$router.push({ path: `/members` });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style></style>
