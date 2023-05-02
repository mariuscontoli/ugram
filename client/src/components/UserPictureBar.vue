<template>
  <div class='row col-12 justify-between'>
    <q-avatar class='col-4 row justify-center items-center'
      ><q-img src='../../public/profile_picture.webp' />
    </q-avatar>
    <p class='col-6 justify-left'>{{ name }}</p>
    <q-btn v-if="currentUser" class='col-1' flat icon='more_vert'>
      <q-menu transition-show='jump-down' transition-hide='jump-up'>
        <q-list style='min-width: 100px'>
          <q-item v-close-popup clickable @click="$emit('edit')">
            <q-icon class='q-pa-sm' name='edit'></q-icon>
            <q-item-section>Edit</q-item-section>
          </q-item>
          <q-item v-close-popup clickable @click="$emit('delete')">
            <q-icon color='negative' class='q-pa-sm' name='delete'></q-icon>
            <q-item-section class='delete-picture'>Delete</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UserPirctureBar',
  props: {
    name: {
      type: String,
      required: true,
    },
    currentUser: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    return {};
  },
});
</script>
