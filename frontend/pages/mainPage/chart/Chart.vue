<template>
  <div>
    <el-table
      :data="dataTable"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
      row-key="id"
      border>
      <el-table-column
        label="Номер"
        prop="index"
        width="77">
      </el-table-column>
      <el-table-column
        label="Наименование"
        width="279">
        <template slot-scope="scope">
          <el-popover
            trigger="hover"
            placement="right"
            width="370">
            <div>
              <div style="text-align: right; margin: 0; padding: 4px 4px 0px 0px ">
                <i class="el-icon-edit" style="padding: 1px 6px;" @click="openSidebar(scope.row)"></i>
                <i class="el-icon-close" style="margin-left: 20px; padding: 8px 0px;" @click="visible = false"></i>
              </div>
              <div style="padding: 3px 12px 15px 12px;">
                <h1 style="padding: 7px 5px; font-size: 14px; font-weight: 505; line-height: 1.4;">{{ scope.row.name }}</h1>
                <p style="padding: 7px 5px; line-height: 1.4;">{{ getText(scope.row.description) }}</p>
              </div>
              <div style="margin: 3px 6px 0px 6px; color: #9597B2">
                Исполнители: {{ getProfile(scope.row.responsible_user_ids) }}
                {{ scope.row.project }}
              </div>
            </div>
            <div slot="reference" class="name-wrapper">{{ scope.row.name }}</div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  
    <sidebar
      ref="sidebar"
      @input="updateTask"
      @load="onload"
      :apiKey="apiKey"
      :tasks="tasks"
    />
  </div>
</template>

<script>
import Sidebar from './../Sidebar.vue';

export default {
  props: {
    apiKey: String,
    tasks: Array,
    profiles: Array,
  },
  data() {
    return {
      task: {},
      visible: false,
      currentRow: null,
    };
  },
  components: {
    Sidebar,
  },
  computed: {
    dataTable() {
      let tasksChildfree = this.tasks.filter(task => task.parent_data == null);
      tasksChildfree.map((task, index) => {
        task.index = index + 1;
        let arrChildren = [];
        if (task.checklist_items.lenght != Array(0)) {
          task.checklist_items.map((item, index) => {
            let childrenTask = this.tasks.find(arr => arr.id == item.linked_task_id);
            childrenTask.index = `${task.index}.${index + 1}`;
            arrChildren.push(childrenTask);
          });
          task.children = arrChildren;
        }
      });

      return tasksChildfree;
    }
  },
  methods: {
    onload() {
      this.$emit('load', true);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    openSidebar(item) {
      this.task = item;
      this.$refs.sidebar.open(item);
    },
    async updateTask(item, fields, fields_old) {
      await $platform.api.requestRoute('tasks.api.task.update', {key: this.apiKey }, {
        "id": item.id,
        "fields": fields,
        "fields_old": fields_old,
        "is_edit_further": null,
        "start_date_from_plan": null,
      });
      this.$uiNotify.success('Задание отредактированно');
      this.$emit('load', true);
    },
    getProfile(id) {
      if (this.profiles[id] !== undefined) {
        return this.profiles[id].name;
      }
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
  },
};
</script>

<style>
.table {
  display: table;
  border-collapse: collapse;
  width: 100%;
  color: #909399;
  border: 1px solid #EBEEF5;
}

.table-row {
  display: table-row;
  width: 100%;
  border-bottom: 1px solid #EBEEF5;
}

.table-cell {
  display: table-cell;
  padding: 12px 10px;
  border-right: 1px solid #EBEEF5;
}

.table-cell_number {
  width: 70px;
}

.table-cell_name {
  width: 280px;
  border-left: none;
}
</style>
