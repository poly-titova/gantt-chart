<template>
  <ui-sidebar
    v-model="isSidebarVisible"
    title="Проект"
    class="sidebar"
    @hide="resetState"
  >
    <p>Заголовок: {{ project.title }}</p>
    <p>Начало работы: {{ getDate(project.start_date) }}</p>
    <p>Завершение работы: {{ getDate(project.finish_date) }}</p>
    <el-button
      size="small"
      @click="closeSidebar"
    >
      <span>Закрыть</span>
    </el-button>
  </ui-sidebar>
</template>

<script>
export default {
  props: {
    value: Object,
    project: Array,
  },
  data() {
    return {
      isSidebarVisible: false,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.item = $utils.object.clone(val);
      },
    },
  },
  methods: {
    open() {
      this.isSidebarVisible = true;
    },
    async closeSidebar() {
      this.resetState();
    },
    resetState() {
      this.isSidebarVisible = false;
    },
    getDate(date) {
      if (date !== null) {
        const ymd = date.replace(new RegExp(`T.*`), '').split(`-`);

        return `${ymd[2]}.${ymd[1]}.${ymd[0]}`;
      }
      
      return '';
    },
  },
};
</script>

<style lang="less" scoped>
.sidebar {
  top: 0 !important;
  width: 550px;
  background: white;

  .content {
    padding-top: 20px;
    padding-right: 30px;

    .text-editor {
      line-height: 20px;
    }
  }
}
</style>
