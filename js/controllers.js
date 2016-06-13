/**
 * Login Controller
 * */
app.controller('loginPage', function($state, $scope, $ionicPopup, $timeout, $ionicLoading, $http, $localStorage, userService) {
  var userData = $localStorage.userData;
  if (typeof userData !== "undefined" && userData.IsSuccess == true) {
    $state.go('home');
  }
  var user = {
    "username": '',
    "password": ''
  }

  //authenticate user
  $scope.doLogin = function(user) {

    // console.log(user);
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    if (user.username.length && user.password.length > 0) {
      userService.authenticate(user.username, user.password, function(data) {
        // console.log(data);
        if (data.IsSuccess == true) {
          $localStorage.userData = data;
          $ionicLoading.hide();
          $state.go('home');
        } else {
          $scope.showAlert();
          $ionicLoading.hide();
        }

      });

      //$state.go('home');
      $ionicLoading.hide();
    } else {
      $scope.showAlert();
      $ionicLoading.hide();
    }

    //$state.go('home');

  };

  $scope.showAlert = function(msg) {
    if ((msg == '') || (msg == undefined)) {
      msg = 'Username or Password is invalid';
    }
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: msg
    });
    alertPopup.then(function(res) {});
  };
});



app.controller('appCtrl', function($window, $state, $filter, $scope, $ionicPopup, $timeout, $ionicLoading, $http, $localStorage, userService, $stateParams, $cordovaBarcodeScanner, $ionicActionSheet, $sessionStorage) {
  //var userData = $localStorage.userData
  //if (userData.IsSuccess == false) {
  //	$state.go('login')
  //}

  $scope.filterFunction = function(element) {
    var date1 = new Date(); //todays date
    var date2 = new Date(element.Start_time__c);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

    // console.log(diffDays);
    if (diffDays < 9) {
      return true;
    } else {
      return false;
    }

  };

  var venueId = $stateParams.venueId;
  var groupId = $stateParams.groupId;
  var sessionId = $scope.sessionId = $stateParams.sessionId;
  $scope.VenueData = $localStorage.VenueData;

  $scope.qrScan = function() {
    alert('camera will open here..');
  }

  $scope.data = {
    showDelete: true
  };

  $scope.edit = function(item) {
    alert('Edit Item: ' + item.id);
  };
  $scope.share = function(item) {
    alert('Share Item: ' + item.id);
  };
  $scope.onItemDelete = function(item) {
    $localStorage.SessionSubitems.splice($localStorage.SessionSubitems.indexOf(item), 1);
    //$localStorage.SessionItems.splice($localStorage.SessionItems.indexOf(item), 1);
  };
  $scope.items = [{
    id: 0
  }, {
    id: 1
  }, {
    id: 2
  }, {
    id: 3
  }, {
    id: 4
  }];
  //console.log($scope.items);
  $scope.uploadToCrm = function(id) {

    var choirsession = id;
    var data = $localStorage.SessionSubitems;

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    $scope.uploadedSubSessions = $filter('filter')($localStorage.SessionSubitems, {
      'sessionID': id
    }, true); 
      if($scope.uploadedSubSessions.length > 0) {
      angular.forEach($scope.uploadedSubSessions, function(item) {
        userService.createRecord(choirsession, item.first_name, function(data) {
          if (item.sessionID == id) {
            $localStorage.SessionSubitems.splice($localStorage.SessionSubitems.indexOf(item), 1);
            $localStorage.SessionItems.splice($localStorage.SessionItems.indexOf(item), 1);
          }
        });
      });
      $state.go("home");
      $ionicLoading.hide();
      $scope.showAlert("Data uploaded");
    } else {
      // $state.go("home");
      $ionicLoading.hide();
      $scope.showAlert("No data uploaded");
    } 
  }
  function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
  }

  $scope.SessionItems = [];
  $scope.SessionSubitems = [];
  if($localStorage.SessionItems == undefined) {
    $localStorage.SessionItems = []
  }
  $scope.uniqueQR = "";
  var counter = 0;
  $scope.tempScan = function() {
            counter++;
             var checkObj = isEmpty($scope.uniqueQR);
             // console.log($scope.uniqueQR);
             if($scope.uniqueQR == "undefined" || checkObj == false) {
              alert('Duplicate Data');
             } else {
             // console.log($scope.uniqueQR);
            var element = {}
            element.first_name = "12345";
            element.sessionID = $localStorage.activeSessionId;
            element.sessionName = $scope.ActivebrandName[0].Name;
            element.sessionTime = $scope.ActivebrandTime[0].Time_Window__c;
            $scope.SessionItems.push(element);
            $scope.SessionSubitems.push(element);
            // console.log($scope.SessionItems);
            $localStorage.SessionItems = $scope.SessionItems;
            if($localStorage.SessionSubitems == undefined) {
              $localStorage.SessionSubitems = $scope.SessionSubitems;
            } else {
              var currentObject = $scope.SessionSubitems.slice(-1)[0] ;
              var previousObject = $localStorage.SessionSubitems;
              var merged = previousObject.concat(currentObject);
              $localStorage.SessionSubitems = merged;
            }
            
            console.log($localStorage.SessionSubitems);
            }
  }
  console.log($localStorage.SessionSubitems);
  function qrscanfunc() {
     if (typeof $localStorage.activeSessionName !== "undefined") {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
          if(imageData.text !== "") {
              $scope.uniqueQR = $filter('filter')($localStorage.SessionSubitems, {
                'sessionID': $localStorage.activeSessionId,
                'first_name': imageData.text
              }, true);
              var checkObj = isEmpty($scope.uniqueQR);
            if($scope.uniqueQR == "undefined" || checkObj == false) {
              $scope.showAlert("Duplicate Record not added");
             } else {
              var element = {}
              element.first_name = imageData.text;
              element.sessionID = $localStorage.activeSessionName;
              element.sessionName = $scope.ActivebrandName[0].Name;
              element.sessionTime = $scope.ActivebrandTime[0].Time_Window__c;
              $scope.SessionItems.push(element);
              $scope.SessionSubitems.push(element);
              // console.log($scope.SessionItems);
              $localStorage.SessionItems = $scope.SessionItems;
              if($localStorage.SessionSubitems == undefined) {
                  $localStorage.SessionSubitems = $scope.SessionSubitems;
              } else {
                  var currentObject = $scope.SessionSubitems.slice(-1)[0] ;
                  var previousObject = $localStorage.SessionSubitems;
                  var merged = previousObject.concat(currentObject);
                  $localStorage.SessionSubitems = merged;
              }
            
            console.log($localStorage.SessionSubitems);
            }
          }
          if(imageData.text !== ""){
          qrscanfunc();
          }
        }, function(error) {
          // console.log("An error happened -> " + error);
        });
      } else {
        $scope.showAlert("Please Select Session First");
      }
  }

  document.addEventListener("deviceready", function() {

    $scope.scanBarcode = function() {
      qrscanfunc();
    };

  }, false);

  $scope.SessionGroups = [];
  angular.forEach($localStorage.SessionItems, function(item){
    var nonEmptySession = $filter('filter')($localStorage.SessionSubitems, {
      'sessionID': item.sessionID
    }, true);
    if(nonEmptySession.length > 0){
      $scope.SessionGroups.push(item);
    }
  });

  // $scope.SessionGroups = $localStorage.SessionItems;
  $scope.sessionSubgroups = $localStorage.SessionSubitems;

  $scope.sessionAction = function(info) {

   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirm',
     template: 'Are you sure?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $localStorage.activeSessionId = info.Venue__c;
        $localStorage.activeSessionName = info.Name;
        $.each($localStorage.VenueData, function(key, brand) {
          if (brand.Id == info.Venue__c) {
            // console.log(brand.Name);
            // document.getElementById('activeSession').innerHTML = brand.Name + " | " + info.Name;
            $state.go("home");
          }
        });
     } else {
       // console.log('You are not sure');
     }
   });

      // $ionicActionSheet.show({
      //   buttons: [{
      //     text: 'Mark As Active'
      //   }],
      //   titleText: 'Session',
      //   cancelText: 'Cancel',
      //   cancel: function() {

      //   },
      //   buttonClicked: function(index) {
      //     $localStorage.activeSessionId = info.Venue__c;
      //     $localStorage.activeSessionName = info.Name;
      //     $.each($localStorage.VenueData, function(key, brand) {
      //       if (brand.Id == info.Venue__c) {
      //         console.log(brand.Name);
      //         document.getElementById('activeSession').innerHTML = brand.Name + " | " + info.Name;
      //         $state.go("home");
      //       }
      //     });
      //     //$state.go("home");
      //   }
      // });
  }

  $scope.ActivebrandName = $filter('filter')($localStorage.VenueData, {
      'Id': $localStorage.activeSessionId
  }, true);

  $scope.ActivebrandTime = $filter('filter')($localStorage.groupData, {
      'Name': $localStorage.activeSessionName
  }, true);
  // console.log($scope.ActivebrandTime);
  $scope.logOut = function() {
    $localStorage.$reset();
    localStorage.clear();
    location.href = "#/login";
  }
  $scope.clickMe = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    if (typeof $localStorage.VenueData == "undefined") {
      userService.getSomething(function(data) {
        // console.log(data);
        $scope.VenueData = data;
        $localStorage.VenueData = data.Records;
        $ionicLoading.hide();

        $state.go('venues');
      });
    } else {
      $ionicLoading.hide();
      $state.go('venues');
    }
  };

  if (typeof venueId !== "undefined") {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    userService.getGroups(venueId, function(data) {
      $localStorage.groupData = data.Records;
      $scope.groupData = $localStorage.groupData;
      // console.log($scope.groupData);
      if($scope.groupData == "") {
        $state.go("venues");
        $scope.showAlert("No Record Found");
      }
      $ionicLoading.hide();
    });
  }

  if (typeof groupId !== "undefined") {
    // console.log(groupId);
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    userService.getSessions(groupId, function(data) {
      // console.log(data);
      $localStorage.groupData = data.Records;
      $scope.groupData = $localStorage.groupData;
      // console.log($scope.groupData);
      $ionicLoading.hide();
    });
  }

  if (typeof sessionId !== "undefined") {
    // console.log(sessionId);
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    userService.getAttendance(sessionId, function(data) {
      // console.log(data);
      $localStorage.sessionData = data.Records;
      $scope.sessionData = $localStorage.sessionData;
      // console.log($scope.sessionData);
      $ionicLoading.hide();
    });
  }

  $scope.markActive = function(sessionData) {
    // console.log(sessionData);
    // console.log(sessionId);

    $localStorage.activeSession = sessionId;
    $scope.showAlert(sessionId + " Is Now Active");
  }

  //$.each($localStorage.VenueData, function(key,brand) {
  //	console.log(brand.Id);
  //	var namekey = $localStorage.activeSession;
  //	if(brand.Id == namekey) {
  //		console.log(brand);
  //		$localStorage.activeSessionName = brand.Name;
  //	}
  //});

  $scope.showAlert = function(msg) {
    if ((msg == '') || (msg == undefined)) {
      msg;
    }
    var alertPopup = $ionicPopup.alert({
      title: 'Notice',
      template: msg
    });
    alertPopup.then(function(res) {});
  };
});
