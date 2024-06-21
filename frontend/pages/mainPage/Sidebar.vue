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
          v-model="visible"
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

                <el-button size="mini" @click="visible = false">
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

      <el-form-item label="Исполнитель:" prop="responsible_user_ids">
        <orgschema-user-selector
          v-model="item.responsible_user_ids"
          :font-size="14"
        />
      </el-form-item>

      <el-form-item label="Планируемое время:" prop="time_plan">
        <el-input-number v-model="item.time_plan" size="small" />
      </el-form-item>

      <el-form-item label="Фактическое время:" prop="time_fact">
        <el-input-number v-model="item.time_fact" size="small" />
      </el-form-item>

      <el-form-item label="Начало задачи:" prop="start_time">
        <el-date-picker
          v-model="item.start_date"
          @change="handleDateChange"
          placeholder="Выберите дату"
        />
      </el-form-item>

      <el-form-item style="position: absolute; bottom: 10px; width: 100%">
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
    currentProject: Object,
  },
  data() {
    return {
      isSidebarVisible: false,
      visible: false,
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
      },
      prevStartDate: null,
    };
  },
  methods: {
    handleDateChange(value) {
      const date = new Date(value).getTime();
      let startDate = new Date(this.currentProject.start_date).getTime();
      let finishDate = new Date(this.currentProject.finish_date).getTime();
      let isAvailable = date >= startDate && date <= finishDate;
      if (!isAvailable) {
        this.item.start_date = this.prevStartDate ?? "";
        this.$message.error("Эта дата недоступна для выбора.");
      } else this.prevStartDate = this.item.start_date;
    },
    open(task) {
      this.task = task;
      this.item = {
        id: task.id,
        name: task.name,
        description: task.description,
        responsible_user_ids: [...task.responsible_user_ids],
        time_plan: task.time_plan,
        time_fact: task.time_fact,
        parent_id: task.parent_id,
        start_date: task.start_date,
      };
      this.isSidebarVisible = true;
      this.prevStartDate = task.start_date;
    },
    close() {
      this.isSidebarVisible = false;
    },
    async deleteTask() {
      await $platform.api.requestRoute(
        "tasks.api.task.remove",
        { key: this.apiKey },
        {
          id: this.task.id,
          is_edit_further: true,
        }
      );
      this.$uiNotify.error("Задание удалено");
      this.$emit("load", true);
      this.close();
    },
    async makeTask() {
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
      this.$uiNotify.success("Задание отредактированно");
      this.$emit("load", true);
      this.visible = false;
    },
    async submit() {
      const projectEnd = new Date(this.currentProject.finish_date);
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
              : [this.item.responsible_user_ids];
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
        this.$emit("input", this.item, fields, fields_old);
        this.close();
      }
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
