const axios = require('axios')

export var eventMixin = {
  methods: {
    deleteEvent: function (event) {
      var self = this
      var options = { year: 'numeric', month: '2-digit', day: '2-digit' }
      var date = new Date(event.startDate * 1000)
      var startDate = Intl.DateTimeFormat('fr-FR', options).format(date)
      return new Promise((resolve, reject) => {
        this.$dialog
          .confirm(this.$t('events.confirmDelete') + ' ' + event.name + ' du ' + startDate + ' ?',
            { okText: this.$t('events.deleteOK'), cancelText: this.$t('events.deleteCancel') })
          .then(function () {
            axios.delete(
              `api/admins/${self.uuid}/events/${event.uuid}`,
              { headers: { 'X-Member-Code': self.code } }
            )
              .then(function () {
                resolve()
              })
              .catch(function (err) {
                reject(err)
              })
          })
          .catch(function (err) {
            reject(err)
          })
      })
    }
  }
}
