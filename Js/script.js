$(document).ready(function() {
    var cityArr = [];  
    // var listItem = $("<li>");
    var unOrdList = $("<ul>");  

    $("#searchBtn").on("click", function(event) {
    var city = $(".input").val();
    var m = moment();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + token;
    

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {
            // temp converter variable
            var tempConv = (response.main.temp - 273.15) * (9/5) + 32;
            // converts timezone to UTC offset in minutes
            var UTC = response.timezone/60;
            // inputs UTC offset and outputs a date stored in var
            var date = m.utcOffset(UTC).format("M/DD/YYYY");
            // displays city name + date
            $(".currentcity").text((response.name) +  " " + "(" + date + ")");
            // icon
            $(".weatherIcon").attr("class", response.weather.icon);
            // temperature
            $("#ctemp").text("Temperature: " + tempConv.toFixed(1) + "°F");
            // humidity
            $("#chumid").text("Humidity: " + response.main.humidity + "%");
            // wind speed
            $("#cwind").text("Wind Speed: " + response.wind.speed + " MPH");
            // UV index
            $("#cuv").text("UV Index: " + response.name);
            // adds cities to array
            cityArr.push(city);
            var value = JSON.stringify(cityArr)
            // save in localStorage
            localStorage.setItem("cities", value);
            // sets values into list elements
            JSON.parse(value);
            var cityList = $("<li>").text(city);
            // var unOrdList = $("<ul>");
            unOrdList.append(cityList);
            
            $("#cities").append(unOrdList);
            

        });


    });
    // var stringCity = JSON.stringify("cities");
    // console.log(stringCity)
    // var parsedCities = JSON.parse(localStorage.getItem("cities"));
    // parsedCities.forEach(city => { 
    //     unOrdList.append(listItem.text(city));
    //      });
    //      $("#cities").append(unOrdList);
    
    
});