<template>
  <div class="carousel-wrapper">
  <a class="jcarousel-prev" href="#"><i class="fa fa-chevron-left"></i></a>
  <div class="jcarousel">
    <ul>
        <li class="month-day"><div class="week">пн</div><div class="day-month">22 set</div></li>
        <li class="month-day"><div class="week">вт</div><div class="day-month">23 set</div></li>
        <li class="month-day"><div class="week">ср</div><div class="day-month">24 set</div></li>
        <li class="month-day active"><div class="week">чт</div><div class="day-month">25 set</div></li>
        <li class="month-day"><div class="week">пт</div><div class="day-month">26 set</div></li>
        <li class="month-day"><div class="week">сб</div><div class="day-month">27 set</div></li>
        <li class="month-day"><div class="week">вс</div><div class="day-month">28 set</div></li>
        <li class="month-day"><div class="week">пн</div><div class="day-month">29 set</div></li>
        <li class="month-day"><div class="week">вт</div><div class="day-month">30 set</div></li>
        <li class="month-day"><div class="week">ср</div><div class="day-month">01 out</div></li>
        <li class="month-day"><div class="week">чт</div><div class="day-month">02 out</div></li>
        <li class="month-day"><div class="week">пт</div><div class="day-month">03 out</div></li>
        <li class="month-day"><div class="week">сб</div><div class="day-month">04 out</div></li>
        <li class="month-day"><div class="week">вс</div><div class="day-month">05 out</div></li>
        <li class="month-day"><div class="week">пн</div><div class="day-month">06 out</div></li>
        <li class="month-day"><div class="week">вт</div><div class="day-month">07 out</div></li>
        <li class="month-day"><div class="week">ср</div><div class="day-month">08 out</div></li>
        <li class="month-day"><div class="week">чт</div><div class="day-month">09 out</div></li>
        <li class="month-day"><div class="week">пт</div><div class="day-month">10 out</div></li>
        <li class="month-day"><div class="week">сб</div><div class="day-month">11 out</div></li>
        <li class="month-day"><div class="week">вс</div><div class="day-month">12 out</div></li>
      </ul>
  </div>
  
  <a class="jcarousel-next" href="#"><i class="fa fa-chevron-right"></i></a>
</div>

<p class="jcarousel-pagination"></p>

<button type="button" class="add-prev">Adicionar anterior</button>
<button type="button" class="add-next">Adicionar próximo</button>
</template>

<script>
var html_prev = '<li class="month-day"><div class="week">пн</div><div class="day-month">XX set</div></li><li class="month-day"><div class="week">вт</div><div class="day-month">XX set</div></li><li class="month-day"><div class="week">ср</div><div class="day-month">XX set</div></li><li class="month-day"><div class="week">чт</div><div class="day-month">XX set</div></li><li class="month-day"><div class="week">пт</div><div class="day-month">XX set</div></li><li class="month-day"><div class="week">сб</div><div class="day-month">XX set</div></li><li class="month-day"><div class="week">вс</div><div class="day-month">XX set</div></li>';

var html_next = '<li class="month-day"><div class="week">пн</div><div class="day-month">YY set</div></li><li class="month-day"><div class="week">вт</div><div class="day-month">YY set</div></li><li class="month-day"><div class="week">ср</div><div class="day-month">YY set</div></li><li class="month-day"><div class="week">чт</div><div class="day-month">YY set</div></li><li class="month-day"><div class="week">пт</div><div class="day-month">YY set</div></li><li class="month-day"><div class="week">сб</div><div class="day-month">YY set</div></li><li class="month-day"><div class="week">вс</div><div class="day-month">YY set</div></li>';

$('.jcarousel')
.on('jcarousel:createend', function() {
	$(this).jcarousel('scroll', $('.jcarousel li:eq('+get_initialSlide($('.jcarousel').find("ul"))+')'), false);
}).jcarousel();

$('.jcarousel-prev').on('jcarouselcontrol:active', function() {
	$(this).removeClass('inactive');
}).on('jcarouselcontrol:inactive', function() {
	$(this).addClass('inactive');
}).jcarouselControl({
	target: '-=7'
});


$('.jcarousel-next').on('jcarouselcontrol:active', function() {
	$(this).removeClass('inactive');
}).on('jcarouselcontrol:inactive', function() {
	$(this).addClass('inactive');
}).jcarouselControl({
	target: '+=7'
});

function get_initialSlide(el){
  var initialSlide = $( ".month-day" ).index( el.find('.month-day.active') )
  return parseInt(initialSlide);
}

$('.add-prev').click(function(){
	$('.jcarousel ul').prepend(html_prev);
	$('.jcarousel').jcarousel('reload');
});

$('.add-next').click(function(){
	$('.jcarousel ul').append(html_prev);
	$('.jcarousel').jcarousel('reload');
});
</script>

<style>
.carousel-wrapper {
  overflow: auto;  
}

.jcarousel {
    position: relative;
    overflow: hidden;
    width: 686px;
    float: left;
}

.jcarousel ul {
    width: 10000em;
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}

.jcarousel ul li {
    float: left;
    width: 86px;
    border: 1px solid #00aeef;
    padding: 15px 5px;
    margin-right: 14px;
    text-align: center;
    color: #00aeef;
    font-family: "Cabin",sans-serif;
    text-transform: uppercase;
    line-height: 20px;
    transition: 0.12s;
    -moz-transition: 0.12s;
    -o-transition: 0.12s;
    -webkit-transition: 0.12s;
  -ms-transition: 0.12s;
  .week {
    font-size: 14px;
  }
  .day-month {
    font-weight: bold;
    font-size: 20px;
  }

  &:hover, &.active {
    background-color: #00aeef;
    color: #fff;
    cursor: pointer;
  }
}

.jcarousel-prev, .jcarousel-next {
  display: inline-block;
  width: 25px;
  text-align: center;
  float: left;
  font-size: 20px;
  line-height: 72px;
  color: #b2b2b2;
}

.jcarousel-prev { margin-right: 7px }
.jcarousel-next { margin-left: 7px }
</style>
