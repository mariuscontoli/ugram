<template>
  <div class="col-12">
    <q-dialog v-model="isOpen" full-width>
      <q-card>
        <q-card-section horizontal class="col-9">
          <q-img :src="img" />
          <q-card-section vertical class="row col-3">
            <div class="col-12">
              <user-picture-bar
                :name="username"
                @edit="editPicture"
                @delete="deletePicture"
                :currentUser="currentUser"
              ></user-picture-bar>
              <p class="q-pt-md col-12">{{ description }}</p>
              <q-chip
                class="row col-12"
                v-for="item in hashtags"
                :key="item"
                :label="item"
              >
              </q-chip>
              <q-chip
                class="row col-12"
                v-for="item in mentions"
                :key="item"
                :label="item"
              >
              </q-chip>
              <div class="row col-12">
                <comment-photo
                  v-for="comment in comments"
                  :key="comment.uuid"
                  :comment="comment"
                ></comment-photo>
              </div>
            </div>
            <div class="row col-12 self-end">
              <q-icon size="md" name="favorite_border"></q-icon>
              <h5 class="q-ma-none">{{ likes.length }}</h5>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isConfirmOpen" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" />
          <span class="q-ml-sm"
            >Are you sure that you want delete this picture ?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            @click="cancelDeletePicture"
            flat
            label="Cancel"
            v-close-popup
          />
          <q-btn
            @click="confirmDeletePicture"
            color="negative"
            flat
            label="Delete"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isEditOpen">
      <q-card class="row col-12">
        <q-bar class="col-12 bg-warning">
          <q-btn @click="closeEdit" dense flat label="close" v-close-popup>
          </q-btn>
          <q-space />
          <q-btn @click="confirmEdit" dense flat label="Validate" v-close-popup>
          </q-btn>
        </q-bar>
        <q-card-section class="col-12">
          <div>
            <q-input
              color="warning"
              bottom-slots
              v-model="descriptionCopy"
              label="Description"
              counter
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="descriptionCopy = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              color="warning"
              bottom-slots
              v-model="tag"
              label="Hashtags"
              counter
              @keydown.enter.prevent="validateTag"
            >
              <template v-slot:prepend>
                <q-icon name="tag" />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click="tag = ''" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
          <div style="min-width: 20vw; max-width: 500px" class="row col-12">
            <q-chip
              removable
              @remove="deleteTag(item)"
              v-for="item in hashtagsCopy"
              :key="item"
              :label="item"
            >
            </q-chip>
          </div>
          <div class="col-12">
            <q-input
              color="warning"
              bottom-slots
              v-model="mention"
              label="Mentions"
              counter
              @keydown.enter.prevent="validateMention"
            >
              <template v-slot:prepend>
                <q-icon name="people" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="mention = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <div style="min-width: 20vw; max-width: 500px" class="row col-12">
            <q-chip
              removable
              @remove="deleteMention(item)"
              v-for="item in mentionsCopy"
              :key="item"
              :label="item"
            >
            </q-chip>
          </div>
          <q-card-section class="row col-12">
            <q-uploader
              auto-upload
              :factory="factory"
              color="amber"
              text-color="black"
              class="row col-12"
            />
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { defineComponent } from 'vue';

import UserPictureBar from './UserPictureBar.vue';
import CommentPhoto from './CommentPhoto.vue';
import { Comment, Like } from 'src/models/models';

export default defineComponent({
  name: 'DialogPicture',
  components: {
    UserPictureBar,
    CommentPhoto,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    hashtags: {
      type: Array as PropType<string[]>,
      required: true,
    },
    mentions: {
      type: Array as PropType<string[]>,
      required: true,
    },
    currentUser: {
      type: Boolean,
      required: true,
    },
    comments: {
      type: Array as PropType<Comment[]>,
      required: true
    },
    likes: {
      type: Array as PropType<Like[]>,
      required: true
    },
    ownerInfos: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      descriptionCopy: '',
      hashtagsCopy: [] as string[],
      mentionsCopy: [] as string[],
      isOpen: this.showDialog,
      isConfirmOpen: false,
      isEditOpen: false,
      tag: '',
      mention: '',
      photoUrl: '',
      base64: '' as string | ArrayBuffer,
      username: '',
    };
  },
  created() {
    this.descriptionCopy = this.description;
    this.hashtagsCopy = [...this.hashtags];
    this.mentionsCopy = [...this.mentions];
    this.username = this.ownerInfos.username
  },
  methods: {
    async factory(files: Array<File>) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        if (reader.result) this.base64 = reader.result;
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    },
    editPicture() {
      this.isEditOpen = true;
    },
    deletePicture() {
      this.isConfirmOpen = true;
    },
    cancelDeletePicture() {
      this.isConfirmOpen = false;
    },
    confirmDeletePicture() {
      this.$emit('delete');
      this.isConfirmOpen = false;
      this.isOpen = false;
    },
    validateTag() {
      this.hashtagsCopy.push(this.tag);
      this.tag = '';
    },
    deleteTag(tag: string) {
      const index = this.hashtagsCopy.findIndex((item) => item === tag);
      this.hashtagsCopy.splice(index, 1);
    },
    validateMention() {
      this.mentionsCopy.push(this.mention);
      this.tag = '';
    },
    deleteMention(name: string) {
      const index = this.mentionsCopy.findIndex((item) => item === name);
      this.mentionsCopy.splice(index, 1);
    },
    confirmEdit() {
      this.$emit(
        'update',
        this.hashtagsCopy,
        this.descriptionCopy,
        this.mentionsCopy,
        this.base64
      );
    },
    closeEdit() {
      console.log('close edit');
    },
  },
  watch: {
    isOpen() {
      this.$emit('updateShow', this.isOpen);
    },
    showDialog() {
      this.isOpen = this.showDialog;
    },
  },
});
</script>
