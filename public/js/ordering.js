/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

var totalIngredientsCounter = 0;
Vue.component('ingredient', {
  props: ['item', 'type', 'lang'],
  template: '<div class="ingredient">\
  <button v-on:click="minusIngredient(item)" id="ingredientsMinusButton" class="ingredientsMinusButton" disabled>-</button>\
  <label class="counterID">{{ counter }}</label>\
  <button v-on:click="plusIngredient(item)" id="ingredientsPlusButton" class="ingredientsPlusButton">+</button>\
  <label>\
  {{item["ingredient_"+ lang]}} {{ item["price_" + type] }} :- \
  </label>\
  </div>',
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {

plusIngredient: function(item){
  if (totalIngredientsCounter > -1 && totalIngredientsCounter < 5 && !item.extra){
    totalIngredientsCounter ++;
    this.counter +=1;
    increaseBar();
    this.$emit('increment');
    if (totalIngredientsCounter == 5){
        var plusButtons = document.getElementsByClassName("ingredientsPlusButton");
        for ( var i = 0; i < plusButtons.length; i++) {
        plusButtons[i].disabled = true;
        }
    }
    //reaching a specific minusButton
    if (this.counter > 0){
        var minusButtons=document.getElementsByClassName("ingredientsMinusButton");
        var thisIngredientsId = this.item.ingredient_id;
        minusButtons[thisIngredientsId-1].disabled = false;
    }
  }

  if (item.extra){
        this.$emit('increment');
  }
},

minusIngredient: function(item){
  if (totalIngredientsCounter > 0 && totalIngredientsCounter <= 5 && !item.extra){
    this.counter -=1;
    totalIngredientsCounter --;
    decreaseBar();
    this.$emit('decrement');
    if (totalIngredientsCounter < 5){
        var plusButtons = document.getElementsByClassName("ingredientsPlusButton");
        for ( var i = 0; i < plusButtons.length; i++) {
            plusButtons[i].disabled = false;
        }
    }
    if (this.counter == 0){
        var minusButtons=document.getElementsByClassName("ingredientsMinusButton");
        var thisIngredientsId = this.item.ingredient_id;
        minusButtons[thisIngredientsId-1].disabled = true;
    }
  }
  if (item.extra){
    this.$emit('decrement');
  }
},

//incrementCounter används inte i nuläget, tror jag..
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

//ökar progress i ingredientsBar
function increaseBar() {
      var fullSize = $("#ingredientsBar").width()-6; //magic number 6, adds padding 3px on each side
      var curSize = $("#ingredientsBarProgress").width();
      var increment = Math.round(fullSize/5);
      if(curSize < fullSize) {
        $("#ingredientsBarProgress").css('width', '+=' + increment);
        var newLength = curSize+increment;
        textOnBar(newLength, increment);
    }
}

//minskar progress i ingredientsBar
function decreaseBar() {
  var fullSize = $("#ingredientsBar").width()-6; //magic number 6, adds padding 3px on each side
  var curSize = $("#ingredientsBarProgress").width();
  var increment = Math.round(fullSize/5);
  if(curSize > 0) {
    $("#ingredientsBarProgress").css('width', '-=' + increment);
    var newLength = curSize-increment;
    textOnBar(newLength, increment);
  }
}

//skriver ut text på ingredientsBar
function textOnBar(newLength, increment){
  if (newLength == 0){
    ingredientsBarText.innerHTML = 'Choose 5 ingredients';
  }
  else if (newLength == increment){
    ingredientsBarText.innerHTML = 'Choose 4 ingredients';
  }
  else if (newLength == 2*increment){
    ingredientsBarText.innerHTML = 'Choose 3 ingredients';
  }
  else if (newLength == 3*increment){
    ingredientsBarText.innerHTML = 'Choose 2 ingredients';
  }
  else if (newLength == 4*increment){
    ingredientsBarText.innerHTML = 'Choose 1 ingredient';
  }
  else{
    ingredientsBarText.innerHTML = 'Your drink is done!';
  }
}

//resets the ingredientsBar and the ingredientsCounter
function resetIngredientsForNewOrder(){
  totalIngredientsCounter = 0;
  var curSize = $("#ingredientsBarProgress").width();
  $("#ingredientsBarProgress").css('width', '-=' + curSize);
  ingredientsBarText.innerHTML = 'Choose 5 ingredients';
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//****************Homepage animation*************


//****************Homepage animation- END *************


/*function getOrderNumber() {
// It's probably not a good idea to generate a random order number, client-side.
// A better idea would be to let the server decide.
return "#" + getRandomInt(1, 1000000);
}*/

var vm = new Vue({
  el: '#ordering',
  mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
  data: {
    type: "m", //preset on size medium
    chosenIngredients: [],
    pricesSmall: [],
    pricesMedium: [],
    pricesLarge: [],
    volume: 0,
    price: 0
  },
  created: function() {
    socket.on("orderNumber",function(orderNumber) {
      //alert("Your ordernumber is " + orderNumber);
    });

  },
  methods: {
    addToDrink: function (item, type) {
      this.chosenIngredients.push(item);
      if (this.chosenIngredients.length == 5){
        document.getElementById("addToMyOrder").disabled = false;
      }
      this.pricesSmall.push(item.price_s);
      this.pricesMedium.push(item.price_m);
      this.pricesLarge.push(item.price_l);
      this.type = type;
      if (type === "s"){
        this.price += +item.price_s;
      }
      else if (type === "m") {
        this.price += +item.price_m;
      }
      else{
        this.price += +item.price_l;
      }
    },

      removeFromDrink: function (item, type) {
          for (var i=0; i < this.chosenIngredients.length; i++){
              if(this.chosenIngredients[i] == item){
                this.chosenIngredients.splice(i,1);
                break;
              }
          }
      document.getElementById("addToMyOrder").disabled = true;

      this.type = type;
      if (type === "s"){
        this.price -= +item.price_s;
      }
      else if (type === "m") {
        this.price -= +item.price_m;
      }
      else{
        this.price -= +item.price_l;
      }

        for (var i=0; i < this.pricesSmall.length; i++){
          if (this.pricesSmall[i] == item.price_s && this.pricesMedium[i] == item.price_m && this.pricesLarge[i] == item.price_l){
              this.pricesSmall.splice(i,1);
              this.pricesMedium.splice(i,1);
              this.pricesLarge.splice(i,1);
              break;
          }
        }
    },

    changeTotalPrice: function (type){
      this.price = 0;
      this.type = type;
      var i;
      if (type === "s"){
        for (i = 0; i < this.pricesSmall.length; i++){
          this.price += this.pricesSmall[i];
        }
      }
      else if (type === "m") {
        for (i = 0; i < this.pricesMedium.length; i++){
          this.price += this.pricesMedium[i];
        }
      }
      else{
        for (i = 0; i < this.pricesLarge.length; i++){
          this.price += this.pricesLarge[i];
        }
      }
    },

    markChosenSizeButton: function(type){
      document.getElementById("smallCup").style.backgroundColor = "white";
      document.getElementById("mediumCup").style.backgroundColor = "white";
      document.getElementById("largeCup").style.backgroundColor = "white";
      this.type=type;
      if (type === 's'){
        document.getElementById("smallCup").style.backgroundColor = "lightblue";
      }
      else if (type === 'm'){
        document.getElementById("mediumCup").style.backgroundColor = "lightblue";
      }
      else {
        document.getElementById("largeCup").style.backgroundColor = "lightblue";
      }
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

      console.log('order', {order: order});
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      socket.emit('order', {order: order});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.volume = 0;
      this.price = 0;
      this.type = '';
      this.chosenIngredients = [];
      this.pricesSmall = [];
      this.pricesMedium = [];
      this.pricesLarge = [];
      resetIngredientsForNewOrder();
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
        this.placeOrderPremade(this.getIngredientById(pm.pm_ingredients[i]), "medium");
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

    placeOrderPremade: function (item, type) {
      this.chosenIngredients.push(item);
      console.log(item.ingredient_en);
      this.type = type;
      var i,
      //Wrap the order in an object
      order = {
        name: "premade drink",
        ingredients: this.chosenIngredients,
        volume: this.volume,
        type: this.type,
        price: this.price
      };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      socket.emit('order', { order: order});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.volume = 0;
      this.price = 0;
      this.type = '';
      this.chosenIngredients = [];
    },

    openTab: function(tabName) {
      // Hide all elements with class="tabcontent" by default */
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }

      // Remove the background color of all tablinks/buttons
      tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }
      tablinks = document.getElementsByClassName("tablinkPM");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }

      // Show the specific tab content
      document.getElementById(tabName).style.display = "block";

      // Add the specific color to the button used to open the tab content
      if (tabName === "checkOut-page") {
        document.getElementById("checkOut-pageBtnPM").style.backgroundColor = "purple";
        document.getElementById("checkOut-pageBtn").style.backgroundColor = "purple";
      };
      if (tabName === "home-page") {
        document.getElementById("home-pageBtnPM").style.backgroundColor = "purple";
        document.getElementById("home-pageBtn").style.backgroundColor = "purple";
      };
      if (tabName === "preMade-page") {
        document.getElementById("defaultOpenPM").style.backgroundColor = "purple";
      };
      if (tabName === "myOrder-page") {
        document.getElementById("myOrder-pageBtnPM").style.backgroundColor = "purple";
        document.getElementById("myOrder-pageBtn").style.backgroundColor = "purple";
      };
      if (tabName === "chooseYourOwn-page") {
        document.getElementById("defaultOpen").style.backgroundColor = "purple";
      };
      if (tabName === "extras-page") {
        document.getElementById("extras-pageBtn").style.backgroundColor = "purple";
      };
    },

    chooseYourOwn: function () {
      var i, tabcontent, tablinks;
      tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }
      tablinks = document.getElementsByClassName("tablinkPM");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }
      document.getElementById("defaultOpen").style.backgroundColor = "purple";
      document.getElementById("chooseYourOwn-page").style.display = "block";
      document.getElementById("preMade-page").style.display = "none";
      document.getElementById("home-page").style.display = "none";
      document.getElementById("myOrder-page").style.display = "none";
      document.getElementById("checkOut-page").style.display = "none";
      document.getElementById("ProgressBarPreMade").style.display = "none";
      document.getElementById("ProgressBarChooseYourOwn").style.display = "block";
    },

    preMade: function () {
      var i, tabcontent, tablinks;
      tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }
      tablinks = document.getElementsByClassName("tablinkPM");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }
      document.getElementById("defaultOpenPM").style.backgroundColor = "purple";
      document.getElementById("chooseYourOwn-page").style.display = "none";
      document.getElementById("preMade-page").style.display = "block";
      document.getElementById("home-page").style.display = "none";
      document.getElementById("myOrder-page").style.display = "none";
      document.getElementById("checkOut-page").style.display = "none";
      document.getElementById("ProgressBarPreMade").style.display = "block";
      document.getElementById("ProgressBarChooseYourOwn").style.display = "none";
    },

    toExtras: function(){
      var extrasCategories,categoriesDrink;
      document.getElementById("defaultOpenPM").style.backgroundColor = "red";
      document.getElementById("category-list").style.display ="none";
      document.getElementById("preMade-page").style.display = "none";
      document.getElementById("home-page").style.display = "none";
      document.getElementById("myOrder-page").style.display = "none";
      document.getElementById("checkOut-page").style.display = "none";
      document.getElementById("ProgressBarPreMade").style.display = "none";
      document.getElementById("chooseYourOwn-page").style.display = "block";
      document.getElementById("ProgressBarChooseYourOwn").style.display = "block";
      categoriesDrink = document.getElementById("categories-drink");
      extrasCategories = document.getElementById("extrasCategories");
      categoriesDrink.appendChild(extrasCategories);
      extrasCategories.style.display="grid";

    },

    toChooseYourOwn: function() {
      document.getElementById("extrasCategories").style.display = "none"; document.getElementById("category-list").style.display ="grid";
    }
  }

});
