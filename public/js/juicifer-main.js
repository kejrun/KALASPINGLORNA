/*jslint es5:true, indent: 2 */
/*global io, Vue */
/*exported sharedVueStuff */
'use strict';

var socket = io();

Vue.component('order-item-done', {
  props: ['uiLabels', 'order', 'orderId', 'lang'],
  template: '<div>{{orderId}} {{order.type}}:\
             <div v-for="o in order.order">\
                <div v-for="ing in o.ingredients">\
                    {{ ing["ingredient_"+ lang] }}\
                </div>\
             </div></div>'
});
// Stuff that is used both in the ordering system and in the kitchen
var sharedVueStuff = {
  data: {
    orders: {},
    uiLabels: {},
    ingredients: {},
    premade:{},
    lang: "en",
    type: "m"
  },
  created: function () {
    socket.on('initialize', function (data) {
      this.orders = data.orders;
      this.uiLabels = data.uiLabels;
      this.ingredients = data.ingredients;
      this.premade = data.premade;
    }.bind(this));

    socket.on('switchLang', function (data) {
      this.uiLabels = data;
    }.bind(this));
      
    socket.on('switchSize', function (data) {
      this.type = data;
    }.bind(this));

    socket.on('currentQueue', function (data) {
      this.orders = data.orders;
      if (typeof data.ingredients !== 'undefined') {
        this.ingredients = data.ingredients;
      }
    }.bind(this));
  },
  methods: {
    switchLang: function () {
      if (this.lang === "en") {
        this.lang = "sv";
      } else {
        this.lang = "en";
      }
      socket.emit('switchLang', this.lang);
    },

    switchType: function (type) {
      this.type = type;
      socket.emit('switchSize', this.type);
    }
  }
};
