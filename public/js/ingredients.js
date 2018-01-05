Vue.component('ingredient', {
  props: ['item', 'lang'],
  template: '<div class="ingredientStock">\
    <div class= "itemColumn">{{item["ingredient_"+ lang]}}</div>\
    <div class= "itemColumn">{{item.stock}}ml</div>\
    <div class= "itemColumn"><button v-on:click="minusIngredient" id="ingredientsMinusButton" name="ingredientsMinusButton">-</button>\
  <label>{{ counter }}</label>\
  <button v-on:click="plusIngredient" id="ingredientsPlusButton" name="ingredientsPlusButton">+</button>\</div>\
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

/*function searchFunction() {
    // Declare variables
    var input, filter, sl, li, a, i;
    input = document.getElementById('searchField');
    filter = input.value.toUpperCase();
    sl = document.getElementsByClassName("stockList");
    li = sl.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
};*/


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
        
    },
    /*searchFunction: function(){
        var input, filter, sl, li, a, i;
        input = document.getElementById('searchField');
        filter = input.value.toUpperCase();
        sl = document.getElementsByClassName("stockList");
        
    }*/

}});
