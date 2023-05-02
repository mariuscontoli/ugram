<template>
  <div class="col-12">{{ comment.authorUsername }}  : {{ comment.content }}</div>
</template>

<script lang="ts">
import { Comment } from '../models/models';
import { PropType } from 'vue';

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CommentPhoto',
  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true
    }
  },
  methods: {

  }
})
</script>
