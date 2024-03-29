<template>
  <tasks-layout>
    <p v-if="projects.length == 0">
      Вам пока не доступно ни одного проекта. 
      <el-button type="text" @click="createProject">Создайте первый проект</el-button>
      чтобы начать работать</p>

    <el-container v-else>
      <el-header>
        <el-popover
          placement="bottom"
          width="300"
          trigger="click">
          <div>
            <el-button
              size="small"
              icon="el-icon-plus"
              style="margin: 10px 0px;"
              @click="createProject">
              Добавить новый проект
            </el-button>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="Выбрать проект" name="1" style="padding-left: 10px;">
                <div
                  v-for="project in projects"
                  class="list">
                  <el-button
                    type="text"
                    @click="changeProject(project.title)">
                    {{ project.title }}
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-button
            slot="reference"
            icon="el-icon-menu"
            class="bt-icon"
          ></el-button>
        </el-popover>

        <h1 class="project-title">{{ currentProject }}</h1>

        <el-popover
          placement="bottom"
          width="300"
          trigger="click">
          <div>
            <el-input v-model="currentProject"></el-input>
            <el-divider></el-divider>
            <el-button
              icon="el-icon-delete"
              @click="deleteProject">
              Удалить
            </el-button>
          </div>
          <el-button
            slot="reference"
            icon="el-icon-setting"
            class="bt-icon"
          ></el-button>
        </el-popover>

        <el-popover
          placement="bottom"
          width="100"
          trigger="click">
            <el-button
              v-for="period in periods"
              @click="changePeriod(period.value)"
              style="width: 100%; margin-bottom: 3px; margin-left: 0px;">
              {{ period.label }}
            </el-button>
          <el-button
            slot="reference"
            icon="el-icon-date"
            class="bt-icon"
          ></el-button>
        </el-popover>

        <el-popover
          placement="bottom"
          width="370"
          trigger="click"
          v-model="visible">
          <el-form ref="form" :model="newTask">
            <el-form-item style="text-align: right; margin: 0;">
              <el-button
                type="success"
                size="mini"
                @click="createTask()"
              >
                <span>Создать</span>
              </el-button>
              <i class="el-icon-close" style="margin-left: 15px; padding: 8px 0px;" @click="visible = false"></i>
            </el-form-item>

            <el-form-item
              prop="name">
              <el-input v-model="newTask.name" size="small" placeholder="Название задачи"/>
            </el-form-item>

            <el-form-item
              prop="description">
              <el-input
                v-model="newTask.description"
                type="textarea"
                :rows="2"
                size="small"
                placeholder="Описание задачи"/>
            </el-form-item>

            <el-form-item
              prop="executor"
            >
              <orgschema-user-selector v-model="newTask.executor" :font-size="14" placeholder="Исполнитель" />
            </el-form-item>

            <el-form-item
              prop="extension">
              <el-date-picker
                v-model="newTask.extension"
                type="daterange"
                start-placeholder="Начало"
                end-placeholder="Конец">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <el-button
            slot="reference"
            icon="el-icon-plus"
            class="bt-icon"
          ></el-button>
        </el-popover>
      </el-header>

      <el-container
        v-if="tasks.length == 0"
        style="margin: 0px 20px;">
        <p>Нет задач.</p>
      </el-container>

      <el-container
        v-else
        style="margin: 0px 20px;">
        <el-aside width="350px">
          <Chart
            :tasks="tasks"
            :profiles="profiles"/>
        </el-aside>

        <el-container>
          <el-header style="height: auto;">
            <Calendar
              :currentPeriod="currentPeriod"/>
          </el-header>

          <el-main style="padding: 15px;">
            <Diagram
              :tasks="tasks"
              :currentPeriod="currentPeriod"/>
          </el-main>
        </el-container>
      </el-container>
    </el-container>

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
import Calendar from './calendar/Calendar.vue';

export default {
  components: {
    Diagram,
    Chart,
    ModalProject,
    Calendar,
  },
  async created() {
    await this.loadProjects({});
    this.currentProject = this.projects[0].title;
    await this.loadTasks({});
    await this.loadProfiles({});
  },
  data() {
    return {
      apiKey: '{PLATRUM_API_KEY}',
      dialogVisible: false,
      visible: false,
      projects: [],
      currentProject: '',
      allTasks: [],
      tasks: [],
      profiles: [],
      periods: [
        {
          label: 'Год',
          value: '12',
        },
        {
          label: 'Полгода',
          value: '6',
        },
        {
          label: 'Квартал',
          value: '4',
        },
        {
          label: 'Месяц',
          value: '10',
        },
        {
          label: 'Неделя',
          value: '7',
        },
      ],
      currentPeriod: '7',
      newTask: {},
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
    changePeriod(value) {
      this.currentPeriod = value;
    },
    async loadTasks() {
      this.allTasks = await $platform.api.requestRoute('tasks.api.task.list', {}, {});
      this.tasks = this.allTasks.filter(item => item.diagramma_new == this.currentProject);
    },
    async loadProfiles() {
      this.profiles = await $platform.api.requestRoute('user.api.profile.list', {}, {});
    },
    async createProject() {
      this.dialogVisible = true;
    },
    async storeProject(item) {
      try {
        const itemWithAccessRules = this.setItemAccessRules(item);
        const storedItem = await this.$modules.plugins.api.storeOne('plugin-gantt.project', itemWithAccessRules);
        this.projects.push(storedItem);
        this.$uiNotify.success('Проект добавлен');
        await this.loadProject({});
      } catch (e) {
        this.$uiNotify.error('Ошибка при сохранении');
        throw e;
      }
    },
    changeProject(title) {
      this.currentProject = title;
      this.tasks = this.allTasks.filter(item => item.diagramma_new == this.currentProject);
    },
    async deleteProject() {
      await $platform.api.requestRoute('plugins.api.storage.delete', { entity: 'plugin-gantt.project', key: this.apiKey }, { filter: [["title", "=", this.project.title]] });
      this.$uiNotify.success('Проект удалён');
    },
  },
};
</script>

<style>
.list {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  padding-left: 15px;
  border-radius: 3px;
  background: #f4f4f4;
}

.bt-icon {
  width: 40px !important;
  height: 40px !important;
  padding-top: 12px !important;
  padding-left: 12px !important;
}

.project-title {
  display: inline-block;
  font-size: 24px;
  padding-top: 12px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
