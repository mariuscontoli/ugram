<template>
  <q-page padding>
    <q-list v-if="chats" class="q-py-md">
      <q-item
        v-for="chat in chats"
        :key="chat.id"
        clickable
        @click="openChat(chat.id)"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="chat.avatar"  alt="../../public/profile_picture.webp"/>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ chat.name }}</q-item-label>
          <q-item-label caption>{{ chat.lastMessage }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label caption>{{ chat.time }}</q-item-label>
          <q-icon name="chevron-right" />
        </q-item-section>
      </q-item>
    </q-list>
    <div v-if="chats.length === 0" class="no-messages">
      <h4>Your Messages</h4>
      <p>Send private photos and messages to a friend or group.</p>
      <q-btn
        flat bordered
        label="Send Message"
        class="send-message-btn"
        @click="showModal = true"
      />
    </div>
    <q-dialog v-model="showModal">
      <q-card class="my-card q-pa-none q-ma-none" flat>
        <div class="row items-center justify-between q-ml-none q-mt-xs q-mb-xs">
          <q-btn class="close-btn" flat icon="close" @click="showModal = false" />
          <div class="modal-title">New message</div>
          <q-btn class="nxt-btn" flat no-caps label="Next" />
        </div>
        <q-separator class="my-separator" inset />
        <div class="row items-center justify-start q-ml-none">
          <div class="q-mb-sm q-ml-md">To:</div>
          <q-card-section class="col-grow">
            <q-input type="text" borderless label-color="white" color="white" v-model="searchText" placeholder="Search..." />
          </q-card-section>
        </div>
        <q-card-section>
          <q-list dense>
            <q-item v-for="(user, index) in filteredUsers" :key="index" clickable @click="chooseUser(user)">
              <q-item-section avatar>
                <q-avatar :src="user.photoUrl" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ user.username }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { useStore } from 'src/stores/store';

export default {
  name: 'ChatListPage',
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      showModal: false,
      users: [],
      searchText: '',
      chats: [
      ],
    };
  },
  created() {
    this.getUserList();
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => user.username.toLowerCase().includes(this.searchText.toLowerCase()));
    },
  },
  methods: {
    async getUserList() {
      const data = await this.$axios.get('/users');
      this.users = data.data.data;
      this.users = this.users.filter((user) => user.id !== this.store.getUserId);
    },
    openChat(chatId) {
      this.$router.push({ name: 'conversation', params: {id: chatId}});
      this.showModal = false;
    },
    chooseUser(user) {
      this.$router.push({ name: 'conversation', params: {id: user.id}});
      this.showModal = false;
    },
  },
};
</script>

<style>



.my-card {
  width: 100%;
  max-width: 500px;
}

.my-separator {
  right: 0;
  top: 0;
  margin: 0;
  padding: 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  right: 0;
  top: 0;
  margin-left: 10px;
  padding: 0;
}

.nxt-btn {
  color: #0095F6;
}

.nxt-btn:hover {
  mso-highlight: transparent;
  color: white;
}

.no-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.no-messages h4 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.send-message-btn {
  margin: 0;
  font-size: 14px;
  position: relative;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #0095F6;
}

</style>
