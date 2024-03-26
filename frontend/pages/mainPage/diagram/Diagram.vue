<template>
  <div class="gantt">
    <h3
      v-for="(day, index) in days"
      :key="index"
      :style="{'grid-column': `${index} / span 2`}"></h3>

    <div
      v-for="(task, index) in tasks"
      :class="`t-${index}`"
      :style="`grid-column: sun-morning / mon-night; grid-row: ${index + 1};`"
      :key="task.id"
      :task=task
    >{{ task.name }}</div>
  </div>
</template>

<script>
export default {
  props: {
    tasks: Array,
    currentPeriod: Number,
  },
  data() {
    return {}
  },
  computed: {
    days() {
      return Array.from({ length: this.currentPeriod - 1 }, (_, i) => i);
    }
  }
};
</script>

<style>
.gantt {
  display: grid;
  grid-gap: 10px 0px;
  width: 100%;
  height: 100%;
  max-width: 1150px;
  padding-top: 10px;
  margin: 0 auto;
}

/* days */
.gantt>h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #909399;
  grid-row: 1;
  border: 1px solid #909399;
}

/* tasks */
.gantt div {
  color: white;
  font-size: 12px;
  padding: 10px 20px;
  border-radius: 20px;
  background: #4464a1;
  /* #4464a1 #F22F63 */
}

@media only screen and (min-width: 600px) {
  .gantt div {
    font-size: 16px;
  }
}

</style>
