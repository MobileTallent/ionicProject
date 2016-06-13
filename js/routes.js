/**
 * Ionic Routes For Complete Application
 * Route with :id are dynamic with sepcific city or venue
 */
app.config( function ( $stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider )
{
	//$ionicConfigProvider.scrolling.jsScrolling( false );
	$stateProvider
		.state( 'app', {
			url: '/login',
			templateUrl: 'login.html',
		} )
		.state( 'home', {
			url: '/home',
			templateUrl: 'templates/home.html',
			controller: 'appCtrl'
		} )
		.state( 'venues', {
			url: '/venues',
			templateUrl: 'templates/venues.html',
			controller: 'appCtrl'
		} )
		.state( 'venue', {
			url: '/venue/:venueId',
			templateUrl: 'templates/venue.html',
			controller: 'appCtrl'
		} )
		.state( 'group', {
			url: '/group/:groupId',
			templateUrl: 'templates/group.html',
			controller: 'appCtrl'
		} )
		.state( 'session', {
			url: '/session/:sessionId',
			templateUrl: 'templates/session.html',
			controller: 'appCtrl'
		} )
		.state( 'upload', {
			url: '/upload/:sessionId',
			templateUrl: 'templates/sendData.html',
			controller: 'appCtrl'
		} )
		.state( 'send', {
			url: '/send',
			templateUrl: 'templates/attendees.html',
			controller: 'appCtrl'
		} );


	$urlRouterProvider.otherwise( '/login' );
} );

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);
