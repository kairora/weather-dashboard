# Weather Dashboard

As a traveler who needs to know the weather for a city of interest, or just a curious user interested in the weather in their own city, this weather app will give you the important details.

## Functionality
The weather dashboard uses the weather API's from https://openweathermap.org/api to allow various functionality.  First, the user can input a city name and click the search button to see the current weather for the city they input.  

![Scheduler-Date Photo](/Assets/search.PNG)


After searching, the user will then be greeted with a view of that city's name and the current date.  Under the this, the dashboard displays the city's temperature in °F, the humidity percentage, windspeed in MPH, and the UV index.  As shown in the photo below, the UV index has a color-gauge. Low UV levels display green, moderate: yellow, mid-high: orange, high: red, and severe: purple.

![Scheduler-Date Photo](/Assets/currentweather.PNG)


A very important feature is that the dashboard stores the weather data even after the user refreshes.

![Scheduler-Date Photo](/Assets/storage.PNG)

You can also click the stored cities and be taken back to that city's weather information. The hover animation creates a change from white to gray to indicate the mouseover. The cursor also changes to a fingerclick cursor.
``` CSS
li:hover {
    background-color: lightgray;
    cursor:pointer;
});
```

![Scheduler-Date Photo](/Assets/hover.PNG)

The dashboard is also able to display not only the current weather of a city, but also that city's 5-day forecast.  In the forecast, the user can view the dates, a weather icon, and the temperature and humidity for those five days.

![Scheduler-Date Photo](/Assets/forecast.PNG)

### Link to the deployed app
[Weather Dashboard App](https://kairora.github.io/weather-dashboard/)

### Link to my GitHub Repo
[My GitHub Repo](https://github.com/kairora/weather-dashboard)
