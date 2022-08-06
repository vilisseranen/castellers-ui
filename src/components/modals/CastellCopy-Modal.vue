<template>
  <div>
    <form action="">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t("castells.copyTitle") }}</p>
          <button type="button" class="delete" @click="$emit('close')" />
        </header>
        <section class="modal-card-body">
          <o-field :label="$t('castells.originalName')">
            <o-input type="string" v-model="oName" disabled> </o-input>
          </o-field>
          <o-field :label="$t('castells.newName')">
            <o-input type="string" v-model="name" required> </o-input>
          </o-field>
        </section>
        <footer class="modal-card-foot">
          <o-button :label="$t('general.cancel')" @click="$emit('close')" />
          <o-button
            :label="$t('castells.copy')"
            type="is-info"
            @click="createCastell()"
          />
        </footer>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import notifications from "../../mixins/notifications";

export default {
  mixins: [notifications],
  props: {
    originalName: String,
    originalUuid: String,
    newName: String,
  },
  data() {
    return {
      name: this.newName,
      oName: this.originalName,
    };
  },
  methods: {
    ...mapActions({
      createCastellModel: "castells/editCastellModel",
      getCastellModel: "castells/getCastellModel",
    }),
    createCastell() {
      const self = this;
      this.getCastellModel(this.originalUuid)
        .then(function (response) {
          const newCastell = response.data;
          newCastell.uuid = undefined;
          newCastell.name = self.name;
          self
            .createCastellModel(newCastell)
            .then(function (response) {
              self.$notifyOK(self.$t("general.notifySuccess"));
              self.$emit("close");
              self.$router.push({ path: `/castellEdit/${response.data.uuid}` });
            })
            .catch(function (error) {
              console.log(error);
              self.$notifyNOK(self.$t("general.notifyFailure"));
            });
        })
        .catch(function (error) {
          console.log(error);
          self.$notifyNOK(self.$t("general.notifyFailure"));
        });
    },
  },
};
</script>
