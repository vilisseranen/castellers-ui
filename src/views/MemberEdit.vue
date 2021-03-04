<template>
  <div>
    <edit-profile-form
      :user="user"
      v-on:editUser="editUser"
      v-on:deleteUser="removeUser"
    ></edit-profile-form>
    <div class="box" v-if="uuid === user.uuid">
      <p class="title is-3">
        {{ $t("members.changePassword") }}
      </p>
      <div class="columns">
        <div class="field column is-4">
          <label class="label">{{ $t("login.password") }}</label>
          <div class="control is-expanded">
            <input
              class="input"
              type="password"
              v-model="credentials.password"
            />
          </div>
        </div>
        <div class="field column is-4">
          <label class="label">{{ $t("login.passwordConfirm") }}</label>
          <div class="control is-expanded">
            <input
              class="input"
              type="password"
              v-bind:class="{ 'is-danger': passwordConfirmDifferent }"
              v-model="credentials.passwordConfirm"
            />
          </div>
        </div>
        <div class="field column is-4">
          <label class="label" style="color: white;">{{
            $t("members.changePassword")
          }}</label>
          <div class="control">
            <button
              type="submit"
              @click.prevent="changeMyPassword"
              class="button is-danger"
            >
              {{ $t("members.changePassword") }}
            </button>
          </div>
        </div>
      </div>
    </div>
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
      user: { roles: [], type: "member", language: "fr", subscribed: 0 }, // defaults are set here
      credentials: {}
    };
  },
  mounted() {
    this.loadUser(this.$route.params.uuid);
  },
  watch: {
    "$route.params.uuid": function(uuid) {
      this.loadUser(uuid);
    }
  },
  computed: {
    ...mapGetters(["uuid", "type"]),
    passwordConfirmDifferent() {
      if (
        this.credentials.passwordConfirm !== undefined &&
        this.credentials.passwordConfirm !== this.credentials.password
      ) {
        return true;
      }
      return false;
    }
  },
  methods: {
    ...mapActions({
      getMember: "members/getMember",
      editMember: "members/editMember",
      changePassword: "members/changePassword"
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
    },
    changeMyPassword(password) {
      var self = this;
      if (this.passwordConfirmDifferent) {
        this.$notifyNOK(this.$t("login.passwordDifferent"));
      } else {
        this.changePassword(this.credentials.password)
          .then(function() {
            self.$notifyOK(self.$t("login.passwordChanged"));
          })
          .catch(function() {
            self.$notifyNOK(self.$t("login.passwordResetError"));
          });
      }
    }
  }
};
</script>
<style></style>
