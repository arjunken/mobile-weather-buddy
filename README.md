# Mobile Weather Buddy

A simple Javascript and PHP based weather app using OpenWeatherMap APIs

The app was built as part of my experimentation with Modern JavaScript ans using APIs. It makes API calls through a back-end script written in PHP which is being used as a middleware. If you are learning Javascript and basics of consuming APIs, this project could be a great start. Fork it or clone it to get started. You can also improve this app further. Maybe a great place to practice your GitHub skills.

## Tech Stack

_Front-end_: of course HTML5, CSS (Wrapped in Bootstrap 5), JQuery and Modern Javascript. For experimentation, I have also included Date-Fns javascript library.

_Back-end_: I am hosting this app on shared hosting server where only PHP scripting is supported. So, I had no options than using PHP script for API calls. I intentionally avoided keeping sensitive information on the client-side. So, in the back-end, it is a MySQL, PHP and Apache.

_API Data_: A free account with OpenWeatherMap API. Apps pulls out data based on your location.

##Features Nothing fancy. It is still a basic app. You may still call it as a crap:). I want you to use it as a base in your projects. -Select the Home City of your choice to start with. The app keeps this as fall back option but displays Weather data based on your current location if you chose to allow the app to access yoour location. Make sure to click on allow when browsers pops up an alert. -It displays: -Current Weather Conditions -Hourly Weather Conditions -Daily Temperatures -You can reset your home location -You can view temperatures in celcius and fahrenheit -You can view distance in metric and imperial systems

## How to install

1. First clone this repository to your local directory by running the below command using Git.

```bash
git clone https://github.com/arjunken/City-Weather-App.git
```

2. Change the directory

```bash
cd City-Weather-App
```

3. Run node package manager command to install dependencies.

```bash
npm install
```

4. Rename config file from `config_example.php` to `config.php`

5. Visit [Accuweather API](https://developer.accuweather.com/apis) and create an account to get your API KEY. Once you sign in your account, you will have to _Add a Project_ to get your API KEY.

6. Open up config.php in your favorite code editor and replace the key string with your key.

7. Now run the below command to build your app.

```bash
npm run build
```

8. All the build files are moved to a `dist` folder. Start your local PHP supported server such as Xampp, Wamp, Lamp or Mamp. I used Xampp. `Visit http://localhost:[port]/[path to the folder] to view the app.

#### Here is the link to [Demo version](https://arjunken.com/projects/cwa/)

![App Screenshot](https://arjunken.com/wp-content/uploads/2022/01/cwa-e1641798430269.png)
