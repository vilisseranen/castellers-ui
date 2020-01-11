const axios = require('axios')

export var memberMixin = {
  methods: {
    deleteUser: function (member) {
      var self = this
      return new Promise((resolve, reject) => {
        this.$dialog
          .confirm(this.$t('members.confirmDelete') + ' ' + member.firstName + ' ' + member.lastName + ' ?',
            { okText: this.$t('members.okDelete'), cancelText: this.$t('members.cancelDelete') })
          .then(function () {
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
          })
          .catch(function (err) {
            reject(err)
          })
      })
    }
  }
}
