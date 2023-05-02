<template>
  <q-page padding>
    <q-spinner
      v-if="isLoading"
      color="warning"
      size="md"
      class="absolute-center"
    />
    <div v-else>
      <div class="row col-12 justify-center">
        <q-input
          color="warning"
          bottom-slots
          v-model="searchUser"
          label="Search"
          class="row col-9 q-mb-md"
          counter
        >
          <template v-slot:prepend>
            <q-icon name="person_search" />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click="searchUser = ''"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-list class="col-4 text-center">
          <user-search-bar
            v-for="item in filteredUserList()"
            :key="item.id"
            :username="item.username"
            :id="item.id"
          />
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import UserSearchBar from 'src/components/UserSearchBar.vue';
import { UserBar } from '../models/models';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchUserPage',
  components: { UserSearchBar },
  data() {
    return {
      isLoading: true,
      searchUser: '',
      userList: [] as UserBar[],
    };
  },
  created() {
    this.getUserList();
    this.isLoading = false;
  },
  methods: {
    async getUserList() {
      const data = await this.$axios.get('/users');
      this.userList = data.data.data.map((item: UserBar) => {
        return { id: item.id, username: item.username } as UserBar
      });
    },
    filteredUserList() {
      return this.userList.filter((item: UserBar) => item.username.toLowerCase().includes(this.searchUser));
    },
  },
});
</script>
