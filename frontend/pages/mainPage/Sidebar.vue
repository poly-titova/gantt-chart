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
          @click="deleteTask()">
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
        prop="executor"
      >
        <orgschema-user-selector v-model="item.executor" :font-size="14" />
      </el-form-item>

      <el-form-item
        prop="extension"
        label="Протяжённость:">
        <el-date-picker
          v-model="item.extension"
          type="daterange"
          start-placeholder="Начало"
          end-placeholder="Конец">
        </el-date-picker>
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
    task: Object,
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
  computed: {
    item() {
      return this.task;
    }
  },
  methods: {
    open() {
      this.isSidebarVisible = true;
    },
    close() {
      this.isSidebarVisible = false;
    },
    async deleteTask() {
      response = await $platform.api.requestRoute('tasks.api.task.remove', {key: apiKey }, {
        "id": this.task.id,
        "is_edit_further": true,
      });
    },
    async submit() {
      this.$emit('input', this.item);
      this.close();
    },
  },
};
</script>

<style lang="less" scoped>
.sidebar {
  top: 0 !important;
  width: 550px;
  background: white;
}
</style>
