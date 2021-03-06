'use strict';

var totalIngredientsCounter = 0;
Vue.component('ingredient', {
  props: ['item', 'type', 'lang'],
  template: '<div class="ingredient">\
  <div class= "ingColumn">{{item["ingredient_"+ lang]}}</div>\
  <div class="costColumn">  {{ item["price_" + type] }} :- </div>\
  <div class= "mpColumn">\
  <button v-on:click="minusIngredient(item)" id="ingredientsMinusButton"  class="ingredientsMinusButton" disabled>-</button>\
  <label class="counterID">{{ counter }}</label>\
  <button v-on:click="plusIngredient(item)" id="ingredientsPlusButton" class="ingredientsPlusButton">+</button>\</div>\
  </div>',

  data:
  function () {
    return {
      counter: 0,
    };
  },

  methods: {

    plusIngredient: function(item){
      this.counter +=1;
      if (this.counter > 0){
        for (var i = 0; i < vm.ingredientsInCategoryOrder.length; i++){
          if (this.item.ingredient_sv === vm.ingredientsInCategoryOrder[i]){
            var newId = i;
            break;
          }
        }
        var minusButtons=document.getElementsByClassName("ingredientsMinusButton");
        minusButtons[newId].disabled = false;
      }
      if (totalIngredientsCounter >= 0 && totalIngredientsCounter < 5 && !item.extra){
        totalIngredientsCounter ++;
        increaseBar();
        if (totalIngredientsCounter == 5){
          var plusButtons = document.getElementsByClassName("ingredientsPlusButton");
          for (var i = 0; i < vm.ingredients.length; i++){
            if(!vm.ingredients[i].extra){
              for ( var j = 0; j < vm.ingredientsInCategoryOrder.length; j++){
                if (vm.ingredients[i].ingredient_sv === vm.ingredientsInCategoryOrder[j]){
                  var newId = j;
                  plusButtons[newId].disabled = true;
                }
              }
            }
          }
        }
      }
      this.$emit('increment');
    },

    minusIngredient: function(item){
      this.counter -=1;
      if (this.counter == 0){
        for (var i = 0; i < vm.ingredientsInCategoryOrder.length; i++){
          if (this.item.ingredient_sv === vm.ingredientsInCategoryOrder[i]){
            var newId = i;
            break;
          }
        }
        var minusButtons=document.getElementsByClassName("ingredientsMinusButton");
        minusButtons[newId].disabled = true;
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

    resetCounter: function () {
      this.counter = 0;
    }
  }
});

//Used in the appversion for the sidetab
function openNav() {
  document.getElementById("sideTab").style.display = "block";
  document.getElementById("openNavbutton").style.display = "none";
}

function closeNav() {
  document.getElementById("sideTab").style.display = "none";
  document.getElementById("openNavbutton").style.display = "block";
}

var curSize = 0;
function increaseBar() {
  var fullSize = $("#ingredientsBar").width()-6; //magic number 6, adds padding 3px on each side
  var increment = Math.round(fullSize/5);
  if(curSize < fullSize) {
    $("#ingredientsBarProgress").css('width', '+=' + increment);
    curSize += increment;
    textOnBar(curSize, increment);
  }
}

function decreaseBar() {
  var fullSize = $("#ingredientsBar").width()-6; //magic number 6, adds padding 3px on each side
  var increment = Math.round(fullSize/5);
  if(curSize > 0) {
    $("#ingredientsBarProgress").css('width', '-=' + increment);
    curSize -= increment;
    textOnBar(curSize, increment);
  }
}

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
  else if (newLength == 5*increment){
    ingredientsBarText.innerHTML = 'Your drink is full, choose extras!';
  }
  else{
    ingredientsBarText.innerHTML = 'Your drink is almost done!';
  }
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
tl.timeScale(0.4).repeat(Infinity);
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

  var vm = new Vue({
    el: '#ordering',
    mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
    data: {
      chosenIngredients: [],
      currentDrink: [],
      myDrinks: [],
      myOrder: [],
      pricesSmall: [],
      pricesMedium: [],
      pricesLarge: [],
      vegetables: [],
      fruits: [],
      berries: [],
      liquids: [],
      extras: [],
      ingredientsInCategoryOrder: [],
      finishedOrderInfo: [],
      preMadesInStock:[],
      yourDrinkNumber: 0,
      volume: 0,
      price: 0,
      totalPrice: 0,
      orderCounterValue: 0
    },

    methods: {

      makeIngredientLists: function(){
        this.vegetables = [];
        this.fruits = [];
        this.berries = [];
        this.liquids = [];
        this.extras = [];
        this.ingredientsInCategoryOrder = [];
        for ( var i = 0; i < this.ingredients.length; i++){
          if (this.ingredients[i].category == "vegetable"){
            this.vegetables.push(this.ingredients[i].ingredient_sv);
          }
          else if (this.ingredients[i].category == "fruit"){
            this.fruits.push(this.ingredients[i].ingredient_sv);
          }
          else if (this.ingredients[i].category == "berry"){
            this.berries.push(this.ingredients[i].ingredient_sv);
          }
          else if (this.ingredients[i].category == "liquid"){
            this.liquids.push(this.ingredients[i].ingredient_sv);
          }
          else{
            this.extras.push(this.ingredients[i].ingredient_sv);
          }
        }
        for ( var i = 0; i < this.vegetables.length; i++){
          this.ingredientsInCategoryOrder.push(this.vegetables[i]);
        }
        for ( var i = 0; i < this.fruits.length; i++){
          this.ingredientsInCategoryOrder.push(this.fruits[i]);
        }
        for ( var i = 0; i < this.berries.length; i++){
          this.ingredientsInCategoryOrder.push(this.berries[i]);
        }
        for ( var i = 0; i < this.liquids.length; i++){
          this.ingredientsInCategoryOrder.push(this.liquids[i]);
        }
        for ( var i = 0; i < this.extras.length; i++){
          this.ingredientsInCategoryOrder.push(this.extras[i]);
        }
      },

      ingInStock: function(ingIDs){
        var inStock=true,tempIngredient;
        for(var i=0; i <ingIDs.length; i++){
          tempIngredient = this.getIngredientById(ingIDs[i]);
          if(tempIngredient.stock < 400){
            return inStock = false;
          }
        }
        return inStock;
      },

      pmsInStock:function(){
        var ingIDs,inStock;
        for (var i = 0; i < this.premade.length ; i ++) {
          ingIDs = this.premade[i].pm_ingredients;
          inStock = this.ingInStock(ingIDs);
          var pmInStock ={
            id: this.premade[i].pm_id,
            inStock: inStock
          }
          this.preMadesInStock.push(pmInStock);
        }
        return this.preMadesInStock;
      },

      addToDrink: function (item, type) {
        this.chosenIngredients.push(item);

        if (this.chosenIngredients.length > 0){
          document.getElementById("resetCurrentDrink").disabled = false;
        }
        if (totalIngredientsCounter == 5){
          document.getElementById("addToMyOrder").disabled = false;
          document.getElementById("continue").disabled = false;
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
          document.getElementById("continue").disabled = true;
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

      getIngredientById: function (id) {
        for (var i =0; i < this.ingredients.length; i += 1) {
          if (this.ingredients[i].ingredient_id === id){
            return this.ingredients[i];
          }
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

      getIngredientList: function (idArr) {
        var ingredientList = [], tempIngredient;
        for (var i = 0; i < idArr.length ; i += 1) {
          tempIngredient = this.getIngredientById(idArr[i]);
          if(tempIngredient.stock >400){
          }
          ingredientList.push(tempIngredient);
        }
        return ingredientList;
      },

      addPremadeDrink: function (item) {
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
        this.myDrinks.push(currentDrink);
        this.myOrder.push(currentDrink);

        // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
        //socket.emit('order', { order: order});
        //set all counters to 0. Notice the use of $refs
        for (var i = 0; i < this.$refs.ingredient.length; i += 1) {
          this.$refs.ingredient[i].resetCounter();
        }
        this.volume = 0;
        this.price = 0;
        this.type = '';
        this.chosenIngredients = [];

        document.getElementById("proceedToCheckout").disabled = false;
        document.getElementById("placeOrderButton").disabled = false;

        //show the notifybubble
        document.getElementById("notifybubble").style.display = "block";
        document.getElementById("notifybubblePM").style.display = "block";
      },

      addToMyOrder: function () {
        this.yourDrinkNumber += 1;
        //Wrap the order in an object
        var drinkName = "Drink #" + this.yourDrinkNumber;
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
        for ( var i = 0; i < this.$refs.ingredient.length; i += 1) {
          this.$refs.ingredient[i].resetCounter();
        }
        this.resetChooseYourOwnPage();

        this.myDrinks.push(currentDrink);
        this.myOrder.push(currentDrink);

        document.getElementById("proceedToCheckout").disabled = false;
        document.getElementById("placeOrderButton").disabled = false;

        //show the notifybubble
        document.getElementById("notifybubble").style.display = "block";
        document.getElementById("notifybubblePM").style.display = "block";
      },

      placeOrder: function () {
        // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
        for(var i=0; i<this.myOrder.length; i+=1){
          var drink = [];
          drink.push(this.myOrder[i]);
          socket.emit('order', {order: drink});
        }
        document.getElementById("proceedToCheckout").disabled = true;
        document.getElementById("placeOrderButton").disabled = true;
        this.yourDrinkNumber = 0;
        this.myDrinks = [];
        this.totalPrice = 0;
      },

      receiveOrderInfo: function(){
        socket.on("returnOrderInfo", function(orderNumber,order) {
          var finishedDrink = {
            orderId: orderNumber,
            drinkName: order.order[0].name,
            drinkSize: order.order[0].type
          }
          this.finishedOrderInfo.push(finishedDrink);
          document.getElementById("receivedOrderContainer").style.display="block";
          document.getElementById("checkOut-page").style.display="none";
          document.getElementById("ProgressBarPreMade").style.display = "none";
          document.getElementById("ProgressBarChooseYourOwn").style.display = "none";
        }.bind(this));
      },

      reloadPage: function(){
        location.reload();
      },

      // CHANGE SIZE FUNCTIONS
      changeSize: function(type){
        this.changeTotalPrice(type);
        this.markChosenSizeButton(type);
        this.switchType(type);
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

      //RESET FUNCTIONS
      resetIngredientsBar: function(){
        totalIngredientsCounter = 0;
        $("#ingredientsBarProgress").css('width', '-=' + curSize);
        curSize = 0;
        ingredientsBarText.innerHTML = 'Choose 5 ingredients';
      },

      resetPlusMinusButtons: function(){
        var plusButtons = document.getElementsByClassName("ingredientsPlusButton");
        for ( var i = 0; i < plusButtons.length; i++) {
          plusButtons[i].disabled = false;
        }
        var minusButtons = document.getElementsByClassName("ingredientsMinusButton");
        for ( var i = 0; i < minusButtons.length; i++) {
          minusButtons[i].disabled = true;
        }
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
        this.switchType('m');
        this.markChosenSizeButton('m');
        this.resetIngredientsBar();
        this.resetPlusMinusButtons();
        document.getElementById("addToMyOrder").disabled = true;
        document.getElementById("continue").disabled = true;
        document.getElementById("resetCurrentDrink").disabled = true;
      },

      //OPEN AND CLOSE TABS
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
          document.getElementById("receivedOrderContainer").style.display = "none";
          document.getElementById("continue").style.display = "none";
          document.getElementById("addToMyOrder").style.display = "none";
        };
        if (tabName === "home-page") {
          document.getElementById("home-pageBtnPM").style.backgroundColor = "#810051";
          document.getElementById("home-pageBtn").style.backgroundColor = "#810051";
          document.getElementById("holder").style.display = "block";
          document.getElementById("continue").style.display = "none";
          document.getElementById("addToMyOrder").style.display = "none";
        };
        if (tabName === "preMade-page") {
          document.getElementById("defaultOpenPM").style.backgroundColor = "#810051";
        };
        if (tabName === "myOrder-page") {
          document.getElementById("myOrder-pageBtnPM").style.backgroundColor = "#810051";
          document.getElementById("myOrder-pageBtn").style.backgroundColor = "#810051";
          document.getElementById("continue").style.display = "none";
          document.getElementById("addToMyOrder").style.display = "none";
        };
        if (tabName === "chooseYourOwn-page") {
          document.getElementById("defaultOpen").style.backgroundColor = "#810051";
        };
        if (tabName === "extras-page") {
          document.getElementById("extras-pageBtn").style.backgroundColor = "#810051";
        };
      },
      //Functions called from Homepage buttons
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
        document.getElementById("extras-page").style.display = "none";
        document.getElementById("addToMyOrder").style.display = "none";
        document.getElementById("continue").style.display = "block";
        document.getElementById("preMade-page").style.display = "none";
        document.getElementById("home-page").style.display = "none";
        document.getElementById("myOrder-page").style.display = "none";
        document.getElementById("checkOut-page").style.display = "none";
        document.getElementById("ProgressBarPreMade").style.display = "none";
        document.getElementById("ProgressBarChooseYourOwn").style.display = "block";
        document.getElementById("labelExtra").style.display = "none";
        document.getElementById("labelIng").style.display = "block";
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

      //Switch between ingredients grid and extras grid
      toExtras: function(){
        var extrasCategories,categoriesDrink;
        document.getElementById("category-list").style.display ="none";
        document.getElementById("preMade-page").style.display = "none";
        document.getElementById("home-page").style.display = "none";
        document.getElementById("myOrder-page").style.display = "none";
        document.getElementById("checkOut-page").style.display = "none";
        document.getElementById("ProgressBarPreMade").style.display = "none";
        document.getElementById("chooseYourOwn-page").style.display = "block";
        document.getElementById("addToMyOrder").style.display = "block";
        document.getElementById("continue").style.display = "none";
        document.getElementById("ProgressBarChooseYourOwn").style.display = "block";
        document.getElementById("labelIng").style.display = "none";
        document.getElementById("labelExtra").style.display = "block";
        categoriesDrink = document.getElementById("chooseYourOwnGrid");
        extrasCategories = document.getElementById("extrasCategories");
        categoriesDrink.appendChild(extrasCategories);
        extrasCategories.style.display="grid";
      },

      toChooseYourOwn: function() {
        document.getElementById("extrasCategories").style.display = "none";
        document.getElementById("category-list").style.display ="grid";
        document.getElementById("addToMyOrder").style.display = "none";
        document.getElementById("continue").style.display = "block";
        document.getElementById("labelIng").style.display = "block";
        document.getElementById("labelExtra").style.display = "none";
      },
    }
  });

  // ------------- For myOrder page --------------
  Vue.component('added-drinks', {
    props: ['order', 'lang', 'name', 'type', 'price'],
    template: '<div class = drinkInfo><h2>{{order.name + " "}}{{order.price}} kr, {{order.type}}</h2>\
    <label>\{{order.ingredients.map(item=>item["ingredient_"+ lang]).join(" ")}}</label>\
    <br>\
    <button v-on:click="minusDrink()" id="drinkMinusButton" class="drinkMinusPlusButton">-</button>\
    <label class="counterID">{{ counter }}</label>\
    <button v-on:click="plusDrink()" id="drinkPlusButton" class="drinkMinusPlusButton">+</button>\
    <br></div>',
    data: function () {
      return {
        counter: 1
      };
    },
    methods: {

      plusDrink: function () {
        this.counter += 1;
        vm.totalPrice += this.order.price;
        vm.orderCounterValue += 1;
        vm.myOrder.push(this.order);
        document.getElementById("proceedToCheckout").disabled = false;
        document.getElementById("placeOrderButton").disabled = false;
      },

      minusDrink: function () {
        if (this.counter > 0){
          this.counter -= 1;
          vm.totalPrice -= this.order.price;
          vm.orderCounterValue -= 1;
        }
        for (var i=0; i<vm.myOrder.length; i++){
          if(vm.myOrder[i]==this.order){
            vm.myOrder.splice(i,1);
            break;
          }
        }
        if (vm.myOrder.length == 0){
          document.getElementById("proceedToCheckout").disabled = true;
          document.getElementById("placeOrderButton").disabled = true;
        }
      },
    }
  });

  Vue.component('drinks-in-order', {
    props: ['order', 'lang', 'name', 'type', 'price'],
    template: '<div id = "myOrderedDrinks">\
    <h2>{{order.name + " "}}{{order.price}} kr, {{order.type}}</h2>\
    <label>\
    {{order.ingredients.map(item=>item["ingredient_"+ lang]).join(" ")}}\
    </label>\
    </div>'
  });

  Vue.component('finished-order-info',{
    props:['uiLabels','finishedDrink'],
    template:'<div id="finishedDrinkInfo">\
    <div id="fdrink"><p>{{ finishedDrink.orderId }}: {{ finishedDrink.drinkName}}, {{finishedDrink.drinkSize}}</p>\
    </div><br>\
    </div>'
  });

  //----------------------------------------------
