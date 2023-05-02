<template>
  <q-layout view="lHh Lpr lFf">
    <div v-if="$q.platform.is.mobile || $q.screen.sm || $q.screen.xs">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title class="row justify-center title-ugram"
            >Ugram</q-toolbar-title
          >
        </q-toolbar>
      </q-header>
      <q-footer elevated>
        <q-tabs class="footer-tabs">
          <q-route-tab
            v-for="link in linksList"
            :key="link.title"
            :to="link.link"
            :icon="link.icon"
            :name="link.title"
          ></q-route-tab>
          <q-route-tab
            clickable
            icon="add_box"
            name="Create"
            @click="showDialog = true"
          ></q-route-tab>
        </q-tabs>
      </q-footer>
    </div>
    <div v-else>
      <q-drawer v-model="leftDrawerOpen" bordered>
        <h3 class="row justify-center title-ugram">Ugram</h3>
        <q-list>
          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
            :notificationCount="link.notification"
            @profileClick="displayAndRemoveNotificationProfile"
          />
          <q-item clickable tag="a" target="_blank" @click="showDialog = true">
            <q-item-section avatar>
              <q-icon name="add_box" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Create</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </div>
    <q-page-container>
      <router-view />
      <DialogUpload :showDialog="showDialog" @uploadShow="uploadShow" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import DialogUpload from 'src/components/DialogUpload.vue';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink,
    DialogUpload,
  },
  data() {
    return {
      showDialog: false,
      linksList: [
        {
          title: 'Home',
          icon: 'home',
          link: '/',
          notification: 0
        },
        {
          title: 'Search',
          icon: 'search',
          link: '/search',
          notification: 0
        },
        {
          title: 'Search Users',
          icon: 'person_search',
          link: '/searchUsers',
          notification: 0
        },
        {
          title: 'Message',
          icon: 'chat',
          link: '/conversations',
          notification: 0
        },
        {
          title: 'Profile',
          icon: 'person',
          link: `/profile/${this.store.userId}`,
          notification: this.notificationCount
        },
      ],
      notificationCount: 0,
      notificationArray: [],
    };
  },
  async created() {
    await this.fetchNotifications();
  },
  methods: {
    uploadShow(isOpen) {
      this.showDialog = isOpen;
    },
    async fetchNotifications() {
      const data = await this.$axios.get(`/user/${this.store.userId}/notifications`);
      const notifications = data.data;
      const notificationCount = notifications.length;
      let likeNotifications = 0;
      let commentNotifications = 0;
      notifications.forEach((notification) => {
        if (notification.type === 'like') likeNotifications++;
        if (notification.type === 'comment') commentNotifications++;
      });
      if (likeNotifications > 0) {
        this.notification(`${likeNotifications} people liked your post`, notificationCount);
      }
      if (commentNotifications > 0) {
        this.notification(`${commentNotifications} people commented on your post`, notificationCount);
      }
    },
    notification(message, notificationCount) {
      if (!this.$route.path.includes('profile'))
        this.addNotificationProfile(notificationCount);
      this.notificationArray.push(message);
    },
    addNotificationProfile(notificationCount) {
      this.linksList[4].notification = notificationCount;
      this.notificationCount = notificationCount;
    },
    displayAndRemoveNotificationProfile() {
      this.notificationArray.forEach((message) => {
        this.$q.notify({
          message: message,
          position: 'top-right',
          classes: 'border-radius-10',
          textColor: 'black',
          color: 'white',
          actions: [
            { label: 'Dismiss', color: 'black', handler: () => { /* ... */ } }
          ]
        });
      });
      this.linksList[4].notification = 0;
      this.notificationCount = 0;
      this.notificationArray = [];
    },
  },
  setup() {
    const leftDrawerOpen = true;
    const store = useStore();
    return {
      store,
      leftDrawerOpen,
    };
  },
  watch: {
    async $route() {
      await this.fetchNotifications();
    },
  },
});
</script>

<style>

.border-radius-10 {
  border-radius: 10px;
  border-color: #121212;
}

</style>
