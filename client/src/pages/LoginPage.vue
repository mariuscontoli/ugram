<template>
  <q-page padding class="row justify-center">
    <div>
      <q-card class="row col-4 justify-center">
        <q-card-section class="col-12 text-white bg-warning">
          <h4 class="q-pa-md text-center">Login</h4>
        </q-card-section>
        <q-form @submit="submitAccount" class="col-12">
          <q-card-section class="col-12">
            <q-input class="col-10" v-model="email" type="email" label="Email">
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
              class="col-10"
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
          </q-card-section>
          <q-card-section class="row col-12">
            <q-btn
              type="submit"
              color="warning"
              class="col-12 bg-primary"
              label="Login"
            ></q-btn>
          </q-card-section>
        </q-form>
        <q-card-section class="row justify-around col-12">
<!--          <GoogleSigninButton class="col-6" /> TO ACTIVATE THIS FEATURE, uncomment everything in boot/googleoauth.js   -->
          <q-btn class="col-6" to="/register" label="Create Account"></q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import GoogleSigninButton from '../components/GoogleSigninButton.vue';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'LoginPage',
  // components: { GoogleSigninButton },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      email: '',
      password: '',
      isPwd: true,
    };
  },
  methods: {
    async submitAccount() {
      try {
        const body = {
          email: this.email,
          password: this.password,
        };
        const res = await this.$axios.post('/login', body);
        const data = res.data;
        this.store.login(data.user.id, data.user.accessToken);
        this.createCookie(data.user.accessToken);
        this.$router.push('/');
      } catch (error: any) {
        this.$q.notify({
          message: error.response.data.error.message,
          color: 'negative',
        });
      }
    },
    createCookie(jwtToken: string) {
      const d = new Date();
      d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
      const expires = d.toUTCString();
      this.$q.cookies.set('jwtToken', jwtToken, {
        expires,
        domain: 'localhost',
        secure: false,
        path: '/',
        sameSite: 'Lax',
      });
    },
  },
});
</script>
