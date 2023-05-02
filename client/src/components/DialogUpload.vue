<template>
  <div class="col-12">
    <q-dialog v-model="isOpen">
      <q-card class="row col-12">
        <q-bar class="col-12 bg-grey-5">
          <q-btn @click="closeUpload" dense flat label="close" v-close-popup>
          </q-btn>
          <q-space />
          <q-btn
            @click="confirmUpload"
            aria-disabled="true"
            dense
            flat
            label="Validate"
          >
          </q-btn>
        </q-bar>
        <q-card-section class="col-12">
          <q-card-section class="row col-12">
            <q-file
              filled
              bottom-slots
              v-model="imgFile"
              label="Label"
              counter
              :onchange="onFileUploaded"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click.stop.prevent="imgFile = undefined"
                  class="cursor-pointer"
                />
              </template>

              <template v-slot:hint> Field hint </template>
            </q-file>
          </q-card-section>
          <cropper
            @change="onChangeCrop"
            v-if="imgFile !== undefined"
            class="cropper"
            :src="imgBlob"
            :resizeImage="{ wheel: false }"
            :stencil-props="{
              minAspectRatio: 4 / 5,
              maxAspectRatio: 16 / 9,
            }"
            min-width="400"
            min-height="400"
          />
          <div>
            <q-input
              color="warning"
              bottom-slots
              v-model="descriptionCopy"
              label="Description"
              counter
              required
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
                  :onclick="(isUploaded = false)"
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
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/stores/store';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default defineComponent({
  // eslint-disable-next-line vue/no-unused-components
  components: { Cropper },
  name: 'DialogUpload',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      imgFile: undefined,
      imgBlob: '',
      isOpen: this.showDialog,
      isUploadOpen: false,
      tag: '',
      descriptionCopy: '',
      hashtagsCopy: [] as string[],
      mentionsCopy: [] as string[],
      mention: '',
      photoUrl: '',
      base64: '' as string | ArrayBuffer,
      isUploaded: false,
    };
  },
  created() {
    this.descriptionCopy = '';
  },
  methods: {
    onChangeCrop({ canvas }: { canvas: any }) {
      this.base64 = canvas.toDataURL();
    },
    onFileUploaded(evt: Event) {
      const target = evt.target as HTMLInputElement;
      if (target && target.files) {
        console.log('abc', target.files.item(0));
        this.imgBlob = URL.createObjectURL(target.files[0]);
      } else {
        this.isUploaded = false;
      }
    },
    uploadPicture() {
      this.isUploadOpen = true;
    },
    validateTag() {
      this.hashtagsCopy.push(this.tag);
      this.tag = '';
    },
    validateMention() {
      this.mentionsCopy.push(this.mention);
      this.tag = '';
    },
    deleteTag(tag: string) {
      const index = this.hashtagsCopy.findIndex((item) => item === tag);
      this.hashtagsCopy.splice(index, 1);
    },
    deleteMention(name: string) {
      const index = this.mentionsCopy.findIndex((item) => item === name);
      this.mentionsCopy.splice(index, 1);
    },
    async confirmUpload() {
      const body = {
        description: this.descriptionCopy,
        keywords: this.hashtagsCopy,
        mentions: this.mentionsCopy,
        photoUrl: this.base64,
      };
      if (this.descriptionCopy != '' || this.base64 != '') {
        await this.$axios.post(`/user/${this.store.getUserId}/photos`, body);
        this.isOpen = false;
        window.location.reload();
      }
    },
    closeUpload() {
      console.log('close upload');
    },
  },
  watch: {
    isOpen() {
      this.$emit('uploadShow', this.isOpen);
    },
    showDialog() {
      this.isOpen = this.showDialog;
    },
  },
});
</script>
