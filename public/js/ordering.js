/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

var totalIngredientsCounter = 0;
Vue.component('ingredient', {
  props: ['item', 'type', 'lang'],
  template: '<div class="ingredient">\
  <label>\
<<<<<<< HEAD
  <button v-on:click="minusIngredient" id="ingredientsMinusButton" name="ingredientsMinusButton" disabled>-</button>\
  <button disabled>{{ counter }}</button>\
  <button v-on:click="plusIngredient" id="ingredientsPlusButton" name="ingredientsPlusButton">+</button>\
  {{item["ingredient_"+ lang]}} ({{ (type=="medium") ? item.vol_m:item.vol_m }} ml), {{item.price_m}}:-\
  </label>\
  </div>',
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {
    plusIngredient: function(){
        this.counter +=1;
        totalIngredientsCounter ++;
        this.$emit('increment');
        increaseBar();
        document.getElementById("ingredientsMinusButton").disabled = false;
        if (totalIngredientsCounter == 5){
            if (this.counter == 5){
                document.getElementById("ingredientsPlusButton").disabled = true;
            }
            else{
                var x = document.getElementsByName("ingredientsPlusButton");
                var i;
                for (i = 0; i < x.length; i++) {
                   x[i].disabled = true;
                }
            }
        }
    },
    minusIngredient: function(){
        this.counter -=1;
        totalIngredientsCounter --;
        this.$emit('increment');
        decreaseBar();
        document.getElementById("ingredientsPlusButton").disabled = false;
        if (totalIngredientsCounter == 0){
            if (this.counter == 0){
                document.getElementById("ingredientsMinusButton").disabled = true;
            }
            else{
                var x = document.getElementsByName("ingredientsMinusButton");
                var i;
                for (i = 0; i < x.length; i++) {
                   x[i].disabled = true;
                }
            }
        }
    },
    
//incrementCounter används inte i nuläget
    incrementCounter: function () {
      this.counter += item.vol_m;
    console.log(item.vol_m)
      this.$emit('increment');
    },
    resetCounter: function () {
      this.counter = 0;
    }
  }
});

document.getElementsByName

//ökar progress i ingredientsBar
function increaseBar() {
    var curSize = $("#ingredientsBarProgress").width();
    var fullSize = 500;
    var increment = fullSize/5;
    if(curSize < fullSize) {
        var newLength = curSize+increment;
        $("#ingredientsBarProgress").css('width', '+=' + increment);
        textOnBar(newLength, fullSize);
    }
}

//minskar progress i ingredientsBar
function decreaseBar() {
    var curSize = $("#ingredientsBarProgress").width();
    var fullSize = 500;
    var increment = fullSize/5;
    if(curSize > 0) {
        var newLength = curSize-increment;
        $("#ingredientsBarProgress").css('width', '-=' + increment);
        textOnBar(newLength, fullSize);
    }
}

//skriver ut text på ingredientsBar
function textOnBar(newLength, fullSize){
  if (newLength == 0){
    ingredientsBarText.innerHTML = 'Choose 5 ingredients';
  }
  else if (newLength == fullSize/5){
    ingredientsBarText.innerHTML = 'Choose 4 ingredients';
  }
  else if (newLength == 2*fullSize/5){
    ingredientsBarText.innerHTML = 'Choose 3 ingredients';
  }
  else if (newLength == 3*fullSize/5){
    ingredientsBarText.innerHTML = 'Choose 2 ingredients';
  }
  else if (newLength == 4*fullSize/5){
    ingredientsBarText.innerHTML = 'Choose 1 ingredient';
  }
  else{
    ingredientsBarText.innerHTML = 'Your drink is done!';
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getOrderNumber() {
  // It's probably not a good idea to generate a random order number, client-side.
  // A better idea would be to let the server decide.
  return "#" + getRandomInt(1, 1000000);
}

var vm = new Vue({
  el: '#ordering',
  mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
  data: {
    type: '',
    chosenIngredients: [],
    volume: 0,
    price: 0
  },
  methods: {
    addToOrder: function (item, type) {
      this.chosenIngredients.push(item);
      this.type = type;
    this.chosenIngredients.push(document.createElement('br'));
      if (type === "medium") {
        this.volume += +item.vol_m;
          console.log("vol_m added");
      } else if (type === "juice") {
        this.volume += +item.vol_juice;
      }
      this.price += +item.price_m;
    },

    placeOrder: function () {
      var i,
      //Wrap the order in an object
      order = {
        ingredients: this.chosenIngredients,
        volume: this.volume,
        type: this.type,
        price: this.price
      };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      socket.emit('order', {orderId: getOrderNumber(), order: order});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.volume = 0;
      this.price = 0;
      this.type = '';
      this.chosenIngredients = [];
    },
    getIngredientById: function (id) {
      for (var i =0; i < this.ingredients.length; i += 1) {
        if (this.ingredients[i].ingredient_id === id){
          return this.ingredients[i];
        }
      }
    },
    orderPremade: function(pm) {
      for (var i = 0; i < pm.pm_ingredients.length; i += 1) {
        this.addToOrder(this.getIngredientById(pm.pm_ingredients[i]), "smoothie");
      }
    },
    getIngredientNameList: function (idArr) {
      var ingredientList = "", tempIngredient;
      for (var i = 0; i < idArr.length ; i += 1) {
        tempIngredient = this.getIngredientById(idArr[i]);
        ingredientList += tempIngredient["ingredient_" + this.lang] + ", ";
      }
      return ingredientList;
    },

    chooseYourOwn: function () {
      document.getElementById("chooseYourOwn-page").style.display = "block";
      document.getElementById("preMade-page").style.display = "none";
      document.getElementById("home-page").style.display = "none";
      document.getElementById("myOrder-page").style.display = "none";
      document.getElementById("checkOut-page").style.display = "none";
      document.getElementById("ProgressBarPreMade").style.display = "none";
      document.getElementById("ProgressBarChooseYourOwn").style.display = "block";
    },
    preMade: function () {
      document.getElementById("chooseYourOwn-page").style.display = "none";
      document.getElementById("preMade-page").style.display = "block";
      document.getElementById("home-page").style.display = "none";
      document.getElementById("myOrder-page").style.display = "none";
      document.getElementById("checkOut-page").style.display = "none";
      document.getElementById("ProgressBarPreMade").style.display = "block";
      document.getElementById("ProgressBarChooseYourOwn").style.display = "none";
    },
    myOrder: function () {
      document.getElementById("chooseYourOwn-page").style.display = "none";
      document.getElementById("preMade-page").style.display = "none";
      document.getElementById("home-page").style.display = "none";
      document.getElementById("myOrder-page").style.display = "block";
      document.getElementById("checkOut-page").style.display = "none";
      if (document.getElementById("ProgressBarPreMade").style.display = "block"){
        document.getElementById("ProgressBarChooseYourOwn").style.display = "none";
      }
      else {
        document.getElementById("ProgressBarChooseYourOwn").style.display = "block";
      };
    },
    checkOut: function () {
      document.getElementById("chooseYourOwn-page").style.display = "none";
      document.getElementById("preMade-page").style.display = "none";
      document.getElementById("home-page").style.display = "none";
      document.getElementById("myOrder-page").style.display = "none";
      document.getElementById("checkOut-page").style.display = "block";
      if (document.getElementById("ProgressBarPreMade").style.display = "block"){
        document.getElementById("ProgressBarChooseYourOwn").style.display = "none";
      }
      else {
        document.getElementById("ProgressBarChooseYourOwn").style.display = "block";
      };
    },
    HomePage: function () {
      document.getElementById("chooseYourOwn-page").style.display = "none";
      document.getElementById("preMade-page").style.display = "none";
      document.getElementById("home-page").style.display = "block";
      document.getElementById("myOrder-page").style.display = "none";
      document.getElementById("checkOut-page").style.display = "none";
    }

  }
});
