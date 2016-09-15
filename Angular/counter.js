var app = angular.module('countApp', []);

app.controller('counter', function($scope, $interval) {
    /***************************************************
       Content to show until countdown starts
    ***************************************************/
    $scope.countDown = 'countdown will start shortly';

    /***************************************************
        This updates the clock every 1 second until
        3pm and then resets itself.
    ***************************************************/
    $interval(function() {
        $scope.total = $scope.getTimeRemaining($scope.getPreferredDeadline());
        $scope.countDown = $scope.total.hours + ' hrs ' + $scope.total.minutes + ' mins';
    }, 1000);

    /***************************************************
        Determines whether it's daylight savings time
        or not
    ***************************************************/
    $scope.getDaylightSavingsTime = function() {
        $scope.today = new Date();
        $scope.jan = new Date($scope.today.getFullYear(), 0, 1);
        $scope.jul = new Date($scope.today.getFullYear(), 6, 1);
        $scope.monthDiff = Math.max($scope.jan.getTimezoneOffset(), $scope.jul.getTimezoneOffset());
        $scope.dst = $scope.today.getTimezoneOffset() < $scope.monthDiff;

        return $scope.dst;
    };

    /***************************************************
        Gets the predetermined end time. Currently it
        is set at "15", which in military time is 3pm.
        You can change the "15" to to whatever time,
        you want it to be.
    ***************************************************/
    $scope.getPreferredDeadline = function() {
        $scope.currentDate = new Date();
        $scope.month = $scope.currentDate.getMonth()+1;
        $scope.day = $scope.currentDate.getDate();
        $scope.output = ($scope.month<10 ? '0' : '') + $scope.month + '/' + ($scope.day<10 ? '0' : '') + $scope.day + '/' + $scope.currentDate.getFullYear();
        $scope.offset = '5';

        if ($scope.getDaylightSavingsTime()) {
            $scope.offset = '4';
        }

        $scope.deadline = $scope.output + ' 15' + ':00:00 GMT-0' + $scope.offset + '00';

        return $scope.deadline;
    };

    /***************************************************
        This converts the time to be the Eastern Time
        Zone.
    ***************************************************/
    $scope.getEasternTimeZone = function() {
        $scope.mainDate = new Date();
        $scope.num = '5';

        if ($scope.getDaylightSavingsTime()) {
            $scope.num = '4';
        }

        $scope.offset = '-' + $scope.num + '.0';
        $scope.utc = $scope.mainDate.getTime() + ($scope.mainDate.getTimezoneOffset() * 60000);
        $scope.newDate = new Date($scope.utc + (3600000*$scope.offset));

        return $scope.newDate;
    };

    /***************************************************
        This takes the value of the 
        getPreferredDeadline() function and subtracts
        it from the current date and time. Then it
        returns the value of the subtraction in the
        form of the total time, hours, and minutes.
    ***************************************************/
    $scope.getTimeRemaining = function(endtime) {
        $scope.t = Date.parse(endtime) - Date.parse(new Date($scope.getEasternTimeZone()));

        if ( $scope.t <= 0 ) {
            $scope.updatedTime = new Date(endtime);
            $scope.updatedTime.setDate($scope.updatedTime.getDate() + 1);
            $scope.nextDay = $scope.updatedTime;
            $scope.t = Date.parse($scope.nextDay) - Date.parse(new Date($scope.getEasternTimeZone()));
        }

        $scope.minutes = Math.floor( ($scope.t/1000/60) % 60 );
        $scope.hours = Math.floor( ($scope.t/(1000*60*60)) % 24 );

        return {
            'total': $scope.t,
            'hours': $scope.hours,
            'minutes': $scope.minutes
        }
    };
});