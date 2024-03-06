<template>
  <el-collapse>
    <Item
      v-for="project in projects"
      :key="project.id"
      :project="project"
      :apiKey="apiKey"
    />
  </el-collapse>
</template>

<script>
import Item from './Item';

export default {
  props: {
    projects: Array,
    apiKey: String,
  },
  data() {
    return {};
  },
  components: {
    Item,
  },
  methods: {},
}
</script>
