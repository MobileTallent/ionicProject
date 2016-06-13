angular.module('starter')
  .factory("userService", function($http, $localStorage, $ionicLoading) {
    var apiUrl = 'https://rockchoir.magentrix.com/';

    return {
      authenticate: function(username, password, success) {
        $http.defaults.useXDomain = true;
        $http({
            //url: apiUrl + 'rest/2.0/login?un=' +username+ '&pw='+password,
            url: 'http://webserver.inheritedarts.com/rock-choir-app/www/login.php?username='+username+'&password='+password,
            method: "GET",
            skipAuthorization: true
          })
          .success(function(data) {
            success(data);
          });
      },
      getSomething: function(success) {
        //console.log($localStorage.userData.SessionId);
        $http({
            method: "GET",
            url: 'http://webserver.inheritedarts.com/rock-choir-app/www/api.php?url=' + encodeURI('query?q=FROM%20Force.Force__Venue__c') + '&token=' + $localStorage.userData.SessionId
          })
          .success(function(data) {
            success(data);
            console.log("From Service:" + data);
          });
      },
      getGroups: function(venueId, success) {
        //console.log($localStorage.userData.SessionId);
        $http({
            method: "GET",
            url: 'http://webserver.inheritedarts.com/rock-choir-app/www/api.php?url=' + encodeURI('query?q=FROM%20Force.Force__Choir_Group__c%20WHERE%20Venue__c%20=%20"' + venueId + '"') + '&token=' + $localStorage.userData.SessionId
          })
          .success(function(data) {
            success(data);
          });
      },
      getSessions: function(groupId, success) {
        //console.log($localStorage.userData.SessionId);
        $http({
            method: "GET",
            url: 'http://webserver.inheritedarts.com/rock-choir-app/www/api.php?url=' + encodeURI('query?q=FROM%20Force.Force__Choir_Session__c%20WHERE%20Choir_Group__c%20=%20"' + groupId + '"') + '&token=' + $localStorage.userData.SessionId
          })
          .success(function(data) {
            success(data);
          });
      },

      getAttendance: function(sessionId, success) {
        //console.log($localStorage.userData.SessionId);
        $http({
            method: "GET",
            url: 'http://webserver.inheritedarts.com/rock-choir-app/www/api.php?url=' + encodeURI('query?q=FROM%20Force.Force__Attendance__c%20WHERE%20Session__c%20="' + sessionId + '"') + '&token=' + $localStorage.userData.SessionId
          })
          .success(function(data) {
            success(data);
          });
      },
      createRecord: function(choirsession, qrdata, success) {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        $http({
            method: "GET",
            url: 'http://webserver.inheritedarts.com/rock-choir-app/www/create.php?sessionID=' + choirsession + '&qrdata=' + qrdata + '&token=' + $localStorage.userData.SessionId
          })
          .success(function(data) {
            success(data);
            console.log(data);
            // $scope.showAlert("Data Uploaded to CRM");
            // $ionicLoading.hide();
          });
      }


    }
  });
