<template>
  <div class="row col-12">
    <q-card class="col-12" flat bordered>
      <q-item class="row q-pa-sm">
        <q-item-section side>
          <q-avatar size="48px">
            <q-img src="../../public/profile_picture.webp" :ratio="1"/>
          </q-avatar>
        </q-item-section>
        <q-item-section class="q-mt-sm">
          <q-item-label style="font-weight: bold">{{ user.username }}</q-item-label>
          <q-item-label caption>{{ getTimeSincePost(post.creationDate) }}</q-item-label>
        </q-item-section>
      </q-item>
      <div class="q-pa-sm">
        <q-img style="object-fit: cover" :src="post.photoUrl"/>
      </div>
      <div class="q-pa-sm">
        <p style="font-weight: bold" v-if="post.likes.length > 1">{{ post.likes.length }} likes</p>
        <p style="font-weight: bold" v-else>{{ post.likes.length }} like</p>
        <p v-if="post.description">{{ post.description }}</p>
        <p style="color: royalblue" v-if="post.keywords">
          {{ post.keywords.join(' ') }}
        </p>
        <p style="color: royalblue" v-if="post.mentions">
          {{ post.mentions.join(' ') }}
        </p>
      </div>
      <q-separator/>
      <div>
        <q-btn flat round size="lg" @click="likePhoto" :icon="isLiked ? 'favorite' : 'favorite_border'" :color="isLiked ? 'red' : ''"/>
        <q-btn flat round size="lg" @click="commentSection = !commentSection" icon="chat_bubble_outline"/>
      </div>
      <q-separator/>
      <div v-if="commentSection" class="q-pa-sm row col-12">
        <div class="comment-container row col-12 justify-between">
          <form class="row col-9">
            <q-input dense
                     ref="commentInput"
                     type="text"
                     class="col-12"
                     placeholder="Add a comment..."
                     v-model="commentText"
                    @keydown.enter.prevent="addComment"

            />
          </form>
          <q-btn
            class="col-2"
            icon="send"
            color="warning"
            @click="addComment">
            Post
          </q-btn>
        </div>
        <div class="comment-subject row col-12" v-for="comment in post.comments" :key="comment.authorUsername">
          <span class="comment-author">{{ comment.authorUsername }}</span>
          <span class="comment-text">{{ comment.content }}</span>
          <q-btn :ripple="false" flat size="sm" v-if="comment.userId === store.userId || post.ownerId === store.userId" icon="more_vert">
            <q-menu>
              <q-list dense>
                <q-item clickable v-close-popup>
                  <q-item-section style="color: #C10015" @click="deleteComment(comment)">Delete</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Cancel</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {Comment, Post, UserBar} from '../models/models';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'FeedPost',
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
    user: {
      type: Object as PropType<UserBar>,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    return { store };
  },
  created() {
    this.isLiked = this.post.likes.filter(like => like.userId === this.store.userId).length > 0;
  },
  data() {
    return {
      isLiked: false,
      commentSection: true,
      commentText: '',
    }
  },
  methods: {
    async likePhoto() {
      try {
        let photoId = this.post.uuid;
        const response = await this.$axios.post(`/photos/${photoId}/likes`);
        this.isLiked = response.data.isLiked;
        this.$emit('post-liked', response.data.photo)
      } catch (error) {
        console.error(error);
      }
    },
    async addComment() {
      if (this.commentText === '') {
        return;
      }
      try {
        let photoId = this.post.uuid;
        const response = await this.$axios.post(`/photos/${photoId}/comments`, {
          text: this.commentText
        });
        this.commentText = '';
        this.$emit('post-commented', response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteComment(comment: Comment) {
      try {
        let photoId = this.post.uuid;
        const response = await this.$axios.delete(`/photos/${photoId}/comments/${comment.uuid}`);
        this.$emit('post-commented', response.data);
      } catch (error) {
        console.error(error);
      }
    },
    getTimeSincePost(timestamp: Date) {
      const now = new Date().getTime();
      const postTime = new Date(timestamp).getTime();
      const difference = now - postTime;
      const minute = 60 * 1000;
      const hour = minute * 60;
      const day = hour * 24;
      const week = day * 7;
      const month = day * 30;
      const year = day * 365;

      if (difference < minute) {
        return 'Just now';
      } else if (difference < hour) {
        const minutesAgo = Math.round(difference / minute);
        return `${minutesAgo}m`;
      } else if (difference < day) {
        const hoursAgo = Math.round(difference / hour);
        return `${hoursAgo}h`;
      } else if (difference < week) {
        const daysAgo = Math.round(difference / day);
        return `${daysAgo}d`;
      } else if (difference < month) {
        const weeksAgo = Math.round(difference / week);
        return `${weeksAgo}w`;
      } else if (difference < year) {
        const monthsAgo = Math.round(difference / month);
        return `${monthsAgo}m`;
      } else {
        const yearsAgo = Math.round(difference / year);
        return `${yearsAgo}y`;
      }
    }

  },
});
</script>
<style>

.comment-subject {
  justify-content: start;
  align-items: start;
  margin-bottom: 2px;
  margin-top: 2px;
}

.comment-subject i {
  display: none;
}

.comment-subject .q-btn .q-focus-helper {
  display: none;
}

.comment-subject:hover i {
  display: block;
}

.comment-author {
  font-weight: bold;
  margin-right: 5px;
}

.comment-text {
  flex: 1;
}

.comment-container {
  display: flex;
  align-items: center;
}

.comment-container input[type="text"] {
  flex: 1;
  margin-right: 10px;
}

.comment-container button {
  background: none;
  border: none;
  color: black;
}

.comment-container button:hover {
  cursor: pointer;
  color: #0095f6;
}

input {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: groove;
  background-color: transparent;
}
</style>
