<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title" v-html="title" style="width: 100%"></p>
        <o-icon
          clickable
          native-type="button"
          pack="fa"
          icon="times"
          @click="$emit('close', { action: 'no', method: 'x' })"
        />
      </header>
      <section class="modal-card-body" v-if="checkboxLabel">
        <label class="checkbox">
          <input type="checkbox" v-model="checked" />
          {{ checkboxLabel }}
        </label>
        <p class="help" v-if="checkboxHelp">{{ checkboxHelp }}</p>
      </section>
      <footer class="modal-card-foot">
        <o-button @click="$emit('close', { action: 'no' })">{{
          cancel
        }}</o-button>
        <o-button
          variant="danger"
          @click="$emit('close', { action: 'yes', checked: checked })"
          >{{ confirm }}</o-button
        >
      </footer>
    </div>
  </form>
</template>

<script>
// Asks to confirm an action. An optional checkbox lets the user choose a
// variant of the action: its state comes back as `checked` when the action is
// confirmed.
export default {
  props: {
    title: String,
    confirm: String,
    cancel: String,
    checkboxLabel: {
      type: String,
      default: "",
    },
    checkboxHelp: {
      type: String,
      default: "",
    },
    checkboxChecked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checked: this.checkboxChecked,
    };
  },
};
</script>
