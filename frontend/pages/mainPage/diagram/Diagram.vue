<template>
  <div class="gantt">
    <div class="gantt-row gantt-period" :style="{'grid-template-columns': `repeat(${currentPeriod}, 1fr)`}">
      <span v-for="(day, index) in days" :key="index">{{ index + 1 }}</span>
    </div>

    <div class="gantt-row gantt-lines" :style="{'grid-template-columns': `repeat(${currentPeriod}, 1fr)`}">
      <span v-for="(day, index) in days" :key="index"></span>
    </div>

    <div
      v-for="(task) in dataTable"
      :key="task.id"
      class="gantt-row"
      :style="{'grid-template-columns': `repeat(${countColumn}, 1fr)`}"
      >
      <ul class="gantt-row-bars" :style="{'grid-template-columns': `repeat(${currentPeriod}, 1fr)`}">
        <li
          class="task-parent"
          :key="task.id"
          :style="{'grid-column': `1/${currentPeriod == 6 || currentPeriod == 12 ? Math.round(Number(task.time_plan)/7) + 1 : Number(task.time_plan) + 1}`}"
          @click="showTasks(task.id)"
        >
          <ul
            v-if="visibleTasks.indexOf(task.id) != -1"
            class="gantt-row-bars">
            <li
              v-for="(child) in task.children"
              class="task-child"
              :key="child.id"
              :style="{'grid-column': `1/${currentPeriod == 6 || currentPeriod == 12 ? Math.round(Number(child.time_plan)/7) + 1 : Number(child.time_plan) + 1}`}"
            ></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tasks: Array,
    currentPeriod: Number,
  },
  data() {
    return {
      arrTasks: [],
    };
  },
  computed: {
    visibleTasks() {
      return this.arrTasks;
    },
    countColumn() {
      if (this.currentPeriod == 6 || this.currentPeriod == 12) {
        return 4;
      } else if (this.currentPeriod == 13) {
        return 7;
      } else {
        return 1;
      }
    },
    days() {
      return Array.from({ length: this.currentPeriod }, (_, i) => i);
    },
    dataTable() {
      let tasksChildfree = this.tasks.filter(task => task.parent_data == null);
      tasksChildfree.map((task) => {
        let arrChildren = [];
        if (task.checklist_items.lenght != Array(0)) {
          task.checklist_items.map((item) => {
            let childrenTask = this.tasks.find(arr => arr.id == item.linked_task_id);
            arrChildren.push(childrenTask);
          });
          task.children = arrChildren;
        }
      });

      return tasksChildfree;
    }
  },
  methods: {
    showTasks(id) {
      if (this.arrTasks.indexOf(id) == -1) {
        this.arrTasks.push(id)
        console.log('add', this.arrTasks)
        return this.arrTasks;
      } else {
        console.log(this.arrTasks.filter(item => item !== id))
        return this.arrTasks = this.arrTasks.filter(item => item !== id);
      }
    }
  }
};
</script>

<style>
.gantt {
  display: grid;
  border: 1px solid #EBEEF5;
  position: relative;
  overflow: hidden;
}

.gantt-row {
  display: grid;
  border-bottom: 1px solid #EBEEF5;
}

.gantt-period {
  color: #909399;
  border-bottom: 1px solid #EBEEF5;
}

.gantt-lines {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: transparent;
}

.gantt-period>span {
  text-align: center;
  font-size: 13px;
  align-self: center;
  font-weight: bold;
  padding: 15px 0;
}

.gantt-lines>span {
  display: block;
  border-right: 1px solid #EBEEF5;
}

.gantt-row-bars {
  list-style: none;
  display: grid;
  padding: 11px 0;
  margin: 0;
  grid-gap: 10px 0;
}

.task-parent {
  min-height: 26px;
  background-color: #40a0ff7c;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border-radius: 30px;
}

.task-child {
  min-height: 26px;
  background-color: #409EFF;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border-radius: 15px;
}
</style>
