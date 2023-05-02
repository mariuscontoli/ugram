<template>
  <GoogleSignInButton
    :type="$q.platform.is.mobile || $q.screen.sm || $q.screen.xs ? 'icon' : ''"
    theme="outline"
    @success="handleSuccess"
    @error="handleError"
  ></GoogleSignInButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  GoogleSignInButton,
  type CredentialResponse,
} from 'vue3-google-signin';
import jwt_decode from 'jwt-decode';
import { GoogleInfos } from '../models/models';
import { useStore } from 'src/stores/store';

export default defineComponent({
  name: 'GoogleSigninButton',
  components: { GoogleSignInButton },
  setup() {
    const store = useStore();
    return { store };
  },
  methods: {
    async handleSuccess(response: CredentialResponse) {
      const { credential } = response;
      const googleInfos = jwt_decode(credential as string) as GoogleInfos;
      await this.loginAccount(googleInfos)
      this.$router.push('/');
    },
    handleError() {
      console.error('Login failed');
    },
    async loginAccount(googleInfos: GoogleInfos) {
      try {
        const body = {
          email: googleInfos.email,
          password: googleInfos.sub,
        };
        const res = await this.$axios.post(
          '/login',
          body
        );
        const data = res.data;
        this.store.login(data.user.id, data.user.accessToken);
        this.createCookie(data.user.accessToken);
      } catch (error: any) {
        if (!error.response.data.success)
          await this.registerAccount(googleInfos);
        console.log(error);
      }
    },
    async registerAccount(googleInfos: GoogleInfos) {
      try {
        const body = {
          username: googleInfos.name,
          firstName: googleInfos.given_name,
          lastName: googleInfos.family_name,
          email: googleInfos.email,
          password: googleInfos.sub,
        };
        const res = await this.$axios.post(
          '/register',
          body
        );
        const data = res.data;
        this.store.login(data.user.id, data.user.accessToken);
        this.createCookie(data.user.accessToken);
      } catch (error) {
          console.log(error);
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
    notifyError(message: string) {
      this.$q.notify({
        message: message,
        color: 'negative',
      });
    },
  },
});
</script>
