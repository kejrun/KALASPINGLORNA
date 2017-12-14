Vue.component('ingredient', {
  props: ['item', 'lang'],
  template: ' <div class="ingredient">\
    <button v-on:click="minusIngredient" id="ingredientsMinusButton" name="ingredientsMinusButton">-</button>\
  <label>{{ counter }}</label>\
  <button v-on:click="plusIngredient" id="ingredientsPlusButton" name="ingredientsPlusButton">+</button>\
  <label>\
  {{item["ingredient_"+ lang]}} ({{ item.vol_m }} ml), {{item.stock}}ml\
  </label>\
  </div>',
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {
     plusIngredient: function(){
        this.counter += 1000;
      this.$emit('refill');
    },
    resetCounter: function () {
      this.counter = 0;
    },
    
        
     minusIngredient: function(){
         this.counter -= 1000;
         this.$emit('refill');
    },
    resetCounter: function () {
      this.counter = 0;
    }
        }  });


var vm = new Vue({
  el: '#ingredients',
  mixins: [sharedVueStuff],
    data: {
    type: '',
    chosenIngredients: [],
    volume: 0,
    price: 0
  },
    methods:{
     RefillStock: function () {
         console.log("please refill");
      //var i,
      //Wrap the order in an object
       refill_ingred = {
        ingredients: this.chosenIngredients,
        volume: this.volume,
        type: this.type,
        price: this.price
        };
         console.log(refill_ingred);
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      //socket.emit('order', {orderId: getOrderNumber(), order: order});
      //set all counters to 0. Notice the use of $refs
      //for (i = 0; i < this.$refs.ingredient.length; i += 1) {
     //   this.$refs.ingredient[i].resetCounter();
     // }
      //this.volume = 0;
     // this.price = 0;
    //  this.type = '';
    //  this.chosenIngredients = [];
    }

}});
