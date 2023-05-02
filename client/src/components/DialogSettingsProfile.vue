<template>
  <div>
    <q-dialog v-model='isOpen'>
      <q-card>
        <q-bar class='col-12 bg-warning'>
          <q-btn @click='closeEdit' dense flat label='close' v-close-popup>
          </q-btn>
          <q-space />
          <q-btn @click='confirmEdit' dense flat label='Validate' v-close-popup>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class='text-h6'>Settings</div>
        </q-card-section>

        <q-card-section class='q-pt-none q-pr-xl q-pl-xl'>
          <q-input
            color='warning'
            bottom-slots
            v-model='firstNameCopy'
            label='First Name'
            counter
          >
            <template v-slot:prepend>
              <q-icon name='people' />
            </template>
            <template v-slot:append>
              <q-icon name='close' @click="firstNameCopy = ''" class='cursor-pointer' />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class='q-pt-none q-pr-xl q-pl-xl'>
          <q-input
            color='warning'
            bottom-slots
            v-model='lastNameCopy'
            label='Last Name'
            counter
          >
            <template v-slot:prepend>
              <q-icon name='people' />
            </template>
            <template v-slot:append>
              <q-icon name='close' @click="lastNameCopy = ''" class='cursor-pointer' />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class='q-pt-none q-pr-xl q-pl-xl'>
          <q-input
            color='warning'
            bottom-slots
            v-model='emailCopy'
            label='Email'
            counter
          >
            <template v-slot:prepend>
              <q-icon name='email' />
            </template>
            <template v-slot:append>
              <q-icon name='close' @click="emailCopy = ''" class='cursor-pointer' />
            </template>
          </q-input>
        </q-card-section>
        <!-- <q-card-section class='q-pt-none q-pr-xl q-pl-xl'>
          <q-input
            color='warning'
            bottom-slots
            v-model='phoneCopy'
            label='Phone'
            counter
          >
            <template v-slot:prepend>
              <q-icon name='phone' />
            </template>
            <template v-slot:append>
              <q-icon name='close' @click="phoneCopy = ''" class='cursor-pointer' />
            </template>
          </q-input>
        </q-card-section> -->
        <q-card-section class='row justify-center q-pt-none q-pr-xl q-pl-xl'>
          <div class='text-h8'>Member since : {{ dateObj.toLocaleDateString() }}</div>
        </q-card-section>
        <q-card-section class='row justify-center q-pt-none q-pr-xl q-pl-xl'>
          <q-btn @click="logout" icon="logout" label="Logout" color="warning"></q-btn>
        </q-card-section>
        <q-card-section class='row justify-center q-pt-none q-pr-xl q-pl-xl'>
          <q-btn @click="deleteAccount" icon="delete" label="Delete account" color="red"></q-btn>
        </q-card-section>

        <q-card-actions align='right'>
          <q-btn flat label='OK' color='primary' v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'DialogSettingsProfile',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    registrationDate: {
      type: String,
      required: true
    }
  },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      isOpen: this.showDialog,
      firstNameCopy: {} as string,
      lastNameCopy: {} as string,
      emailCopy: {} as string,
      phoneCopy: {} as string,
      dateObj: {} as Date
    };
  },
  created() {
    this.firstNameCopy = this.firstName;
    this.lastNameCopy = this.lastName;
    this.emailCopy = this.email;
    this.phoneCopy = this.phone;
    this.dateObj = new Date(this.registrationDate);
  },
  methods: {
    logout() {
      this.store.logout();
      this.$router.push('/login');
    },
    async deleteAccount() {
      await this.$axios.delete('/user/me');
      this.$q.cookies.remove('jwtToken');
      this.$router.push('/login');
    },
    confirmEdit() {
      this.$emit('update', this.firstNameCopy, this.lastNameCopy, this.emailCopy, this.phoneCopy);
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
