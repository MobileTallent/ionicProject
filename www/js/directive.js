//Directive that returns an element which adds buttons on click which show an alert on click
app.directive('addbuttonsbutton', function(){
	return {
		restrict: 'E',
		template: "<button class='color_yellow font_size_18 transparentButton ' addbuttons >ADD ANOTHER</button>"
	}
});

app.directive('addbuttonsbutton1', function(){
	return {
		restrict: 'E',
		template: "<button class='color_yellow font_size_18 transparentButton ECadd ' addbuttons1 >ADD ANOTHER</button>"
	}
});


//Directive for adding buttons on click that show an alert on click
app.directive('addbuttons', function($compile){
	return function(scope, element, attrs){
		element.bind('click', function(){
			scope.count++;
			angular.element(document.getElementById('space-for-buttons')).append($compile("<input type='text' placeholder='MEDICAL CONDITIONS ' name='Medical_Conditions__c'  class='medCon1 textbox_details '>")(scope));
		});
	};
});

//Directive for adding buttons on click that show an alert on click
app.directive('addbuttons1', function($localStorage,$compile){
	return function(scope, element, attrs){
		element.bind('click', function(){
			var EC = $localStorage.EmergencyContactDataCount;
			if(EC < 2)
			{
				console.log(EC);
			$localStorage.EmergencyContactDataCount = EC= +EC + +1;
				console.log(EC);
			var div ="<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'   >";
		    	div +="<div class='form-group'>";
				//div +="Coming Soon";
		    	div +="<label class='color_white'>Emergency Contact  </label> <br>";
				div +="<input type='hidden' placeholder='FIRST NAME ' class=' medCon1 textbox_details ' name='Id' value='' >";
			   div +="<label class='color_white'>First Name  </label> ";
				div +="<input type='text' placeholder='FIRST NAME ' class=' medCon1 textbox_details ' name='First_Name__c'  >";
			    div +="<label class='color_white'>Last Name  </label> ";
				div +="<input type='text' placeholder='LAST NAME ' class=' medCon1 textbox_details ' name='Last_Name__c'  >";
				div +="<label class='color_white'>Telephone Number  </label> ";
				div +="<input type='text' placeholder='TELEPHONE NUMBER '  class='medCon1 textbox_details ' name='Home_Phone__c'  >";
				div +="<label class='color_white'>Mobile Number  </label> ";
				div +="<input type='text' placeholder='MOBILE NUMBER '  class='medCon1 textbox_details ' name='Mobile_Phone__c'  >";
				div +="<label class='color_white'>Description </label> ";
				div +="<textarea class=' textbox_details medCon1  ' maxlength='150'  rows='10' name='Description__c'   placeholder='DESCRIPTION (RELATION)'></textarea>";
				div +="</div>";
			    div +="</div>";
				angular.element(document.getElementById('EmergencyContactCount')).val(EC);
				
				if(EC == '2')
				{
					$(".EmergencyContactDataAppend").css('display','none');
					
				}
				//	console.log(EC);
			angular.element(document.getElementById('AppendAdd')).append($compile(div)(scope));
			}
			else
			{
					$(".EmergencyContactDataAppend").css('display','none');
				
			}
			//alert($localStorage.EmergencyContactDataCount);
			
		});
	};
});


//Directive for showing an alert on click
app.directive('alert', function(){
	return function(scope, element, attrs){
		element.bind('click', function(){
			console.log(attrs);
			alert('This is alert #'+attrs.alert);
		});
	};
});

//Directive for adding buttons on click that show an alert on click
app.directive('uploadfile', function($compile){
	return function(scope, element, attrs){
		element.bind('click', function(){
			 angular.element(document.getElementById('downloadFile')).triggerHandler('click');
		});
	};
});
