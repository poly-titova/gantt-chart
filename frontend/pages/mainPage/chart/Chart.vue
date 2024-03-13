<template>
  <el-table
    :data="tasks"
    border
    @current-change="handleCurrentChange"
    style="width: 100%">
    <el-table-column
      type="index"
      label="Номер"
      width="70">
    </el-table-column>
    <el-table-column
      prop="name"
      label="Наименование">
    </el-table-column>
  </el-table>

  <sidebar
    ref="sidebar"
    :task="task"
  />
</template>

<script>
import Sidebar from './../Sidebar.vue';

export default {
  props: {
    tasks: Array,
  },
  data() {
    return {
      task: {},
    };
  },
  components: {
    Sidebar,
  },
  methods: {
    handleCurrentChange(val) {
      this.$refs.sidebar.open();
      this.task = val;
    },
  }
}
</script>
