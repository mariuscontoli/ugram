<template>
  <q-page padding class="row justify-center">
    <div>
      <q-card class="row col-4 justify-center">
        <q-card-section class="col-12 text-white bg-warning">
          <h4 class="q-pa-md text-center">Register</h4>
        </q-card-section>
        <q-form @submit="submitNewAccount" class="col-12">
          <q-card-section class="col-12">
            <q-input
              color="warning"
              class="col-10"
              v-model="username"
              required
              label="Username"
              ref="usernameInput"
              :rules="[async () => {
              const response = await $axios.get(`/check-username?username=${username}`)
              return !response.data.userExists
                ? true
                : 'Username already exists';
              }]"
            >
              <template v-slot:before>
                <q-icon name="account_circle" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="username = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <q-input
              color="warning"
              class="col-10"
              v-model="firstName"
              required
              label="First name"
            >
              <template v-slot:before>
                <q-icon name="person" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="firstName = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <q-input
              color="warning"
              class="col-10"
              v-model="lastName"
              required
              label="Last name"
            >
              <template v-slot:before>
                <q-icon name="person" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="lastName = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <q-input
              color="warning"
              class="col-10"
              v-model="email"
              required
              type="email"
              label="Email"
            >
              <template v-slot:before>
                <q-icon name="email" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="email = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <q-input
              color="warning"
              class="col-10 q-pa-none"
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="Password"
            >
              <template v-slot:before>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
                <q-icon
                  name="close"
                  @click="password = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <q-input
              color="warning"
              class="col-10"
              v-model="confirmPassword"
              :type="isPwdConfirm ? 'password' : 'text'"
              label="Confirm Password"
            >
              <template v-slot:before>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdConfirm = !isPwdConfirm"
                />
                <q-icon
                  name="close"
                  @click="confirmPassword = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section class="row col-12">
            <q-btn
              type="submit"
              color="warning"
              class="col-12 bg-primary"
              label="Submit"
            ></q-btn>
          </q-card-section>
        </q-form>
        <q-card-section class="row justify-around col-12">
          <GoogleSigninButton class="col-6" />
          <q-btn class="col-6" to="/login" label="Login"></q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GoogleSigninButton from '../components/GoogleSigninButton.vue';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'RegisterPage',
  components: { GoogleSigninButton },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      username: '' as string,
      firstName: '' as string,
      lastName: '' as string,
      email: '' as string,
      password: '' as string,
      confirmPassword: '' as string,
      isPwd: true,
      isPwdConfirm: true,
    };
  },
  methods: {
    async submitNewAccount() {
      if (!this.checkCredentials()) return;
      try {
        const body = {
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        };
        const res = await this.$axios.post('/register', body);
        const data = res.data;
        this.store.login(data.user.id, data.user.accessToken);
        this.createCookie(data.user.accessToken);
        this.$router.push('/');
      } catch (error: any) {
        this.notifyError(error.response.data.error.message);
        console.log(error);
      }
    },
    createCookie(jwtToken: string) {
      const d = new Date();
      d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
      const expires = d.toUTCString();
      this.$q.cookies.set('jwtToken', jwtToken, {
        expires,
        domain: 'localhost',
        secure: false,
        path: '/',
        sameSite: 'Lax',
      });
    },
    checkCredentials() {
      if (this.password != this.confirmPassword) {
        this.notifyError('Passwords are not the same');
        return false;
      }
      return true;
    },
    notifyError(message: string) {
      this.$q.notify({
        message: message,
        color: 'negative',
      });
    },
  },
});
</script>
