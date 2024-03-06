<template>
  <Collapse
    :projects="projects"
    :apiKey="apiKey"
  />
</template>

<script>
import Collapse from './Collapse';

export default {
  props: {
    projects: Array,
    apiKey: String,
  },
  data() {
    return {};
  },
  components: {
    Collapse
  },
}
</script>
