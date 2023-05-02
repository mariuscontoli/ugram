<template>
  <q-page padding class="bg-grey-2 row justify-center col-12">
    <q-spinner
      v-if="isLoading"
      color="warning"
      size="md"
      class="absolute-center"
    />
    <div v-else class="col-md-8 col-xs-12">
      <FeedPost
        v-for="item in posts"
        :key="item.uuid"
        :post="item"
        @post-liked="updatePost"
        @post-commented="updatePost"
        :user="getUser(item.ownerId)"
        style="margin-bottom: 1em"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FeedPost from 'src/components/FeedPost.vue';
import { Post, UserBar } from 'src/models/models';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'HomePageView',
  components: {
    FeedPost,
  },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      isLoading: true,
      posts: [] as Post[],
      users: [] as UserBar[],
    };
  },
  async created() {
    await this.getPosts();
    await this.getUsers();
    this.isLoading = false;
  },
  methods: {
    async getPosts() {
      const data = await this.$axios.get('/photos');
      this.posts = data.data.data;
      return this.posts.sort(function   (a, b) {
        return (
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
      });
    },
    async getUsers() {
      const data = await this.$axios.get('/users');
      this.users = data.data.data;
    },
    getUser(id: number) {
      const test = this.users.find((item) => {
        if (item.id === id) return item;
      });
      if (!test) return { id: 0, username: 'ERROR', photoUrl: '' };
      return test;
    },
    updatePost(updatedPost: Post) {
      const index = this.posts.findIndex((post) => post.uuid === updatedPost.uuid);
      this.posts[index] = updatedPost;
    }
  },
});
</script>
