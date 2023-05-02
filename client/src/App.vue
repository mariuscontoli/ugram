<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    store.setupAxiosInterceptors();
    return { store };
  },
  created() {
    let jwtToken = this.$q.cookies.get('jwtToken');
    if (jwtToken)
      this.$axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    else
      this.$router.push('/login');
  }
})
</script>
