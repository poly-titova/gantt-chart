<template>
  <div>
    <div class="table">
      <div class="table-row">
        <div class="table-cell table-cell_number"><b>Номер</b></div>
        <div class="table-cell table-cell_name"><b>Наименование</b></div>
      </div>

      <div
        v-for="(task, index) in tasks"
        :key="task.id"
        class="table-row">
        <div class="table-cell table-cell_number">{{ index + 1 }}</div>
        <el-popover
          placement="right"
          width="370"
          v-model="visible"
          trigger="click"
          class="table-row">
          <div>
            <div style="text-align: right; margin: 0; padding: 4px 4px 0px 0px ">
              <i class="el-icon-edit" style="padding: 1px 6px;" @click="openSidebar(task)"></i>
              <i class="el-icon-close" style="margin-left: 20px; padding: 8px 0px;" @click="visible = false"></i>
            </div>
            <div style="padding: 3px 12px 15px 12px;">
              <h1 style="padding: 7px 5px; font-size: 14px; font-weight: 505; line-height: 1.4;">{{ task.name }}</h1>
              <p style="padding: 7px 5px; line-height: 1.4;">{{ getText(task.description) }}</p>
            </div>
            <div style="margin: 3px 6px 0px 6px; color: #9597B2">
              Исполнители: {{ getProfile(task.responsible_user_ids) }}
              {{ task.project }}
            </div>
          </div>
          <div slot="reference">
            <div class="table-cell table-cell_name">{{ task.name }}</div>
          </div>
        </el-popover>
      </div>
    </div>
  
    <sidebar
      ref="sidebar"
      @input="updateTask"
      :task="task"
      :profiles="profiles"
    />
  </div>
</template>

<script>
import Sidebar from './../Sidebar.vue';

export default {
  props: {
    tasks: Array,
    profiles: Array,
  },
  data() {
    return {
      task: {},
      visible: false,
    };
  },
  components: {
    Sidebar,
  },
  methods: {
    openSidebar(item) {
      this.task = item;
      this.$refs.sidebar.open();
    },
    async updateTask(item) {
      console.log(item)
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
