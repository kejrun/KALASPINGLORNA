Vue.component('ingredient', {
  props: ['item', 'lang'],
  template: ' <div class="ingredient">\
  <label>\
  <button v-on:click="refillCounter">{{ counter }}</button>\
  {{item["ingredient_"+ lang]}} ({{item.vol_m }} ml), {{item.stock}} ml\
  </label>\
  </div>',
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {
    refillCounter: function () {
      this.counter += 1000;
      this.$emit('refill');
    },
    resetCounter: function () {
      this.counter = 0;
    }
     /*refillStock: function (){
          var i,
      //Wrap the order in an object
      refill = {
        ingredients: this.chosenIngredients,
      };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      socket.emit('refill', {refill: refill});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.chosenIngredients = [];
     }*/
  }
});

var vm = new Vue({
  el: '#ingredients',
  mixins: [sharedVueStuff],
   data: {
    chosenIngredients: [],
  },
    methods: {
    
     /*refillStock: function (){
          var i,
      //Wrap the order in an object
      refill = {
        ingredients: this.chosenIngredients,
      };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      socket.emit('refill', {refill: refill});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.chosenIngredients = [];
     }*/
        }
});
