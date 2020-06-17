$(document).ready(function () {
    var cityArr = [];
    var unOrdList = $("#cities")

    $("#searchBtn").on("click", function (event) {
        var city = $(".input").val();
        var m = moment();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + token;

        // var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + token + "&lat=" + lat + "&lon=" + lon;

        event.preventDefault();


        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            // temp converter variable
            var tempConv = (response.main.temp - 273.15) * (9 / 5) + 32;
            // converts timezone to UTC offset in minutes
            var UTC = response.timezone / 60;
            // inputs UTC offset and outputs a date stored in var
            var date = m.utcOffset(UTC).format("M/DD/YYYY");
            // displays city name + date
            $(".currentcity").text((response.name) + " " + "(" + date + ")");
            // icon
            $(".weatherIcon").attr("class", response.weather.icon);
            // temperature
            $("#ctemp").text("Temperature: " + tempConv.toFixed(1) + "°F");
            // humidity
            $("#chumid").text("Humidity: " + response.main.humidity + "%");
            // wind speed
            $("#cwind").text("Wind Speed: " + response.wind.speed + " MPH");
            
           
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            // console.log(response);
            // console.log("lat: " + lat);
            // console.log("lon: " + lon);
           
            var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + token + "&lat=" + lat + "&lon=" + lon;
            
            $.ajax({
                url: UVqueryURL,
                method: "GET",
            }).then(function (response) {
                console.log(response);
                // UV index
                $("#cuv").text("UV Index: " + response.value);
    
            });

            
        });

        
        // success: function(data) {
        // $.ajax({
        //     url: UVqueryURL,
        //     method: "GET",
        // }).then(function (response) {
        //     console.log(response);
        //     // UV index
        //     $("#cuv").text("UV Index: " + response.name);
        // });

        // };

        // adds cities to array
        cityArr.push(city);
        // stringifies the array
        var value = JSON.stringify(cityArr);
        // saves string in localStorage
        localStorage.setItem("cities", value);
        // turns string into an array
        JSON.parse(value);

        // inserts the city input to an LI element
        var cityList = $("<li>").text(city);
        // appends the listed city into the unordered list
        unOrdList.append(cityList);


        // grabs the last city in the array
        var lastCity = cityArr[cityArr.length - 1];
        // console.log(lastCity);


    }); // End of Search button click function

    var parsedCities = JSON.parse(localStorage.getItem("cities"));
    // when the page reloads, display the list of cities in the HTML
    // localStorage.getItem(cities);
    if (parsedCities !== null) {
        cityArr = parsedCities;
        var newOrdList = null;
        parsedCities.forEach(city => {
            newOrdList = unOrdList.append($("<li>").text(city));
        });
        $("#cities").append(newOrdList);
        //  saves in storage but removes the top city on restart, then removes all but last entered city on restart??
    }


});