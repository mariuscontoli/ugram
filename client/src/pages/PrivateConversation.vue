<template>
  <q-page padding>
    <q-spinner
      v-if="isLoading"
      color="warning"
      size="md"
      class="absolute-center"
    />
    <q-scroll-area v-else ref="scrollArea" id="scroll-container" class="col-12">
      <q-list v-for="(message, index) in messageCopy" :key="index">
        <div :class="message.sentBy === this.store.userId ? 'sent-by-me' : 'sent-by-other'">
          <q-item id="message-container">
            <q-item-section avatar>
              <q-avatar>
                <q-img src="../../public/profile_picture.webp" />
              </q-avatar>
            </q-item-section>
            <q-item-section id="message-bubble">
              <q-item-label>{{ message.text }}</q-item-label>
              <q-item-label caption>{{ message.time }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-scroll-area>
    <div class="col-12" id="messageBar">
    <q-input v-model="newMessage" @keydown.enter="sendMessage"
             class="message-field"
             color="black"
             borderless
             hide-bottom-space
             dense
             prefix-icon="search"
             type="text"
             placeholder="Message..." />
  </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import SocketioService from 'src/services/socketio.service';
import { useStore } from 'src/stores/store';


export default defineComponent({
  name: 'ChatPage',
  setup() {
    const store = useStore();
    return { store };
  },
  async created() {
    SocketioService.setupSocketConnection();
    await this.getRoomInfo();
    await this.getRoomMessages();
    this.messageCopy = [...this.messages];
    this.isLoading = false;
  },
    beforeUnmount() {
      SocketioService.disconnect();
    },
  data() {
    return {
      isLoading: true,
      messages: [],
      newMessage: '',
      messageCopy: [],
      roomId: '',
      receiverId : this.$route.params.id,
    };
  },
  methods: {
    initRoomSocket() {
      SocketioService.joinRoom(this.roomId, this.store.getUserId);
      SocketioService.subscribeToMessages((err, data) => {
        this.messageCopy.push(data.message);
        this.$nextTick(() => {
          this.$refs.scrollArea.setScrollPosition('vertical', this.$refs.scrollArea.$el.scrollHeight, 1);
        });
      });
    },
    async getRoomInfo() {
      const data = await this.$axios.get(`/user/conversation/roomId/${this.receiverId}`);
      this.roomId = data.data;
      if (this.roomId !== '') {
        this.initRoomSocket();
      }
    },
    async getRoomMessages() {
      console.log('getting room messages')
      const data = await this.$axios.get(`/user/conversation/${this.roomId}/messages`);
      this.messages = data.data;
      console.log(this.messages)
    },
    async sendMessage() {
      if (this.newMessage !== '') {
        const message = {
          text: this.newMessage,
          time: new Date().toLocaleTimeString(),
          sentBy: this.store.userId
        };
        // find a way to use callback object, if not leave it blank, unused
        SocketioService.sendMessage(message, this.roomId, async cb => {
          await this.$axios.post(`/user/conversation/${this.roomId}/messages`, {
            message: this.newMessage
          });
          this.messageCopy.push(message);
          this.newMessage = '';
        });
      }
      this.$nextTick(() => {
        this.$refs.scrollArea.setScrollPosition('vertical', this.$refs.scrollArea.$el.scrollHeight, 1);
      });
    }
  },
    watch: {
      messages() {
        this.messageCopy = this.messageList;
      }
    }
}
);
</script>

<style scoped>

.sent-by-me {
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  overflow-y: visible;
  box-sizing: border-box;
  overflow-x: visible;
  position: relative;
}

.sent-by-other {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  overflow-y: visible;
  box-sizing: border-box;
  overflow-x: visible;
  position: relative;
}

#scroll-container {
  height: calc(100vh - 96px);
  overflow-y: auto;
}

#message-container {
  display: flex;
  align-self: flex-end;
  justify-content: center;
}

#message-bubble {
  border: 1px solid black;
  background-color: #fff;
  border-radius: 20px;
  padding: 10px;
  margin: 10px;
}

#messageBar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #fff;
}

.message-field {
  padding-left: 10px;
  border-left: 1px solid black;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  border-radius: 20px;
}

</style>
