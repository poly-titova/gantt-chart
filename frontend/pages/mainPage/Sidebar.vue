<template>
  <ui-sidebar
    v-model="isSidebarVisible"
    title="Задание"
    class="sidebar"
    style="padding: 0px 20px;"
    @hide="resetState"
  >
    <el-row>
      <el-col :span="8">
        <el-button
          size="small"
          icon="el-icon-share"
          style="margin: 10px 0px;"
          @click="">
          Сделать подзадачей
        </el-button>
      </el-col>

      <el-col :span="8">
        <el-button
          size="small"
          icon="el-icon-link"
          style="margin: 10px 20px;"
          @click="">
          Связать задачу
        </el-button>
      </el-col>

      <el-col :span="8">
        <el-button
          size="small"
          icon="el-icon-delete"
          style="margin: 10px 0px 10px 10px;"
          @click="deleteTask">
          Удалить задачу
        </el-button>
      </el-col>
    </el-row>

    <el-form ref="form" :model="item" style="position: relative; height: 100%;">
      <el-form-item
        prop="name"
        label="Название:">
        <el-input v-model="item.name" size="small"/>
      </el-form-item>

      <el-form-item
        prop="description"
        label="Описание:">
        <el-input
          v-model="item.description"
          type="textarea"
          :rows="2"
          size="small"/>
      </el-form-item>

      <el-form-item
        label="Исполнитель:"
        prop="responsible_user_ids"
      >
        <orgschema-user-selector v-model="item.responsible_user_ids" :font-size="14" />
      </el-form-item>

      <el-form-item label="Планируемое время:" prop="time_plan">
        <el-input-number v-model="item.time_plan" size="small" />
      </el-form-item>

      <el-form-item label="Фактическое время:" prop="time_fact">
        <el-input-number v-model="item.time_fact" size="small" />
      </el-form-item>

      <el-form-item style="position: absolute; bottom: 10px; width: 100%;">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button
              style="position: relative; width: 100%; margin-right: 10px;"
              @click="close">
              <span>Отменить</span>
            </el-button>
          </el-col>

          <el-col :span="12">
            <el-button
              type="success"
              plain
              style="position: relative; width: 100%; margin: 0px 10px;"
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
  },
  data() {
    return {
      isSidebarVisible: false,
      task: {},
      item: {
        id: 0,
        name: '',
        description: '',
        responsible_user_ids: [],
        time_plan: 0,
        time_fact: 0,
      }
    };
  },
  methods: {
    open(task) {
      this.task = task;
      this.item = {
        id: task.id,
        name: task.name,
        description: task.description,
        responsible_user_ids: [...task.responsible_user_ids],
        time_plan: task.time_plan,
        time_fact: task.time_fact,
      };
      this.isSidebarVisible = true;
    },
    close() {
      this.isSidebarVisible = false;
    },
    async deleteTask() {
      await $platform.api.requestRoute('tasks.api.task.remove', {key: this.apiKey }, {
        "id": this.task.id,
        "is_edit_further": true,
      });
      this.$uiNotify.error('Задание удалено');
      this.$emit('load', true);
      this.close();
    },
    async submit() {
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
        fields.responsible_user_ids = [this.item.responsible_user_ids];
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

      this.$emit('input', this.item, fields, fields_old);
      this.close();
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
