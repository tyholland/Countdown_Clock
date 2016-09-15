var counter = {
    /***************************************************
       Function to starts the clock countdown
    ***************************************************/
    init: function() {
        this._initializeClock(this._getPreferredDeadline());
    },

    /***************************************************
        Determines whether it's daylight savings time
        or not
    ***************************************************/
    _getDaylightSavingsTime: function() {
        var today = new Date(),
            jan = new Date(today.getFullYear(), 0, 1),
            jul = new Date(today.getFullYear(), 6, 1),
            monthDiff = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()),
            dst = today.getTimezoneOffset() < monthDiff;

        return dst;
    },

    /***************************************************
        Gets the predetermined end time. Currently it
        is set at "15", which in military time is 3pm.
        You can change the "15" to to whatever time,
        you want it to be.
    ***************************************************/
    _getPreferredDeadline: function() {
        var currentDate = new Date(),
            month = currentDate.getMonth()+1,
            day = currentDate.getDate(),
            output = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + currentDate.getFullYear(),
            offset = '5',
            deadline;

            if (this._getDaylightSavingsTime()) {
                offset = '4';
            }

            deadline = output + ' 15' + ':00:00 GMT-0' + offset + '00';

        return deadline;
    },

    /***************************************************
        This converts the time to be the Eastern Time
        Zone.
    ***************************************************/
    _getEasternTimeZone: function() {
        var mainDate = new Date(),
            num = '5';

        if (this._getDaylightSavingsTime()) {
            num = '4';
        }

        var offset = '-' + num + '.0',
            utc = mainDate.getTime() + (mainDate.getTimezoneOffset() * 60000),
            newDate = new Date(utc + (3600000*offset));

        return newDate;
    },

    /***************************************************
        This takes the value of the 
        getPreferredDeadline() function and subtracts
        it from the current date and time. Then it
        returns the value of the subtraction in the
        form of the total time, hours, and minutes.
    ***************************************************/
    _getTimeRemaining: function(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date(this._getEasternTimeZone())),
            updatedTime,
            nextDay;

        if ( t <= 0 ) {
            updatedTime = new Date(endtime);
            updatedTime.setDate(updatedTime.getDate() + 1);
            nextDay = updatedTime;
            t = Date.parse(nextDay) - Date.parse(new Date(this._getEasternTimeZone()));
        }

        var minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/(1000*60*60)) % 24 );

        return {
            'total': t,
            'hours': hours,
            'minutes': minutes
        };
    },

    /***************************************************
        This updates the clock every 1 second until
        3pm and then resets itself.
    ***************************************************/
    _initializeClock: function(endtime) {
        var timeinterval = setInterval(function() {
                var t = counter._getTimeRemaining(endtime);
                $('.theTime').html(t.hours + ' hrs ' + t.minutes + ' mins');

                if (t.hours === 0 && t.minutes === 0) {
                    $('.theTime').hide();
                } else {
                    $('.theTime').show();
                }

            }, 1000);
    }
}