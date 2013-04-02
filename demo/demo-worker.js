// Generated by CoffeeScript 1.6.2
var getSquares, textOperations;

importScripts("../easy-web-worker.js");

getSquares = function(event, numberArray) {
  var number, squares;

  squares = (function() {
    var _i, _len, _results;

    _results = [];
    for (_i = 0, _len = numberArray.length; _i < _len; _i++) {
      number = numberArray[_i];
      _results.push(number * number);
    }
    return _results;
  })();
  return self.execute("getSquaresCallback", squares);
};

textOperations = {
  reverseText: function(event, text) {
    var reversedText;

    reversedText = text.split("").reverse().join("");
    return self.execute("NestedFunctions.textPrinter.printToConsole", reversedText);
  }
};

/*
//@ sourceMappingURL=demo-worker.map
*/
