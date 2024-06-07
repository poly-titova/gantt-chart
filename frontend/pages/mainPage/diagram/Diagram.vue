<template>
  <div class="gantt">
    <div
      v-if="currentPeriod==10"
      class="gantt-row gantt-period"
      :style="{'grid-template-columns': `repeat(${dateColumns.length}, ${dateColumns.length < 10 ? '1fr' : '90px'})`}">
      <span v-for="(day, index) in dateColumns" :key="index">{{ weekdaysName(day) }}</span>
    </div>

    <div
      v-if="currentPeriod==10"
      class="gantt-row gantt-lines"
      :style="{'grid-template-columns': `repeat(${dateColumns.length}, ${dateColumns.length < 10 ? '1fr' : '90px'})`}">
      <span v-for="(day, index) in dateColumns" :key="index"></span>
    </div>

    <div
      v-if="currentPeriod==15"
      class="gantt-row gantt-period"
      :style="{'grid-template-columns': `repeat(${countWeeks.length}, ${countWeeks.length < 15 ? '1fr' : '60px'})`}">
      <span v-for="(week, index) in countWeeks" :key="index">{{ week.weekName }}</span>
    </div>

    <div
      v-if="currentPeriod==15"
      class="gantt-row gantt-lines"
      :style="{'grid-template-columns': `repeat(${countWeeks.length}, ${countWeeks.length < 15 ? '1fr' : '60px'})`}">
      <span v-for="(week, index) in countWeeks" :key="index"></span>
    </div>

    <div
      v-if="currentPeriod==12"
      class="gantt-row gantt-period"
      :style="{'grid-template-columns': `repeat(${countMonths.length}, ${countMonths.length < 12 ? '1fr' : '72px'})`}">
      <span v-for="(month, index) in countMonths" :key="index">{{ month.monthName }}</span>
    </div>

    <div
      v-if="currentPeriod==12"
      class="gantt-row gantt-lines"
      :style="{'grid-template-columns': `repeat(${countMonths.length}, ${countMonths.length < 12 ? '1fr' : '72px'})`}">
      <span v-for="(month, index) in countMonths" :key="index"></span>
    </div>

    <div
      v-for="(task) in dataTable"
      :key="task.id"
      class="gantt-row"
      :style="{'grid-template-columns': `repeat(${countColumn}, 120px)`}"
      >
      <ul class="gantt-row-bars" :style="{'grid-template-columns': `repeat(${currentPeriod}, ${widthColumn}px)`}">
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
    dateColumns: Array,
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
      if (this.currentPeriod == 12) {
        return 4;
      } else if (this.currentPeriod == 15) {
        return 7;
      } else {
        return 1;
      }
    },
    widthColumn() {
      if (this.currentPeriod == 10) {
        return 90;
      } else if (this.currentPeriod == 15) {
        return 60;
      } else {
        return 72;
      }
    },
    countWeeks() {
      let arrWeeks = [];
      let week = [];
      let countDay = 1;

      this.dateColumns.map(date => {
        date = new Date(date).toLocaleString('ru',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

        if (countDay == 8) {
          arrWeeks.push({
            weekName: `${week[0].slice(0, -8)}-${week[week.length - 1].slice(0, -8)}`,
            week: week,
          });

          week = [];
          countDay = 1;
        }

        week.push(date);

        countDay = countDay + 1;
      });

      if (week.length !== 0) {
        arrWeeks.push({
          weekName: `${week[0].slice(0, -8)} - ${week[week.length - 1].slice(0, -8)}`,
          week: week,
        });

        week = [];
      }

      return arrWeeks;
    },
    countMonths() {
      let arrMonths = [];
      let month = [];
      let startMonth = (this.dateColumns[0]).slice(-2);

      this.dateColumns.map(date => {
        if (startMonth == `${date}`.slice(-2) && date !== this.dateColumns[0]) {
          arrMonths.push({
            monthName: `${month[0].slice(0, -8)} - ${month[month.length - 1].slice(0, -8)}`,
            month: month,
          });

          month = [];
        }

        month.push(new Date(date).toLocaleString('ru',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }));
      });

      if (month.length !== 0) {
        arrMonths.push({
          monthName: `${month[0].slice(0, -8)} - ${month[month.length - 1].slice(0, -8)}`,
          month: month
        });

        month = [];
      }

      return arrMonths;
    },
    dataTable() {
      let tasksChildfree = this.tasks.filter(task => task.parent_data == null);
      tasksChildfree.map((task) => {
        let arrChildren = [];
        if (task.checklist_items.length != Array(0)) {
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
        return this.arrTasks;
      } else {
        return this.arrTasks = this.arrTasks.filter(item => item !== id);
      }
    },
    weekdaysName(day) {
      const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      const date = new Date(day).toLocaleString('ru',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      return `${weekdays[(new Date(day)).getDay()]}, ${date}`.slice(0, -8);
    },
  }
};
</script>

<style>
.gantt {
  display: grid;
  border: 1px solid #EBEEF5;
  position: relative;
  overflow: auto;
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
