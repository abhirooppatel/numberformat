angular.module('number-format-demo', [])
  .controller('MainCtrl', [function() {
    var self = this;

    self.numberData = 3000;

    self.numberChanged = function() {
      //console.log('Number changed to ',  self.numberData);
    }
  }]);