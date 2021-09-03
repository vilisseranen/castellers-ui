<template>
  <div>
    <form action="">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t("castells.copyTitle") }}</p>
          <button type="button" class="delete" @click="$emit('close')" />
        </header>
        <section class="modal-card-body">
          <b-field :label="$t('castells.originalName')">
            <b-input type="string" :value="originalName" disabled> </b-input>
          </b-field>
          <b-field :label="$t('castells.newName')">
            <b-input type="string" v-model="name" required> </b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <b-button :label="$t('general.cancel')" @click="$emit('close')" />
          <b-button
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

export default {
  props: {
    originalName: String,
    originalUuid: String,
    newName: String,
  },
  data() {
    return {
      name: this.newName,
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
