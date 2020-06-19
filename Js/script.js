$(document).ready(function () {
    var cityArr = [];
    var unOrdList = $("#cities")
    var firstAJAX;
    var m = moment();
    var p = $("<p>");
    var forecastSect = $("<section>", { class: "day" });
    var city = $(".input").val();

    // search button click 
    $("#searchBtn").on("click", function (event) {
        var city = $(".input").val();
        // var cityBtnTxt = $("cityLI").text();
        event.preventDefault();
        // call first AJAX
        inputCity(city);
        cityStorage(city);
        foreCastCall(city);



    });
    // List item click
    $("#cities").on("click", "li", function (event) {
        event.preventDefault();
        inputCity($(this).text());
        // foreCastCall($(this).text());
        // // console.log($(this).text());


    });

    // grabs the needed reponse data
    function inputCity(city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=97ac3291da095ed4502e29467303d678";

        $.ajax({
            url: queryURL,
            method: "GET",
            success: function (data) {
                firstAJAX = data;
            }
        }).then(function (response) {
            // temp converter variable
            var tempConv = (response.main.temp - 273.15) * (9 / 5) + 32;
            // converts timezone to UTC offset in minutes
            var UTC = response.timezone / 60;
            // inputs UTC offset and outputs a date stored in var
            var date = m.utcOffset(UTC).format("M/DD/YYYY");
            localStorage.setItem("NowDate", date);
            // displays city name + date
            $(".currentcity").text((response.name) + " " + "(" + date + ")");
            var storedName = response.name
            localStorage.setItem("NowCity", storedName);
            // icon
            var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
            $(".currentcity").append(icon);

            // temperature display and set into localStorage
            $("#ctemp").text("Temperature: " + tempConv.toFixed(1) + " °F");
            localStorage.setItem("NowTemp", tempConv.toFixed(1) + " °F");
            // humidity display and set into localStorage
            $("#chumid").text("Humidity: " + response.main.humidity + "%");
            var storedHum = response.main.humidity + "%"
            localStorage.setItem("NowHum", storedHum);
            // wind speed display and set into localStorage
            $("#cwind").text("Wind Speed: " + response.wind.speed + " MPH");
            var storedWind = response.wind.speed + " MPH"
            localStorage.setItem("NowWind", storedWind);

            // store and pass the lat and lon from first AJAX
            var lat = response.coord.lat;
            var lon = response.coord.lon;

            uvFinder(lat, lon);
        });
    }
    // grabs the UV from 2nd AJAX with input from first AJAX
    function uvFinder(lat, lon) {
        var UVqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=97ac3291da095ed4502e29467303d678&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: UVqueryURL,
            method: "GET",
        }).then(function (response) {
            // Creates and inserts UV value with colored background depending on severity level
            var uvValue = response.value
            $("#cuv").text("UV Index: ");
            $("#cuv").append($("<span>", { class: "cSpan" }));
            $(".cSpan").text(uvValue);
            localStorage.setItem("NowUV", uvValue);
            // displays the color level for UV index. 
            if (uvValue >= 0 && uvValue <= 2.999) {
                $(".cSpan").attr("id", "low")
            } else if (uvValue >= 3 && uvValue <= 5.999) {
                $(".cSpan").attr("id", "moderate")
            } else if (uvValue >= 6 && uvValue <= 7.999) {
                $(".cSpan").attr("id", "midhigh")
            } else if (uvValue >= 8 && uvValue <= 10.999) {
                $(".cSpan").attr("id", "high")
            } else if (uvValue >= 11) {
                $(".cSpan").attr("id", "severe")
            } else {
                $(".cSpan").text("UV Index: N/A")
            }
        });
    }

    // 5-day forecast AJAX 
    function foreCastCall(city) {
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=97ac3291da095ed4502e29467303d678&units=imperial";
        $.ajax({
            url: forecastURL,
            method: "GET",
        }).then(function (result) {
            console.log(result);
            // start the forecast div empty
            $(".future").empty();


            for (var i = 0; i < result.list.length; i++) {
                var add = i + 1;
                if (result.list[i].dt_txt.search("12:00:00") !== -1) {
                    // Temp Converter
                    // var foreTempConv = (result.list[i].main.temp - 273.15) * (9 / 5) + 32;
                    // creates section with
                    var forecastSect = $("<section>", { class: "day" });

                    // creates p el with date text
                    var formattedDate = new Date(result.list[i].dt_txt).toLocaleDateString();
                    localStorage.setItem("foreDates", formattedDate);


                    // creates an img tag with icon
                    var foreIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + result.list[i].weather[0].icon + "@2x.png");
                    localStorage.setItem("foreIcons", foreIcon);



                    // creates a p with the temp
                    var fiveTemp = result.list[i].main.temp_max;
                    var foreTemp = "Temperature: " + fiveTemp + " °F";
                    localStorage.setItem("foreTemps", foreTemp);


                    // creates a p with the humidity
                    var humidity = "Humidity: " + JSON.stringify(result.list[i].main.humidity) + "%"
                    var foreHum = humidity;
                    localStorage.setItem("foreHums", foreHum);




                    // append date
                    $(".future").append(forecastSect.append(formattedDate, $("<br>")));
                    // append icon
                    $(".future").append(forecastSect.append(foreIcon, $("<br>")));
                    // append Temp
                    $(".future").append(forecastSect.append(foreTemp, $("<br>")));
                    // append Humidity
                    $(".future").append(forecastSect.append(foreHum));
                }
            }
        });
    };

    function cityStorage(city) {
        // adds cities to array
        cityArr.push(city);
        // stringifies the array
        var value = JSON.stringify(cityArr);
        // saves string in localStorage
        localStorage.setItem("cities", value);
        // turns string into an array
        JSON.parse(value);
        // inserts the city input to an LI element with class and styles
        unOrdList.append($("<li>", { class: "cityLI" }).text(city));
        // grabs the last city in the array
        var lastCity = cityArr[cityArr.length - 1];
        // append date
        
        // $(".future").append(forecastSect.append(localStorage.getItem("foreDates"), $("<br>")));
        // // append icon
        // $(".future").append(forecastSect.append(localStorage.getItem("foreIcons"), $("<br>")));
        // // append Temp
        // $(".future").append(forecastSect.append(localStorage.getItem("foreTemps"), $("<br>")));
        // // append Humidity
        // $(".future").append(forecastSect.append(localStorage.getItem("foreHums")));


    }


    // On Reload
    var storedCities = localStorage.getItem("cities");
    var parsedCities = JSON.parse(storedCities);
    // when the page reloads, display the list of cities in the HTML
    if (parsedCities !== null) {
        cityArr = parsedCities;
        var newOrdList = null;
        parsedCities.forEach(city => {
            newOrdList = unOrdList.append($("<li>", { class: "cityLI" }).text(city));

        });
        $("#cities").append(newOrdList);
    }

    // Display last saved city data
    $(".currentcity").text(localStorage.getItem("NowCity") + " " + "(" + localStorage.getItem("NowDate") + ")");
    // var lastTempConv = (firstAJAX.data.main.temp - 273.15) * (9 / 5) + 32;

    // icon
    // $(".weatherIcon").attr("class", firstAJAX.data.weather.icon);
    // temperature
    $("#ctemp").text("Temperature: " + localStorage.getItem("NowTemp"));
    // // humidity
    $("#chumid").text("Humidity: " + localStorage.getItem("NowHum"));
    // wind speed
    $("#cwind").text("Wind Speed: " + localStorage.getItem("NowWind"));
    // UV 
    var lastUV = localStorage.getItem("NowUV")
    $("#cuv").text("UV Index: ");
    $("#cuv").append($("<span>", { class: "cSpan" }));
    $(".cSpan").text(lastUV);
    if (lastUV >= 0 && lastUV <= 2.999) {
        $(".cSpan").attr("id", "low")
    } else if (lastUV >= 3 && lastUV <= 5.999) {
        $(".cSpan").attr("id", "moderate")
    } else if (lastUV >= 6 && lastUV <= 7.999) {
        $(".cSpan").attr("id", "midhigh")
    } else if (lastUV >= 8 && lastUV <= 10.999) {
        $(".cSpan").attr("id", "high")
    } else if (lastUV >= 11) {
        $(".cSpan").attr("id", "severe")
    } else {
        $(".cSpan").text("UV Index: N/A")
    }





    // grabs the last city in the array
    // var lastCity = parsedCities[parsedCities.length - 1];
    // console.log(lastCity);


});