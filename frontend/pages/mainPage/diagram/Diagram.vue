<template>
  <div class="gantt" style="width: 100%">
    <div
      class="gantt-row gantt-period"
      :style="{
        'grid-template-columns': `${setGrid}`,
      }"
    >
      <span v-for="(el, index) in currentView" :key="index">{{
        currentPeriod == 10 ? weekdaysName(el) : el.name
      }}</span>
    </div>

    <div
      class="gantt-row gantt-lines"
      :style="{
        'grid-template-columns': `${setGrid}`,
      }"
    >
      <span v-for="el in currentView" :key="el"></span>
    </div>

    <div
      v-for="task in dataTable"
      :key="task.id"
      class="gantt-row"
      :style="{ 'grid-template-columns': `${setGrid}` }"
    >
      <ul class="gantt-row-bars">
        <li
          :key="task.id"
          :style="{
            'grid-column': `1, 1fr`,
            'min-height': '26px',
          }"
          @click="showTasks(task.id)"
        >
          <ul v-if="visibleTasks.indexOf(task.id) != -1" class="gantt-row-bars">
            <li
              v-for="child in task.children"
              :key="child.id"
              class="task-child"
              :style="{
                visibility: 'hidden',
                'grid-column': `${setGridRowChild(task, child)}`,
              }"
            ></li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="gantt-bars" style="position: absolute; top: 0px; width: 100%">
      <div
        class="gantt-row gantt-period"
        :style="{
          visibility: 'hidden',
          'grid-template-columns': `${setGrid}`,
        }"
      >
        <span v-for="(el, index) in currentView" :key="index">{{
          currentPeriod == 10 ? weekdaysName(el) : el.name
        }}</span>
      </div>

      <ul
        v-for="task in dataTable"
        :key="task.id"
        style="display: grid; width: 100%"
        class="gantt-row-bars"
        :style="{ 'grid-template-columns': `${setGridBar}` }"
      >
        <li
          class="task-parent"
          :key="task.id"
          :style="{
            'grid-column': `${setGridRow(task)}`,
          }"
          @click="showTasks(task.id)"
        >
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
    startDate: String,
    endDate: String,
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
      const date = new Date(task.start_date ?? this.startDate);
      const timeDifference = Math.abs(date - startDate);
      let left = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return `${left + 1}/${left + 1 + Number(task.time_plan)}`;
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

<style>
.gantt {
  display: grid;
  border: 1px solid #ebeef5;
  position: relative;
  overflow: auto;
}

.gantt-row {
  display: grid;
  border-bottom: 1px solid #ebeef5;
}

.gantt-period {
  color: #909399;
  border-bottom: 1px solid #ebeef5;
}

.gantt-lines {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: transparent;
}

.gantt-period > span {
  text-align: center;
  font-size: 13px;
  align-self: center;
  font-weight: bold;
  padding: 15px 0;
}

.gantt-lines > span {
  display: block;
  border-right: 1px solid #ebeef5;
}

.gantt-row-bars {
  list-style: none;
  display: grid;
  padding: 11px 0;
  margin: 0;
  grid-gap: 0;
  width: 100%;
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
  background-color: #409eff;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border-radius: 15px;
}
</style>
