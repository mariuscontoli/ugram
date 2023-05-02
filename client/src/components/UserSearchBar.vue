<template>
  <q-item clickable tag='a' :to='`/profile/${id}`'>
    <q-item-section avatar>
      <q-avatar>
        <q-img src='../../public/profile_picture.webp' />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ username }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'UserSearchBar',
  props: {
    username: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  setup() {
    return {};
  },
};
</script>