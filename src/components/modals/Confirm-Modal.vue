<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title" v-html="title" style="width: 100%"></p>
        <o-icon
          clickable
          native-type="button"
          icon="times"
          @click="$emit('close', { action: 'no', method: 'x' })"
        />
      </header>
      <footer class="modal-card-foot">
        <o-button @click="$emit('close', { action: 'no' })">{{
          cancel
        }}</o-button>
        <o-button variant="danger" @click="$emit('close', { action: 'yes' })">{{
          confirm
        }}</o-button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ["title", "confirm", "cancel"],
};
</script>
