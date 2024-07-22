<template>
  <div class="gantt">
    <div
      class="gantt-row gantt-period"
      :style="{
        'grid-template-columns': `${setGrid}`,
        'background-color': `${new Date(date).getDay() == 0 || new Date(date).getDay() == 6 ? '#9093991c' : ''}`
      }"
    >
      <span v-for="(el, index) in currentView" :key="index">{{
        currentPeriod == 10 ? weekdaysName(el) : el.name
      }}</span>
    </div>

    <div class="gantt-bars">
      <ul
        v-for="task in dataTable"
        :key="task.id"
        class="gantt-row-bars"
        :style="{ 'grid-template-columns': `${setGridBar}` }"
      >
        <span
          v-for="date in currentView"
          :key="date"
          :id="date"
          :style="{ 'background-color': `${new Date(date).getDay() == 0 || new Date(date).getDay() == 6 ? '#9093991c' : ''}` }"
          @dragover.prevent
          @drop="drop($event)"
          @dragenter="dragEnter($event)">
        </span>

        <li
          class="task-parent"
          :key="task.id"
          :style="{
            'grid-column': `${setGridRow(task)}`,
          }"
          @click="showTasks(task.id);"
          draggable="true" @dragstart="dragStart(task)"
        >
          <span
            draggable="true" @dragstart="moveStart(task)"
            class="move-arrow">
            <i class="el-icon-arrow-left" style="position: absolute; top: 4px"></i>
          </span>
          <ul
            v-if="visibleTasks.indexOf(task.id) != -1"
            style="display: grid; width: 100%"
            class="gantt-row-bars"
            :style="{ 'grid-template-columns': `${setGridBarChild(task)}` }"
          >
            <li
              v-for="child in task.children"
              class="task-child"
              :key="child.id"
              :style="{
                'grid-column': `${setGridRowChild(task, child)}`,
              }"
            ></li>
          </ul>
          <span
            draggable="true" @dragstart="moveEnd(task)"
            class="move-arrow"
            style="right: 0px;">
            <i class="el-icon-arrow-right" style="position: absolute; top: 4px; right: 0px;"></i>
          </span>
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
    apiKey: String,
    currentPeriod: Number,
    startDate: String,
    endDate: String,
  },
  data() {
    return {
      arrTasks: [],
      draggedTask: null,
      startTask: null,
      endTask: null,
      startDay: '',
      timePlan: null,
    };
  },
  computed: {
    visibleTasks() {
      return this.arrTasks;
    },
    setGrid() {
      let result = "";
      if (this.currentPeriod == 10)
        result = `repeat(${this.dateColumns.length}, ${
          this.dateColumns.length < 10 ? "1fr" : "90px"
        })`;
      else if (this.currentPeriod == 15)
        result = `repeat(${this.countWeeks.length}, ${
          this.countWeeks.length < 15 ? "1fr" : "60px"
        })`;
      else
        result = `repeat(${this.countMonths.length}, ${
          this.countMonths.length < 12 ? "1fr" : "72px"
        })`;

      return result;
    },
    setGridBar() {
      let result = "";
      let lenDays = this.dateColumns.length;

      if (this.currentPeriod == 10)
        result = `repeat(${lenDays}, ${lenDays < 10 ? "1fr" : "90px"})`;
      else if (this.currentPeriod == 15) {
        let quitDays = lenDays % 7;
        const isShortWeeks = this.countWeeks.length < 15;
        let lenPx = `${Math.floor(60 / 7)}px`; // 60px / 7 days

        switch (quitDays) {
          case 0:
            result = `repeat(${lenDays}, ${isShortWeeks ? "1fr" : lenPx})`;
            break;
          default:
            let percent = `${Math.round(
              100 / (this.countWeeks.length * quitDays)
            )}%`;
            let percentPx = `${Math.floor(60 / quitDays)}px`; // 60px / n days, n < 7
            let percentResult = `${isShortWeeks ? percent : percentPx}`;
            result = `repeat(${lenDays - quitDays}, ${
              isShortWeeks ? "1fr" : lenPx
            }) repeat(${quitDays}, ${percentResult})`;
        }
      } else {
        switch (this.countMonths.length) {
          case 1:
            result = `repeat(${lenDays}, ${"1fr"})`;
            break;
          default:
            result = this.getRepeatInMonth();
        }
      }
      return result;
    },
    countWeeks() {
      let arrWeeks = [];
      let week = [];
      let countDay = 1;

      this.dateColumns.map((date) => {
        date = new Date(date).toLocaleString("ru", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        if (countDay == 8) {
          arrWeeks.push({
            name: `${week[0].slice(0, -8)}-${week[week.length - 1].slice(
              0,
              -8
            )}`,
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
          name: `${week[0].slice(0, -8)} - ${week[week.length - 1].slice(
            0,
            -8
          )}`,
          week: week,
        });

        week = [];
      }

      return arrWeeks;
    },
    countMonths() {
      let arrMonths = [];
      let month = [];
      let startMonth = this.dateColumns[0].slice(-2);

      this.dateColumns.map((date) => {
        if (startMonth == `${date}`.slice(-2) && date !== this.dateColumns[0]) {
          arrMonths.push({
            name: `${month[0].slice(0, -8)} - ${month[month.length - 1].slice(
              0,
              -8
            )}`,
            month: month,
          });

          month = [];
        }

        month.push(
          new Date(date).toLocaleString("ru", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
      });

      if (month.length !== 0) {
        arrMonths.push({
          name: `${month[0].slice(0, -8)} - ${month[month.length - 1].slice(
            0,
            -8
          )}`,
          month: month,
        });

        month = [];
      }

      return arrMonths;
    },
    dataTable() {
      let tasksChildfree = this.tasks.filter(
        (task) => task.parent_data == null
      );
      tasksChildfree.map((task) => {
        let arrChildren = [];
        if (task.checklist_items.length != Array(0)) {
          task.checklist_items.map((item) => {
            let childrenTask = this.tasks.find(
              (arr) => arr.id == item.linked_task_id
            );
            arrChildren.push(childrenTask);
          });
          task.children = arrChildren;
        }
      });

      return tasksChildfree;
    },
    currentView() {
      let array = [];
      if (this.currentPeriod == 10) array = this.dateColumns;
      else if (this.currentPeriod == 15) array = this.countWeeks;
      else array = this.countMonths;
      return array;
    },
  },
  methods: {
    dragStart(task) {
      this.draggedTask = task;
    },
    moveStart(task) {
      this.startTask = task;
      this.startDay = task.start_date;
      this.timePlan = task.time_plan;
    },
    moveEnd(task) {
      this.endTask = task;
      this.oldPlan = task.time_plan;
    },
    async dragEnter(event) {
      const date = new Date(event.target.id);
      if (this.endTask == null) {
        this.startTask.start_date = `${event.target.id}T03:00:00.000Z`;
        this.startTask.time_plan = this.timePlan + Math.round((new Date(this.startDay) - date) / 86400000);
      } else if (this.startTask == null) {
        const startDate = new Date(this.endTask.start_date);
        this.endTask.time_plan = Math.round((date - startDate) / 86400000) + 1;
      }
    },
    async drop(event) {
      const date = new Date(event.target.id);

      if (this.startTask == null && this.endTask == null) {
        const oldDate = this.draggedTask.start_date;
        this.draggedTask.start_date = date;

        await $platform.api.requestRoute(
          "tasks.api.task.update",
          { key: this.apiKey },
          {
            id: this.draggedTask.id,
            fields: { start_date: `${event.target.id}T00:00:00.000Z` },
            fields_old: { start_date: oldDate },
            is_edit_further: null,
            start_date: `${event.target.id}T00:00:00.000Z`,
          }
        );
      } else if (this.startTask == null) {
        await $platform.api.requestRoute(
          "tasks.api.task.update",
          { key: this.apiKey },
          {
            id: this.endTask.id,
            fields: { time_plan: this.endTask.time_plan },
            fields_old: { time_plan: this.oldPlan },
            is_edit_further: null,
            start_date: this.endTask.start_date,
          }
        );
      } else if (this.endTask == null) {
        await $platform.api.requestRoute(
          "tasks.api.task.update",
          { key: this.apiKey },
          {
            id: this.startTask.id,
            fields: { time_plan: this.startTask.time_plan, start_date: this.startTask.start_date },
            fields_old: { time_plan: this.timePlan, start_date: this.startDay },
            is_edit_further: null,
            start_date: this.startTask.start_date,
          }
        );
      }

      this.draggedTask = null;
      this.startTask = null;
      this.endTask = null;
    },
    getRepeatInMonth() {
      let res = "";
      let months = this.generateMonthObjects(
        new Date(this.startDate),
        new Date(this.endDate)
      );

      const percentEachMonth = Math.floor(100 / this.countMonths.length);

      const isShortMonths = this.countMonths.length < 15;
      months.forEach((el) => {
        const differenceMs = el.endDate - el.startDate;
        let duration = Math.ceil(differenceMs / (1000 * 60 * 60 * 24)) + 1;
        let checkPercent = Number.isInteger(percentEachMonth / duration);
        let percent = `${
          checkPercent ? percentEachMonth / duration + "%" : "1fr"
        }`;
        let percentPx = `${Math.floor(72 / duration)}px`; // 72px / n days
        let percentResult = `${isShortMonths ? percent : percentPx}`;
        res = res + " " + `repeat(${duration}, ${percentResult})`;
      });

      return res;
    },
    generateMonthObjects(start_date, end_date) {
      let current = start_date;
      const months = [];

      while (current <= end_date) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        if (current < start_date) {
          startDate.setDate(1); // Если это первый месяц в промежутке, установить начало на start_date
        }
        if (endDate > end_date) {
          endDate.setDate(end_date.getDate()); // Если это последний месяц в промежутке, установить конец на end_date
        }

        months.push({
          month: month + 1, // Добавляем 1, так как getMonth() возвращает индекс месяца (0 для января)
          year: year,
          startDate: startDate,
          endDate: endDate,
        });

        current.setMonth(current.getMonth() + 1); // Переходим к следующему месяцу
      }

      return months;
    },
    setGridRow(task) {
      const startDate = new Date(this.startDate);
      const date = new Date(task.start_date ?? startDate);
      const timeDifference = Math.round((date - startDate) / 86400000);
      return `${timeDifference + 1}/${timeDifference + 1 + Number(task.time_plan)}`;
    },
    setGridBarChild(task) {
      return `repeat(${task.time_plan}, 1fr)`;
    },
    setGridRowChild(task, child) {
      const startDate = new Date(task.start_date ?? this.startDate);
      const date = new Date(child.start_date ?? this.startDate);
      const timeDifference = Math.abs(date - startDate);
      let left = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return `${left + 1}/${left + 1 + Number(child.time_plan)}`;
    },
    showTasks(id) {
      if (this.arrTasks.indexOf(id) == -1) {
        this.arrTasks.push(id);
        return this.arrTasks;
      } else {
        return (this.arrTasks = this.arrTasks.filter((item) => item !== id));
      }
    },
    weekdaysName(day) {
      const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
      const date = new Date(day).toLocaleString("ru", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return `${weekdays[new Date(day).getDay()]}, ${date}`.slice(0, -8);
    },
  },
};
</script>

<style scoped>
.gantt {
  display: grid;
  background-color: white;
  width: 100%;
  border: 1px solid #ebeef5;
  position: relative;
  overflow: auto;
}

.gantt-bars {
  width: 100%;
  height: 100%;
  top: 0px;
}

.gantt-row {
  display: grid;
  border-bottom: 1px solid #ebeef5;
}

.gantt-period {
  color: #909399;
  border-bottom: 1px solid #ebeef5;
}

.gantt-period > span {
  text-align: center;
  font-size: 13px;
  align-self: center;
  font-weight: bold;
  padding: 15px 0;
}

.gantt-row-bars {
  list-style: none;
  display: grid;
  position: relative;
  border-bottom: 1px solid #ebeef5;
  padding: 0;
  margin: 0;
  grid-gap: 0;
  width: 100%;
  grid-gap: 10px 0;
}

.gantt-row-bars > span {
  min-height: 48px;
  border-right: 1px solid #ebeef5;
}

.task-parent {
  position: absolute;
  width: 100%;
  min-height: 26px;
  margin: 11px 0;
  background-color: #40a0ff7c;
  overflow: hidden;
  cursor: pointer;
  border-radius: 30px;
  z-index: 1;
}

.task-child {
  min-height: 26px;
  background-color: #409eff;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border-radius: 15px;
}

.move-arrow {
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  z-index: 1;
}
</style>
