<template>
  <div class="box event-templates">
    <!-- Start from a template, when creating an event -->
    <div class="field" v-if="creating && templates.length">
      <label class="label">{{ $t("eventTemplates.startFrom") }}</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select
            :value="selectedUuid"
            :aria-label="$t('eventTemplates.startFrom')"
            @change="choose($event.target)"
          >
            <option value="">{{ $t("eventTemplates.none") }}</option>
            <option v-for="t in templates" :key="t.uuid" :value="t.uuid">
              {{ t.title }}
            </option>
          </select>
        </div>
      </div>
      <p class="help">{{ $t("eventTemplates.startFromHelp") }}</p>
    </div>

    <!-- Save the values of the form as a template -->
    <div v-if="saving">
      <label class="label">{{ $t("eventTemplates.title") }}</label>
      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            class="input"
            type="text"
            maxlength="100"
            v-model="title"
            :placeholder="$t('eventTemplates.titlePlaceholder')"
            @keydown.enter.prevent="save"
          />
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-info"
            :disabled="busy || !title.trim()"
            @click="save"
          >
            {{ $t("eventTemplates.save") }}
          </button>
        </div>
      </div>
      <p class="help">{{ $t("eventTemplates.saveHelp") }}</p>
    </div>

    <p class="event-templates-links">
      <a role="button" v-if="!saving" @click="startSaving">{{
        $t("eventTemplates.saveAs")
      }}</a>
      <a role="button" v-else @click="saving = false">{{
        $t("general.cancel")
      }}</a>
      <router-link :to="{ name: 'EventTemplates' }">{{
        $t("eventTemplates.manage")
      }}</router-link>
    </p>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import templateHelper from "../api/eventTemplateHelper";
import { escapeHtml } from "../api/htmlHelper";
import ConfirmModal from "./modals/Confirm-Modal.vue";

// Templates in the form of an event: choosing one fills the form, and the
// values of the form can be saved as a template. The component never changes
// the event itself: it emits "apply" with the fields to set.
export default {
  name: "event-template-picker-component",
  props: {
    // The event of the form.
    event: {
      type: Object,
      required: true,
    },
    // True when the event is being created: templates are only proposed then.
    creating: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["apply"],
  data() {
    return {
      templates: [],
      selectedUuid: "",
      saving: false,
      title: "",
      busy: false,
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    ...mapActions({
      getTemplates: "eventTemplates/getTemplates",
      createTemplate: "eventTemplates/createTemplate",
      updateTemplate: "eventTemplates/updateTemplate",
    }),
    async load() {
      try {
        const response = await this.getTemplates();
        this.templates = response.data || [];
      } catch (error) {
        // Without templates, the form works as before.
        console.log(error);
      }
    },
    async confirm(title) {
      const modal = this.$oruga.modal.open({
        component: ConfirmModal,
        props: {
          title,
          confirm: this.$t("general.yes"),
          cancel: this.$t("general.cancel"),
        },
      });
      const result = await modal.promise;
      return Boolean(result) && result.action === "yes";
    },
    // A template was picked in the list.
    async choose(select) {
      const uuid = select.value;
      const template = this.templates.find((t) => t.uuid === uuid);
      if (!template) {
        this.selectedUuid = "";
        return;
      }
      // The modal renders its title as HTML.
      if (
        templateHelper.hasTypedValues(this.event) &&
        !(await this.confirm(
          this.$t("eventTemplates.overwriteForm", {
            title: escapeHtml(template.title),
          })
        ))
      ) {
        select.value = this.selectedUuid;
        return;
      }
      this.selectedUuid = uuid;
      this.$emit("apply", templateHelper.fieldsFor(this.event, template));
    },
    startSaving() {
      const selected = this.templates.find((t) => t.uuid === this.selectedUuid);
      this.title = selected ? selected.title : this.event.name || "";
      this.saving = true;
    },
    // Saves the values of the form as a template. A template that already has
    // this title is replaced, after confirmation.
    async save() {
      const title = this.title.trim();
      if (!title || this.busy) {
        return;
      }
      const template = templateHelper.fromEvent(this.event, title);
      const existing = templateHelper.findByTitle(this.templates, title);
      if (
        existing &&
        !(await this.confirm(
          this.$t("eventTemplates.overwriteTemplate", {
            title: escapeHtml(existing.title),
          })
        ))
      ) {
        return;
      }
      this.busy = true;
      try {
        if (existing) {
          await this.updateTemplate({ ...template, uuid: existing.uuid });
        } else {
          await this.createTemplate(template);
        }
        this.saving = false;
        this.$root.$notifyOK(this.$t("eventTemplates.saved"));
      } catch (error) {
        const conflict = error.response && error.response.status === 409;
        this.$root.$notifyNOK(
          this.$t(
            conflict ? "eventTemplates.titleTaken" : "general.notifyFailure"
          )
        );
        console.log(error);
      } finally {
        this.busy = false;
      }
      await this.load();
    },
  },
};
</script>

<style scoped>
.event-templates {
  margin-bottom: 1.5rem;
}
.event-templates-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
}
</style>
