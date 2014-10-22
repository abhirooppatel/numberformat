angular.module('number-format-demo', ['fundoo.directives'])
	.controller('MainCtrl', [function() {
		var self = this;

		self.numberData = 3000;

		self.numberChanged = function() {
			//console.log('Number changed to ',  self.numberData);
		}
	}]);