<template>
  <tasks-layout>
    <p v-if="projects.length == 0">
      Вам пока не доступно ни одного проекта.
      <el-button type="text" @click="createProject"
        >Создайте первый проект</el-button
      >
      чтобы начать работать
    </p>

    <el-container v-else>
      <el-header>
        <el-popover placement="bottom-start" width="300" trigger="click">
          <div>
            <el-button
              size="small"
              icon="el-icon-plus"
              style="margin: 10px 0px"
              @click="createProject"
            >
              Добавить новый проект
            </el-button>
            <el-collapse v-model="activeProjects">
              <el-collapse-item
                title="Выбрать проект"
                name="1"
                style="padding-left: 10px"
              >
                <div v-for="project in projects" class="list">
                  <el-button type="text" @click="changeView(project)">
                    {{ project.title }}
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>

            <el-button
              size="small"
              icon="el-icon-plus"
              style="margin: 10px 0px;"
              @click="createPattern">
              Создать шаблон проекта
            </el-button>
            <el-collapse v-model="activePatterns" v-if="patterns.length !== 0">
              <el-collapse-item
                title="Выбрать шаблон"
                name="1"
                style="padding-left: 10px"
              >
                <div v-for="pattern in patterns" class="list">
                  <el-button type="text" @click="changeView(pattern)">
                    {{ pattern.title }}
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

        <h1 class="project-title">{{ currentView.title }}</h1>
        <p v-if="currentView.type == 'pattern'" class="pattern">Шаблон</p>

        <el-popover v-if="currentView.type == 'project'" placement="bottom-start" width="300" trigger="click">
          <div>
            <el-input
              v-model="currentView.title"
              style="margin-bottom: 5px"
            ></el-input>
            <button class="bt-menu" @click="openAccessControl()">
              Управление доступами
            </button>
            <button class="bt-menu" @click="openSettingFields()">
              Настройка полей
            </button>
            <el-divider></el-divider>
            <el-button icon="el-icon-delete" @click="deleteProject">
              Удалить
            </el-button>
          </div>
          <el-button
            slot="reference"
            icon="el-icon-setting"
            class="bt-icon"
          ></el-button>
        </el-popover>

        <el-popover v-else placement="bottom-start" width="300" trigger="click">
          <div>
            <el-input
              v-model="currentView.title"
              style="margin-bottom: 5px"
            ></el-input>
            <el-divider></el-divider>
            <el-button icon="el-icon-delete" @click="deletePattern">
              Удалить
            </el-button>
          </div>
          <el-button
            slot="reference"
            icon="el-icon-setting"
            class="bt-icon"
          ></el-button>
        </el-popover>

        <el-popover placement="bottom" width="100" trigger="click">
          <el-button
            v-for="period in periods"
            @click="changePeriod(period.value)"
            style="width: 100%; margin-bottom: 3px; margin-left: 0px"
          >
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
          v-model="visible"
        >
          <el-form ref="form" :model="newTask">
            <el-form-item style="text-align: right; margin: 0">
              <el-button type="success" size="mini" @click="createTask">
                <span>Создать</span>
              </el-button>
              <i
                class="el-icon-close"
                style="margin-left: 15px; padding: 8px 0px"
                @click="visible = false"
              ></i>
            </el-form-item>

            <el-form-item prop="name">
              <el-input
                v-model="newTask.name"
                size="small"
                placeholder="Название задачи"
              />
            </el-form-item>

            <el-form-item prop="description">
              <el-input
                v-model="newTask.description"
                type="textarea"
                :rows="2"
                size="small"
                placeholder="Описание задачи"
              />
            </el-form-item>

            <el-form-item prop="executor">
              <orgschema-user-selector
                v-model="newTask.executor"
                :font-size="14"
                placeholder="Исполнитель"
              />
            </el-form-item>

            <el-form-item label="Планируемое время:" prop="time_plan">
              <el-input-number v-model="newTask.time_plan" size="small" />
            </el-form-item>

            <el-form-item label="Начало задачи:" prop="start_date">
              <el-date-picker
                v-model="newTask.start_date"
                @change="handleDateChange"
                placeholder="Выберите дату"
              />
            </el-form-item>
          </el-form>
          <el-button
            slot="reference"
            icon="el-icon-plus"
            class="bt-icon"
          ></el-button>
        </el-popover>
      </el-header>

      <el-container v-if="currentTasks.length == 0" style="margin: 0px 20px">
        <p>Нет задач.</p>
      </el-container>

      <el-container v-else style="margin: 0px 20px">
        <el-aside width="357px">
          <Chart
            @load="loadTasks"
            :tasks="currentTasks"
            :profiles="profiles"
            :apiKey="apiKey"
            :currentView="currentView"
          />
        </el-aside>

        <el-container v-if="this.currentView.type == 'project'">
          <el-main style="padding: 0px 10px !important">
            <Diagram
              :tasks="currentTasks"
              :dateColumns="dateColumns"
              :currentPeriod="currentPeriod"
              :startDate="currentView.start_date"
              :endDate="currentView.finish_date"
            />
          </el-main>
        </el-container>
      </el-container>
    </el-container>

    <ModalProject
      v-model="selectedProject"
      @input="storeProject"
      @hide="handleProjectHide"
      @show="showProjectDialog"
      :patterns="patterns"
      :dialogProjectVisible="dialogProjectVisible"
    />

    <ModalPattern
      v-model="selectedPattern"
      @input="storePattern"
      @hide="handlePatternHide"
      @show="showPatternDialog"
      :dialogPatternVisible="dialogPatternVisible"
    />

    <AccessControl
      ref="accessControl"
      @input="updateAccess"
      :currentView="currentView"
      :profiles="profiles"
    />

    <SettingFields ref="settingFields" @input="updateFields" />
  </tasks-layout>
</template>

<script>
import Chart from "./chart/Chart.vue";
import Diagram from "./diagram/Diagram.vue";
import ModalProject from "./ModalProject.vue";
import ModalPattern from "./ModalPattern.vue";
import AccessControl from "./AccessControl.vue";
import SettingFields from "./SettingFields.vue";

export default {
  components: {
    Diagram,
    Chart,
    ModalProject,
    ModalPattern,
    AccessControl,
    SettingFields,
  },
  async created() {
    await this.loadProjects({});
    await this.loadPatterns({});
    this.currentView = this.projects[0];
    await this.loadTasks({});
    await this.loadProfiles({});
  },
  data() {
    return {
      apiKey: "{PLATRUM_API_KEY}",
      dialogProjectVisible: false,
      dialogPatternVisible: false,
      visible: false,
      projects: [],
      patterns: [],
      selectedProject: [],
      selectedPattern: [],
      currentView: {},
      arrDate: [],
      allTasks: [],
      profiles: [],
      periods: [
        {
          label: "По месяцам",
          value: "12",
        },
        {
          label: "По неделям",
          value: "15",
        },
        {
          label: "По дням",
          value: "10",
        },
      ],
      currentPeriod: "10",
      newTask: {},
      prevStartDate: null,
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (!val) this.newTask = {};
      },
    },
    newTask: {
      handler(val, oldVal) {
        if (Object.keys(oldVal).length === 0)
          this.prevStartDate = val.start_date;
      },
      deep: true,
    },
  },
  computed: {
    currentTasks() {
      if (this.currentView.type == 'pattern') {
        return this.currentView.tasks;
      } else {
        return this.allTasks.filter(item => item.diagramma_new == this.currentView.title).reverse();
      } 
    },
    dateColumns() {
      let startDate = new Date(this.currentView.start_date);
      let finishDate = new Date(this.currentView.finish_date);

      function pad(s) {
        return ("00" + s).slice(-2);
      }

      while (startDate.getTime() != finishDate.getTime()) {
        this.arrDate.push(
          "" +
            startDate.getFullYear() +
            "-" +
            pad(startDate.getMonth() + 1) +
            "-" +
            pad(startDate.getDate())
        );
        startDate.setDate(startDate.getDate() + 1);
      }

      this.arrDate.push(
        "" +
          finishDate.getFullYear() +
          "-" +
          pad(finishDate.getMonth() + 1) +
          "-" +
          pad(finishDate.getDate())
      );
      return this.arrDate;
    },
  },
  methods: {
    handleDateChange(value) {
      const date = new Date(value).getTime();
      let startDate = new Date(this.currentView.start_date).getTime();
      let finishDate = new Date(this.currentView.finish_date).getTime();
      let isAvailable = date >= startDate && date <= finishDate;
      if (!isAvailable) {
        this.newTask.start_date = this.prevStartDate ?? "";
        this.$message.error("Эта дата недоступна для выбора.");
      } else this.prevStartDate = this.newTask.start_date;
    },
    handleProjectHide() {
      this.selectedProject = this.createDefaultProject();
    },
    handlePatternHide() {
      this.selectedPattern = this.createDefaultPattern();
    },
    showProjectDialog(item) {
      this.dialogProjectVisible = item;
    },
    showPatternDialog(item) {
      this.dialogPatternVisible = item;
    },
    openAccessControl() {
      this.$refs.accessControl.open();
    },
    openSettingFields() {
      this.$refs.settingFields.open();
    },
    createDefaultProject() {
      return {
        title: null,
        start_date: null,
        finish_date: null,
      };
    },
    createDefaultPattern() {
      return {
        title: null,
        tasks: [],
      };
    },
    setItemAccessRules(item) {
      return {
        ...item,
        access_rules: [
          { action: "view", allow_everyone: true },
          { action: "edit", allow_everyone: true },
        ],
      };
    },
    async loadProjects() {
      this.projects = await $platform.api.requestRoute(
        "plugins.api.storage.select",
        { entity: "plugin-gantt.project", key: this.apiKey },
        {}
      );
    },
    async loadPatterns() {
      this.patterns = await $platform.api.requestRoute(
        "plugins.api.storage.select",
        { entity: "plugin-gantt.pattern", key: this.apiKey },
        {}
      );
    },
    async loadTasks() {
      this.allTasks = await $platform.api.requestRoute(
        "tasks.api.task.list",
        {},
        {}
      );
    },
    async loadProfiles() {
      this.profiles = await $platform.api.requestRoute(
        "user.api.profile.list",
        {},
        {}
      );
    },
    changePeriod(value) {
      this.currentPeriod = value;
    },
    createProject() {
      this.dialogProjectVisible = true;
    },
    createPattern() {
      this.dialogPatternVisible = true;
    },
    async storeProject(item) {
      try {
        const itemWithAccessRules = this.setItemAccessRules(item);
        const storedItem = await this.$modules.plugins.api.storeOne(
          "plugin-gantt.project",
          itemWithAccessRules
        );
        this.projects.push(storedItem);
        await this.loadProjects({});
        this.$uiNotify.success("Проект добавлен");

        if (item.tasks !== null) {
          item.tasks.map((task) => {
            console.log('create', task)
            $platform.api.requestRoute(
              "tasks.api.task.create",
              { key: this.apiKey },
              {
                can_edit: true,
                category_key: "task",
                description: task.description,
                diagramma_new: item.title,
                name: task.name,
                responsible_user_ids: [''],
                recurrence_data: {},
                relations: [],
                status_key: "new",
                time_plan: task.time_plan,
              }
            );
          });

          await this.loadTasks({});
        }
      } catch (e) {
        this.$uiNotify.error("Ошибка при сохранении");
        throw e;
      }
    },
    async storePattern(item, tasks) {
      try {
        item.tasks = tasks;
        const itemWithAccessRules = this.setItemAccessRules(item);
        const storedItem = await this.$modules.plugins.api.storeOne(
          "plugin-gantt.pattern",
          itemWithAccessRules
        );
        this.patterns.push(storedItem);
        await this.loadPatterns({});
        this.$uiNotify.success("Шаблон добавлен");
      } catch (e) {
        this.$uiNotify.error("Ошибка при сохранении");
        throw e;
      }
    },
    changeView(view) {
      this.arrDate = [];
      this.currentView = view;
    },
    async deleteProject() {
      await $platform.api.requestRoute(
        "plugins.api.storage.delete",
        { entity: "plugin-gantt.project", key: this.apiKey },
        { filter: [["title", "=", this.currentView.title]] }
      );
      this.$uiNotify.success("Проект удалён");
      await this.loadProject({});
      this.currentView = this.projects[0];
    },
    async deletePattern() {
      await $platform.api.requestRoute(
        "plugins.api.storage.delete",
        { entity: "plugin-gantt.pattern", key: this.apiKey },
        { filter: [["title", "=", this.currentView.title]] }
      );
      this.$uiNotify.success("Шаблон удалён");
      await this.loadPatterns({});
      this.currentView = this.projects[0];
    },
    async createTask() {
      const projectEnd = new Date(this.currentView.finish_date);
      const taskStart = new Date(this.newTask.start_date);

      const taskEnd = new Date(taskStart);
      taskEnd.setDate(taskEnd.getDate() + Number(this.newTask.time_plan) - 1);

      if (projectEnd < taskEnd) {
        this.$message.error("Ошибка");
      } else {
        await $platform.api.requestRoute(
          "tasks.api.task.create",
          { key: this.apiKey },
          {
            can_edit: true,
            category_key: "task",
            description: this.newTask.description,
            diagramma_new: this.currentView.title,
            name: this.newTask.name,
            recurrence_data: {},
            relations: [],
            responsible_user_ids: [this.newTask.executor],
            start_date: this.newTask.start_date,
            status_key: "new",
            time_plan: this.newTask.time_plan,
          }
        );
        this.$uiNotify.success("Задание создано");
        this.visible = false;
        this.newTask = {};
        await this.loadTasks({});
      }
    },
    async updateAccess() {
      console.log("success");
    },
    async updateFields() {
      console.log("success");
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

.bt-menu {
  background-color: #ffffff;
  border: none;
  color: #606266;
  height: 40px;
  width: 100%;
  text-align: left;
  padding-left: 0px;
  font-size: 14px;
  line-height: 40px;
  text-decoration: none;
}

.bt-menu:hover {
  background-color: #eef0ff;
}

.project-title {
  display: inline-block;
  font-size: 24px;
  padding-top: 12px;
  padding-left: 10px;
  padding-right: 10px;
}

.pattern {
  display: inline-block;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
  font-size: 14px;
} 
</style>
