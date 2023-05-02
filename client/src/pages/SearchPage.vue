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
        <q-select
          color="warning"
          filled
          clearable
          v-model="searchPost"
          use-input
          input-debounce="0"
          :options="wordsOptions"
          label="Search"
          class="row col-9 q-mb-md"
          counter
          @input-value="filterWords"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-select>
        <div class="col-md-8 col-xs-12">
          <FeedPost
            v-for="item in posts"
            :key="item.uuid"
            :post="item"
            :user="getUser(item.ownerId)"
            style="margin-bottom: 1em"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import FeedPost from 'src/components/FeedPost.vue';
import { Post, UserBar } from '../models/models';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchPage',
  components: { FeedPost },
  data() {
    return {
      isLoading: true,
      searchPost: '',
      posts: [] as Post[],
      users: [] as UserBar[],
      words: [] as string[],
      wordsOptions: [] as string[],
    };
  },
  async created() {
    this.isLoading = false;
    await this.getPosts();
    await this.getWords();
    await this.getUsers();
  },

  methods: {
    async getPosts() {
      const data = await this.$axios.get('/photos');
      this.posts = data.data.data;
      this.posts = this.posts.sort(function (a, b) {
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      });
    },
    async getWords() {
      this.posts.map((item) => {
        if (item.description) this.words.push(item.description);
        if (item.keywords) {
          item.keywords.map((keyword) => {
            this.words.push(keyword);
          });
        }
      });
      this.words = this.words.filter((item,
            index) => this.words.indexOf(item) === index);
      this.wordsOptions = [...this.words];
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
    filterWords(val: string) {
      this.wordsOptions = this.words.filter((item) =>
        item.toLowerCase().includes(val)
      );
    }
  },
  watch: {
    async searchPost() {
      let data = null;
      if (this.searchPost.includes('#')) {
        data = await this.$axios.get('/photos', {
          params: { keyword: this.searchPost },
        });
      } else {
        data = await this.$axios.get('/photos', {
          params: { description: this.searchPost },
        });
      }
      this.posts = data.data.data;
      this.posts = this.posts.sort(function (a, b) {
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      });
    },
  },
});
</script>
