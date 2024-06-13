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
        <el-popover placement="bottom" width="300" trigger="click">
          <div>
            <el-button
              size="small"
              icon="el-icon-plus"
              style="margin: 10px 0px"
              @click="createProject"
            >
              Добавить новый проект
            </el-button>
            <el-collapse v-model="activeNames">
              <el-collapse-item
                title="Выбрать проект"
                name="1"
                style="padding-left: 10px"
              >
                <div v-for="project in projects" class="list">
                  <el-button type="text" @click="changeProject(project)">
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

        <h1 class="project-title">{{ currentProject.title }}</h1>

        <el-popover placement="bottom-start" width="300" trigger="click">
          <div>
            <el-input
              v-model="currentProject.title"
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
            <el-form-item label="Начало задачи:" prop="start_time">
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

      <el-container v-if="tasks.length == 0" style="margin: 0px 20px">
        <p>Нет задач.</p>
      </el-container>

      <el-container v-else style="margin: 0px 20px">
        <el-aside width="357px">
          <Chart
            @load="loadTasks"
            :tasks="tasks"
            :profiles="profiles"
            :apiKey="apiKey"
            :currentProject="currentProject"
          />
        </el-aside>

        <el-container>
          <el-main style="padding: 0px 10px !important">
            <Diagram
              :tasks="tasks"
              :dateColumns="dateColumns"
              :currentPeriod="currentPeriod"
              :startDate="currentProject.start_date"
            />
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

    <AccessControl
      ref="accessControl"
      @input="updateAccess"
      :currentProject="currentProject"
      :profiles="profiles"
    />

    <SettingFields ref="settingFields" @input="updateFields" />
  </tasks-layout>
</template>

<script>
import Chart from "./chart/Chart.vue";
import Diagram from "./diagram/Diagram.vue";
import ModalProject from "./ModalProject.vue";
import AccessControl from "./AccessControl.vue";
import SettingFields from "./SettingFields.vue";

export default {
  components: {
    Diagram,
    Chart,
    ModalProject,
    AccessControl,
    SettingFields,
  },
  async created() {
    await this.loadProjects({});
    this.currentProject = this.projects[0];
    await this.loadTasks({});
    await this.loadProfiles({});
  },
  data() {
    return {
      apiKey: "{PLATRUM_API_KEY}",
      dialogVisible: false,
      visible: false,
      projects: [],
      currentProject: {},
      arrDate: [],
      allTasks: [],
      tasks: [],
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
    dateColumns() {
      let startDate = new Date(this.currentProject.start_date);
      let finishDate = new Date(this.currentProject.finish_date);

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
      let startDate = new Date(this.currentProject.start_date).getTime();
      let finishDate = new Date(this.currentProject.finish_date).getTime();
      let isAvailable = date >= startDate && date <= finishDate;
      if (!isAvailable) {
        this.newTask.start_date = this.prevStartDate ?? "";
        this.$message.error("Эта дата недоступна для выбора.");
      } else this.prevStartDate = this.newTask.start_date;
    },
    handleModalHide() {
      this.selectedProject = this.createDefaultProject();
    },
    showDialog(item) {
      this.dialogVisible = item;
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
    async loadTasks() {
      this.allTasks = await $platform.api.requestRoute(
        "tasks.api.task.list",
        {},
        {}
      );
      this.tasks = this.allTasks
        .filter((item) => item.diagramma_new == this.currentProject.title)
        .reverse();
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
      this.dialogVisible = true;
    },
    async storeProject(item) {
      try {
        const itemWithAccessRules = this.setItemAccessRules(item);
        const storedItem = await this.$modules.plugins.api.storeOne(
          "plugin-gantt.project",
          itemWithAccessRules
        );
        this.projects.push(storedItem);
        this.$uiNotify.success("Проект добавлен");
        await this.loadProject({});
      } catch (e) {
        this.$uiNotify.error("Ошибка при сохранении");
        throw e;
      }
    },
    changeProject(project) {
      this.arrDate = [];
      this.currentProject = project;
      this.tasks = this.allTasks.filter(
        (item) => item.diagramma_new == this.project.title
      );
    },
    async deleteProject() {
      await $platform.api.requestRoute(
        "plugins.api.storage.delete",
        { entity: "plugin-gantt.project", key: this.apiKey },
        { filter: [["title", "=", this.project.title]] }
      );
      this.$uiNotify.success("Проект удалён");
    },
    async createTask() {
      const projectEnd = new Date(this.currentProject.finish_date);
      const taskStart = new Date(this.newTask.start_date);

      const taskEnd = new Date(taskStart);
      taskEnd.setDate(taskEnd.getDate() + Number(this.newTask.time_plan));

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
            diagramma_new: this.currentProject.title,
            name: this.newTask.name,
            owner_user_id: "22086f8b917cd0417b85a85b8b7c32ac",
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
</style>
