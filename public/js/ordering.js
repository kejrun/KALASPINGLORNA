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
    this.counter +=1;

    if (this.counter > 0){
        var minusButtons=document.getElementsByClassName("ingredientsMinusButton");
        var thisIngredientsId = this.item.ingredient_id;
        minusButtons[thisIngredientsId-1].disabled = false;
    }

    if (totalIngredientsCounter >= 0 && totalIngredientsCounter < 5 && !item.extra){
        totalIngredientsCounter ++;
        increaseBar();

        if (totalIngredientsCounter == 5){
            var plusButtons = document.getElementsByClassName("ingredientsPlusButton");
            for ( var i = 0; i < vm.ingredients.length; i++) {
                if(!vm.ingredients[i].extra){
                plusButtons[i].disabled = true;
                }
            }
        }
    }
    this.$emit('increment');
  },

minusIngredient: function(item){
    this.counter -=1;
    if (this.counter == 0){
    var minusButtons=document.getElementsByClassName("ingredientsMinusButton");
    var thisIngredientsId = this.item.ingredient_id;
    minusButtons[thisIngredientsId-1].disabled = true;
    }

    if (totalIngredientsCounter > 0 && totalIngredientsCounter <= 5 && !item.extra){
        totalIngredientsCounter --;
        decreaseBar();

        if (totalIngredientsCounter < 5){
            var plusButtons = document.getElementsByClassName("ingredientsPlusButton");
            for ( var i = 0; i < plusButtons.length; i++) {
                plusButtons[i].disabled = false;
            }
        }
    }
    this.$emit('decrement');
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

function openNav() {
    document.getElementById("sideTab").style.display = "block";
    document.getElementById("openNavbutton").style.display = "none";
}

function closeNav() {
    document.getElementById("sideTab").style.display = "none";
    document.getElementById("openNavbutton").style.display = "block";
}

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
    ingredientsBarText.innerHTML = 'Your drink is full, choose extras!';
  }
}

//to reset the entire choose your own page, call function resetChooseYourOwnPage in Vue component
//functions for resetting choose your own, resetChooseYourOwn calls the other resetting functions
function resetChooseYourOwn(){
    resetIngredientsBar();
    resetPlusMinusButtons();
    document.getElementById("addToMyOrder").disabled = true;
    document.getElementById("addToMyOrder").style.color = "gray";
    document.getElementById("addToMyOrder").style.backgroundColor = "#306d31";
    document.getElementById("resetCurrentDrink").disabled = true;
}

function resetIngredientsBar(){
  totalIngredientsCounter = 0;
  var curSize = $("#ingredientsBarProgress").width();
  $("#ingredientsBarProgress").css('width', '-=' + curSize);
  ingredientsBarText.innerHTML = 'Choose 5 ingredients';
}

function resetPlusMinusButtons(){
    var plusButtons = document.getElementsByClassName("ingredientsPlusButton");
    for ( var i = 0; i < plusButtons.length; i++) {
        plusButtons[i].disabled = false;
    }
    var minusButtons = document.getElementsByClassName("ingredientsMinusButton");
    for ( var i = 0; i < minusButtons.length; i++) {
        minusButtons[i].disabled = true;
    }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//****************Homepage animation*************
var leaves = $(".leaves"),
    piece1 = $("#p1"),
    piece2 = $("#p2"),
    piece3 = $("#p3"),
    piece4 = $("#p4"),
    piece5 = $("#p5"),
    piece6 = $("#p6"),
    orange = $("#orange"),
    letters = $("#text path"),
    tl;

tl = new TimelineMax();
tl.timeScale(0.4).seek(0);
tl.set(orange, {transform: "translateY(-120px)"})
tl.to(orange, 1, {transform: "translateY(0px)", ease:Bounce.easeOut})
  .to(piece4, 0.3, {rotation:-20, ease:Bounce.easeOut,                transformOrigin:"center bottom"}, "split")
  .to(piece3, 0.3, {yPercent: -10, rotation: 45, ease:Bounce.easeOut,
                  transformOrigin:"left bottom"}, "split")
  .to(piece2, 0.3, {transform: "translateY(35px) rotate(-25deg)", ease:Bounce.easeOut, transformOrigin:"right bottom"}, "split")
  .to(piece5, 0.3, {transform: "translateY(-10px) rotate(-45deg)", rotation: -45, ease:Bounce.easeOut, transformOrigin:"right bottom"}, "split")
  .to(piece6, 0.3, {transform: "translateY(25px) rotate(-45deg)", rotation: -45, ease:Bounce.easeOut, transformOrigin:"right bottom"}, "split")
  .to(piece1, 0.3, {transform: "translateY(50px) rotate(15deg)", rotation: 15, ease:Bounce.easeOut, transformOrigin:"left bottom"}, "split")
  .to(leaves, 0.5, {transform: "translateY(65px)", ease:Bounce.easeOut},"split")
  .staggerFrom(letters, 0.01, {autoAlpha: 0}, 0.05)
		.add("end");

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
    currentDrink: [],
    myOrder: [],
    pricesSmall: [],
    pricesMedium: [],
    pricesLarge: [],
    yourDrinkNumber: 0,
    volume: 0,
    price: 0,
    totalPrice: 0,
    orderCounterValue: 0
  },
  created: function() {
    socket.on("orderNumber",function(orderNumber) {
      //alert("Your ordernumber is " + orderNumber);
    });
  },
  methods: {
    addToDrink: function (item, type) {
      this.chosenIngredients.push(item);
      console.log("addToDrink used");
      console.log(item);
      console.log(this.type);

      if (this.chosenIngredients.length > 0){
        document.getElementById("resetCurrentDrink").disabled = false;
      }

      if (totalIngredientsCounter == 5){
        document.getElementById("addToMyOrder").disabled = false;
        document.getElementById("addToMyOrder").style.color = "white";
        document.getElementById("addToMyOrder").style.backgroundColor = "forestgreen";
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

      if (!item.extra){
        document.getElementById("addToMyOrder").disabled = true;
        document.getElementById("addToMyOrder").style.color = "gray";
        document.getElementById("addToMyOrder").style.backgroundColor = "#306d31";
      }

      if (this.chosenIngredients.length == 0){
          document.getElementById("resetCurrentDrink").disabled = true;
      }

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
      document.getElementById("smallCupPreMade").style.backgroundColor = "white";
      document.getElementById("mediumCupPreMade").style.backgroundColor = "white";
      document.getElementById("largeCupPreMade").style.backgroundColor = "white";
      this.type=type;
      if (type === 's'){
        document.getElementById("smallCup").style.backgroundColor = "lightblue";
        document.getElementById("smallCupPreMade").style.backgroundColor = "lightblue";
      }
      else if (type === 'm'){
        document.getElementById("mediumCup").style.backgroundColor = "lightblue";
        document.getElementById("mediumCupPreMade").style.backgroundColor = "lightblue";
      }
      else {
        document.getElementById("largeCup").style.backgroundColor = "lightblue";
        document.getElementById("largeCupPreMade").style.backgroundColor = "lightblue";
      }
    },

    addToMyOrder: function () {
     var i;
     this.yourDrinkNumber += 1;
     //Wrap the order in an object
     var drinkName = "Your Own Drink #" + this.yourDrinkNumber;
     this.totalPrice += this.price;
     this.orderCounterValue += 1;
     var currentDrink = {
       name: drinkName,
       ingredients: this.chosenIngredients,
       volume: this.volume,
       type: this.type,
       price: this.price
     };

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
     resetChooseYourOwn();
     closeNav();

     this.myOrder.push(currentDrink);
     //kolla här: behöver vi köra reset här också?? Jenny-Siri
     resetChooseYourOwn();

     //show the notifybubble
     document.getElementById("notifybubble").style.display = "block";
     document.getElementById("notifybubblePM").style.display = "block";
   },
   placeOrder: function () {
       console.log("hejhej");
     // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
     for(var i=0; i<this.myOrder.length; i+=1){
     var drink = [];
     drink.push(this.myOrder[i]);
     socket.emit('order', {order: drink});
     }
     this.yourDrinkNumber = 0;
     this.myOrder = [];
     this.totalPrice = 0;
   },

    //this function resets EVERYTHING on the choose your own page
    resetChooseYourOwnPage: function(){
      for (var i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.volume = 0;
      this.price = 0;
      this.type = '';
      this.chosenIngredients = [];
      this.pricesSmall = [];
      this.pricesMedium = [];
      this.pricesLarge = [];
      resetChooseYourOwn();
    },

    getIngredientById: function (id) {
      for (var i =0; i < this.ingredients.length; i += 1) {
        if (this.ingredients[i].ingredient_id === id){
          return this.ingredients[i];
        }
      }
    },

    orderPremade: function(pm) {
      //for (var i = 0; i < pm.pm_ingredients.length; i += 1) {
        this.addPremadeDrink(pm);
        // this.addPremadeDrink(this.getIngredientById(pm.pm_ingredients[i]), "medium");
      //}
    },
    getIngredientNameList: function (idArr) {
      var ingredientList = "", tempIngredient;
      for (var i = 0; i < idArr.length ; i += 1) {
        tempIngredient = this.getIngredientById(idArr[i]);
        ingredientList += tempIngredient["ingredient_" + this.lang] + ", ";
      }
      return ingredientList;
    },
    getIngredientList: function (idArr) {
      var ingredientList = [], tempIngredient;
      for (var i = 0; i < idArr.length ; i += 1) {
        tempIngredient = this.getIngredientById(idArr[i]);
        ingredientList.push(tempIngredient);
      }
      return ingredientList;
    },
    addPremadeDrink: function (item) {
      var i;

          if (this.type === "s"){
            this.price = item.price_s;
          }
          else if (this.type === "m") {
            this.price = item.price_m;
          }
          else{
            this.price = item.price_l;
          }

      this.totalPrice += this.price;
      this.orderCounterValue += 1;

      //Wrap the order in an object
      var currentDrink = {
        name: item.pm_name,
        ingredients: this.getIngredientList(item.pm_ingredients),
        volume: this.volume,
        type: this.type,
        price: this.price
      };

      console.log(currentDrink.name);
      this.myOrder.push(currentDrink);
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      //socket.emit('order', { order: order});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.volume = 0;
      this.price = 0;
      this.type = '';
      this.chosenIngredients = [];

      //show the notifybubble
      document.getElementById("notifybubble").style.display = "block";
      document.getElementById("notifybubblePM").style.display = "block";
    },

    openTab: function(tabName) {
      // Hide all elements with class="tabcontent" by default */
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      document.getElementById("holder").style.display = "none";

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
        document.getElementById("checkOut-pageBtnPM").style.backgroundColor = "#810051";
        document.getElementById("checkOut-pageBtn").style.backgroundColor = "#810051";
      };
      if (tabName === "home-page") {
        document.getElementById("home-pageBtnPM").style.backgroundColor = "#810051";
        document.getElementById("home-pageBtn").style.backgroundColor = "#810051";
        document.getElementById("holder").style.display = "block";
      };
      if (tabName === "preMade-page") {
        document.getElementById("defaultOpenPM").style.backgroundColor = "#810051";
      };
      if (tabName === "myOrder-page") {
        document.getElementById("myOrder-pageBtnPM").style.backgroundColor = "#810051";
        document.getElementById("myOrder-pageBtn").style.backgroundColor = "#810051";
      };
      if (tabName === "chooseYourOwn-page") {
        document.getElementById("defaultOpen").style.backgroundColor = "#810051";
      };
      if (tabName === "extras-page") {
        document.getElementById("extras-pageBtn").style.backgroundColor = "#810051";
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
      document.getElementById("holder").style.display = "none";
      document.getElementById("defaultOpen").style.backgroundColor = "#810051";
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
      document.getElementById("holder").style.display = "none";
      document.getElementById("defaultOpenPM").style.backgroundColor = "#810051";
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
      document.getElementById("extrasCategories").style.display = "none";
      document.getElementById("category-list").style.display ="grid";
    }
  }

});


// ------------- For myOrder page --------------
Vue.component('ordered-drink', {
    props: ['uiLabels', 'order', 'orderId', 'lang', 'type'],
    template: '<div class = drinkInfo><h2>{{order.name + " "}}{{order.price}} kr, {{order.type}}</h2>\
    <label>\{{order.ingredients.map(item=>item["ingredient_"+ lang]).join(" ")}}</label>\
    <br>\
    <button v-on:click="minusDrink(item)" id="drinkMinusButton" class="drinkMinusButton">-</button>\
    <label class="counterID">{{ counter }}</label>\
    <button v-on:click="plusDrink(item)" id="drinkPlusButton" class="drinkPlusButton">+</button>\
    <br></div>',
    data: function () {
        return {
          counter: 1
        };
    },
    methods: {
      minusDrink: function () {
        },

      plusDrink: function () {
        }

    }
})

Vue.component('ordered-drinks', {
  props: ['uiLabels', 'order', 'orderId', 'lang', 'name', 'type', 'price', 'totalPrice'],
   template: '<div id = "myOrderedDrinks">\
           <ordered-drink\
             :ui-labels="uiLabels"\
             :lang="lang"\
             :order-id="orderId"\
             :type="type"\
             :price="price"\
             :totalPrice="totalPrice"\
             :order="order">\
           </ordered-drink>\
          </div>',

    methods: {

    }
  });

//----------------------------------------------
