 $scope.SessionGroups = [];
   $scope.filterFunction = function(element) {
    /* var date1 = new Date(); //todays date
    var date2 = new Date(element.Start_time__c);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

     console.log(diffDays);
    if (diffDays < 9) {
      return true;
    } else {
      return false;
    } */
	
	return true;

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
      $state.go("home1");
      $ionicLoading.hide();
      $scope.showAlert("Data uploaded");
    } else {
      // $state.go("home1");
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
             console.log($scope.SessionSubitems);
              $localStorage.SessionItems = $scope.SessionItems;
              if($localStorage.SessionSubitems == undefined) {
                  $localStorage.SessionSubitems = $scope.SessionSubitems;
              } else {
                  var currentObject = $scope.SessionSubitems.slice(-1)[0] ;
                  var previousObject = $localStorage.SessionSubitems;
                  var merged = previousObject.concat(currentObject);
                   $scope.SessionSubitems = $localStorage.SessionSubitems = merged;
              } 
            
            console.log($localStorage.SessionSubitems);
            }
			
			$state.go("home1");
			
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
             console.log(brand.Name);
            // document.getElementById('activeSession').innerHTML = brand.Name + " | " + info.Name;
            $state.go("home1");
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
      //         $state.go("home1");
      //       }
      //     });
      //     //$state.go("home1");
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
		
		
		var SessionArrayOp=[];
	for(var SessionCList=0; SessionCList < data.Count && SessionArrayOp.length < 12; SessionCList++ )
				{
							var date1 = new Date(); //todays date
							var date2 = new Date(data.Records[SessionCList].Start_time__c);
							
							var differenceTravel = date2.getTime() - date1.getTime();
							var diffDays = (differenceTravel) / (1000 * 3600 * 24);

							
							 if (diffDays > 0) {
								 	console.log(diffDays);
									
							  SessionArrayOp.push(data.Records[SessionCList]);
							}
		
				}
			
				if(SessionArrayOp.length > 0)
				{
					console.log(SessionArrayOp);
					 $localStorage.groupData = SessionArrayOp;
					$scope.groupData = $localStorage.groupData;
				}
				else
				{
				   $state.go("venues");
					$scope.showAlert("No Record Found");
				}
				
				
     
      // console.log($scope.groupData);
      /* if($scope.groupData == "") {
        $state.go("venues");
        $scope.showAlert("No Record Found");
      } */
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
      console.log("Hello");
      $localStorage.groupData = data.Records;
      $scope.groupData = $localStorage.groupData;
     console.log($scope.groupData);
	
	
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
  
