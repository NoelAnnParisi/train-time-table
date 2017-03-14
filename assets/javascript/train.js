var config = {
    apiKey: "AIzaSyBEDvLJv4xyHrV4p4nZz9onZWhNi12pERU",
    authDomain: "train-times-421d2.firebaseapp.com",
    databaseURL: "https://train-times-421d2.firebaseio.com",
    storageBucket: "train-times-421d2.appspot.com",
    messagingSenderId: "173621060607"
};

firebase.initializeApp(config);

// When adding trains, administrators should be able to submit the following:
// Train Name
// Destination
// First Train Time -- in military time
// Frequency -- in minutes
// Code this app to calculate when the next train will arrive; this should be relative to the current time.
// Users from many different machines must be able to view same train times.
// Styling and theme are completely up to you. Get Creative!

//<td class="train-name"> this is train name</td>
//<td class="destination">Where to?</td>
//<td class="departure">When are we leaving?</td>
//<td class="frequency">How often?</td>

const train = {
    name: "Polar Express",
    destination: "LA",
    firstTrainTime: moment(), // military time
    frequency: 3 //minutes
};

// get element
let nameElement = $('.train-name').text();
let destinationElement = $('.destination').text();
let departureElement = $('.departure').text();
let frequencyElement = $('.frequency').text();

