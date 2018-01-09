/*jslint es5:true, indent: 2 */
/*global io, Vue */
/*exported sharedVueStuff */
'use strict';

var socket = io();


// Stuff that is used both in the ordering system, ingredients page and in the kitchen
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
    switchLang: function (lang) {
      if (lang === "en") {
        this.lang = "en";
      } else {
        this.lang = "sv";
      }
      socket.emit('switchLang', this.lang);
    },

    switchType: function (type) {
      this.type = type;
      socket.emit('switchSize', this.type);
    }
  }
};
