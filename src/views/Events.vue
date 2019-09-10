<template>
  <div>
    <event></event>
  </div>
</template>

<script>
import Event from '../components/Event.vue'
import axios from 'axios'

export default {
  components: {
    Event
  },
  computed: {
    columns: function () {
      var baseColumns = ['name', 'date', 'start', 'end']
      if (this.type === 'admin') {
        baseColumns.push('actions')
      }
      if (this.uuid) {
        baseColumns.push('participation')
      }
      if (this.type === 'admin') {
        baseColumns.push('attendance')
      }
      return baseColumns
    },
    startTimestamp: function () {
      return this.allEvents ? 1 : 0
    }
  },
  mounted () {
    this.listPractices()
    this.checkAction()
  },
  data () {
    var table = {
      data: []
    }
    var allEvents = false
    return {
      table,
      allEvents
    }
  },
  methods: {
    checkAction () {
      if (this.action.type === 'participateEvent') {
        this.participation(this.action.objectUUID, this.action.payload)
      }
    },
    listPractices () {
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
          self.table.data = response.data
          for (var i = 0; i < self.table.data.length; i++) {
            self.table.data[i]['date'] = self.extractDate(
              self.table.data[i]['startDate']
            )
            self.table.data[i]['start'] = self.extractTime(
              self.table.data[i]['startDate']
            )
            self.table.data[i]['end'] = self.extractTime(
              self.table.data[i]['endDate']
            )
            if (self.table.data[i]['participation'] === 'yes') {
              self.table.data[i]['style'] = {
                background: 'rgba(174, 224, 127, 0.25)'
              }
            } else if (self.table.data[i]['participation'] === 'no') {
              self.table.data[i]['style'] = {
                background: 'rgba(232, 78, 78, 0.25)'
              }
            }
          }
        })
        .catch(err => console.log(err))
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
    participation (eventuuid, participation) {
      var self = this
      axios
        .post(
          `/api/events/${eventuuid}/members/${this.uuid}`,
          { answer: participation },
          { headers: { 'X-Member-Code': this.code } }
        )
        .then(function () {
          self.notifyOK(self.$t('practices.participation_ok'))
          self.listPractices()
        })
        .catch(function () {
          self.notifyNOK(self.$t('practices.participation_nok'))
        })
    },
    addPractice () {
      this.$router.push({ name: 'PracticeAdd' })
    },
    editPracticeUuid (practiceUuid) {
      this.$router.push({ path: `/practiceEdit/${practiceUuid}` })
    },
    removePractice (practice) {
      var self = this
      this.deletePractice(practice)
        .then(function () {
          self.listPractices()
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
