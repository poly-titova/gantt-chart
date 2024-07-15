<template>
  <ui-sidebar
    v-model="isSidebarVisible"
    title="Задание"
    class="sidebar"
    style="padding: 0px 20px"
    @hide="resetState"
  >
    <el-row>
      <el-col :span="8">
        <el-popover
          placement="bottom-start"
          width="500"
          trigger="click"
          v-model="visibleMake"
        >
          <div>
            <p
              style="
                margin-bottom: 10px;
                color: #606266;
                line-height: 1.4;
                font-size: 14px;
              "
            >
              Выберите задачу к которой будет привязана открытая задача:
            </p>

            <el-form ref="form" :model="soughtTask">
              <el-form-item prop="id" style="margin-bottom: 10px">
                <el-select
                  v-model="soughtTask.id"
                  filterable
                  placeholder="Найти задачу"
                  style="width: 474px !important"
                >
                  <el-option
                    v-for="selectTask in tasks"
                    :key="selectTask.id"
                    :label="selectTask.name"
                    :value="selectTask.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item style="margin: 0px">
                <el-button type="success" size="mini" @click="makeTask">
                  <span>Сделать подзадачей</span>
                </el-button>

                <el-button size="mini" @click="visibleMake = false">
                  <span>Отменить</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-button
            slot="reference"
            size="small"
            icon="el-icon-share"
            style="margin: 10px 0px"
          >
            Сделать подзадачей
          </el-button>
        </el-popover>
      </el-col>

      <el-col :span="8">
        <el-button
          size="small"
          icon="el-icon-link"
          style="margin: 10px 20px"
          @click=""
        >
          Связать задачу
        </el-button>
      </el-col>

      <el-col :span="8">
        <el-button
          size="small"
          icon="el-icon-delete"
          style="margin: 10px 0px 10px 10px"
          @click="deleteTask"
        >
          Удалить задачу
        </el-button>
      </el-col>
    </el-row>

    <el-form ref="form" :model="item" style="position: relative; height: 100%">
      <el-form-item prop="name" label="Название:">
        <el-input v-model="item.name" size="small" />
      </el-form-item>

      <el-form-item prop="description" label="Описание:">
        <el-input
          v-model="item.description"
          type="textarea"
          :rows="2"
          size="small"
        />
      </el-form-item>

      <el-form-item v-if="item.type == 'project'" label="Исполнитель:" prop="responsible_user_ids">
        <orgschema-user-selector
          v-model="item.responsible_user_ids"
          :font-size="14"
        />
      </el-form-item>

      <el-form-item label="Планируемое время:" prop="time_plan">
        <el-input-number v-model="item.time_plan" size="small" />
      </el-form-item>

      <div v-if="item.type == 'project'">
        <el-form-item label="Фактическое время:" prop="time_fact">
          <el-input-number v-model="item.time_fact" size="small" />
        </el-form-item>

        <el-form-item label="Начало задачи:" prop="start_date">
          <el-date-picker
            v-model="item.start_date"
            @change="handleDateChange"
            placeholder="Выберите дату"
          />
        </el-form-item>
      </div>

      <el-form-item style="margin-top: 20px; margin-bottom: 10px; width: 100%">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button
              style="position: relative; width: 100%; margin-right: 10px"
              @click="close"
            >
              <span>Отменить</span>
            </el-button>
          </el-col>

          <el-col :span="12">
            <el-button
              type="success"
              plain
              style="position: relative; width: 100%; margin: 0px 10px"
              @click="submit"
            >
              <span>Сохранить</span>
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </ui-sidebar>
</template>

<script>
export default {
  props: {
    value: Object,
    apiKey: String,
    tasks: Array,
    currentView: Object,
    profiles: Array,
  },
  data() {
    return {
      isSidebarVisible: false,
      visibleMake: false,
      visibleLink: false,
      soughtTask: {},
      task: {},
      item: {
        id: 0,
        name: "",
        description: "",
        responsible_user_ids: [],
        time_plan: 0,
        time_fact: 0,
        parent_id: 0,
        start_date: "",
        relations: [],
      },
      prevStartDate: null,
      links: [
        {
          type: 'complete_with',
          name: 'Должна быть выполнена вместе с'
        },
        {
          type: 'complete_before',
          name: 'Должна быть выполнена до'
        },
        {
          type: 'complete_after',
          name: 'Должна быть выполнена после'
        },
      ]
    };
  },
  methods: {
    uuidv4() {
      let d = new Date().getTime();

      if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
      }

      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);

        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
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
    handleDateChange(value) {
      const date = new Date(value).getTime();
      let startDate = new Date(this.currentView.start_date).getTime();
      let finishDate = new Date(this.currentView.finish_date).getTime();
      let isAvailable = date >= startDate && date <= finishDate;
      if (!isAvailable) {
        this.item.start_date = this.prevStartDate ?? "";
        this.$message.error("Эта дата недоступна для выбора.");
      } else this.prevStartDate = this.item.start_date;
    },
    async open(task) {
      this.task = task;
      this.item = {
        id: task.id,
        index: task.index,
        name: task.name,
        description: task.description,
        responsible_user_ids: task.responsible_user_ids ? [...task.responsible_user_ids] : [],
        time_plan: task.time_plan,
        time_fact: task.time_fact ? task.time_fact : 0,
        type: task.type ? task.type : 'project',
        parent_id: task.parent_id,
        parent_data: task.parent_data,
        checklist_items: task.checklist_items ? [...task.checklist_items] : [],
        start_date: task.start_date ? task.start_date : 0,
        relations: task.relations ? [...task.relations] : [],
      };
      this.isSidebarVisible = true;
    },
    close() {
      this.isSidebarVisible = false;
    },
    async deleteTask() {
      if (this.currentView.type == "project") {
        await $platform.api.requestRoute(
          "tasks.api.task.remove",
          { key: this.apiKey },
          {
            id: this.task.id,
            is_edit_further: true,
          }
        );
      } else {
        let allTasks = this.currentView.tasks;
        allTasks = allTasks.filter(task => task.name !== this.item.name);
        this.currentView.tasks = allTasks;

        await $platform.api.requestRoute('plugins.api.storage.delete', { entity: 'plugin-gantt.pattern', key: this.apiKey }, { filter: [["title", "=", this.currentView.title]] });
        const itemWithAccessRules = this.setItemAccessRules(this.currentView);
        await this.$modules.plugins.api.storeOne(
          "plugin-gantt.pattern",
          itemWithAccessRules
        );
      }

      this.$uiNotify.error("Задание удалено");
      this.$emit("loadTasks", true);
      this.$emit("loadPatterns", true);
      this.close();
    },
    async makeTask() {
      if (this.currentView.type == "project") {
        let fields = new Object();
        let fields_old = new Object();
        if (this.soughtTask.id !== this.item.parent_id) {
          fields.parent_id = this.soughtTask.id;
          fields_old.parent_id = this.item.parent_id;
        }
        await $platform.api.requestRoute(
          "tasks.api.task.update",
          { key: this.apiKey },
          {
            id: this.item.id,
            fields: fields,
            fields_old: fields_old,
            is_edit_further: null,
            start_date: this.item.start_date,
          }
        );
      } else {
        if (this.soughtTask.id !== this.item.parent_id) {
          this.item.parent_id = this.soughtTask.id;
          this.item.parent_data = {
            "id": this.soughtTask.id,
            "name": this.tasks.find(task => task.id == this.soughtTask.id).name,
            "status_key": "new",
            "is_recurrent": false
          };
          let withoutChildren = this.currentView.tasks.filter(task => task.id !== this.task.id);
          withoutChildren.push(this.item);
          this.currentView.tasks = withoutChildren;

          let parent = this.tasks.find(task => task.id == this.soughtTask.id);
          parent.checklist_items.push({
            "author_id": "22086f8b917cd0417b85a85b8b7c32ac",
            "closing_date": null,
            "creation_date": new Date(),
            "id": this.uuidv4(),
            "is_further": false,
            "linked_task_id": this.item.id,
            "modification_date": new Date(),
            "order": 0,
            "text": this.item.name,
          });
          let withoutParent = this.currentView.tasks.filter(task => task.id !== parent.id);
          withoutParent.push(parent);
          this.currentView.tasks = withoutParent;

          await $platform.api.requestRoute('plugins.api.storage.delete', { entity: 'plugin-gantt.pattern', key: this.apiKey }, { filter: [["title", "=", this.currentView.title]] });
          const itemWithAccessRules = this.setItemAccessRules(this.currentView);
          await this.$modules.plugins.api.storeOne(
            "plugin-gantt.pattern",
            itemWithAccessRules
          );
        }
      }

      this.$uiNotify.success("Задание отредактированно");
      this.$emit("loadTasks", true);
      this.$emit("loadPatterns", true);
      this.visibleMake = false;
    },
    async submit() {
      if (this.currentView.type == 'project') {
        const projectEnd = new Date(this.currentView.finish_date);
        const taskStart = new Date(this.item.start_date);

        const taskEnd = new Date(taskStart);
        taskEnd.setDate(taskEnd.getDate() + Number(this.item.time_plan) - 1);

        if (projectEnd < taskEnd) {
          this.$message.error("Ошибка");
        } else {
          let fields = new Object();
          let fields_old = new Object();

          if (this.task.name !== this.item.name) {
            fields.name = this.item.name;
            fields_old.name = this.task.name;
          }

          if (this.task.description !== this.item.description) {
            fields.description = this.item.description;
            fields_old.description = this.task.description;
          }

          if (this.task.responsible_user_ids !== this.item.responsible_user_ids) {
            fields.responsible_user_ids =
              this.item.responsible_user_ids.length == 0
                ? this.item.responsible_user_ids
                : this.item.responsible_user_ids;
            fields_old.responsible_user_ids = [...this.task.responsible_user_ids];
          }

          if (this.task.time_plan !== this.item.time_plan) {
            fields.time_plan = this.item.time_plan;
            fields_old.time_plan = this.task.time_plan;
          }

          if (this.task.time_fact !== this.item.time_fact) {
            fields.time_fact = this.item.time_fact;
            fields_old.time_fact = this.task.time_fact;
          }

          if (this.task.start_date !== this.item.start_date) {
            fields.start_date = this.item.start_date;
            fields_old.start_date = this.task.start_date;
          }
        }
        this.$emit("input", this.item, fields, fields_old);
        this.close();
      } else {
        let tasks = this.currentView.tasks.filter(task => task.index !== this.task.index);
        tasks.push(this.item);
        this.currentView.tasks = tasks;

        await $platform.api.requestRoute('plugins.api.storage.delete', { entity: 'plugin-gantt.pattern', key: this.apiKey }, { filter: [["title", "=", this.currentView.title]] });
        const itemWithAccessRules = this.setItemAccessRules(this.currentView);
        await this.$modules.plugins.api.storeOne(
          "plugin-gantt.pattern",
          itemWithAccessRules
        );
        this.close();
        this.$uiNotify.success("Задание отредактированно");
      }
    },
    getProfile(id) {
      if (this.profiles[id] !== undefined) {
        return this.profiles[id].name;
      }
    },
    getText(str) {
      if (str !== null) {
        const startIndex = str.indexOf('<p>') + 3;
        const endIndex = str.indexOf('</p>');
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
  width: 650px;
  background: white;
}
</style>
