/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

Vue.component('ingredient', {
  props: ['item', 'type', 'lang'],
  template: ' <div class="ingredient">\
  <label>\
  <button v-on:click="incrementCounter">{{ counter }}</button>\
  {{item["ingredient_"+ lang]}} ({{ (type=="smoothie") ? item.vol_m:item.vol_m }} ml), {{item.price_m}}:-, {{item.stock}} pcs\
  </label>\
  </div>',
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1;
      this.$emit('increment');
      increaseBar();
        
    },
    resetCounter: function () {
      this.counter = 0;
    }
  }
});

//ökar progress i ingredientsBar
function increaseBar() {
    var curSize = $("#ingredientsBarProgress").width();
    var fullSize = 500;
    var increment = fullSize/5;
    if(curSize < fullSize) {
        var newLength = curSize+increment;
        $("#ingredientsBarProgress").css('width', '+=' + increment);
        //console.log(newLength);
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
        //console.log(newLength);
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
      if (type === "smoothie") {
        this.volume += +item.vol_smoothie;
      } else if (type === "juice") {
        this.volume += +item.vol_juice;
      }
      this.price += +item.selling_price;
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
