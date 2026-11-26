<template>
  <div>
    <p class="title is-5">{{ $t("eventTemplates.pageTitle") }}</p>
    <p class="mb-4">{{ $t("eventTemplates.pageIntro") }}</p>

    <p class="has-text-grey mb-4" v-if="loaded && !templates.length && !form">
      {{ $t("eventTemplates.empty") }}
    </p>

    <div class="event-template" v-for="t in templates" :key="t.uuid">
      <div v-if="!form || form.uuid !== t.uuid">
        <p>
          <strong>{{ t.title }}</strong>
        </p>
        <p class="is-size-7 has-text-grey">{{ summary(t) }}</p>
        <p class="event-template-description" v-if="t.description">
          {{ t.description }}
        </p>
        <div class="buttons are-small mt-2">
          <button
            type="button"
            class="button"
            :disabled="busy"
            @click="edit(t)"
          >
            {{ $t("eventTemplates.edit") }}
          </button>
          <button
            type="button"
            class="button is-danger is-light"
            :disabled="busy"
            @click="remove(t)"
          >
            {{ $t("eventTemplates.delete") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Form to edit a template or to create one -->
    <div class="box" v-if="form">
      <p class="subtitle is-6">
        {{
          form.uuid ? $t("eventTemplates.editing") : $t("eventTemplates.new")
        }}
      </p>
      <div class="field">
        <label class="label">{{ $t("eventTemplates.title") }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            maxlength="100"
            v-model="form.title"
          />
        </div>
        <p class="help">{{ $t("eventTemplates.titleHelp") }}</p>
      </div>
      <div class="field">
        <label class="label">{{ $t("eventTemplates.eventName") }}</label>
        <div class="control">
          <input class="input" type="text" v-model="form.name" />
        </div>
      </div>
      <div class="field">
        <label class="label">{{ $t("events.type") }}</label>
        <div class="control">
          <div class="select">
            <select v-model="form.type">
              <option v-for="type in types" :key="type" :value="type">
                {{ $t("events." + type) }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column">
          <div class="field">
            <label class="label">{{ $t("eventTemplates.startTime") }}</label>
            <div class="control">
              <input class="input" type="time" v-model="form.startTime" />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">{{ $t("eventTemplates.endTime") }}</label>
            <div class="control">
              <input class="input" type="time" v-model="form.endTime" />
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label">{{ $t("events.location") }}</label>
        <div class="control">
          <input class="input" type="text" v-model="form.locationName" />
        </div>
        <p class="help">{{ $t("eventTemplates.locationHelp") }}</p>
      </div>
      <div class="field">
        <label class="label">{{ $t("events.description") }}</label>
        <div class="control">
          <textarea
            class="textarea"
            rows="6"
            v-model="form.description"
          ></textarea>
        </div>
      </div>
      <div class="field">
        <label class="checkbox">
          <input type="checkbox" v-model="form.uniform" />
          {{ $t("events.uniformRequired") }}
        </label>
      </div>
      <div class="buttons">
        <button
          type="button"
          class="button is-info"
          :disabled="busy || !form.title.trim()"
          @click="save"
        >
          {{ $t("eventTemplates.save") }}
        </button>
        <button type="button" class="button" @click="form = null">
          {{ $t("general.cancel") }}
        </button>
      </div>
    </div>

    <button
      type="button"
      class="button is-info is-light mt-4"
      v-if="loaded && !form"
      @click="create"
    >
      {{ $t("eventTemplates.new") }}
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import templateHelper from "../api/eventTemplateHelper";
import { escapeHtml } from "../api/htmlHelper";
import ConfirmModal from "../components/modals/Confirm-Modal.vue";

// Start and end proposed for a new template: the usual hours of a practice.
const DEFAULT_START = "18:45";
const DEFAULT_END = "21:30";

export default {
  name: "event-templates-view",
  data() {
    return {
      templates: [],
      loaded: false,
      // The template being edited or created, or null.
      form: null,
      busy: false,
      types: ["practice", "presentation", "social", "music"],
    };
  },
  computed: {
    ...mapGetters(["type"]),
  },
  mounted() {
    if (this.type !== "admin") {
      this.$router.push({ name: "Events" });
      return;
    }
    this.load();
  },
  methods: {
    ...mapActions({
      getTemplates: "eventTemplates/getTemplates",
      createTemplate: "eventTemplates/createTemplate",
      updateTemplate: "eventTemplates/updateTemplate",
      deleteTemplate: "eventTemplates/deleteTemplate",
    }),
    fail(error) {
      const conflict = error.response && error.response.status === 409;
      this.$root.$notifyNOK(
        this.$t(
          conflict ? "eventTemplates.titleTaken" : "general.notifyFailure"
        )
      );
      console.log(error);
    },
    async load() {
      try {
        const response = await this.getTemplates();
        this.templates = response.data || [];
      } catch (error) {
        this.fail(error);
      } finally {
        this.loaded = true;
      }
    },
    hasTimes(template) {
      return template.startDate > 0 && template.endDate >= template.startDate;
    },
    // "Entraînement · Pratique · 18:45 – 21:30 · Collège Brébeuf"
    summary(template) {
      const parts = [];
      if (template.name) {
        parts.push(template.name);
      }
      parts.push(this.$t("events." + template.type));
      if (this.hasTimes(template)) {
        const start = templateHelper.timeOfDay(template.startDate);
        const end = templateHelper.timeOfDay(template.endDate);
        parts.push(`${start} – ${end}`);
      }
      if (template.locationName) {
        parts.push(template.locationName);
      }
      if (template.uniformRequired === 1) {
        parts.push(this.$t("events.uniform"));
      }
      return parts.join(" · ");
    },
    create() {
      this.form = {
        uuid: "",
        title: "",
        name: "",
        type: "practice",
        description: "",
        locationName: "",
        location: { lat: 0, lng: 0 },
        sampleDate: Math.trunc(Date.now() / 1000),
        startTime: DEFAULT_START,
        endTime: DEFAULT_END,
        uniform: false,
      };
    },
    edit(template) {
      const timed = this.hasTimes(template);
      this.form = {
        uuid: template.uuid,
        title: template.title,
        name: template.name,
        type: template.type,
        description: template.description,
        locationName: template.locationName,
        // The position on the map is kept as it is: it is set from an event.
        location: { ...template.location },
        sampleDate: timed ? template.startDate : Math.trunc(Date.now() / 1000),
        startTime: timed
          ? templateHelper.timeOfDay(template.startDate)
          : DEFAULT_START,
        endTime: timed
          ? templateHelper.timeOfDay(template.endDate)
          : DEFAULT_END,
        uniform: template.uniformRequired === 1,
      };
    },
    async save() {
      const form = this.form;
      const times = templateHelper.onDay(
        form.sampleDate,
        form.startTime,
        form.endTime
      );
      if (!times) {
        this.$root.$notifyNOK(this.$t("eventTemplates.timesInvalid"));
        return;
      }
      const template = {
        uuid: form.uuid,
        title: form.title.trim(),
        name: form.name.trim(),
        type: form.type,
        description: form.description,
        locationName: form.locationName.trim(),
        location: form.location,
        startDate: times.startDate,
        endDate: times.endDate,
        uniformRequired: form.uniform ? 1 : 0,
      };
      this.busy = true;
      try {
        if (template.uuid) {
          await this.updateTemplate(template);
        } else {
          await this.createTemplate(template);
        }
        this.form = null;
        this.$root.$notifyOK(this.$t("eventTemplates.saved"));
      } catch (error) {
        this.fail(error);
      } finally {
        this.busy = false;
      }
      await this.load();
    },
    async remove(template) {
      const modal = this.$oruga.modal.open({
        component: ConfirmModal,
        props: {
          // The modal renders its title as HTML.
          title: this.$t("eventTemplates.deleteConfirm", {
            title: escapeHtml(template.title),
          }),
          confirm: this.$t("general.yes"),
          cancel: this.$t("general.cancel"),
        },
      });
      const result = await modal.promise;
      if (!result || result.action !== "yes") {
        return;
      }
      this.busy = true;
      try {
        await this.deleteTemplate(template.uuid);
      } catch (error) {
        this.fail(error);
      } finally {
        this.busy = false;
      }
      await this.load();
    },
  },
};
</script>

<style scoped>
.event-template {
  padding: 0.75rem 0;
  border-bottom: 1px solid #ededed;
}
.event-template:empty {
  display: none;
}
.event-template-description {
  white-space: pre-line;
  margin-top: 0.35rem;
}
</style>
