/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

Vue.component('order-item', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: '<div id = style-orderbutton><div class = orderInfo>{{orderId}} <div v-for="o in order.order"><h2>{{o["type"]}}</h2>\
    </div></div><div v-for="o in order.order"><h6>{{o["name"]}}</h6><div v-for="ing in o.ingredients" class = orderIngredInfo>{{ ing["ingredient_" + lang] }}</div></div></div>'
});

Vue.component('order-item-to-prepare', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: '<div class = style_orders_inQueue>\
           <button class = ArrowImg_dis>\
            <img src="https://abcdefghijklmn-pqrstuvwxyz.com/wp-content/themes/o/img/prev.svg" width="30">\
            <br>{{uiLabels.cancel}}\
          </button>\
            <button v-on:click="orderInMade" id="Drink_items">\
          <order-item\
            :ui-labels="uiLabels"\
            :lang="lang"\
            :order-id="orderId"\
            :order="order">\
          </order-item>\
            </button>\
            <button class = ArrowImg_dis>\
            <img src="https://abcdefghijklmn-pqrstuvwxyz.com/wp-content/themes/o/img/next.svg" width="30">\
            <br>{{uiLabels.ready}}\
          </button>\
         </div>',
    methods: {
    orderInMade: function(){
        this.$emit('in-made');
    }
    }
  });


var vm = new Vue({
  el: '#orders',
  mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
  methods: {
    markDone: function (orderid) {
      socket.emit("orderDone", orderid);
    },
    sendCancel: function (orderid) {
      socket.emit("cancelOrder", orderid);
    },
    markInMade: function(orderid){
        
      socket.emit("orderInMade", orderid);
    },
    unmarkInMade: function(orderid){
      socket.emit("notInMade", orderid);
    },
    undoCancel: function(orderid){
        socket.emit("undoCancelOrder", orderid);
        window.location = 'http://localhost:3000/kitchen';
    },
    wantToCancel: function (orderid){
        socket.emit("wantCancel", orderid); 
        window.location = 'http://localhost:3000/kitchen'; 
    },                     
    ShowHistory: function(){
      document.getElementById("finishedOrder").style.display ="block";
      document.getElementById("start_page").style.display = "none";
      document.getElementById("Hist_Ingred").style.display = "none";

    },
    ShowIngredients: function(){
      window.location = 'http://localhost:3000/ingredients';
      document.getElementById("finishedOrder").style.display ="none";
      document.getElementById("start_page").style.display = "none";
    },
    ShowStartpage: function(){
      document.getElementById("finishedOrder").style.display ="none";
      document.getElementById("start_page").style.display = "block";
      document.getElementById("Hist_Ingred").style.display = "block"; 
    }
  }
});

Vue.component('order-item-to-prepare-in-made', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: '<div class = style_orders_inQueue>\
            <button v-on:click="wantCancel" class = ArrowImg>\
             <img src="https://abcdefghijklmn-pqrstuvwxyz.com/wp-content/themes/o/img/prev.svg" width="30">\
            <br>{{uiLabels.cancel}}\
          </button>\
            <button v-on:click="notInMade" id="inMade_Drink_items">\
            <order-item\
            :ui-labels="uiLabels"\
            :lang="lang"\
            :order-id="orderId"\
            :order="order">\
          </order-item>\
            </button>\
            <button v-on:click="orderDone" class = ArrowImg>\
            <img src="https://abcdefghijklmn-pqrstuvwxyz.com/wp-content/themes/o/img/next.svg" width="30">\
            <br>{{uiLabels.ready}}\
          </button>\
         </div>',
    methods: {
    orderDone: function () {
      this.$emit('done');
        
    },
    notInMade: function(){
      this.$emit('in-made');
    },
    wantCancel: function () {
      this.$emit('want-cancel')
    }
  }

});

Vue.component('order-cancel', {
    props: ['uiLabels', 'order', 'orderId', 'lang'],
    template: '<div class = cancelOrNot><div class = cancelOrNotOrder >{{uiLabels.CancelWant}}<div v-for="o in order.order" class = orderIngredCancel>{{orderId}}, {{o["type"]}}<div v-for="ing in o.ingredients" class = orderIngredInfo>{{ ing["ingredient_" + lang] }}</div></div></div>\
    <button v-on:click="cancelOrder" class = YesNoButton>{{uiLabels.yes}}</button>\
    <button v-on:click="undoCancelOrder" class = YesNoButton>{{uiLabels.no}}</button></div>',
    methods: {
      cancelOrder: function () {
        this.$emit('cancel')
    },
    undoCancelOrder:function(){
        this.$emit('undo-cancel')
    }
    }
}); 

Vue.component('order-item-done', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: '<div class = finishedOrderClass > <div v-for="o in order.order">{{orderId}}, {{o["type"]}}</div>\<div v-for="o in order.order"><div v-for="ing in o.ingredients" class = orderIngredInfo>{{ ing["ingredient_" + lang] }}</div></div></div>'
});

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock_kitchen').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
};

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
};
