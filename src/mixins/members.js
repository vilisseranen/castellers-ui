const axios = require('axios')

export var memberMixin = {
  methods: {
    deleteUser: function (member) {
      var self = this
      return new Promise((resolve, reject) => {
        this.$buefy.dialog.confirm({
          message: this.$t('members.confirmDelete') + ' <b>' + member.firstName + ' ' + member.lastName + '</b> ?',
          confirmText: this.$t('members.okDelete'),
          cancelText: this.$t('members.cancelDelete'),
          type: 'is-danger',
          onConfirm: () => {
            axios.delete(
              `api/admins/${self.uuid}/members/${member.uuid}`,
              { headers: { 'X-Member-Code': self.code } }
            )
              .then(function () {
                resolve()
              })
              .catch(function (err) {
                reject(err)
              })
          }
        })
      })
    }
  }
}
