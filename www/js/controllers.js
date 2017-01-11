/**
 * Login Controller
 * */
app.controller('loginPage', function ($state, $scope, $ionicPopup, $timeout, $ionicLoading, $http, $localStorage, userService, $element) {
	var userData = $localStorage.userData;
	console.log(userData);
	if (typeof userData !== "undefined" && userData.IsSuccess == true) {

		console.log($localStorage.UserType);
		if ($localStorage.UserType == 'Inactive Taster' || $localStorage.UserType == 'Retired Member' || $localStorage.UserType == 'Inactive Choir Leader') {

			$scope.showAlert("Account inactive please contact Rockchoir Admin ");
			//Commenting out, why would we clear the data if they're logged out?
			//localStorage.clear();
			location.href = "#/login";
		} else if ($localStorage.UserType == 'Active Taster' || $localStorage.UserType == 'Confirmed Member') {
			$('.HomeButton').attr("href", "#/home");
			$state.go('home');
		} else if ($localStorage.UserType == 'Active Choir Leader') {
			$('.HomeButton').attr("href", "#/home1");
			$state.go('home1');
		}

	}
	var user = {
		"username": '',
		"password": ''
	}

	//authenticate user
	$scope.doLogin = function (user) {

		// console.log(user);
		$ionicLoading.show({
			content: 'processing...',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		/* var passwordLogin= user.password;

		passwordLogin= passwordLogin.replace("&", "#!+AND+!#");
		 */
		userService.authenticate(user.username, user.password, function (data) {
			//console.log(data);
			if (data.IsSuccess == true) {
				$localStorage.userData = data;

				$localStorage.SessionId = $scope.SessionId = data.SessionId;

				$localStorage.username = user.username;

				$ionicLoading.show({
					html: 'processing...',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 200,
					showDelay: 0
				});

				userService.getSomething1(function (data) {

					if (data == '"Session expired or invalid"') {
						$ionicLoading.hide();
						$scope.showAlert("Session expired. Please Login ");
						//Commenting out, why would we clear the data if they're logged out?
						//localStorage.clear();
						location.href = "#/login";

					} else {
						console.log(data);
						if (data.Count > 0) {

							$localStorage.UserType = data.Records[0]['Member_Status__c'];
							$localStorage.MemberId = data.Records[0]['Id'];

							$ionicLoading.hide();
							if (data.Records[0]['Member_Status__c'] == 'Inactive Taster' || data.Records[0]['Member_Status__c'] == 'Retired Member' || data.Records[0]['Member_Status__c'] == 'Inactive Choir Leader') {

								$scope.showAlert("Account inactive please contact Rockchoir Admin ");
								//Commenting out, why would we clear the data if they're logged out?
								//localStorage.clear();
								location.href = "#/login";
							} else if (data.Records[0]['Member_Status__c'] == 'Active Taster' || data.Records[0]['Member_Status__c'] == 'Confirmed Member') {
								$('.HomeButton').attr("href", "#/home");
								$state.go('home');
							} else if (data.Records[0]['Member_Status__c'] == 'Active Choir Leader') {
								$('.HomeButton').attr("href", "#/home1");
								$state.go('home1');
							}

						} else {
							/* $ionicLoading.hide();
							$scope.showAlert("Account inactive please contact Rockchoir Admin ");

							//Commenting out, why would we clear the data if they're logged out?
							localStorage.clear();
							location.href = "#/login"; */
							$localStorage.UserType = "Active Choir Leader";
							$ionicLoading.hide();
							$('.HomeButton').attr("href", "#/home1");
							$state.go('home1');
						}

					}

				});

			} else {
				$scope.showAlert();
				$ionicLoading.hide();
			}

		});

		//$state.go('home');

	};

	$scope.showAlert = function (msg) {
		if ((msg == '') || (msg == undefined)) {
			msg = 'Username or Password is invalid';
		}
		var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: msg
			});
		alertPopup.then(function (res) {});
	};
});

/**
 * appCtrl Controller
 * */

app.controller('appCtrl', function ($window, $state, $filter, $scope, $ionicPopup, $timeout, $ionicLoading, $http, $localStorage, userService, $stateParams, $cordovaBarcodeScanner, $ionicActionSheet, $sessionStorage, $anchorScroll, $location, $cordovaFileTransfer, $rootScope) {

	if (typeof $localStorage.userData == "undefined") {
		$state.go('app');
	} else {
		console.log($localStorage.UserType);
	}
	$scope.count = 0;

	var BillingHistory1 = {
		"To": '12/01/2016',
		"From": '12/12/2016'
	}

	$scope.PersonalInfoData = $localStorage.PersonalInfoData;
	$scope.MedicalInfoData = $localStorage.MedicalInfoData;
	$scope.EmergencyContactData = $localStorage.EmergencyContactData;
	$scope.SessionCalenderData = $localStorage.SessionCalenderData;
	//$scope.SongListData =[];
	$scope.SongListData = $localStorage.SongListData;
	$scope.BillingHistoryData = $localStorage.BillingHistoryData;
	// $scope.BillingHistory1.To = $localStorage.BillingHistory1.To;
	// $scope.BillingHistory1.From = $localStorage.BillingHistory1.From;


	/**
	 * Logout
	 * */

	$scope.logOut = function () {
		$localStorage.$reset();
		localStorage.clear();
		location.href = "#/login";
	};

	/****************** Document List code *******************/
	$scope.songlist1 = function () {
		$ionicLoading.show({
			content: 'processing...',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		$state.go('songlist1');
		$ionicLoading.hide();

	};

	/****************** Document List code *******************/
	$scope.SongList = function () {
		$ionicLoading.show({
			content: 'processing...',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		if (typeof $localStorage.SongListData == "undefined" || $localStorage.SongListData == '') {
			userService.SongList(function (data) {
				console.log(data);
				if (data == '"Session expired or invalid"') {
					$ionicLoading.hide();
					$scope.showAlert("Session expired. Please Login ");
					//Commenting out, why would we clear the data if they're logged out?
					localStorage.clear();
					location.href = "#/login";
				} else {
					if (data.length > 0) {
						// $scope.showAlert('');
						//	console.log(data);

						// console.log('$localStorage' );
						$localStorage.SongListData = data;
						//console.log($localStorage.SongListData);

						$scope.SongListData = $localStorage.SongListData = data;

						$ionicLoading.hide();
						$state.go('SongList');
					} else {
						$ionicLoading.hide();
						$scope.showAlert("No Records Found");

					}

				}
			});
		} else {
			$ionicLoading.hide();
			$state.go('SongList');
		}

	};

	/****************** Document List code end *******************/

	/****************** Home Page code *******************/
	$scope.home = function () {
		$ionicLoading.show({
			content: 'processing...',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		$ionicLoading.hide();
		$state.go('home');

	};

	/****************** Home Page code end *******************/

	/****************** Billing History Filter code *******************/

	$scope.BillingHistoryFilter = function (BillingHistory1) {

		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		userService.BillingHistoryFilter(BillingHistory1, function (data) {
			console.log(data);
			if (data == '"Session expired or invalid"') {
				$ionicLoading.hide();
				$scope.showAlert("Session expired. Please Login ");
				//Commenting out, why would we clear the data if they're logged out?
				localStorage.clear();
				location.href = "#/login";

			} else {
				if (data.Records.length > 0) {

					if (data.Count > 800) {
						var BillingHistoryDataArray = [];
						for (var Rc = 0; Rc < 800; Rc++) {
							BillingHistoryDataArray.push(data.Records[Rc]);
						}

						$scope.BillingHistoryData = BillingHistoryDataArray;
						$localStorage.BillingHistoryData = BillingHistoryDataArray;

					} else {
						$scope.BillingHistoryData = data.Records; ;
						$localStorage.BillingHistoryData = data.Records;
					}

					$ionicLoading.hide();
					$state.go('BillingHistory');

				} else {
					$scope.BillingHistoryData = $localStorage.BillingHistoryData = data.Records;
					$scope.showAlert("No Records Found");
					$ionicLoading.hide();
					$state.go('BillingHistory');
				}

			}

		});

	};

	/****************** Billing History Filter code end *******************/

	/****************** Login Page code *******************/

	$scope.login = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
		$ionicLoading.hide();
		$state.go('login');

	};
	/****************** Login Page code end *******************/

	$scope.BillingHistory1 = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		$ionicLoading.hide();
		$state.go('BillingHistory1');

	};

	/****************** Payments Page code *******************/

	$scope.Payments = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
		$ionicLoading.hide();
		$state.go('Payments');

	};

	$scope.SessionCalender1 = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
		$ionicLoading.hide();
		$state.go('SessionCalender1');

	};

	/****************** Payments Page code end *******************/

	/****************** Personal Info  Page code *******************/

	$scope.PersonalInfoPage = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		userService.getSomething1(function (data) {

			if (data == '"Session expired or invalid"') {
				$ionicLoading.hide();
				$scope.showAlert("Session expired. Please Login ");
				//Commenting out, why would we clear the data if they're logged out?
				localStorage.clear();
				location.href = "#/login";

			} else {
				//alert(data.Records[0].Birthdate);
				var pBirthDate = '';
				for (var _obj in data.Records) {
					if (data.Records[_obj].Birthdate) {
						pBirthDate = data.Records[_obj].Birthdate;
						if (data.Records[_obj].Birthdate.indexOf('T') !== -1) {
							var array = data.Records[_obj].Birthdate.split('T');
							var currdate = array[0].split('-');

							data.Records[_obj].Birthdate = new Date(currdate[0], currdate[1], currdate[2]);
							console.log(data.Records[_obj].Birthdate)

						}
						break;
					}
				}

				//console.log(data.Records);
				if (data.Records.length > 0) {
					$scope.PersonalInfoData = data;
					$localStorage.PersonalInfoData = data.Records;

					$ionicLoading.hide();
					$state.go('PersonalInfoPage');

				} else {
					$scope.BillingHistoryData = $localStorage.BillingHistoryData = data.Records;
					$scope.showAlert("Your are not valid user to get personal information . Please login with valid user.");
					$ionicLoading.hide();
					$state.go('PersonalInfo');
				}

			}

		});

	};

	/****************** Personal Info  Page code end *******************/

	/****************** Session Calender Page code *******************/

	$scope.SessionCalender = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		if (typeof $localStorage.SessionCalenderData == "undefined" || $localStorage.SessionCalenderData == '') {

			userService.SessionCalender($localStorage.SessionId, function (data) {
				//console.log(data);
				if (data == '"Session expired or invalid"') {
					$ionicLoading.hide();
					$scope.showAlert("Session expired. Please Login ");
					//Commenting out, why would we clear the data if they're logged out?
					localStorage.clear();
					location.href = "#/login";

				} else {
					var filter = 'Date__c'; //sort by group name
					var compare = function (filter) {
						return function (a, b) {
							var a = a[filter],
							b = b[filter];

							if (a < b) {
								return -1;
							} else if (a > b) {
								return 1;
							} else {
								return 0;
							}
						}
					}

					filter = compare(filter); //set filter

					//console.log(data.Records.sort(filter));

					var SessionArrayOp1 = data.Records.sort(filter);
					console.log(SessionArrayOp1);
					var SessionArrayOp = [];
					for (var SessionCList = 0; SessionCList < SessionArrayOp1.length && SessionArrayOp.length < 10; SessionCList++) {
						var date1 = new Date(); //todays date
						var date2 = new Date(SessionArrayOp1[SessionCList].Date__c);

						var differenceTravel = date2.getTime() - date1.getTime();
						var diffDays = (differenceTravel) / (1000 * 3600 * 24);

						console.log(diffDays);
						if (diffDays > 0) {
							console.log(diffDays);
							SessionArrayOp.push(SessionArrayOp1[SessionCList]);
						}

					}

					console.log(SessionArrayOp);
					if (SessionArrayOp.length > 0) {
						$scope.SessionCalenderData = SessionArrayOp;
						$localStorage.SessionCalenderData = SessionArrayOp;
						$ionicLoading.hide();
						$state.go('SessionCalender');
					} else {
						$ionicLoading.hide();
						$scope.showAlert("No Records Found");
						$ionicLoading.hide();
					}

					$ionicLoading.hide();

				}

			});

		} else {
			$ionicLoading.hide();
			$state.go('SessionCalender');
		}

	};
	/****************** Session Calender Page code end *******************/

	/****************** Personal Info Menu Page code *******************/

	$scope.PersonalInfo = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		$ionicLoading.hide();
		$state.go('PersonalInfo');
	};

	/****************** Personal Info Menu Page code end *******************/

	/****************** Medical Info Page code *******************/

	$scope.MedicalInfo = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
		userService.getSomething1(function (data) {
			console.log(data);

			if (data == '"Session expired or invalid"') {
				$ionicLoading.hide();
				$scope.showAlert("Session expired. Please Login ");
				//Commenting out, why would we clear the data if they're logged out?
				localStorage.clear();
				location.href = "#/login";

			} else {
				if (data.Records.length > 0) {

					$scope.MedicalInfoData = data;
					$scope.MedicalInfoData = [];
					$scope.UserId = $localStorage.UserId = data.Records[0].Id;
					console.log(data.Records[0].Medical_Conditions__c);
					var Medical_Conditions = data.Records[0].Medical_Conditions__c;
					if (Medical_Conditions === null) {}
					else {

						var stringData = data.Records[0].Medical_Conditions__c;
						var array = stringData.split(',');
						$scope.count = array.length;
						//console.log($scope.MedicalInfoData);
						for (var $sl = 0; $sl < array.length; $sl++) {
							var obj = "Medical_Conditions__c" + $sl;

							if (array[$sl] !== '') {
								$scope.MedicalInfoData.push({
									name: obj,
									value: array[$sl]
								});
							}

						}
					}

					$localStorage.MedicalInfoData = $scope.MedicalInfoData;
					//console.log($scope.MedicalInfoData);
					$ionicLoading.hide();
					$state.go('MedicalInfo');

				} else {

					$scope.BillingHistoryData = $localStorage.BillingHistoryData = data.Records;
					$scope.showAlert("Your are not valid user to get medical information . Please login with valid user.");
					$ionicLoading.hide();
					$state.go('PersonalInfo');
				}
			}

		});

	};

	/****************** Medical Info Page code end  *******************/

	/****************** Emergency Contact Page code *******************/

	$scope.EmergencyContactDataCount = $localStorage.EmergencyContactDataCount;

	$scope.EmergencyContact = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		userService.EmergencyContact(function (data) {

			console.log(data);
			if (data == '"Session expired or invalid"') {
				$ionicLoading.hide();
				$scope.showAlert("Session expired. Please Login ");
				//Commenting out, why would we clear the data if they're logged out?
				localStorage.clear();
				location.href = "#/login";

			} else {
				if (data.Count > 0) {
					$scope.UserId = $localStorage.UserId = data.Records[0].Id;

				}
				var EmergencyContactArrayOp = [];
				for (var SessionCList = 0; SessionCList < data.Count && EmergencyContactArrayOp.length < 2; SessionCList++) {
					EmergencyContactArrayOp.push(data.Records[SessionCList]);

				}

				$localStorage.EmergencyContactData = $scope.EmergencyContactData = EmergencyContactArrayOp;
				$localStorage.EmergencyContactDataCount = $scope.EmergencyContactDataCount = data.Count;
				if (data.Count > 1) {
					console.log("count: " + data.Count);

					$(".EmergencyContactDataAppend").css('display', 'none');
					$("#EmergencyContactDataAppend").css('display', 'none');
					angular.element(document.getElementById('EmergencyContactDataAppend')).css('display', 'none');

				}
				angular.element(document.getElementById('EmergencyContactCount')).val(data.Count);
				$ionicLoading.hide();
				$state.go('EmergencyContact');

			}

			$ionicLoading.hide();

		});
	};

	/****************** Emergency Contact Page code *******************/

	$scope.PaymentPage = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
		$ionicLoading.hide();
		$state.go('PaymentPage');

	};

	/****************** Billing History Page code *******************/

	$scope.BillingHistory = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		if (typeof $localStorage.BillingHistoryData == "undefined" || $localStorage.BillingHistoryData == '') {

			userService.BillingHistory(function (data) {
				console.log(data);
				if (data == '"Session expired or invalid"') {
					$ionicLoading.hide();
					$scope.showAlert("Session expired. Please Login ");
					//Commenting out, why would we clear the data if they're logged out?
					localStorage.clear();
					location.href = "#/login";

				} else {
					if (data.Records.length > 0) {

						if (data.Count > 800) {
							var BillingHistoryDataArray = [];
							for (var Rc = 0; Rc < 800; Rc++) {
								BillingHistoryDataArray.push(data.Records[Rc]);
							}

							$scope.BillingHistoryData = BillingHistoryDataArray;
							$localStorage.BillingHistoryData = BillingHistoryDataArray;

						} else {
							$scope.BillingHistoryData = data.Records; ;
							$localStorage.BillingHistoryData = data.Records;
						}

						//$localStorage.BillingHistory1.To = $localStorage.BillingHistory1.From ='2016-01-01T09:38:01';

						$ionicLoading.hide();
						$state.go('BillingHistory');

					} else {
						$scope.showAlert("No Records Found");
						$ionicLoading.hide();
						//$state.go('BillingHistory');
					}

				}

			});
		} else {
			$ionicLoading.hide();
			$state.go('BillingHistory');
		}
	};

	/****************** Billing History Page code *******************/

	/****************** Personal Info Form Submit code *******************/

	$scope.PersonalInfoFormSubmit = function (PersonalInfo) {

		//console.log(PersonalInfo);
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		if (PersonalInfo.FirstName.length > 0) {
			userService.PersonalInfoFormSubmit(PersonalInfo, function (data) {
				//alert(data);
				$localStorage.username = PersonalInfo.Email;
				//console.log($localStorage.username);
				if (data.HasError == false) {
					$scope.showAlert("Data Updated Successfully");
					$ionicLoading.hide();
					$state.go('PersonalInfoPage');
				} else {
					$scope.showAlert("Data not Updated. please try again");
					$ionicLoading.hide();
				}

			});

		} else {
			$scope.showAlert();
			$ionicLoading.hide();
		}

		//$state.go('home');

	};

	/****************** Personal Info Form Submit code *******************/

	/****************** Medical Info Form Submit code *******************/

	$scope.MedicalInfoFormSubmit = function () {

		// console.log( $('#MedicalInfoSubmit').serialize());
		var string = $('#MedicalInfoSubmit').serialize();
		//console.log(string);
		var finalString = [];
		if (string.indexOf('&') !== -1) {
			var array = string.split('&');
			//console.log(array);
			for (var $sl = 0; $sl < array.length; $sl++) {
				var array1 = array[$sl].split('=');
				finalString.push(array1[1].replace("+", " "));

			}

		}
		var Medical_Conditions__c = finalString.join(',');
		//console.log(Medical_Conditions__c);
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		$ionicLoading.hide();

		userService.MedicalInfoFormSubmit(Medical_Conditions__c, function (data) {
			//console.log(data);
			if (data.HasError == false) {
				$scope.showAlert("Data Updated Successfully");
				$ionicLoading.hide();
				$state.go('MedicalInfo');
			} else {
				$scope.showAlert("Fail to Update. Please try again");
				$ionicLoading.hide();
			}

		});

	};

	/****************** Medical Info Form Submit code *******************/

	/****************** Emergency Contact Form Submit Submit code *******************/

	$scope.EmergencyContactFormSubmit = function () {

		var Id = [];
		var First_Name__c = [];
		var Last_Name__c = [];
		var Home_Phone__c = [];
		var Mobile_Phone__c = [];
		var Description__c = [];

		var dataArray = $("#EmergencyContactSubmit").serializeArray();
		console.log(dataArray);

		for (i = 0; i < dataArray.length; i += 1) {
			if (dataArray[i].name === "Id") {
				Id.push(dataArray[i].value);
			} else if (dataArray[i].name === "First_Name__c") {

				First_Name__c.push(dataArray[i].value);
			} else if (dataArray[i].name === "Last_Name__c") {

				Last_Name__c.push(dataArray[i].value);
			} else if (dataArray[i].name === "Home_Phone__c") {

				Home_Phone__c.push(dataArray[i].value);
			} else if (dataArray[i].name === "Mobile_Phone__c") {

				Mobile_Phone__c.push(dataArray[i].value);
			} else if (dataArray[i].name === "Description__c") {

				Description__c.push(dataArray[i].value);
			}

		}

		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		if (Id.length > 0) {
			userService.EmergencyContactFormSubmit(Id, First_Name__c, Last_Name__c, Home_Phone__c, Mobile_Phone__c, Description__c, function (data) {
				//alert(data);
				if (data == 'Success') {
					$scope.showAlert("Data Updated Successfully");
					$ionicLoading.hide();
					$state.go('EmergencyContact');
				} else {
					$scope.showAlert("Fail to update . You must provide a First Name and a Last Name and at least one phone number ");
					$ionicLoading.hide();
					$state.go('EmergencyContact');
				}

			});

		} else {
			$scope.showAlert();
			$ionicLoading.hide();
		}

	};

	/****************** Emergency Contact Form Submit Submit code *******************/

	/****************** Medical Info Form Submit code *******************/

	$scope.DocumentListFilter = function (character) {

		//console.log(character);
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		if (character.length > 0) {
			userService.DocumentListFilter(character, function (data) {

				if (data == '"Session expired or invalid"') {
					$ionicLoading.hide();
					$scope.showAlert("Session expired. Please Login ");
					//Commenting out, why would we clear the data if they're logged out?
					localStorage.clear();
					location.href = "#/login";

				} else {
					if (data.Records.length > 0) {
						$scope.SongListData = $localStorage.SongListData = data.Records;
						$ionicLoading.hide();
						$state.go('SongList');

					} else {
						$scope.SongListData = $localStorage.SongListData = data.Records;
						$scope.showAlert("No Records Found");
						$ionicLoading.hide();
						$state.go('SongList');
					}

				}

			});

		} else {
			userService.SongList(function (data) {

				if (data == '"Session expired or invalid"') {
					$ionicLoading.hide();
					$scope.showAlert("Session expired. Please Login ");
					//Commenting out, why would we clear the data if they're logged out?
					localStorage.clear();
					location.href = "#/login";

				} else {
					$scope.SongListData = $localStorage.SongListData = data.Records;
					//console.log($scope.SongListData);
					$ionicLoading.hide();
					$state.go('SongList');

				}

			});
		}

	};

	/****************** Medical Info Form Submit code *******************/

	$scope.NameSplit = function (string) {
		var charcter = string.charAt(0);
		var res = charcter.toUpperCase();
		return res;

	};

	$scope.DateSplit = function (string, nb) {
		if (string.indexOf('T') !== -1) {
			var array = string.split('T');
			//console.log(array[nb]);
			return array[nb];
		}

	};
	$scope.Venue_Details__cSplit = function (string) {
		var re = /<br>/gi;
		var array = string.replace(re, ',');
		var res = array.split(",");
		// var re1 = /,/gi;
		//var array1 = array.replace(re1,' -');
		return res[0]
	};

	$scope.showAlert = function (msg) {
		if ((msg == '') || (msg == undefined)) {
			msg;
		}
		var alertPopup = $ionicPopup.alert({
				title: 'Notice',
				template: msg
			});
		alertPopup.then(function (res) {});
	};

	$scope.Venue_Details__TimeSplit = function (string) {
		if (string.indexOf('-') !== -1) {
			var array = string.split('-');
			if (parseInt(array[0]) < 13) {
				var data = array[0] + " AM";
			} else {
				var data = array[0] + " PM";
			}
			return data;
		}

	};
	$scope.gotoAnchor = function (x) {
		console.log(x)
		var newHash = 'anchor' + x;
		if ($location.hash() !== newHash) {
			// set the $location.hash to `newHash` and
			// $anchorScroll will automatically scroll to it
			$location.hash('anchor' + x);
		} else {
			// call $anchorScroll() explicitly,
			// since $location.hash hasn't changed
			$anchorScroll();
		}
	};

	$scope.DirectOpen = function (id, name) {

		var Extention = name.substr(name.lastIndexOf('.') + 1);
		var FileName1 = id + "." + Extention;
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		if (id !== '') {

			var targetPath1 = cordova.file.dataDirectory + FileName1;
			var ref = cordova.InAppBrowser.open(targetPath1, '_blank', 'location=yes', 'EnableViewPortScale=yes');
			ref.addEventListener('loadstart', function (event) {});

		}
	};

	$scope.Download = function (id, name) {

		console.log(name);
		var Extention = name.substr(name.lastIndexOf('.') + 1);
		var FileName1 = id + "." + Extention;
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		if (id !== '') {

			var targetPath1 = cordova.file.dataDirectory + name;
			window.resolveLocalFileSystemURL(targetPath1, fileExisted, fileDidNotExist);

			function fileExisted(fileEntry) {
				$ionicLoading.hide();
				var ref = cordova.InAppBrowser.open(targetPath1, '_blank', 'location=yes', 'EnableViewPortScale=yes');
				ref.addEventListener('loadstart', function (event) {});

			}

			function fileDidNotExist() {

				userService.Download(id, name, function (data) {

					console.log(data);

					if (data !== '') {
						var string_array = data.split('/');
						var filename = string_array.slice(-1).pop();
						var url = $rootScope.downloadFileUrl + filename;
						var targetPath = cordova.file.dataDirectory + filename;
						var trustHosts = true;
						var options = {};
						// alert(url);
						// alert(targetPath);

						$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
						.then(function (result) {
							$timeout(function () {
								$ionicLoading.hide()
								$ionicPopup.alert({
									title: 'Download Complete',
								})
								.then(function (res) {
									var ref = cordova.InAppBrowser.open(targetPath1, '_blank', 'location=yes', 'EnableViewPortScale=yes');
									ref.addEventListener('loadstart', function (event) {});
								})
							}, 3000);

							userService.RemoveDownloadedFile(FileName, function (data) {
								console.log(data);
							});

						}, function (err) {
							//$ionicLoading.show("ERROR: " + JSON.stringify(err));

							$timeout(function () {
								$ionicLoading.hide()
								$ionicPopup.alert({
									title: 'Rockchoir needs access to storage permission',
								})
							}, 3000);
							//alert("ERROR: " + JSON.stringify(err));
						}, function (progress) {
							$scope.downloadProgress1 = (progress.loaded / progress.total).toFixed() * 100;
							if ($scope.downloadProgress1)
								$ionicLoading.show({
									template: '<ion-spinner></ion-spinner> <br/>' + Math.floor($scope.downloadProgress1) + '%',
									content: 'Loading',
									animation: 'fade-in',
									showBackdrop: true,
									maxWidth: 200,
									showDelay: 0
								});
						});

					} else {
						$ionicLoading.hide();
						$scope.showAlert("Please try after some time.");
					}
				});
			}

		} else {
			$ionicLoading.hide();
			$scope.showAlert("Try after some time");
		}

	};

	$scope.DownloadSelect = function (name, DivId) {

		console.log(name);

		var datafileE = name.split("#");
		var id = datafileE[0];
		var FileName = datafileE[1];
		console.log(id);
		$('.' + DivId).css("display", "none");
		$('ul.' + DivId + '> li ').removeClass("active");
		$('#' + id).addClass("active");

		if (name !== '') {

			var datafileE = name.split("#");
			var id = datafileE[0];
			var FileName = datafileE[1];

			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});

			var targetPath = cordova.file.dataDirectory + id + '.mp3';

			window.resolveLocalFileSystemURL(targetPath, fileExisted, fileDidNotExist);

			function fileExisted(fileEntry) {
				$ionicLoading.hide();
				var ref = cordova.InAppBrowser.open(targetPath, '_blank', 'location=yes');
				ref.addEventListener('loadstart', function (event) {});

			}

			function fileDidNotExist() {
				//alert("file does not exist");

				userService.Download(id, FileName, function (data) {
					console.log(data);

					if (data !== '') {
						var string_array = data.split('/');
						var filename = string_array.slice(-1).pop();
						var url = $rootScope.downloadFileUrl + filename;
						//alert(url);
						var targetPath = cordova.file.dataDirectory + id + '.mp3';
						var trustHosts = true;
						var options = {};
						// alert(url);
						// alert(targetPath);
						$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
						.then(function (result) {
							$timeout(function () {
								$ionicLoading.hide()
								$ionicPopup.alert({
									title: 'Download Complete',
								})
								.then(function (res) {
									var ref = cordova.InAppBrowser.open(targetPath, '_blank', 'location=yes');
									ref.addEventListener('loadstart', function (event) {});
									//ref.addEventListener('loadstart', myCallback);
									//ref.removeEventListener('loadstart', myCallback);
								})
							}, 3000);

							userService.RemoveDownloadedFile(FileName, function (data) {
								console.log(data);

							});

							//alert("File Downloaded"); // Success!
						}, function (err) {
							//$ionicLoading.show("ERROR: " + JSON.stringify(err));

							$timeout(function () {
								$ionicLoading.hide()
								$ionicPopup.alert({
									title: 'Rockchoir needs access to storage permission',
								})
							}, 3000);
							//alert("ERROR: " + JSON.stringify(err));
						}, function (progress) {
							$scope.downloadProgress1 = (progress.loaded / progress.total).toFixed() * 100;
							if ($scope.downloadProgress1)
								$ionicLoading.show({
									template: '<ion-spinner></ion-spinner> <br/>' + Math.floor($scope.downloadProgress1) + '%',
									content: 'Loading',
									animation: 'fade-in',
									showBackdrop: true,
									maxWidth: 200,
									showDelay: 0
								});
						});

					} else {
						$scope.showAlert("Please try after some time.");
					}

					//$scope.showAlert(data);
				});

			}

		} else {
			$ionicLoading.hide();
			$scope.showAlert("Try after some time");
		}

	};

	/*********************************************************************************/
	/************************** PHASE 1 METHODS **************************************/
	/*********************************************************************************/

	$scope.filterFunction = function (element) {
		var date1 = new Date(); //todays date
		var date2 = new Date(element.Start_time__c);
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

		// console.log(diffDays);
		if (diffDays < 9) {
			return true;
		} else {
			return true;
		}

	};

	$scope.SessionItems = [];
	$scope.SessionSubitems = [];
	var venueId = $stateParams.venueId;
	var groupId = $stateParams.groupId;
	var sessionId = $scope.sessionId = $stateParams.sessionId;
	$scope.VenueData = $localStorage.VenueData;

	$scope.sessionSubgroups = $localStorage.ScannedUploadCrm;

	$scope.data = {
		showDelete: true
	};

	$scope.onItemDelete = function (item) {
		console.log($localStorage.SessionSubitems);
		var confirmPopup1 = $ionicPopup.confirm({
				title: 'Confirm',
				template: '<p style="text-align:center;"> Are you sure?</p>',
				cancelText: 'No',
				okText: 'Yes'
			});
		confirmPopup1.then(function (res) {
			if (res) {
				$scope.SessionGroups.splice($localStorage.SessionSubitems.indexOf(item), 1);
				$localStorage.ScannedUploadCrm.splice($localStorage.ScannedUploadCrm.indexOf(item), 1);
				console.log($localStorage.SessionSubitems);
			} else {
				// console.log('You are not sure');
			}

		});
	};

	/*********************************************************************************/
	/************************** UPLOAD TO CRM CODE ***********************************/
	/*********************************************************************************/

	$scope.uploadToCrm = function () {
		var id = sessionId;
		console.log(id);
		var UploadedStatus = '';
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
				'SelectedScheduleName': id
			}, true);

		console.log($scope.uploadedSubSessions.length);
		if ($scope.uploadedSubSessions.length > 0) {
			var sessionCount = 0;
			angular.forEach($scope.uploadedSubSessions, function (item) {
				userService.createRecord(choirsession, item.first_name, function (data) {
					if (data == '"Session expired or invalid"') {
						$ionicLoading.hide();
						$scope.showAlert("Session expired. Please Login ");
						//Commenting out, why would we clear the data if they're logged out?
						//$localStorage.$reset();
						//localStorage.clear();
						location.href = "#/login";
					} else {

						$localStorage.SessionSubitems.splice($localStorage.SessionSubitems.indexOf(item), 1);
						$localStorage.SessionItems.splice($localStorage.SessionItems.indexOf(item), 1);
						sessionCount++;

						if (sessionCount == $scope.uploadedSubSessions.length) {
							//Once data is uploaded - clear it.
							localStorage.clear();
							//Set active session to undefined to ensure the correct response
							$localStorage.activeSessionName == "undefined";
							
							$state.go("home1");
							$ionicLoading.hide();
							$scope.showAlert("Data uploaded");
						}

					}

				});
			});

		} else {
			// $state.go("home");
			$ionicLoading.hide();
			$scope.showAlert("No data uploaded");
		}
	}

	/*********************************************************************************/
	/************************** CHECK IS EMPTY CODE ***********************************/
	/*********************************************************************************/

	function isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	}

	/*********************************************************************************/
	/************************** QR SCAN  CODE ***********************************/
	/*********************************************************************************/

	function qrscanfunc() {
			//Start of the barcode scanner method
		if (typeof $localStorage.activeSessionName !== "undefined") {
			$cordovaBarcodeScanner.scan({
				"preferFrontCamera": false, // iOS and Android - false by default
				"showFlipCameraButton": true, // iOS and Android
				"prompt": "Place a barcode inside the scan area", // supported on Android only
				"formats": "QR_CODE", // Just look for QR Codes
				"orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
			}).then(function (imageData) {
				if (imageData.text !== "") {


					var element = {}
					element.first_name = imageData.text;
					element.sessionID = $localStorage.activeSessionId;
					element.sessionName = $localStorage.ActiveSessionNameToDisplay;
					element.sessionTime = $localStorage.ActiveSessionTimeToDisplay;
					element.SelectedScheduleName = $localStorage.SelectedScheduleName;

					$scope.SessionItems.push(element);
					$scope.SessionSubitems.push(element);

					$localStorage.SessionItems = $scope.SessionItems;
					if ($localStorage.SessionSubitems == undefined) {
						$localStorage.SessionSubitems = $scope.SessionSubitems;
					} else {
						var currentObject = $scope.SessionSubitems.slice(-1)[0];
						var previousObject = $localStorage.SessionSubitems;

						var merged = previousObject.concat(currentObject);
						$localStorage.SessionSubitems = merged;
					}
					//Recurive call, to stay on scanner page. DIRTY use.............But works.....Right?
					qrscanfunc();
				}
			}, function (error) { //Couldn't find anything......
				$state.go("home1");
				$scope.showAlert("error:" + error);
			});
		} else {
			//Should be called if a session is not selected - right?
			$scope.showAlert("Please Select Session First");
		}
	}
	$scope.sessionSubgroups = $localStorage.SessionSubitems;

	$scope.SessionGroups = $localStorage.SessionSubitems;

	/*********************************************************************************/
	/************************** SESSION SELECTION CODE ***********************************/
	/*********************************************************************************/

	$scope.sessionAction = function (info) {

		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		//console.log(info.Name);
		$scope.ActivebrandNameS = $filter('filter')($localStorage.VenueData, {
				'Id': info.Venue__c
			}, true);

		userService.getSelectedSessionTime(info.Name, function (data) {
			if (data == '"Session expired or invalid"') {
				$ionicLoading.hide();
				$scope.showAlert("Session expired. Please Login ");
				//$localStorage.$reset();
				//localStorage.clear();
				location.href = "#/login";
			} else {
				$ionicLoading.hide();
				$localStorage.ActiveSessionTimeToDisplay = data.Records[0].Time_Window__c;
				var date = data.Records[0].Start_time__c.split("T");
				var days = date[0].split("-");
				var Start_time__c = days[2] + "/" + days[1] + "/" + days[0];
				var confirmPopup = $ionicPopup.confirm({
						title: 'Confirm',
						template: '<p> You have clicked on <span style="color:green;font-style: italic;">' + $scope.ActivebrandNameS[0].Name + ',  Date :' + Start_time__c + ' </span> . Do you wish to continue?</p>',
						cancelText: 'No',
						okText: 'Yes'
					});
				confirmPopup.then(function (res) {
					if (res) {
						$localStorage.activeSessionId = info.Id;
						$localStorage.activeSessionName = info.Name;
						$ionicLoading.show({
							content: 'Loading',
							animation: 'fade-in',
							showBackdrop: true,
							maxWidth: 200,
							showDelay: 0
						});

						userService.getSelectedChoirName(info.Venue__c, function (data) {
							if (data == '"Session expired or invalid"') {
								$ionicLoading.hide();
								$scope.showAlert("Session expired. Please Login ");
								//Commenting out, why would we clear the data if they're logged out?
								//localStorage.clear();
								location.href = "#/login";
							} else {

								$scope.ActivebrandName = $localStorage.ActiveSessionNameToDisplay = data.Records[0].Name;
								console.log($localStorage.ActiveSessionNameToDisplay);
								angular.element(document.getElementById('activeSession')).html($localStorage.ActiveSessionNameToDisplay);
								//document.getElementById("activeSession").html($localStorage.ActiveSessionNameToDisplay);
							}
						});

						$localStorage.SelectedScheduleName = info.Name;

						//$localStorage.ActiveSessionTimeToDisplay= $scope.ActivebrandTimeS[0].Time_Window__c;


						console.log($localStorage.activeSessionId);
						console.log($localStorage.ActiveSessionNameToDisplay);
						console.log($localStorage.ActiveSessionTimeToDisplay);
						$ionicLoading.hide();
						$state.go("home1");
						console.log($localStorage.SessionSubitems);
					} else {
						// console.log('You are not sure');
					}
				});

			}
		});

	}

	if (typeof $localStorage.activeSessionId !== "undefined") {

		console.log("activeSessionId2 =" + $localStorage.activeSessionId);

		$scope.ActivebrandName = $filter('filter')($localStorage.VenueData, {
				'Id': $localStorage.activeSessionId
			}, true);
	}
	/*********************************************************************************/
	/************************** get choir list ***********************************/
	/*********************************************************************************/

	$scope.clickMe = function () {

		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		var p = $localStorage.VenueData;
		//  alert(p);
		if (typeof $localStorage.VenueData == "undefined" || $localStorage.VenueData == '') {
			userService.getSomething(function (data) {

				if (data == '"Session expired or invalid"') {
					$ionicLoading.hide();
					$scope.showAlert("Session expired. Please Login ");
					//Commenting out, why would we clear the data if they're logged out?
					localStorage.clear();
					location.href = "#/login";
				} else {

					if (data.Count > 0) {
						$scope.VenueData = data;

						$localStorage.VenueData = data.Records;
						// alert($localStorage.VenueData);


						$state.go('venues');
						$ionicLoading.hide();
					} else {
						$ionicLoading.hide();

						$scope.showAlert("No Record Found");
						$state.go("home1");
					}

					// console.log(data);
				}
			});
		} else {
			$ionicLoading.hide();
			$state.go('venues');
		}

	};

	/*********************************************************************************/
	/************************** GET LOCATION LIST ***********************************/
	/*********************************************************************************/

	if (typeof venueId !== "undefined") {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
		userService.getGroups(venueId, function (data) {
			if (data == '"Session expired or invalid"') {
				$ionicLoading.hide();
				$scope.showAlert("Session expired. Please Login ");
				//Commenting out, why would we clear the data if they're logged out?
				localStorage.clear();
				location.href = "#/login";
			} else {

				$localStorage.vgroupData = data.Records;
				$scope.vgroupData = $localStorage.vgroupData;
				// console.log($scope.groupData);
				if ($scope.vgroupData == "") {
					$state.go("venues");
					$scope.showAlert("No Record Found");
				}
				$ionicLoading.hide();
			}
		});
	}

	/*********************************************************************************/
	/************************** GET SESSION LIST ***********************************/
	/*********************************************************************************/

	if (typeof groupId !== "undefined") {
		// console.log(groupId);
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		userService.getSessions(groupId, function (data) {

			if (data == '"Session expired or invalid"') {
				$ionicLoading.hide();
				$scope.showAlert("Session expired. Please Login ");
				//Commenting out, why would we clear the data if they're logged out?
				localStorage.clear();
				location.href = "#/login";
			} else {

				var filter = 'Start_time__c'; //sort by group name
				var compare = function (filter) {
					return function (a, b) {
						var a = a[filter],
						b = b[filter];

						if (a < b) {
							return -1;
						} else if (a > b) {
							return 1;
						} else {
							return 0;
						}
					}
				}

				filter = compare(filter); //set filter

				//console.log(data.Records.sort(filter));

				var SessionArrayOp1 = data.Records.sort(filter);
				console.log(SessionArrayOp1);
				var SessionArrayOp = [];

				for (var SessionCList = 0; SessionCList < SessionArrayOp1.length && SessionArrayOp.length < 10; SessionCList++) {
					var date1 = new Date(); //todays date
					var date2 = new Date(SessionArrayOp1[SessionCList].Start_time__c);

					var differenceTravel = date2.getTime() - date1.getTime();
					var diffDays = (differenceTravel) / (1000 * 3600 * 24);

					console.log(diffDays);
					if (diffDays > 0) {
						console.log(diffDays);
						SessionArrayOp.push(SessionArrayOp1[SessionCList]);
					}

				}

				if (SessionArrayOp.length > 0) {
					console.log(SessionArrayOp);
					$ionicLoading.hide();
					$localStorage.groupData = SessionArrayOp;
					$scope.groupData = $localStorage.groupData;
				} else {

					$ionicLoading.hide();
					$scope.showAlert("No Record Found");
					$state.go("home1");
				}
			}
		});
	}

	/*********************************************************************************/
	/************************** GET SCHEDULE LIST ***********************************/
	/*********************************************************************************/

	if (typeof sessionId !== "undefined") {
		// console.log(sessionId);
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
		userService.getAttendance(sessionId, function (data) {
			if (data == '"Session expired or invalid"') {
				$ionicLoading.hide();
				$scope.showAlert("Session expired. Please Login ");
				//Commenting out, why would we clear the data if they're logged out?
				localStorage.clear();
				location.href = "#/login";
			} else {

				// console.log(data);
				$localStorage.sessionData = data.Records;
				$scope.sessionData = $localStorage.sessionData;
				// console.log($scope.sessionData);
				$ionicLoading.hide();
			}
		});
	}

	$scope.DisplaySessionAddress = function (Address, Name) {
		var alertPopup = $ionicPopup.alert({
				title: Name,
				template: '<p style="text-align:center">' + Address + '<p>'
			});

	};

	var scanneddataarray = [];

	$scope.upload = function (SelectedScheduleName) {

		console.log('$scope.sessionSubgroups : ');
		console.log($scope.sessionSubgroups);

		console.log('$localStorage.ScannedUploadCrm : ');
		console.log($localStorage.ScannedUploadCrm);

		var scanneddataarray = [];

		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
		var ScanneddataDisplay = 0;
		var Scanneddata = $scope.SessionGroups;
		if (Scanneddata.length > 0) {

			for (var count = 0; count < Scanneddata.length; count++) {
				if (Scanneddata[count].SelectedScheduleName == SelectedScheduleName) {
					scanneddataarray.push(Scanneddata[count]);
					UploadSessionIdCRM = {};
					UploadSessionIdCRM.sessionID = Scanneddata[count].sessionID;
				}
				ScanneddataDisplay++;
				if (ScanneddataDisplay == Scanneddata.length) {
					$localStorage.ScannedUploadCrm = scanneddataarray;
					$scope.sessionSubgroups = $localStorage.ScannedUploadCrm;
					$localStorage.UploadSessionIdCRM = $scope.UploadSessionIdCRM = UploadSessionIdCRM;

					console.log('$scope.sessionSubgroups : ');
					console.log($scope.sessionSubgroups);

					console.log('$localStorage.ScannedUploadCrm : ');
					console.log($localStorage.ScannedUploadCrm);

					console.log($scope.UploadSessionIdCRM);

					$state.go("upload");
					$ionicLoading.hide();
				}

			}

		}

	};

	document.addEventListener('deviceready', onDeviceReady);
	function onDeviceReady() {
		$scope.scanBarcode = function () {
			qrscanfunc();
		};

		var success = function (status) {
			//alert('Message: ' + status);
		}

		var error = function (status) {
			// alert('Error: ' + status);
		}

	}

	function GetFormattedDate(dates) {
		var date = dates.split("T");
		var days = date[0].split("-");
		return days[2] + "/" + days[1] + "/" + days[0];
	}

});
