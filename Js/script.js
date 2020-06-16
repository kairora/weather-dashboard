$(document).ready(function() {
    

    $("#searchBtn").on("click", function(event) {
    var city = $(".input").val();
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + token;
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {
            console.log(response);
        });






    });
});