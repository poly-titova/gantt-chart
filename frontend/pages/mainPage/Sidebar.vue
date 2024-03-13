<template>
  <ui-sidebar
    v-model="isSidebarVisible"
    title="Задание"
    class="sidebar"
    @hide="resetState"
  >
    <p>Заголовок: {{ task.name }}</p>
    <p>Описание: {{ getText(task.description) }}</p>
    <p>Исполнитель: {{ getProfile(task.responsible_user_ids) }}</p>
    <p>Начало работы: {{ getDate(task.start_date) }}</p>
    <p>Завершение работы: {{ getDate(task.finish_date) }}</p>
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
    task: Array,
  },
  data() {
    return {
      isSidebarVisible: false,
      profiles: [],
    };
  },
  async created() {
    await this.loadProfiles({});
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
    async loadProfiles() {
      this.profiles = await $platform.api.requestRoute('user.api.profile.list', {}, {});
    },
    getDate(date) {
      if (date !== null) {
        const ymd = date.replace(new RegExp(`T.*`), '').split(`-`);

        return `${ymd[2]}.${ymd[1]}.${ymd[0]}`;
      }
      
      return '';
    },
    getProfile(id) {
      return this.profiles[id].name;
    },
    getText(str) {
      if (str !== null) {
        const startIndex = str.indexOf('<p>') + 3;
        const endIndex = str.indexOf('</p>', startIndex);
        const text = str.substring(startIndex, endIndex);

        return text;
      }
      
      return str;
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
