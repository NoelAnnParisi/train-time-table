var config = {
    apiKey: "AIzaSyBEDvLJv4xyHrV4p4nZz9onZWhNi12pERU",
    authDomain: "train-times-421d2.firebaseapp.com",
    databaseURL: "https://train-times-421d2.firebaseio.com",
    storageBucket: "train-times-421d2.appspot.com",
    messagingSenderId: "173621060607"
};

firebase.initializeApp(config);

const train = {
    name: "Polar Express", // name that train!
    destination: "LA", // where to??
    frequency: "", //minutes between trains
    nextArrival: "", // military time & figure this out 
    minutesAway: "" // minutes away  
};
const dbRefObject = firebase.database().ref();

// get element
dbRefObject.on("value", snap => {
	;
});

$('#submit').on('click', function(event) {

    event.preventDefault();

    const firstDeparture = moment($('#first-departure-time').val().trim(), "HH:mm"); //hh:mm
    const frequency = parseInt($('#frequency').val().trim());
    const nextTrain = firstDeparture.add(frequency, 'minutes');
    const minUntilNextTrain = nextTrain.diff(moment(), 'minutes');

    const $trainName = $("<td>",{'class': 'train-name', text: $('#train-name').val().trim() });
    const $destination = $("<td>",{'class': 'destination', text: $('#destination').val().trim() });
    const $frequency = $("<td>",{'class': 'frequency', text: $('#frequency').val().trim()});
    const $nextArrival = $("<td>",{'class': 'next-arrival', text: moment(nextTrain,"HH:mm").format("HH:mm")});
    const $minutesAway = $("<td>",{'class': 'minutes-away', text: (minUntilNextTrain)});
 	
 	const $newRow = $('<tr>').append($trainName, $destination, $frequency, $nextArrival, $minutesAway);
    $('tbody').append($newRow);
})
