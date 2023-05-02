<template>
  <q-item clickable tag='a' target='_blank' @click='switchPage'>
    <q-item-section v-if='icon' avatar>
      <q-icon :name='icon'>
      </q-icon>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
    <q-badge v-if="notificationCount > 0" rounded color="red" text-color="white">
      {{ notificationCount }}
    </q-badge>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '#',
    },
    icon: {
      type: String,
      default: '',
    },
    notificationCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    switchPage() {
      if (this.title === 'Profile')
        this.$emit('profileClick');
      this.$router.push(this.link);
    },
  },
});
</script>
