<template>
  <div class="box" v-if="series.length">
    <p class="title is-4">{{ $t("badges.title") }}</p>
    <div v-for="s in series" :key="s.uuid" class="badge-series">
      <p class="subtitle is-5">
        {{ $t("badges.series." + s.code + ".name") }}
      </p>
      <div class="badge-grid">
        <div
          v-for="badge in s.badges"
          :key="badge.uuid"
          class="badge-item"
          :class="{ 'badge-locked': !isUnlocked(badge.uuid) }"
          :title="$t('badges.items.' + badge.code + '.description')"
        >
          <img
            :src="`/static/badges/${badge.image}`"
            :alt="$t('badges.items.' + badge.code + '.name')"
            class="badge-image"
          />
          <p class="badge-name">
            {{ $t("badges.items." + badge.code + ".name") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "badges-component",
  props: {
    memberUuid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      memberBadges: [],
    };
  },
  computed: {
    ...mapState({
      series: (state) => state.badges.series,
    }),
    unlockedUuids() {
      return this.memberBadges.map((b) => b.badgeUuid);
    },
  },
  watch: {
    memberUuid(newUuid) {
      this.loadMemberBadges(newUuid);
    },
  },
  mounted() {
    const self = this;
    this.getBadges()
      .catch(function () {})
      .finally(function () {
        self.loadMemberBadges(self.memberUuid);
      });
  },
  methods: {
    ...mapActions({
      getBadges: "badges/getBadges",
      fetchMemberBadges: "badges/getMemberBadges",
    }),
    isUnlocked(badgeUuid) {
      return this.unlockedUuids.includes(badgeUuid);
    },
    loadMemberBadges(uuid) {
      if (!uuid) {
        this.memberBadges = [];
        return;
      }
      const self = this;
      this.fetchMemberBadges(uuid)
        .then(function (response) {
          self.memberBadges = response.data || [];
        })
        .catch(function () {
          self.memberBadges = [];
        });
    },
  },
};
</script>

<style scoped>
.badge-series {
  margin-bottom: 1.5rem;
}
.badge-series:last-child {
  margin-bottom: 0;
}
.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.badge-item {
  width: 110px;
  text-align: center;
}
.badge-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
}
.badge-name {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
.badge-locked .badge-image {
  filter: grayscale(1);
  opacity: 0.4;
}
.badge-locked .badge-name {
  opacity: 0.6;
}
</style>
