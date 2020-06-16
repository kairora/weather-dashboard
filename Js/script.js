$(document).ready(function() {
    var city = $(".input").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + token;
    
    $("#find-movie").on("click", function(event) {
    
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {
            console.log(response);
        });






    });
});