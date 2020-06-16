/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/assets/indexedDB.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/assets/indexedDB.js":
/*!************************************!*\
  !*** ./public/assets/indexedDB.js ***!
  \************************************/
/*! exports provided: saveTransaction, getTransactions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveTransaction\", function() { return saveTransaction; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTransactions\", function() { return getTransactions; });\nvar db; // create a new db request for the budget indexedDB\n\nvar request = indexedDB.open(\"budget\", 1);\n\nrequest.onupgradeneeded = function (event) {\n  // create object store called \"pending\" and set autoIncrement to true\n  var db = event.target.result; // Set auto increment to true for the pending store\n\n  db.createObjectStore(\"pending\", {\n    autoIncrement: true\n  });\n};\n\nrequest.onsuccess = function (event) {\n  db = event.target.result; // check if app is online before reading from db\n\n  if (navigator.onLine) {\n    checkDatabase();\n  }\n};\n\nrequest.onerror = function (event) {\n  console.log(\"Woops! \" + event.target.errorCode);\n};\n\nfunction checkDatabase() {\n  // open a transaction on your pending db\n  var transaction = db.transaction([\"pending\"], \"readwrite\"); // access your pending object store\n\n  var store = transaction.objectStore(\"pending\"); // get all records from store and set to a variable\n\n  var getAll = store.getAll(); // if there a values in the indexedDB post them to the actual database\n\n  getAll.onsuccess = function () {\n    if (getAll.result.length > 0) {\n      fetch(\"/api/transaction/bulk\", {\n        method: \"POST\",\n        body: JSON.stringify(getAll.result),\n        headers: {\n          Accept: \"application/json, text/plain, */*\",\n          \"Content-Type\": \"application/json\"\n        }\n      }).then(function (response) {\n        return response.json();\n      }).then(function () {\n        // if successful, open a transaction on your pending db\n        var transaction = db.transaction([\"pending\"], \"readwrite\"); // access your pending object store\n\n        var store = transaction.objectStore(\"pending\"); // clear all items in the store once they have been posted to the database\n\n        store.clear();\n      })[\"catch\"](function (err) {\n        return console.log(err);\n      });\n    }\n  };\n} // save newly added transaction to pending if app is offline\n\n\nfunction saveTransaction(newTransaction) {\n  // create a transaction on the pending db with readwrite access\n  var transaction = db.transaction([\"pending\"], \"readwrite\"); // access your pending object store\n\n  var store = transaction.objectStore(\"pending\"); // add record to your store with add method.\n\n  store.add(newTransaction);\n} //add the pending transactions to the transaction array to display if app is offline\n\nfunction getTransactions(transactions, callback) {\n  var storedTransaction; //check if the indexeddb database exists\n\n  if (db) {\n    // create a transaction on the pending db with read access\n    var transaction = db.transaction([\"pending\"], \"readonly\"); // access your pending object store\n\n    var store = transaction.objectStore(\"pending\"); // add record to your store with add method.\n\n    var getAll = store.getAll();\n\n    getAll.onsuccess = function () {\n      storedTransaction = getAll.result;\n\n      if (storedTransaction != []) {\n        storedTransaction.forEach(function (transaction) {\n          transactions.unshift(transaction);\n        });\n        callback();\n      }\n    };\n  }\n\n  return storedTransaction;\n}\n\n//# sourceURL=webpack:///./public/assets/indexedDB.js?");

/***/ })

/******/ });