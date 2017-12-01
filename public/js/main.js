Vue.component('tablerow-item', {
  /*Inherits data from Vue instance and bring it to component*/
  props: ['tablerow'],
  /*Rendering data into template*/
  template: '<transition name="item-transit">\
              <tr>\
              <td>\
                  <transition name="slide-fade" mode="out-in">\
                    <p v-if="!tablerow.editable">{{tablerow.name}}</p>\
                    <input ref="inputname" v-if="tablerow.editable" v-bind:value="tablerow.name" v-on:input="updateName($event.target.value)" v-on:focus="selectAll" v-on:blur="formatName" class="form-control">\
                  </transition>\
              </td>\
              <td>\
                  <transition name="slide-fade" mode="out-in">\
                    <p v-if="!tablerow.editable">{{tablerow.value}}</p>\
                    <input ref="input" v-if="tablerow.editable" v-bind:value="tablerow.value" v-on:input="updateValue($event.target.value)" v-on:focus="selectAll" v-on:blur="formatValue" class="form-control">\
                  </transition>\
              </td>\
              <td>\
                  <transition name="slide-fade" mode="out-in">\
                    <p v-if="!tablerow.editable">${{ tablerow.price }}</p>\
                    <input ref="inputprice" v-if="tablerow.editable" v-bind:value="tablerow.price" v-on:input="updatePrice($event.target.value)" v-on:focus="selectAll" v-on:blur="formatPrice" class="form-control">\
                  </transition>\
              </td>\
              <td><button v-on:click="$emit(\'edit\')" class="btn btn-warning glyphicon glyphicon-edit"></button></td>\
              <td><button v-on:click="$emit(\'remove\')" class="btn btn-danger glyphicon glyphicon-remove"></button></td>\
             </tr>\
             </transition>',
  methods: {
    /*Update input value within keyboard typing by currencyValidator(from Vue.js example)*/
    updateValue: function (value) {
      if (isNaN(value) || (value === 'undefined')) {
        //this.value = 0;
        value = 0;
        this.$emit('input', value);
      } else {
        //this.value = value;
        this.$emit('input', value);
      }
    },
    /*Result is formated value in input if it's isNaN converted to default value (null)*/
    formatValue: function () {
        var value = this.$refs.input.value;

        this.$emit('input', value);
    },
    /*Name update and capitalization within keyboard typing */
    updateName: function (nameVal) {
      //this.name = nameVal;
      var nameValInputed = nameVal.charAt(0).toUpperCase() + nameVal.slice(1);

      this.$emit('inputname', nameValInputed);
    },
    /* Name update in model for blur field */
    formatName: function () {
      var nameValInputed = this.$refs.inputname.value;

      this.$emit('inputname', nameValInputed);
    },
    /*Price update and check within keyboard typing */
    updatePrice: function (priceVal) {
      if (isNaN(this.$refs.inputprice.value) || (this.$refs.inputprice.value === 'undefined')) {
        this.$refs.inputprice.value = '0.00';
        this.$emit('inputprice', this.$refs.inputprice.value);
      } else {
        this.priceVal = priceVal;
        var result = currencyValidator.parse(priceVal, this.priceVal);
        if (result.warning) {
          this.$refs.inputprice.value = result.value;
        }
        this.$emit('inputprice', result.value);
      }
    },
    /* Price update in model for blur field */
    formatPrice: function () {
        this.$refs.inputprice.value = currencyValidator.format(this.$refs.inputprice.value);

        this.$emit('inputprice', this.$refs.inputprice.value);
    },
    /*All symbols selection*/
    selectAll: function (event) {
      setTimeout(function () {
      	event.target.select();
      }, 0)
    }
  }
});

Vue.component('add-item', {
  /*Rendering data into template*/
  template: '<tr>\
              <td>\
                <input ref="newName"" v-on:input="addName($event.target.value)" v-on:blur="addName($event.target.value)" class="form-control">\
              </td>\
              <td>\
                <input ref="newValue" v-on:input="addValue($event.target.value)" v-on:blur="addValue($event.target.value)" class="form-control">\
              </td>\
              <td>\
                <input ref="newPrice" v-on:input="addPrice($event.target.value)" v-on:blur="addPrice($event.target.value)" class="form-control">\
              </td>\
              <td><button v-on:click="addNewItem()" class="btn btn-success glyphicon glyphicon-plus"></button></td>\
              <td></td>\
             </tr>',

  methods: {
    /* Send new object to instance and empty fields */
    addNewItem: function () {
      var newItem = {
        name: this.name,
        value: this.value,
        price: this.price
      };

      this.$emit('addnew', newItem);
      this.$refs.newName.value = '';
      this.$refs.newValue.value = '';
      this.$refs.newPrice.value = '';
    },
    /* New value update */
    addValue: function (value) {
      if (isNaN(value) || (value === 'undefined')) {
        this.value = 0;
      } else {
        this.value = value;
      }
    },
    /* New name update and capitalization within keyboard typing */
    addName: function (nameVal) {
      this.name = nameVal.charAt(0).toUpperCase() + nameVal.slice(1);
    },

    /* New price update and format by Currency Validator */
    addPrice: function (priceVal) {
        var result;

        if (isNaN(priceVal) || (priceVal === 'undefined')) {
          this.price = '0.00';
        } else {
          this.priceVal = priceVal;
          result = currencyValidator.parse(priceVal, this.priceVal);
          if (result.warning) {
            this.priceVal = result.value;
          }

          this.price = currencyValidator.format(result.value);
        }
    }
  }

});


var app = new Vue({
  el: '#app',
  data: {
    /*Item list with default values (hardcoded for current test task but should be loaded from server-side in JSON/BSON format)*/
    itemList: [
      { id: 0, name: 'Cellphone', price: '150.00', value: '0', leave: 0, editable: false},
      { id: 1, name: 'Tablet', price: '100.00', value: '0', leave: 0, editable: false},
      { id: 2, name: 'Desktop', price: '300.00', value: '0', leave: 0, editable: false}
    ]
  },
  methods: {
    /*Check id of item and removing it from data and table*/
    removeItem: function (item) {
      var itemList = this.itemList,
          self = this;

      for (var j=0;j<itemList.length;j++) {
        if (itemList[j].id === item.id) {
          self.itemList.splice(j, 1);
        }
      }
    },
    /* Hide item presentation and show fields */
    editItem: function (item) {
      var itemList = this.itemList;

      for (var j=0;j<itemList.length;j++) {
        if (itemList[j].id === item.id) {
          if (itemList[j].editable) {
            itemList[j].editable = false;
          } else {
            itemList[j].editable = true;
          }
        }
      }
    },
    /* Add new item to table and verify if all fields are filled */
    addItem: function (newItem) {
      var itemList = this.itemList;
          newItem.id = itemList.length;
          newItem.leave = 0;
          newItem.editable = false;

      if (newItem.name && newItem.value && newItem.price) {
        itemList.push(newItem);
      }
    },
    /* Name update in model for edited row */
    editName: function (nameVal, item) {
      item.name = nameVal;
    },
    /* Price update in model for edited row */
    editPrice: function (priceVal, item) {
      item.price = priceVal;
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
