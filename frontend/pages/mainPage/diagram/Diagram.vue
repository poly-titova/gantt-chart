<template>
  <div class="gantt">
    <span class="d-1"></span>
    <span class="d-2"></span>
    <span class="d-3"></span>
    <span class="d-4"></span>
    <span class="d-5"></span>
    <span class="d-6"></span>

    <h3 class="h-sun">пн</h3>
    <h3 class="h-mon">вт</h3>
    <h3 class="h-tue">ср</h3>
    <h3 class="h-wed">чт</h3>
    <h3 class="h-thu">пт</h3>
    <h3 class="h-fri">сб</h3>
    <h3 class="h-sat">вс</h3>

    <div
      v-for="(project, index) in projects"
      :class="`t-${index}`"
      :style="`grid-column: sun-morning / mon-night; grid-row: ${index + 1};`"
      :key="project.id"
      :project=project
    >{{ project.title }}</div>
<!-- 
    <div class="t-1" style="grid-column: sun-morning / mon-night;">Прописать тз</div>
    <div class="t-2" style="grid-column: mon-morning / sat-night;">Создать проект</div>
    <div class="t-3" style="grid-column: sun-morning / tue-midday;">Отправить отчёт</div>
    <div class="t-4" style="grid-column: tue-midday / wed-night;">Сверстать сайт</div>
    <div class="t-5" style="grid-column: mon-morning / wed-midday;">Обучить стажёра</div>
    <div class="t-6" style="grid-column: mon-night / fri-morning;">Прокачать навыки</div>
    <div class="t-7" style="grid-column: wed-midday /sat-night;">Найти работников</div>
    <div class="t-8" style="grid-column: wed-midday / thu-midday;">Отправить зарплату</div> -->
  </div>
</template>

<script>
export default {
  props: {
    projects: Array,
  },
};
</script>

<style>
.gantt {
  display: grid;
  grid-template-columns:
    [sun-morning] 1fr [sun-midday] 1fr [sun-night mon-morning] 1fr [mon-midday] 1fr [mon-night tue-morning] 1fr [tue-midday] 1fr [tue-night wed-morning] 1fr [wed-midday] 1fr [wed-night thu-morning] 1fr [thu-midday] 1fr [thu-night fri-morning] 1fr [fri-midday] 1fr [fri-night sat-morning] 1fr [sat-midday] 1fr [sat-night];
  grid-gap: 10px 0px;
  width: 100%;
  height: 100%;
  max-width: 1150px;
  padding-top: 10px;
  margin: 0 auto;
}

/* dividers */
.gantt>span {
  border-left: 1px solid lightgrey;
  grid-row: 1 / span 10;
}

span.d-1 {
  grid-column: 3;
}

span.d-2 {
  grid-column: 5;
}

span.d-3 {
  grid-column: 7;
}

span.d-4 {
  grid-column: 9;
}

span.d-5 {
  grid-column: 11;
}

span.d-6 {
  grid-column: 13;
}

/* days */
.gantt>h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #909399;
  grid-row: 1;
}

h3.h-sun {
  grid-column: 1 / span 2;
}

h3.h-mon {
  grid-column: 3 / span 2;
}

h3.h-tue {
  grid-column: 5 / span 2;
}

h3.h-wed {
  grid-column: 7 / span 2;
}

h3.h-thu {
  grid-column: 9 / span 2;
}

h3.h-fri {
  grid-column: 11 / span 2;
}

h3.h-sat {
  grid-column: 13 / span 2;
}

/* projects */
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
