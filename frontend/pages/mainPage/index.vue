<template>
  <tasks-layout>
    <ui-collection-panel slot="sidebar">
      <Chart />
    </ui-collection-panel>

    <Diagram />
  </tasks-layout>
</template>

<script>
import Chart from './Chart.vue';
import Diagram from './Diagram';

export default {
  components: {
    Diagram,
    Chart
},
  data() {
    return {

    };
  },
  methods: {},
};
</script>
