import { defineStore } from 'pinia';
import axios, {AxiosError} from 'axios';
import { Cookies } from 'quasar';

export const useStore = defineStore('store', {
  state: () => ({
    isLogged: false,
    userId: undefined as unknown as number
  }),
  getters: {
    getisLogged: (state) => state.isLogged,
    getUserId: (state) => state.userId,
  },
  actions: {
    setupAxiosInterceptors() {
      axios.interceptors.response.use(
        response => response,
        (error: AxiosError) => {
          console.log(error.response)
          if (error.response?.data.message === 'Invalid token' || error.response?.data.message === 'Token expired') {
            this.logout()
          }
          return Promise.reject(error)
        }
      )
    },
    login(userId: number, token: string) {
      this.isLogged = true;
      this.userId = userId;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    },
    logout() {
      this.isLogged = false;
      Cookies.remove('jwtToken');
      console.log('logout');
      this.userId = undefined as unknown as number;
      axios.defaults.headers.common['Authorization'] = undefined;
    }
  },
  persist: true,
});
