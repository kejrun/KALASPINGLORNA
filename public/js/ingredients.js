Vue.component('ingredient', {
  props: ['item', 'lang'],
  template: '<div class="ingredientStock">\
    <div class= "itemColumn">{{item["ingredient_"+ lang]}}</div>\
    <div class= "itemColumn">{{item.stock}}ml</div>\
    <div class= "itemColumn"><button v-on:click="minusIngredient" class="MinusPlusButtons" name="ingredientsMinusButton">-</button>\
  <label id="counterStock">{{ counter }}</label>\
  <button v-on:click="plusIngredient" class="MinusPlusButtons" name="ingredientsPlusButton">+</button>\</div>\
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
        console.log(this)
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

Vue.component('ingredient-limited', {
  props: ['item', 'lang'],
  template: '<div class="ingredientStock">\
    <div class= "itemColumn">{{item["ingredient_"+ lang]}}</div>\
    <div class= "itemColumn">{{item.stock}}ml</div>\
   </div>',         
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

var vm = new Vue({
  el: '#ingredients',
  mixins: [sharedVueStuff],
    data: {
        searchText: ""
    },
    methods:{
    addToRefill: function(item){
        socket.emit("plusIngredient", item.ingredient_id);
    },
    unaddToRefill: function(item){
        socket.emit("minusIngredient", item.ingredient_id);
    },
   //  refreshPage: function(){
    //    window.location = 'http://localhost:3000/ingredients';

   // },
   // ShowStartpage: function(){
   //     window.location = 'http://localhost:3000/kitchen';
   //     document.getElementById("finishedOrder").style.display ="none";
        
  //  },
    filteredIngredients: function () {
        var resultList = [];
        for (var i = 0; i< this.ingredients.length; i+=1) {
            if(this.ingredients[i]["ingredient_" +this.lang].substring(0,this.searchText.length) == this.searchText) {
                resultList.push(this.ingredients[i]);
            }
            
        }
        return resultList;
    }
    
   


}});
