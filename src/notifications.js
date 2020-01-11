import Vue from 'vue'
import Notify from 'vue2-notify'
import notifications from './mixins/notifications'

Vue.use(Notify, {
  itemClass: 'notification',
  position: 'top-right',
  enter: 'fadeIn',
  leave: 'fadeOut'
})
const types = {
  info: { itemClass: 'is-info' },
  error: { itemClass: 'is-danger' },
  warning: { itemClass: 'is-warning' },
  success: { itemClass: 'is-success' }
}

Vue.$notify.setTypes(types)
Vue.mixin(notifications)

export default {}
