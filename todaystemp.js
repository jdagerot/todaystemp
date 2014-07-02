$(function() {

    // Some settings

    //Countrycode and city:

    var countryString = "SE/Stockholm",
        nbrOfHistoryYears = 5,
        API_KEY_WUNDERGROUND = "",
        historicURL = "//api.wunderground.com/api/" + API_KEY_WUNDERGROUND + "/conditions/q/" + countryString + ".json",
        todayURL = "//api.wunderground.com/api/" + API_KEY_WUNDERGROUND + "/history_" + yearIDX + "0702/q/" + countryString + ".json";


    // Make a call to get current temperature then update the left value on the page
    $.ajax({
        url: historicURL,
        dataType: "jsonp",
        success: function(parsed_json) {
            $("#leftBox").html(parsed_json.current_observation.temp_c);
        },
        error: function(err) {

            console.log(err)

        }
    });



    /**
    Called everytime we get a request back from the ajax layer, when reaching 0 we are good to go and update the page.
    **/
    var historyCountDown = nbrOfHistoryYears;

    function areWeDone2() {
        historyCountDown--;
        if (historyCountDown == 0) {
            historicalArray.sort(function(a, b) {
                return a.year < b.year;
            });
            for (a in historicalArray) {
                h = historicalArray[a];
                $("#rightBox").append("" + h.year + ": " + h.temp + "<br/>");
            }

        }
    }

    var historicalArray = [];

    var yearNow = (new Date()).getFullYear();
    $("#leftBox").append("<h4>" + yearNow + "</h4><br/>");
    for (yearIDX = yearNow - 1; yearIDX >= (yearNow - nbrOfHistoryYears); yearIDX--) {
        $.ajax({
            url: todayURL,
            dataType: "jsonp",
            success: function(parsed_json) {

                hour = new Date().getHours();
                historicalArray.push({
                    year: parsed_json.history.utcdate.year,
                    temp: findCorrespodningObservation(parsed_json, hour)
                });

            },
            error: function(err) {
                console.log(err)

            }
        }).then(areWeDone2);

    }

    /**
    When we get historical daya we need to loop through all observations to find one that is at the same time as now. We don't care about minutes.
*/
    function findCorrespodningObservation(json, hour) {
        for (i = 0; i < json.history.observations.length; i++) {
            var obs = json.history.observations[i];
            console.log("comparing" + hour + " with " + obs.utcdate.hour);
            if (hour == obs.utcdate.hour) {
                return obs.tempm;
            }
        }
    }
})