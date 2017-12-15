Vue.component('ingredient', {
  props: ['item', 'lang'],
  template: ' <div class="ingredient">\
  <label>\
  {{item["ingredient_"+ lang]}}, {{item.stock}}ml\
  </label>\
 <button v-on:click="minusIngredient" id="ingredientsMinusButton" name="ingredientsMinusButton">-</button>\
  <label>{{ counter }}</label>\
  <button v-on:click="plusIngredient" id="ingredientsPlusButton" name="ingredientsPlusButton">+</button>\
  </div>',
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {
     plusIngredient: function(){
        this.$emit('refill');
        this.counter += 1000;
        
    },
     minusIngredient: function(){
        this.$emit('un-refill');
        this.counter -= 1000;
        
     },
    resetCounter: function () {
      this.counter = 0;
    }
    }
});


var vm = new Vue({
  el: '#ingredients',
  mixins: [sharedVueStuff],
    methods:{
    addToRefill: function(item){
        socket.emit("plusIngredient", item.ingredient_id);
    },
    unaddToRefill: function(item){
        socket.emit("minusIngredient", item.ingredient_id);
    },
     refreshPage: function(){
        window.location = 'http://localhost:3000/ingredients';
         
    },
    ShowStartpage: function(){
        window.location = 'http://localhost:3000/kitchen';
        document.getElementById("finishedOrder").style.display ="none";
        document.getElementById("start_page").style.display = "none";
    }
    
}});
