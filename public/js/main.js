Vue.component('tablerow-item', {
  /*Inherits data from Vue instance and bring it to component*/
  props: ['tablerow'],
  /*Rendering data into template*/
  template: '<tr>\
              <td><p>{{tablerow.name}}</p></td>\
              <td><input ref="input" v-bind:value="tablerow.value" v-on:input="updateValue($event.target.value)" v-on:focus="selectAll" v-on:blur="formatValue" class="form-control"></td>\
              <td><p>${{ tablerow.price }}</p></td>\
              <td><button v-on:click="$emit(\'remove\')" class="btn btn-danger glyphicon glyphicon-remove"></button></td>\
             </tr>',
  /*Mounted formating function*/
  mounted: function () {
    this.formatValue()
  },
  methods: {
    /*Update input value within keyboard typing by currencyValidator(from Vue.js example)*/
    updateValue: function (value) {
      this.value = value;
      var result = currencyValidator.parse(value, this.value);
      if (result.warning) {
        this.$refs.input.value = result.value;
      }
      this.$emit('input', result.value);
    },
    /*Result is formated value in input if it's isNaN converted to default value (null)*/
    formatValue: function () {
      this.$refs.input.value = currencyValidator.format(this.$refs.input.value);
      //this.value = currencyValidator.format(this.value);
      if (isNaN(this.$refs.input.value)) {
        this.$refs.input.value = '0.00';
      }
    },
    /*All symbols selection*/
    selectAll: function (event) {
      setTimeout(function () {
      	event.target.select();
      }, 0)
    }
  }
});

var app = new Vue({
  el: '#app',
  data: {
    /*Item list with default values (hardcoded for current test task but should be loaded from server-side in JSON/BSON format)*/
    itemList: [
      { id: 0, name: 'Cellphone', price: '150', value: '0.00', leave: 0},
      { id: 1, name: 'Tablet', price: '100', value: '0.00', leave: 0},
      { id: 2, name: 'Desktop', price: '300', value: '0.00', leave: 0}
    ]
  },
  methods: {
    /*Check id of item and removing it from data and table*/
    removeItem: function (item) {
      var itemList = this.itemList,
          self = this;

      for (var j=0;j<itemList.length;j++) {
        if (itemList[j].id === item.id) {
          itemList[j].leave = 1;
          setTimeout(function(x) { return function() { self.itemList.splice(x, 1); }; }(j), 500);
        }
      }
    }
  },
  computed: {
    /*Total price calculation if item's quantity(input value) isNaN it's omitted*/
    total: function () {
      var total = 0,
          itemCost = [],
          itemList = this.itemList;
      for (var i=0;i<itemList.length;i++) {
        itemCost[i] = (itemList[i].value * itemList[i].price);
        if (!isNaN(itemCost[i])) {
          total += itemCost[i];
        } else {
          continue;
        }
      }
      return currencyValidator.format(total);
    }
  }
});
