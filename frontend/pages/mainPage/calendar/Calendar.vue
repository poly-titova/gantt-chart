<template>
  <div class="calendar">
    <h3 class="h-sun">22</h3>
    <h3 class="h-mon">23</h3>
    <h3 class="h-tue">24</h3>
    <h3 class="h-wed">25</h3>
    <h3 class="h-thu">26</h3>
    <h3 class="h-fri">27</h3>
    <h3 class="h-sat">28</h3>
  </div>
</template>

<script>
export default {};
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

@media only screen and (min-width: 600px) {
  .calendar div {
    font-size: 16px;
  }
}

</style>
