$(document).ready(function () {
    var cityArr = [];
    var unOrdList = $("#cities")
    var firstAJAX;
    var m = moment();
    var p = $("<p>");
    var foreCastEl1 = $("#day1");
    var foreCastEl2 = $("#day2");
    var foreCastEl3 = $("#day3");
    var foreCastEl4 = $("#day4");
    var foreCastEl5 = $("#day5");
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
        var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=97ac3291da095ed4502e29467303d678&lat=" + lat + "&lon=" + lon;
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


    // var stringAJAX = JSON.stringify(firstAJAX)
    // // JSON.parse(firstAJAX);
    // console.log("first AJAX: " + JSON.parse(stringAJAX));
    // console.log("first AJAX function: " + stringAJAX);
    // console.log(JSON.parse(firstAJAX.sys.name));

    // localStorage.setItem("CityName", stringAJAX.data.name)
    // var lastTempConv = (firstAJAX.data.main.temp - 273.15) * (9 / 5) + 32;
    // $(".currentcity").text((firstAJAX.data.name) + " " + "(" + date + ")");
    // // icon
    // $(".weatherIcon").attr("class", firstAJAX.data.weather.icon);
    // // temperature
    // $("#ctemp").text("Temperature: " + lastTempConv.toFixed(1) + "°F");
    // // humidity
    // $("#chumid").text("Humidity: " + firstAJAX.data.main.humidity + "%");
    // // wind speed
    // $("#cwind").text("Wind Speed: " + firstAJAX.data.wind.speed + " MPH");

    // 5-day forecast AJAX 
    function foreCastCall(city) {
        var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=97ac3291da095ed4502e29467303d678&units=imperial";
        $.ajax({
            url: forecastURL,
            method: "GET",
        }).then(function (result) {
            console.log(result);
            // console.log(result.list[0].dt);
            console.log("result list" + result.list[0].dt_txt);
            // start the forecast div empty
            $(".future").empty();


            for (var i = 0; i < result.list.length; i++) {
                // var add = i + 1;
                // var resultList = JSON.stringify(result.list[i]);
                // var resultList = result.list;
                // console.log("hour text: "  + result.list[0].dt_text);
                // console.log("result length  " + resultList.length);
                if (result.list[i].dt_txt.search("12:00:00") !== -1) {
                    // Temp Converter
                    // var foreTempConv = (result.list[i].main.temp - 273.15) * (9 / 5) + 32;
                    // creates section with
                    var forecastSect = $("<section>", { class: "day" });

                    // creates p el with date text
                    // var foreDate = p.text(moment.unix(response.list[i].dt).format("MM/DD/YYYY"));
                    // var foreDate = p.text(moment.add(add, "day").format("MM/DD/YYYY"));
                    // var formattedDate = moment(result.list.dt_txt).format("M/DD/YYYY");
                    var formattedDate = new Date(result.list[i].dt_txt).toLocaleDateString();
                    var foreDate = p.text(formattedDate);
                    console.log("date: " + foreDate);

                    // var theWeather = result.list[i].weather
                    
                    // for (var j =0; j < theWeather.length; j++) {

                    // }
                    console.log("icon: " + result.list[0].weather[0].icon);

                    // creates an img tag with icon
                    var foreIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + result.list[i].weather[0].icon + "@2x.png");



                    // creates a p with the temp
                    var foreTemp = p.text("Temperature: " + result.list[i].main.temp_max + " °F");

                    console.log("temp: " + foreTemp);


                    // creates a p with the humidity
                    var foreHum = p.text("Humidity: " + result.list[i].main.humidity + "%");

                    console.log("humidity: " + foreHum);



                    // append date
                    $(".future").append(forecastSect.append(foreDate));
                    // append icon
                    $(".future").append(forecastSect.append(foreIcon));
                    // append icon
                    $(".future").append(forecastSect.append(foreTemp));
                    // append icon
                    $(".future").append(forecastSect.append(foreHum));

                    // humidity = "Humidity: " + result.list[i].main.humidity + "%"
                    // $(".future").prepend($("<section>", {class: "day"}).append(pHum.text(humidity)));
                }
            }



            // humidity1 = "Humidity: " + resultList[0].main.humidity + "%"
            // foreCastEl1.append(pHum.text(humidity1));
            // humidity2 = "Humidity: " + resultList[9].main.humidity + "%"
            // foreCastEl2.append(pHum.text(humidity2));
            // humidity3 = "Humidity: " + resultList[0].main.humidity + "%"
            // foreCastEl3.append(pHum.text(humidity3));
            // humidity4 = "Humidity: " + resultList[0].main.humidity + "%"
            // foreCastEl4.append(pHum.text(humidity4));
            // humidity5 = "Humidity: " + resultList[0].main.humidity + "%"
            // foreCastEl5.append(pHum.text(humidity5));

        });
    }

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