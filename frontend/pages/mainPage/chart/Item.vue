<template>
  <el-collapse-item
    :title="project.title"
    :name="project.id">
    <p>Заголовок: {{ project.title }}</p>
    <p>Начало работы: {{ getDate(project.start_date) }}</p>
    <p>Завершение работы: {{ getDate(project.finish_date) }}</p>
    <el-button @click="openSidebar">Раскрыть проект</el-button>
    <el-button type="danger" @click="deleteProject">Удалить проект</el-button>

    <sidebar
      ref="sidebar"
      :project="project"
    />
  </el-collapse-item>
</template>

<script>
import Sidebar from './../Sidebar';

export default {
  props: {
    project: Array,
    apiKey: String,
  },
  data() {
    return {}
  },
  components: {
    Sidebar,
  },
  methods: {
    openSidebar() {
      this.$refs.sidebar.open();
    },
    getDate(date) {
      if (date !== null) {
        const ymd = date.replace(new RegExp(`T.*`), '').split(`-`);

        return `${ymd[2]}.${ymd[1]}.${ymd[0]}`;
      }
      
      return '';
    },
    async deleteProject() {
      await $platform.api.requestRoute('plugins.api.storage.delete', { entity: 'plugin-gantt.project', key: this.apiKey }, { filter: [["title", "=", this.project.title]] });
      this.$uiNotify.success('Проект удалён');
    }
  }
}
</script>
