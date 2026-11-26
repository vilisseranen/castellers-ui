import api from "../api/castellers";
import ConfirmModal from "../components/modals/Confirm-Modal.vue";
import EventCancelModal from "../components/modals/EventCancel-Modal.vue";
import { escapeHtml } from "../api/htmlHelper";

// Title of a modal about an event: the question, then the event and its day.
// The modals render their title as HTML.
function modalTitle(question, event) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(event.startDate * 1000);
  const startDate = Intl.DateTimeFormat("fr-FR", options).format(date);
  return (
    question + " <b>" + escapeHtml(event.name) + "</b> (" + startDate + ")"
  );
}

export const eventMixin = {
  methods: {
    // Asks why, then cancels the event: it stays listed, as cancelled. Also
    // changes the reason of an event that is already cancelled. Resolves with
    // true when the event was cancelled, false when the admin gave up.
    async cancelEvent(event) {
      const alreadyCancelled = event.cancelled === 1;
      // Members are only told about an event that is still to come, and only
      // once: not again when the reason changes.
      const upcoming = event.startDate * 1000 > Date.now();
      const modal = this.$oruga.modal.open({
        component: EventCancelModal,
        props: {
          title: modalTitle(this.$t("events.confirmCancel"), event),
          initialReason: event.cancelReason || "",
          initialNote: event.cancelNote || "",
          offerNotify: upcoming && !alreadyCancelled,
        },
      });
      const result = await modal.promise;
      if (!result || result.action !== "yes") {
        return false;
      }
      await api.cancelEvent(
        event.uuid,
        { reason: result.reason, note: result.note },
        !upcoming || result.notify !== false
      );
      return true;
    },
    // Puts a cancelled event back. Resolves with true when it was restored,
    // false when the admin gave up.
    async restoreEvent(event) {
      const upcoming = event.startDate * 1000 > Date.now();
      const props = {
        title: modalTitle(this.$t("events.confirmRestore"), event),
        confirm: this.$t("general.yes"),
        cancel: this.$t("general.cancel"),
      };
      if (upcoming) {
        props.checkboxLabel = this.$t("events.deleteNotify");
        props.checkboxHelp = this.$t("events.restoreNotifyHelp");
        props.checkboxChecked = true;
      }
      const modal = this.$oruga.modal.open({ component: ConfirmModal, props });
      const result = await modal.promise;
      if (!result || result.action !== "yes") {
        return false;
      }
      await api.restoreEvent(event.uuid, !upcoming || result.checked !== false);
      return true;
    },
    async deleteEvent(event) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const date = new Date(event.startDate * 1000);
      const startDate = Intl.DateTimeFormat("fr-FR", options).format(date);
      // Members are only told about the deletion of an event that is still to
      // come: the choice is only offered then.
      const upcoming = event.startDate * 1000 > Date.now();
      const props = {
        // The modal renders its title as HTML.
        title:
          this.$t("events.confirmDelete") +
          " <b>" +
          escapeHtml(event.name) +
          "</b> (" +
          startDate +
          ")",
        confirm: this.$t("general.yes"),
        cancel: this.$t("general.cancel"),
      };
      if (upcoming) {
        props.checkboxLabel = this.$t("events.deleteNotify");
        props.checkboxHelp = this.$t("events.deleteNotifyHelp");
        props.checkboxChecked = true;
      }
      const modalPromise = this.$oruga.modal.open({
        component: ConfirmModal,
        props,
      });
      const result = await modalPromise.promise;
      return new Promise((resolve, reject) => {
        if (result.action == "yes") {
          const notify = !upcoming || result.checked !== false;
          api
            .deleteEvent(event.uuid, notify)
            .then(function () {
              resolve();
            })
            .catch(function (err) {
              reject(err);
            });
        }
        resolve();
      });
    },
  },
};
