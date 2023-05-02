<template>
  <q-page padding>
    <q-spinner
      v-if="isLoading"
      color="warning"
      size="md"
      class="absolute-center"
    />
    <div v-else>
      <profile-upper-layout :currentUser="currentUser" :userInfo="userInfo" />
      <q-separator inset="true" spaced="sm" />
      <div class="row">
        <picture-card
          v-for="photo in userInfo.photos"
          :currentUser="currentUser"
          :key="photo.uuid"
          :photoInfo="photo"
          :userInfo="userInfo"
          :userId="id"
        ></picture-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import ProfileUpperLayout from 'src/components/ProfileUpperLayout.vue';
import PictureCard from 'src/components/PictureCard.vue';
import { defineComponent } from 'vue';
import { UserInfo } from '../models/models';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'ProfilePage',
  components: {
    ProfileUpperLayout,
    PictureCard,
  },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      currentUser: false,
      userInfo: {} as UserInfo,
      // photos: {},
      isLoading: true,
      id: {} as number,
    };
  },
  async created() {
    this.id = Number(this.$route.params.id);
    this.currentUser = this.id == this.store.getUserId;
    await this.getUserInfo();
    // await this.getUserPhotos();
    this.isLoading = false;
  },
  methods: {
    async getUserInfo() {
      const data = await this.$axios.get(
        `/user/${this.id}`
      );
      this.userInfo = data.data;
    },
    // async getUserPhotos() {
    //   const data = await this.$axios.get(
    //     `/user/${this.id}/photos`
    //   );
    //   this.photos = data.data;
    // },
  },
  watch: {
    $route(to, from) {
      if (to !== from && to.path.includes('profile') && from.path.includes('profile')) {
        location.reload();
      }
    },
  },
});
</script>
