<template>
  <div class="row col-12">
    <q-avatar class="col-5 row justify-center items-center"
      ><q-img src="../../public/profile_picture.webp" />
    </q-avatar>
    <div class="col-lg-5 col-md-6 col-xs-7 q-mt-lg">
      <div class="row col-12">
        <h4 class="ellipsis col-lg-6 col-md-8 col-xs-9 q-ma-none">
          {{username}}
        </h4>
        <h5 class="ellipsis col-lg-6 col-md-8 col-xs-9 q-ma-none">
          {{firstName}} {{ lastName }}
        </h5>
        <q-btn
          v-if="currentUser"
          push
          class="col-2 q-ml-md"
          label="Settings"
          @click="showDialog = !showDialog"
        />
        <dialog-settings-profile
          :showDialog="showDialog"
          :firstName="firstName"
          :lastName="lastName"
          :email="email"
          :phone="phone"
          :registrationDate="registrationDate"
          @update="updateUser"
          @updateShow="updateShow"
        />
      </div>
      <div class="row justify-center justify-between q-mt-lg">
        <p class="text-h6 col-xs-12 col-sm-4 profile-counter text-center">
          0 publications
        </p>
        <p class="text-h6 col-xs-12 col-sm-4 profile-counter text-center">
          0 followers
        </p>
        <p class="text-h6 col-xs-12 col-sm-4 profile-counter text-center">
          0 following
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DialogSettingsProfile from './DialogSettingsProfile.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProfileUpperLayout',
  components: {
    DialogSettingsProfile,
  },
  props: {
    currentUser: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDialog: false,
      username: {} as string,
      email: {} as string,
      firstName: {} as string,
      lastName: {} as string,
      phone: {} as string,
      registrationDate: {} as string,
    };
  },
  created() {
    this.username = this.userInfo.username;
    this.email = this.userInfo.email;
    this.firstName = this.userInfo.firstName;
    this.lastName = this.userInfo.lastName;
    this.phone = '0673824567';
    this.registrationDate = this.userInfo.registrationDate;
  },
  methods: {
    updateShow(isOpen: boolean) {
      this.showDialog = isOpen;
    },
    async updateUser(newFirsName: string, newLastName: string, newEmail: string, newPhone: string) {
      this.firstName = newFirsName;
      this.lastName = newLastName;
      this.email = newEmail;
      this.phone = newPhone;
      const body = {
        firstName: this.firstName, lastName: this.lastName, email: this.email, phone: this.phone
      }
      await this.$axios.patch(
        `/user/${this.userInfo.id}`, body
      );
    }
  },
});
</script>
