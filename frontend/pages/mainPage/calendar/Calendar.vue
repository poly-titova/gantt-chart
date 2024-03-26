<template>
  <div class="calendar">
    <h3
      v-for="(day, index) in days"
      :key="index"
      :style="{'grid-column': `${index} / span 2`}"></h3>
  </div>
</template>

<script>
export default {
  props: {
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
.calendar {
  display: grid;
  grid-gap: 10px 0px;
  width: 100%;
  height: 35px;
  max-width: 1150px;
  margin: 0 auto;
}

/* days */
.calendar>h3 {
  text-align: center;
  margin: 5px 0px;
  padding: 5px 0px;
  color: #909399;
  grid-row: 1;
  border: 1px solid #909399;
}

@media only screen and (min-width: 600px) {
  .calendar div {
    font-size: 16px;
  }
}

</style>
