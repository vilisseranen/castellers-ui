<template>
  <div>
    <div class="box">
      <p class="title is-3" v-if="actionLabel === 'update'">
        {{ $t("events.update") }}
      </p>
      <p class="title is-3" v-if="actionLabel === 'create'">
        {{ $t("events.create") }}
      </p>
      <div class="columns is-multiline">
        <div class="field column is-3" v-if="!readonly">
          <fieldset disabled>
            <label class="label">ID</label>
            <div class="control is-expanded">
              <input class="input" type="text" v-model="currentEvent.uuid" />
            </div>
          </fieldset>
        </div>
        <div class="field column is-7">
          <label class="label" v-bind:class="{ required: !readonly }">{{
            $t("general.name")
          }}</label>
          <div class="control is-expanded">
            <input
              :disabled="readonly ? true : false"
              class="input"
              type="text"
              :placeholder="$t('events.nameDescription')"
              v-model="currentEvent.name"
            />
          </div>
        </div>
        <div class="field column is-2">
          <label class="label" v-bind:class="{ required: !readonly }">{{
            $t("events.type")
          }}</label>
          <div class="control is-expanded">
            <PrettyRadio
              class="p-default p-curve"
              name="type"
              color="primary-o"
              value="practice"
              :disabled="readonly ? true : false"
              v-model="event.type"
              >{{ $t("events.practiceType") }}</PrettyRadio
            >
            <PrettyRadio
              class="p-default p-curve"
              name="type"
              color="warning-o"
              value="presentation"
              :disabled="readonly ? true : false"
              v-model="event.type"
              >{{ $t("events.presentationType") }}</PrettyRadio
            >
            <PrettyRadio
              class="p-default p-curve"
              name="type"
              color="success-o"
              value="social"
              :disabled="readonly ? true : false"
              v-model="event.type"
              >{{ $t("events.socialType") }}</PrettyRadio
            >
          </div>
        </div>
        <div class="field column is-6">
          <label class="label" v-bind:class="{ required: !readonly }">{{
            $t("events.start")
          }}</label>
          <div class="control is-expanded">
            <datetime
              :disabled="readonly ? true : false"
              input-id="startDate"
              type="datetime"
              v-model="startDateForCalendar"
              input-class="input"
              :minute-step="15"
            ></datetime>
          </div>
        </div>
        <div class="field column is-6">
          <label class="label" v-bind:class="{ required: !readonly }">{{
            $t("events.end")
          }}</label>
          <div class="control is-expanded">
            <datetime
              :disabled="readonly ? true : false"
              input-id="endDate"
              type="datetime"
              v-model="endDateForCalendar"
              input-class="input"
              :minute-step="15"
            ></datetime>
          </div>
        </div>
        <div class="field column is-2" v-if="currentEvent.uuid === undefined">
          <label class="label">{{ $t("events.recurringEvent") }}</label>
          <div class="field">
            <b-switch v-model="recurring" type="is-info"></b-switch>
          </div>
        </div>
        <div
          class="field column is-4"
          v-if="currentEvent.uuid === undefined && recurring"
        >
          <label class="label" v-bind:class="{ required: !readonly }">{{
            $t("events.interval")
          }}</label>
          <PrettyRadio
            class="p-default p-curve"
            name="interval"
            color="primary-o"
            value="1w"
            v-model="currentEvent.recurring.interval"
            >{{ $t("events.1w") }}</PrettyRadio
          >
          <PrettyRadio
            class="p-default p-curve"
            name="interval"
            color="info-o"
            value="1d"
            v-model="currentEvent.recurring.interval"
            >{{ $t("events.1d") }}</PrettyRadio
          >
        </div>
        <div
          class="field column is-6"
          v-if="currentEvent.uuid === undefined && recurring"
        >
          <label class="label" v-bind:class="{ required: !readonly }">{{
            $t("events.until")
          }}</label>
          <datetime
            type="datetime"
            v-model="untilDateForCalendar"
            input-class="input"
            input-id="until"
            :minute-step="15"
          ></datetime>
        </div>
        <div class="column is-12">
          <div class="columns">
            <div
              class="field is-6 column"
              v-if="(readonly && event.locationName) || !readonly"
            >
              <label class="label" v-bind:class="{ note: !readonly }">{{
                $t("events.location")
              }}</label>
              <div class="control is-expanded" style="margin-bottom: 10px">
                <input
                  :disabled="readonly ? true : false"
                  class="input"
                  type="text"
                  :placeholder="$t('events.locationDescription')"
                  v-model="currentEvent.locationName"
                />
              </div>
              <l-map
                :zoom="zoom"
                :center="currentEvent.location"
                @click="setLocation"
                style="height: 400px; margin: 0; z-index: 0"
              >
                <l-tile-layer
                  :url="url"
                  :attribution="attribution"
                ></l-tile-layer>
                <l-marker :lat-lng="currentEvent.location"></l-marker>
              </l-map>
            </div>
            <div class="field is-6 column">
              <label class="label">{{ $t("events.description") }}</label>
              <div class="control is-expanded" style="margin-bottom: 10px">
                <textarea
                  :disabled="readonly ? true : false"
                  class="textarea"
                  type="text"
                  :placeholder="$t('events.descriptionDescription')"
                  v-model="currentEvent.description"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-12 column" v-if="!readonly">
          <div class="field-body">
            <div class="field">
              <p class="control">
                <button
                  type="submit"
                  class="button is-info"
                  @click.prevent="eventEdit"
                  v-if="actionLabel === 'update'"
                >
                  {{ $t("events.updateButton") }}
                </button>
                <button
                  type="submit"
                  class="button is-info"
                  @click.prevent="eventEdit"
                  v-if="actionLabel === 'create'"
                >
                  {{ $t("events.createButton") }}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!readonly">
        <hr />
        <div>
          <span class="required"></span>
          {{ $t("general.requiredFields") }}
        </div>
        <div>
          <span class="note"></span>
          {{ $t("events.noteLocation") }}
        </div>
      </div>
      <b-loading
        :is-full-page="true"
        :active.sync="isLoading"
        :can-cancel="false"
      ></b-loading>
    </div>
    <div class="box" v-if="this.type === 'admin' && this.event.uuid">
      <label class="label"
        >{{
          $t("events.presentRegistered").replace(/^\w/, (c) => c.toUpperCase())
        }}
        ({{ this.countPresent() }} / {{ this.countRegistered() }})</label
      >
      <span class="has-text-weight-bold">{{ $t("events.filterMembers") }}</span>
      <b-field grouped group-multiline>
        <div v-for="(column, index) in filters" :key="index" class="control">
          <b-checkbox v-model="column.display">
            {{ column.title }}
          </b-checkbox>
        </div>
      </b-field>

      <b-table
        :data="this.participation"
        ref="table"
        :default-sort="['participation', 'asc']"
        icon-pack="fas"
        :row-class="
          (row, index) =>
            (row.presence === 'yes' && !filters.present.display) ||
            (row.presence === 'no' && !filters.absent.display) ||
            (row.participation === 'yes' &&
              !filters.participationYes.display) ||
            (row.participation === 'no' && !filters.participationNo.display)
              ? 'is-hidden'
              : ''
        "
      >
        <b-table-column
          v-slot="props"
          field="name"
          :label="participationColumns['name']"
        >
          {{ props.row.firstName }} {{ props.row.lastName }}
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="roles"
          :label="participationColumns['roles']"
        >
          {{ props.row.roles }}
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="participation"
          :label="participationColumns['participation']"
          sortable
        >
          <div class="tags">
            <span
              class="tag is-success"
              v-if="props.row.participation == 'yes'"
              >{{ $t("events.participationYes") }}</span
            >
            <span
              class="tag is-danger"
              v-if="props.row.participation == 'no'"
              >{{ $t("events.participationNo") }}</span
            >
          </div>
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="presence"
          :label="participationColumns['presence']"
          sortable
        >
          <div class="tags">
            <span class="tag is-success" v-if="props.row.presence == 'yes'">{{
              $t("members.present")
            }}</span>
            <span class="tag is-danger" v-if="props.row.presence == 'no'">{{
              $t("members.absent")
            }}</span>
          </div>
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="setPresence"
          :label="participationColumns['setPresence']"
          centered
          width="50"
        >
          <a v-on:click="presence(currentEvent.uuid, props.row.uuid, 'yes')">
            <span class="icon">
              <i class="fas fa-check has-text-success"></i>
            </span>
          </a>
          <a v-on:click="presence(currentEvent.uuid, props.row.uuid, 'no')">
            <span class="icon">
              <i class="fas fa-times has-text-danger"></i>
            </span>
          </a>
          <a v-on:click="presence(currentEvent.uuid, props.row.uuid, '')">
            <span class="icon">
              <i class="fas fa-minus has-text-info"></i>
            </span>
          </a>
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Datetime } from "vue-datetime";
import PrettyRadio from "pretty-checkbox-vue/radio";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

import "vue-datetime/dist/vue-datetime.css";
import "pretty-checkbox/dist/pretty-checkbox.min.css";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const L = window.L;

export default {
  props: {
    readonly: Boolean,
  },
  components: {
    Datetime,
    PrettyRadio,
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    const s = new Date(Date.now());
    s.setDate(s.getDate() + ((4 + 7 - s.getDay()) % 7)); // next thursday
    s.setHours(18, 45); // at 6:45PM
    const e = new Date(s);
    e.setHours(21, 30);
    const table = {
      data: [],
    };
    return {
      event: {
        startDate: Math.trunc(s.valueOf() / 1000),
        endDate: Math.trunc(e.valueOf() / 1000),
        recurring: {
          interval: "1w",
          until: 0,
        },
        type: "practice",
        location: {
          // defaults to college Brebeuf
          lat: 45.50073714334654,
          lng: -73.6241186484186,
        },
        locationName: "",
        description: "",
      }, // defaults are set here
      isLoading: false,
      table,
      displayAllMembers: false,
      recurring: false,
      // map
      zoom: 16,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      participationColumns: {
        name: this.$t("general.name"),
        roles: this.$t("members.roles"),
        participation: this.$t("members.participation"),
        presence: this.$t("members.presence"),
        setPresence: this.$t("members.setPresence"),
      },
      filters: {
        present: { title: this.$t("members.present"), display: true },
        absent: { title: this.$t("members.absent"), display: true },
        participationYes: {
          title: this.$t("events.participationYes"),
          display: true,
        },
        participationNo: {
          title: this.$t("events.participationNo"),
          display: true,
        },
      },
      participation: [],
    };
  },
  watch: {
    recurring: function (val) {
      if (val) {
        this.currentEvent.recurring.until = this.currentEvent.startDate;
      } else {
        this.currentEvent.recurring.until = 0;
      }
    },
  },
  mounted() {
    this.loadEvent(this.$route.params.uuid);
    this.listParticipants(this.$route.params.uuid);
  },
  computed: {
    ...mapGetters(["uuid", "type"]),
    columns: function () {
      return ["participant_name", "roles", "participation"];
    },
    actionLabel: function () {
      return this.event.uuid ? "update" : "create";
    },
    currentEvent: {
      get: function () {
        return this.event;
      },
      set: function (newUuid) {
        this.currentEvent.uuid = newUuid;
      },
    },
    startDateForCalendar: {
      get: function () {
        return this.dateToCalendar(this.currentEvent.startDate);
      },
      set: function (newDate) {
        this.currentEvent.startDate = this.dateFromCalendar(newDate);
        if (this.currentEvent.startDate > this.currentEvent.endDate) {
          this.endDateForCalendar = newDate;
        }
        if (
          this.recurring &&
          this.currentEvent.startDate > this.currentEvent.recurring.until
        ) {
          this.untilDateForCalendar = newDate;
        }
      },
    },
    endDateForCalendar: {
      get: function () {
        return this.dateToCalendar(this.currentEvent.endDate);
      },
      set: function (newDate) {
        this.currentEvent.endDate = this.dateFromCalendar(newDate);
      },
    },
    untilDateForCalendar: {
      get: function () {
        return this.dateToCalendar(this.currentEvent.recurring.until);
      },
      set: function (newDate) {
        this.currentEvent.recurring.until = this.dateFromCalendar(newDate);
      },
    },
  },
  methods: {
    ...mapActions({
      getEventParticipation: "events/getEventParticipation",
      getEvent: "events/getEvent",
      editEvent: "events/editEvent",
      presenceEvent: "events/presenceEvent",
    }),
    // map
    setLocation(event) {
      if (!this.readonly) {
        this.currentEvent.location = L.latLng(
          event.latlng.lat,
          event.latlng.lng
        );
      }
    },
    dateFromCalendar(dateToConvert) {
      if (dateToConvert) {
        const date = new Date(dateToConvert);
        return Math.trunc(date.getTime() / 1000);
      } else {
        return 0;
      }
    },
    dateToCalendar(dateToConvert) {
      if (dateToConvert) {
        const date = new Date(dateToConvert * 1000);
        return date.toISOString();
      } else {
        return "";
      }
    },
    eventEdit() {
      const self = this;
      self.isLoading = true;
      this.editEvent(self.currentEvent)
        .then(function (response) {
          self.isLoading = false;
          if (!self.event.uuid) {
            self.$router.push({ path: `/eventEdit/${response.data.uuid}` });
            self.loadEvent(response.data.uuid);
          }
          self.$notifyOK(self.$t("events.notify_success"));
        })
        .catch(function (error) {
          self.isLoading = false;
          self.$notifyNOK(self.$t("events.notify_error"));
          console.log(error);
        });
    },
    loadEvent(uuid) {
      if (uuid) {
        const self = this;
        this.getEvent(uuid)
          .then(function (response) {
            // If locationName is not set, use default coordinates
            if (response.data.locationName === "") {
              response.data.location = self.event.location;
            }
            self.event = response.data;
          })
          .catch((err) => console.log(err));
      }
    },
    listParticipants(eventUuid) {
      if (eventUuid && this.type === "admin") {
        const self = this;
        this.getEventParticipation(eventUuid)
          .then(function (response) {
            self.participation = response.data;
            for (let i = 0; i < self.participation.length; i++) {
              self.participation[i].roles = self.participation[i].roles
                .sort()
                .join(", ");
            }
          })
          .catch((err) => console.log(err));
      }
    },
    countRegistered() {
      return this.participation.filter(
        (member) => member.participation === "yes"
      ).length;
    },
    countPresent() {
      return this.participation.filter((member) => member.presence === "yes")
        .length;
    },
    presence(eventUuid, memberUuid, presence) {
      const self = this;
      this.presenceEvent({ eventUuid, memberUuid, presence }).then(function (
        response
      ) {
        self.listParticipants(eventUuid);
      });
    },
  },
};
</script>
