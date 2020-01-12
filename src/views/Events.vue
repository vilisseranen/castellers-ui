<template>
  <div>
    <p class="title is-5">{{ $t('events.title') }}</p>
    <div class="columns">
      <b-field class="column"  v-if="type==='admin'">
        <button class="button field is-info" @click="addEvent">
          <span class="icon">
            <i class="fa fa-calendar-plus"></i>
          </span>
          <span>{{ $t('events.addEvent')}}</span>
        </button>
      </b-field>
      <b-field grouped class="column" position="is-right">
        <b-switch
          v-model="showPractices"
          type="is-info"
          v-on:input="filterEvents('practices')"
        >{{$t('events.showPractices')}}</b-switch>
        <b-switch
          v-model="showPresentations"
          type="is-warning"
          v-on:input="filterEvents('presentations')"
        >{{$t('events.showPresentations')}}</b-switch>
      </b-field>
    </div>
    <div class="columns is-multiline">
      <event
        v-for="event in filteredEvents"
        v-bind:key="event.uuid"
        v-bind:event="event"
        v-bind:memberType="type"
        v-on:participate="participate"
        v-on:remove="removeEvent"
        v-on:edit="editEvent"
      ></event>
    </div>
  </div>
</template>

<script>
import Event from '../components/Event.vue'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { eventMixin } from '../mixins/events.js'

export default {
  mixins: [eventMixin],
  components: {
    Event
  },
  computed: {
    ...mapGetters(['uuid', 'code', 'type', 'action']),
    startTimestamp: function () {
      return this.allEvents ? 1 : 0
    }
  },
  mounted () {
    this.listEvents()
  },
  watch: {
    uuid: function (uuid) {
      this.listEvents()
    }
  },
  data () {
    return {
      events: [],
      filteredEvents: [],
      allEvents: false,
      showPractices: true,
      showPresentations: true
    }
  },
  methods: {
    listEvents () {
      var self = this
      var url
      // If admin we will see attendance
      if (this.uuid && this.type === 'admin') {
        url = `/api/admins/${self.uuid}/events?start=${this.startTimestamp}`
        // If user we will see our participation
      } else if (this.uuid) {
        url = `/api/members/${self.uuid}/events?start=${this.startTimestamp}`
        // We will just see events
      } else {
        url = `/api/events?start=${this.startTimestamp}`
      }
      axios
        .get(url, { headers: { 'X-Member-Code': self.code } })
        .then(function (response) {
          self.events = response.data
          for (var i = 0; i < response.data.length; i++) {
            self.events[i]['date'] = self.extractDate(
              self.events[i]['startDate']
            )
            self.events[i]['start'] = self.extractTime(
              self.events[i]['startDate']
            )
            self.events[i]['end'] = self.extractTime(self.events[i]['endDate'])
          }
          self.filterEvents()
        })
        .catch(err => console.log(err))
    },
    filterEvents (type) {
      // Prevent from displaying neither practices nor events
      if (this.showPractices === false && this.showPresentations === false) {
        if (type === 'practices') {
          this.showPresentations = true
        }
        if (type === 'presentations') {
          this.showPractices = true
        }
      }
      // Filter results
      if (this.showPractices === false) {
        this.filteredEvents = this.events.filter(
          event => event.type !== 'practice'
        )
      } else if (this.showPresentations === false) {
        this.filteredEvents = this.events.filter(
          event => event.type !== 'presentation'
        )
      } else {
        this.filteredEvents = this.events
      }
    },
    extractDate (timestamp) {
      var options = { year: 'numeric', month: '2-digit', day: '2-digit' }
      var date = new Date(timestamp * 1000)
      return new Intl.DateTimeFormat('fr-FR', options).format(date)
    },
    extractTime (timestamp) {
      var options = { hour: '2-digit', minute: '2-digit' }
      var time = new Date(timestamp * 1000)
      return new Intl.DateTimeFormat('fr-FR', options).format(time)
    },
    participate (eventUuid, participation) {
      var self = this
      axios
        .post(
          `/api/events/${eventUuid}/members/${this.uuid}`,
          { answer: participation },
          { headers: { 'X-Member-Code': this.code } }
        )
        .then(function () {
          self.listEvents()
          self.$notifyOK(self.$t('events.participationOK'))
        })
        .catch(function () {
          self.$notifyNOK(self.$t('events.participationNOK'))
        })
    },
    addEvent () {
      this.$router.push({ name: 'EventAdd' })
    },
    editEvent (eventUuid) {
      this.$router.push({ path: `/eventEdit/${eventUuid}` })
    },
    removeEvent (practice) {
      var self = this
      this.deleteEvent(practice)
        .then(function () {
          self.listEvents()
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
