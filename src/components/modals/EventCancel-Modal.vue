<template>
  <form action="" @submit.prevent="confirm">
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
      <section class="modal-card-body">
        <p class="content">{{ $t("events.cancelHelp") }}</p>
        <div class="field">
          <label class="label required">{{ $t("events.cancelReason") }}</label>
          <div class="control" v-for="choice in reasons" :key="choice">
            <label class="radio">
              <input
                type="radio"
                name="cancelReason"
                :value="choice"
                v-model="reason"
              />
              {{ $t("events.cancelReasons." + choice) }}
            </label>
          </div>
        </div>
        <div class="field">
          <label class="label">{{ $t("events.cancelNote") }}</label>
          <div class="control">
            <textarea
              class="textarea"
              rows="2"
              maxlength="500"
              v-model="note"
              :placeholder="$t('events.cancelNotePlaceholder')"
            ></textarea>
          </div>
        </div>
        <div class="field" v-if="offerNotify">
          <label class="checkbox">
            <input type="checkbox" v-model="notify" />
            {{ $t("events.deleteNotify") }}
          </label>
          <p class="help">{{ $t("events.cancelNotifyHelp") }}</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <o-button @click="$emit('close', { action: 'no' })">{{
          $t("events.cancelBack")
        }}</o-button>
        <o-button variant="danger" :disabled="!reason" @click="confirm">{{
          $t("events.cancelConfirm")
        }}</o-button>
      </footer>
    </div>
  </form>
</template>

<script>
// Reasons why an event is cancelled, as the API knows them.
const CANCEL_REASONS = ["weather", "technical", "other"];

// Asks why an event is cancelled: a reason among CANCEL_REASONS, an optional
// note, and whether the members are told by email. When confirmed, closes
// with { action: "yes", reason, note, notify }.
export default {
  props: {
    title: String,
    // Reason and note of an event that is already cancelled, to change them.
    initialReason: {
      type: String,
      default: "",
    },
    initialNote: {
      type: String,
      default: "",
    },
    // Members are only told about an event that is still to come.
    offerNotify: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      reasons: CANCEL_REASONS,
      reason: this.initialReason,
      note: this.initialNote,
      notify: true,
    };
  },
  methods: {
    confirm() {
      if (!this.reason) {
        return;
      }
      this.$emit("close", {
        action: "yes",
        reason: this.reason,
        note: this.note.trim(),
        notify: this.notify,
      });
    },
  },
};
</script>
