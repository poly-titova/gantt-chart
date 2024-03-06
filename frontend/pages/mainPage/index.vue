<template>
  <tasks-layout>
    <div slot="toolbar">
      <el-button
        type="primary"
        size="small"
        @click="createProject">
        Создать проект
      </el-button>
    </div>
    <ui-collection-panel slot="sidebar">
      <Chart
        :projects="projects"
        :apiKey="apiKey"
      />
    </ui-collection-panel>

    <Diagram :projects="projects" />

    <ModalProject
      v-model="selectedProject"
      @input="storeProject"
      @hide="handleModalHide"
      @show="showDialog"
      :dialogVisible="dialogVisible"
    />
  </tasks-layout>
</template>

<script>
import Chart from './chart/Chart.vue';
import Diagram from './diagram/Diagram.vue';
import ModalProject from './ModalProject.vue';

export default {
  components: {
    Diagram,
    Chart,
    ModalProject,
  },
  async created() {
    await this.loadProjects({});
  },
  data() {
    return {
      apiKey: 'eeb845c1-c5f8-4856-b4b0-f29d5cb6ab71',
      dialogVisible: false,
      projects: [],
    };
  },
  methods: {
    handleModalHide() {
      this.selectedProject = this.createDefaultProject();
    },
    showDialog(item) {
      this.dialogVisible = item;
    },
    createDefaultProject() {
      return {
        title: null,
        start_date: null,
        finish_date: null,
      };
    },
    setItemAccessRules(item) {
      return {
        ...item,
        access_rules: [
          { action: 'view', allow_everyone: true },
          { action: 'edit', allow_everyone: true },
        ],
      };
    },
    async loadProjects() {
      this.projects = await $platform.api.requestRoute('plugins.api.storage.select', { entity: 'plugin-gantt.project', key: this.apiKey }, {});
    },
    async createProject() {
      this.dialogVisible = true;
    },
    async storeProject(item) {
      try {
        const itemWithAccessRules = this.setItemAccessRules(item);
        const storedItem = await this.$modules.plugins.api.storeOne('plugin-gantt.project', itemWithAccessRules);
        this.projects.push(storedItem);
        await $platform.api.requestRoute('tasks.api.board.panel.store', {key: this.apiKey}, {board_id: 306, name: item.title});
        this.$uiNotify.success('Проект добавлен');
        await this.loadProject({});
      } catch (e) {
        this.$uiNotify.error('Ошибка при сохранении');
        throw e;
      }
    },
  },
};
</script>
