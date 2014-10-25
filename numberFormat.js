angular.module('number-format-demo')
  .directive('numberFormat', [function() {
    var defaultOptions = {maxLength: 11, inputClass:''};
    var thousandLimit = 3;
    var millionLimit = 6;
    var charKKeyCode = 75;
    var charMKeyCode = 77;
    var thousand = 1000;
    var million = 1000000;
    var caretPositionData = {key: -1, position: -1};

    var getFormattedNumber = function(number) {
      if(!number) {
        return '';
      }

      if(number.toString().length > 3) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      return number;
    };

    var getShortCodeNumber = function(number) {
      var numericValue = number.toString().replace(/,/g, '').toString();
      if(/[kKmM]/.test(number)) {
        var numericValueLength = numericValue.length;
        var lastChar = numericValue[numericValueLength - 1];
        var substring = numericValue.substring(0, numericValueLength - 1);
        var numberToBeFormatted = substring.trim().length === 0 ? 1 : substring*1;
        var multiplier = lastChar === 'k' || lastChar === 'K' ? thousand : million;
        var formattedNumber = getFormattedNumber(numberToBeFormatted*multiplier);
        return formattedNumber;
      }
      return getFormattedNumber(numericValue);
    };

    var handleKeyDownEvent = function(e, elem, scope) {
      caretPositionData = {key: e.keyCode, position: elem.caret()};
      // console.log('Caret Position in keydown : ', caretPositionData);

      var noAllowedChar = e.keyCode !== charKKeyCode && e.keyCode !== charMKeyCode;

      if(!noAllowedChar) {
        if(e.keyCode === charKKeyCode && (scope.formatView && scope.formatView.length >= scope.maxLength - thousandLimit)) {
          return false;
        }

        if(e.keyCode === charMKeyCode && (scope.formatView && scope.formatView.length >= scope.maxLength - millionLimit )) {
          return false;
        }
      }
      if(noAllowedChar && !(e.which > 32 && e.which <= 40) && e.which !== 46 && e.which!=8 && e.which!=0 && (e.which<48 || e.which>57)){
        return false;
      }
      return true;
    };

    var handleCaretPosition = function(elem, number) {
      console.log('Caret Position : ', caretPositionData, ' Number : ', number, ' Length : ', number.toString().length);
      if(caretPositionData.position === number.toString().length - 1 && caretPositionData.key !== 8) {
        return;
      }
      if(caretPositionData.key === 8) {
        elem.caret(caretPositionData.position - 1);
      }

      if(caretPositionData.key >= 48 && caretPositionData.key <= 57) {
        elem.caret(caretPositionData.position + 1);
      }
    };

    return {
      restrict: 'A',
      replace: true,
      template: '<input type="text" ng-model="formatView" maxlength="{{maxLength}}" ng-class="inputClass"/>',
      scope: {
        formatData: '=',
        options: '@',
        onValueChange: '&'
      },
      link: function(scope, elem, attrs) {
        scope.options = angular.extend({}, defaultOptions, scope.options);
        scope.maxLength = scope.options.maxLength;
        scope.inputClass = scope.options.inputClass;

        elem.on('keydown', function(e) {
          return handleKeyDownEvent(e, elem, scope);
        });

        scope.$on('invalidChar', function() {
          scope.formatView = scope.formatView.replace(/[kKmM]/, '');
        });

        scope.$watch(function() {
          return scope.formatData;
        }, function(newVal, oldVal) {
          if(newVal) {
            // console.log('New Data Value : ', newVal);
            scope.formatView = getFormattedNumber(newVal);
          }
        });

        scope.$watch(function() {
          return scope.formatView;
        }, function(newVal, oldVal) {
          if(newVal !== oldVal) {
            if(/[kKmM]/.test(newVal.toString().substring(0, newVal.length - 1))) {
              scope.$emit('invalidChar');
              return;
            }
            // console.log('New Value : ', newVal);
            scope.formatView = getShortCodeNumber(newVal);
            scope.formatData = newVal? newVal.toString().replace(/,/g, '')*1: undefined;
            // elem.caret(caretPosition - 1);
            // console.log('Caret Position in $watch : ', caretPositionData);
            handleCaretPosition(elem, scope.formatView);
            scope.onValueChange();
          }
        });
      }
    }
  }
  ]);