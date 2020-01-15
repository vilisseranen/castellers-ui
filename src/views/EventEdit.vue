<template>
  <div class="box">
    <p class="title is-3" v-if="actionLabel==='update'">{{ $t('events.update') }}</p>
    <p class="title is-3" v-if="actionLabel==='create'">{{ $t('events.create') }}</p>
    <div class="columns is-multiline">
      <div class="field column is-3">
        <fieldset disabled>
          <label class="label">ID</label>
          <div class="control is-expanded">
            <input class="input" type="text" v-model="currentEvent.uuid" />
          </div>
        </fieldset>
      </div>
      <div class="field column is-7">
        <label class="label required">{{$t('events.name')}}</label>
        <div class="control is-expanded">
          <input
            class="input"
            type="text"
            :placeholder="$t('events.nameDescription')"
            v-model="currentEvent.name"
          />
        </div>
      </div>
      <div class="field column is-2">
        <label class="label required">{{$t('events.type')}}</label>
        <div class="control is-expanded">
          <PrettyRadio
            class="p-default p-curve"
            name="type"
            color="primary-o"
            value="practice"
            v-model="event.type"
          >{{ $t('events.practiceType') }}</PrettyRadio>
          <PrettyRadio
            class="p-default p-curve"
            name="type"
            color="warning-o"
            value="presentation"
            v-model="event.type"
          >{{ $t('events.presentationType') }}</PrettyRadio>
        </div>
      </div>
      <div class="field column is-6">
        <label class="label required">{{$t('events.start')}}</label>
        <div class="control is-expanded">
          <datetime
            input-id="startDate"
            type="datetime"
            v-model="startDateForCalendar"
            input-class="input"
            :minute-step="15"
          ></datetime>
        </div>
      </div>
      <div class="field column is-6">
        <label class="label required">{{$t('events.end')}}</label>
        <div class="control is-expanded">
          <datetime
            input-id="endDate"
            type="datetime"
            v-model="endDateForCalendar"
            input-class="input"
            :minute-step="15"
          ></datetime>
        </div>
      </div>
      <div class="field column is-2" v-if="currentEvent.uuid === undefined">
        <label class="label">{{$t('events.recurringEvent')}}</label>
        <div class="field">
          <b-switch v-model="recurring" type="is-info"></b-switch>
        </div>
      </div>
      <div class="field column is-4" v-if="currentEvent.uuid === undefined && recurring">
        <label class="label required">{{$t('events.interval')}}</label>
        <PrettyRadio
          class="p-default p-curve"
          name="interval"
          color="primary-o"
          value="1w"
          v-model="currentEvent.recurring.interval"
        >{{ $t('events.1w') }}</PrettyRadio>
        <PrettyRadio
          class="p-default p-curve"
          name="interval"
          color="info-o"
          value="1d"
          v-model="currentEvent.recurring.interval"
        >{{ $t('events.1d') }}</PrettyRadio>
      </div>
      <div class="field column is-6" v-if="currentEvent.uuid === undefined && recurring">
        <label class="label required">{{$t('events.until')}}</label>
        <datetime
          type="datetime"
          v-model="untilDateForCalendar"
          input-class="input"
          input-id="until"
          :minute-step="15"
        ></datetime>
      </div>
      <div class="field is-12 column">
        <div class="field-body">
          <div class="field">
            <p class="control">
              <button
                type="submit"
                class="button is-info"
                @click.prevent="eventEdit"
                v-if="actionLabel==='update'">
              {{ $t('events.updateButton') }}</button>
              <button
                type="submit"
                class="button is-info"
                @click.prevent="eventEdit"
                v-if="actionLabel==='create'">
              {{ $t('events.createButton') }}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div>
      <span class="required"></span>
      {{ $t('general.requiredFields') }}
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { Datetime } from 'vue-datetime'
import PrettyRadio from 'pretty-checkbox-vue/radio'

import 'vue-datetime/dist/vue-datetime.css'
import 'pretty-checkbox/dist/pretty-checkbox.min.css'

export default {
  components: {
    Datetime,
    PrettyRadio
  },
  data () {
    var s = new Date(Date.now())
    s.setDate(s.getDate() + (4 + 7 - s.getDay()) % 7) // next thursday
    s.setHours(18, 45) // at 6:45PM
    var e = new Date(s)
    e.setHours(21, 30)
    var table = {
      data: []
    }
    return {
      event: {
        'startDate': Math.trunc(s.valueOf() / 1000),
        'endDate': Math.trunc(e.valueOf() / 1000),
        'recurring': {
          'interval': '1w',
          'until': 0
        },
        'type': 'practice'
      }, // defaults are set here
      isLoading: false,
      table,
      displayAllMembers: false,
      recurring: false
    }
  },
  watch: {
    recurring: function (val) {
      if (val) {
        this.currentEvent.recurring.until = this.currentEvent.startDate
      } else {
        this.currentEvent.recurring.until = 0
      }
    }
  },
  mounted () {
    this.loadEvent(this.$route.params.uuid)
    this.listParticipants(this.$route.params.uuid)
  },
  computed: {
    ...mapGetters(['uuid', 'code', 'type']),
    columns: function () {
      return ['participant_name', 'roles', 'participation']
    },
    actionLabel: function () {
      return this.event.uuid ? 'update' : 'create'
    },

    currentEvent: {
      get: function () {
        return this.event
      },
      set: function (newUuid) {
        this.currentEvent.uuid = newUuid
      }
    },
    startDateForCalendar: {
      get: function () {
        return this.dateToCalendar(this.currentEvent.startDate)
      },
      set: function (newDate) {
        this.currentEvent.startDate = this.dateFromCalendar(newDate)
        if (this.currentEvent.startDate > this.currentEvent.endDate) {
          this.endDateForCalendar = newDate
        }
        if (this.recurring && this.currentEvent.startDate > this.currentEvent.recurring.until) {
          this.untilDateForCalendar = newDate
        }
      }
    },
    endDateForCalendar: {
      get: function () {
        return this.dateToCalendar(this.currentEvent.endDate)
      },
      set: function (newDate) {
        this.currentEvent.endDate = this.dateFromCalendar(newDate)
      }
    },
    untilDateForCalendar: {
      get: function () {
        return this.dateToCalendar(this.currentEvent.recurring.until)
      },
      set: function (newDate) {
        this.currentEvent.recurring.until = this.dateFromCalendar(newDate)
      }
    },
    selectDateLabel: function () {
      return this.$t('events.selectDate')
    }
  },
  methods: {
    dateFromCalendar (dateToConvert) {
      if (dateToConvert) {
        var date = new Date(dateToConvert)
        return Math.trunc(date.getTime() / 1000)
      } else {
        return 0
      }
    },
    dateToCalendar (dateToConvert) {
      if (dateToConvert) {
        var date = new Date(dateToConvert * 1000)
        return date.toISOString()
      } else {
        return ''
      }
    },
    eventEdit () {
      var self = this
      self.isLoading = true
      if (self.currentEvent.uuid !== undefined) {
        var url = `/api/admins/${self.uuid}/events/${this.currentEvent.uuid}`
        axios.put(
          url,
          this.currentEvent,
          { headers: { 'X-Member-Code': this.code } }
        ).then(function (response) {
          self.isLoading = false
          self.$notifyOK(self.$t('events.notify_success'))
          self.$emit('updatePractice', response.data.uuid)
        }).catch(function (error) {
          self.isLoading = false
          self.$notifyNOK(self.$t('events.notify_error'))
          console.log(error)
        })
      } else {
        axios.post(
          `/api/admins/${this.uuid}/events`,
          this.currentEvent,
          { headers: { 'X-Member-Code': this.code } }
        ).then(function (response) {
          self.isLoading = false
          self.$notifyOK(self.$t('events.notify_success'))
          self.$emit('updatePractice', response.data.uuid)
        }).catch(function (error) {
          self.isLoading = false
          self.$notifyNOK(self.$t('events.notify_error'))
          console.log(error)
        })
      }
    },
    countParticipants (participation) {
      return this.table.data.filter(participant => participant.participation === participation).length
    },
    loadEvent (uuid) {
      if (uuid) {
        var self = this
        var url = `/api/events/${uuid}`
        axios.get(
          url, { headers: { 'X-Member-Code': this.code } }
        ).then(function (response) {
          self.event = response.data
          self.$router.push({ path: `/eventEdit/${self.event.uuid}` })
        }).catch(err => console.log(err))
      }
    },
    listParticipants (uuid) {
      if (uuid) {
        var self = this
        var url = `/api/admins/${this.uuid}/events/${uuid}/members`
        axios.get(
          url, { headers: { 'X-Member-Code': this.code } }
        ).then(function (response) {
          self.table.data = response.data
          for (var i = 0; i < self.table.data.length; i++) {
            if (self.table.data[i]['participation'] === 'yes') {
              self.table.data[i]['style'] = { background: 'rgba(174, 224, 127, 0.25)' }
            } else if (self.table.data[i]['participation'] === 'no') {
              self.table.data[i]['style'] = { background: 'rgba(232, 78, 78, 0.25)' }
            } else if (self.table.data[i]['participation'] === 'maybe') {
              self.table.data[i]['style'] = { background: 'rgba(232, 178, 8, 0.25)' }
            } else {
              self.table.data[i]['style'] = { background: 'rgba(7, 124, 232, 0.25)' }
            }
          }
        }).catch(err => console.log(err))
      }
    }
  }
}
</script>
