/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

Vue.component('order-item-to-prepare', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: '<div>\
           <button v-on:click="orderDone" class = ArrowImg>\
            <img src="https://abcdefghijklmn-pqrstuvwxyz.com/wp-content/themes/o/img/prev.svg" width="30">\
            <br>{{uiLabels.ready}}\
          </button>\
            <button v-on:click="orderInMade" id="Drink_items">\
          <order-item\
            :ui-labels="uiLabels"\
            :lang="lang"\
            :order-id="orderId"\
            :order="order">\
          </order-item>\
            </button>\
            <button v-on:click="cancelOrder" class = ArrowImg>\
            <img src="https://abcdefghijklmn-pqrstuvwxyz.com/wp-content/themes/o/img/next.svg" width="30">\
            <br>{{uiLabels.cancel}}\
          </button>\
         </div>',
    methods: {
    orderDone: function () {
    this.$emit('done');
    },
    orderInMade: function(){
    if (document.getElementById("Drink_items")){
    document.getElementById("Drink_items").id='changeButton';
    }
    else{
    document.getElementById("changeButton").id='Drink_items';
    }
    },
    cancelOrder: function () {
    this.$emit('cancel');
    }, 
 
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
    ShowHistory: function(){
        console.log("hej")
        document.getElementById("finishedOrder").style.display ="block";
        document.getElementById("start_page").style.display = "none";
        document.getElementById("IngredientsPage").style.display ="none";
            
    },
    ShowIngredients: function(){
        window.location = 'http://localhost:3000/ingredients'
        document.getElementById("finishedOrder").style.display ="none";
        document.getElementById("start_page").style.display = "none";
        //document.getElementById("IngredientsPage").style.display ="block";
    },
    ShowStartpage: function(){
        document.getElementById("finishedOrder").style.display ="none";
        document.getElementById("start_page").style.display = "block";
        document.getElementById("IngredientsPage").style.display ="none";
    }
    }
});