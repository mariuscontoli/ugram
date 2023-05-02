<template>
  <div class='col-md-4 col-xs-6 q-pa-sm'>
    <q-card>
      <q-img @click='showDialog = true' :src="picture" />
    </q-card>
    <dialog-picture
      :showDialog='showDialog'
      @updateShow='updateShow'
      :img='photoInfo.photoUrl'
      :description='description'
      :hashtags='hashtags'
      :mentions='mentions'
      :comments='comments'
      :likes="likes"
      :ownerInfos="userInfo"
      @update='updatePicture'
      @delete="deletePicture"
      :currentUser="currentUser"
    />
  </div>
</template>

<script lang="ts">
import DialogPicture from './DialogPicture.vue';
import { defineComponent, PropType } from 'vue';
import { Post } from '../models/models';


export default defineComponent({
  name: 'PictureCard',
  components: {
    DialogPicture,
  },
  props: {
    photoInfo: {
      type: Object as PropType<Post>,
      required: true,
    },
    userId: {
      type: Number,
      required: true
    },
    currentUser: {
      type: Boolean,
      required: true
    },
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDialog: false,
      description: this.photoInfo.description,
      hashtags: this.photoInfo.keywords,
      mentions: this.photoInfo.mentions,
      picture: this.photoInfo.photoUrl,
      comments: this.photoInfo.comments,
      likes: this.photoInfo.likes
    };
  },
  methods: {
    updateShow(isOpen: boolean) {
      this.showDialog = isOpen;
    },
    async updatePicture(hashtags: Array<string>, description: string, mentions: Array<string>, picture: string) {
      this.hashtags = [...hashtags];
      this.description = description;
      this.mentions = [...mentions];
      if (picture)
        this.picture = picture;
      const body = { description: this.description, keywords: this.hashtags, mentions: this.mentions };
      await this.$axios.patch(
        `/user/${this.userId}/photos/${this.photoInfo.uuid}`, body
      );
    },
    async deletePicture() {
      await this.$axios.delete(
        `/user/${this.userId}/photos/${this.photoInfo.uuid}`
      );
    }
  },
});
</script>
