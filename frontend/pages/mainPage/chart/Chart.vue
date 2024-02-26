<template>
  <el-table :data="tasks">
    <el-table-column type="expand">
      <template slot-scope="props">
        <p>Заголовок: {{ props.row.name }}</p>
        <p>Описание: {{ getText(props.row.description) }}</p>
        <p>Исполнитель: {{ props.row.responsible_user_ids }}</p>
        <p>Начало работы: {{ props.row.start_date }}</p>
        <p>Завершение работы: {{ props.row.finish_date }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Заголовок" prop="name">
    </el-table-column>
    <el-table-column label="Планированое время" prop="time_plan">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  async created() {
    await this.loadTasks({});
  },
  data() {
    return {
      tasks: []
    }
  },
  methods: {
    async loadTasks() {
      this.tasks = await $platform.api.requestRoute('tasks.api.task.list', {}, {});
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
  }
}
</script>
