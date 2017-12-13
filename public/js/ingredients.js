Vue.component('ingredient', {
  props: ['item', 'type', 'lang'],
  template: ' <div class="ingredient">\
  <label>\
  <button v-on:click="incrementCounter">{{ counter }}</button>\
  {{item["ingredient_"+ lang]}} ({{item.vol_m }} ml), {{item.stock}} ml\
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
    },
    resetCounter: function () {
      this.counter = 0;
    }
  }
});

var vm = new Vue({
  el: '#ingredients',
  mixins: [sharedVueStuff]
});
