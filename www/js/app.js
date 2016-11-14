// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic' ,'ngStorage' ,'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.filter('isAfter', function() {
  return function(items, dateAfter) {
    // Using ES6 filter method
    return items.filter(function(item){
      return moment(item.date).isAfter(dateAfter);
    })
  }
})

app.filter( 'unique', function () {

  return function ( arr, targetField ) {

    var values = [],
        i,
        unique,
        l = arr.length,
        results = [],
        obj;

    for ( i = 0; i < arr.length; i++ ) {

      obj = arr[ i ];

      unique = true;
      for ( v = 0; v < values.length; v++ ) {
        if ( obj[ targetField ] == values[ v ] ) {
          unique = false;
        }
      }

      if ( unique ) {
        values.push( obj[ targetField ] );
        results.push( obj );
      }

    }
    return results;
  };
} )
