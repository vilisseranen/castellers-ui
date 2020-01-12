<template>
  <div class="box">
    <p class="title is-3" v-if="actionLabel==='update'">{{ $t('members.update') }}</p>
    <p class="title is-3" v-if="actionLabel==='create'">{{ $t('members.create') }}</p>
    <div class="columns is-multiline">
      <div class="field column is-4">
        <fieldset disabled>
          <label class="label">ID</label>
          <div class="control is-expanded">
            <input class="input" type="text" v-model="current_user.uuid" />
          </div>
        </fieldset>
      </div>
      <div class="field column is-4">
        <label class="label required">{{$t('members.type')}}</label>
        <div class="control is-expanded">
          <PrettyRadio
            class="p-default p-curve"
            name="type"
            color="primary-o"
            value="member"
            v-model="current_user.type"
          >{{ $t('members.memberType') }}</PrettyRadio>
          <PrettyRadio
            class="p-default p-curve"
            name="type"
            color="success-o"
            value="admin"
            v-model="current_user.type"
          >{{ $t('members.adminType') }}</PrettyRadio>
        </div>
      </div>
      <div class="field column is-4">
        <label class="label required">{{ $t('members.language') }}</label>
        <div class="control is-expanded">
          <PrettyRadio
            class="p-default p-curve"
            name="language"
            value="fr"
            v-model="current_user.language"
          >{{ $t('members.languageFR') }}</PrettyRadio>
          <PrettyRadio
            class="p-default p-curve"
            name="language"
            value="en"
            v-model="current_user.language"
          >{{ $t('members.languageEN') }}</PrettyRadio>
          <PrettyRadio
            class="p-default p-curve"
            name="language"
            value="cat"
            v-model="current_user.language"
          >{{ $t('members.languageCAT') }}</PrettyRadio>
        </div>
      </div>
      <div class="field column is-4">
        <label class="label required">{{ $t('members.firstName') }}</label>
        <div class="control is-expanded">
          <input class="input" type="text" v-model="current_user.firstName" />
        </div>
      </div>
      <div class="field column is-4">
        <label class="label required">{{ $t('members.lastName') }}</label>
        <div class="control is-expanded">
          <input class="input" type="text" v-model="current_user.lastName" />
        </div>
      </div>
      <div class="field column is-4">
        <label class="label required">{{ $t('members.email') }}</label>
        <div class="control is-expanded">
          <input class="input" type="text" v-model="current_user.email" />
        </div>
      </div>
      <div class="field column is-3">
        <label class="label">{{ $t('members.height') }}</label>
        <div class="control is-expanded">
          <input
            class="input"
            type="text"
            v-model.lazy="heightDisplayed"
            :placeholder="heightExemple()"
          />
        </div>
      </div>
      <div class="field column is-3">
        <label class="label">{{ $t('members.units') }}</label>
        <div class="control is-expanded">
          <PrettyRadio
            class="p-default p-curve"
            name="height"
            color="primary-o"
            value="cm"
            v-model="height_unit"
          >{{ $t('members.cm') }}</PrettyRadio>
          <PrettyRadio
            class="p-default p-curve"
            name="height"
            color="success-o"
            value="ft"
            v-model="height_unit"
          >{{ $t('members.ft') }}</PrettyRadio>
        </div>
      </div>
      <div class="field column is-3">
        <label class="label">{{ $t('members.weight') }}</label>
        <div class="control is-expanded">
          <input
            class="input"
            type="text"
            v-model.lazy="weightDisplayed"
            :placeholder="weightExemple()"
          />
        </div>
      </div>
      <div class="field column is-3">
        <label class="label">{{ $t('members.units') }}</label>
        <div class="control is-expanded">
          <PrettyRadio
            class="p-default p-curve"
            name="weight"
            color="primary-o"
            value="kg"
            v-model="weight_unit"
          >{{ $t('members.kg') }}</PrettyRadio>
          <PrettyRadio
            class="p-default p-curve"
            name="weight"
            color="success-o"
            value="lb"
            v-model="weight_unit"
          >{{ $t('members.lb') }}</PrettyRadio>
        </div>
      </div>
      <div class="field column is-8">
        <label class="label">{{ $t('members.roles') }}</label>
        <div class="control is-expanded">
          <multiselect
            v-model="current_user.roles"
            :options="available_roles"
            :multiple="true"
            :placeholder="''"
            :closeOnSelect="false"
            :selectLabel="$t('multiselect.selectLabel')"
            :selectGroupLabel="$t('multiselect.selectGroupLabel')"
            :deselectLabel="$t('multiselect.deselectLabel')"
            :deselectGroupLabel="$t('multiselect.deselectGroupLabel')"
            :selectedLabel="$t('multiselect.selectedLabel')"
          ></multiselect>
        </div>
      </div>
      <div class="field column is-4">
        <label class="label">{{$t('members.extra')}}</label>
        <div class="control is-expanded">
          <input class="input" type="text" v-model="current_user.extra" />
        </div>
      </div>
      <div class="column is-12">
        <div class="notification is-success" v-if="current_user.activated === 1">
          <span>{{ $t('members.alreadyLoggedIn') }}</span>
        </div>
        <div class="notification is-warning" v-if="current_user.activated === 0">
          <span>{{ $t('members.neverLoggedIn') }}</span>
        </div>
      </div>
      <div class="field is-horizontal column">
        <div class="field-body">
          <div class="field">
            <p class="control">
              <button
                type="submit"
                class="button is-danger"
                @click.prevent="memberDelete"
                v-if="current_user.uuid"
              >{{ $t('members.deleteButton') }}</button>
            </p>
          </div>
          <div class="field">
            <p class="control">
              <button
                type="submit"
                class="button is-info"
                @click.prevent="memberEdit"
                v-if="actionLabel==='update'"
              >{{ $t('members.updateButton') }}</button>
              <button
                type="submit"
                class="button is-info"
                @click.prevent="memberEdit"
                v-if="actionLabel==='create'"
              >{{ $t('members.createButton') }}</button>
            </p>
          </div>
          <div class="field">
            <p class="control">
              <button
                type="submit"
                class="button is-warning"
                @click.prevent="resendEmail"
                v-if="current_user.uuid && this.type === 'admin'"
              >{{ $t('members.emailButton') }}</button>
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
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import PrettyRadio from 'pretty-checkbox-vue/radio'
import 'pretty-checkbox/dist/pretty-checkbox.min.css'

export default {
  components: {
    Multiselect,
    PrettyRadio
  },
  name: 'edit-profile-form',
  props: {
    user: Object
  },
  computed: {
    ...mapGetters(['uuid', 'code', 'type']),
    actionLabel: function () {
      return this.user.uuid ? 'update' : 'create'
    },
    current_user: {
      get: function () {
        return this.user
      },
      set: function (newUuid) {
        this.current_user.uuid = newUuid
      }
    },
    heightDisplayed: {
      get: function () {
        var height
        if (this.height_unit === 'ft') {
          var inches = Math.round((parseInt(this.current_user.height) / 2.54) % 12)
          var feet = Math.floor((parseInt(this.current_user.height) / 2.54) / 12)
          if (inches === 12) {
            feet += 1
            inches = ''
          }
          if (!isNaN(inches) && !isNaN(feet)) {
            height = feet + "'" + inches
            return height
          }
        } else {
          height = parseFloat(this.current_user.height)
        }
        if (!isNaN(height)) {
          return Math.round(height)
        }
        return null
      },
      set: function (height) {
        var heightToSave
        if (this.height_unit === 'ft') {
          var heightParsed = height.split("'", 2)
          var feet = parseFloat(heightParsed[0])
          var inches = parseFloat(heightParsed[1])
          if (isNaN(inches)) {
            inches = 0
          }
          if (!isNaN(feet)) {
            heightToSave = feet * 2.54 * 12 + inches * 2.54
            this.current_user.height = heightToSave.toFixed(2)
          } else {
          }
        } else {
          heightToSave = parseFloat(height)
          if (!isNaN(heightToSave)) {
            this.current_user.height = heightToSave.toFixed(2)
          }
        }
        if (isNaN(heightToSave)) {
          this.current_user.height = ''
        }
      }
    },
    weightDisplayed: {
      get: function () {
        var weight
        if (this.weight_unit === 'lb') {
          weight = parseFloat(this.current_user.weight) * 2.205
        } else {
          weight = parseFloat(this.current_user.weight)
        }
        if (weight !== 'undefined' && !isNaN(weight)) {
          return Math.round(weight)
        }
        return null
      },
      set: function (weight) {
        var weightToSave = parseFloat(weight)
        if (!isNaN(weightToSave)) {
          if (this.weight_unit === 'lb') {
            weightToSave /= 2.205
            if (!isNaN(weightToSave)) {
              this.current_user.weight = weightToSave.toFixed(2)
            }
          } else {
            this.current_user.weight = weightToSave.toFixed(2)
          }
        }
      }
    }
  },
  data () {
    return {
      updating: false,
      available_roles: [],
      height_unit: 'cm',
      weight_unit: 'kg'
    }
  },
  mounted () {
    var self = this
    axios.get('/api/roles').then(function (response) {
      self.available_roles = response.data.sort()
    }).catch(err => console.log(err))
  },
  methods: {
    heightExemple () {
      return this.height_unit === 'cm' ? this.$t('members.exempleCM') : this.$t('members.exempleFT')
    },
    weightExemple () {
      return this.weight_unit === 'kg' ? this.$t('members.exempleKG') : this.$t('members.exempleLB')
    },
    resendEmail () {
      var self = this
      self.updating = true
      axios.get(
        `/api/admins/${self.uuid}/members/${this.current_user.uuid}/registration`,
        { headers: { 'X-Member-Code': this.code } }
      ).then(function (response) {
        self.updating = false
        self.$notifyOK(self.$t('members.notifySuccess'))
      }).catch(function (error) {
        self.updating = false
        self.$notifyNOK(self.$t('members.notifyFailure'))
        console.log(error)
      })
    },
    memberEdit () {
      this.$emit('editUser', this.current_user)
    },
    memberDelete () {
      this.$emit('deleteUser', this.current_user)
    }
  }
}
</script>
<style>
</style>
