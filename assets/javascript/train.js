var config = {
    apiKey: "AIzaSyBEDvLJv4xyHrV4p4nZz9onZWhNi12pERU",
    authDomain: "train-times-421d2.firebaseapp.com",
    databaseURL: "https://train-times-421d2.firebaseio.com",
    storageBucket: "train-times-421d2.appspot.com",
    messagingSenderId: "173621060607"
};

firebase.initializeApp(config);
// initialize database object 
const dbRefObject = firebase.database().ref().child('train');
// when the submit button is clicked capture train values and create object to push to firebase
$('#submit').on('click', function(event) {

    event.preventDefault();
    // initialize user's input as variables
    const trainName = $('#train-name').val().trim();
    const destination = $('#destination').val().trim();
    const firstDeparture = moment($('#first-departure-time').val().trim(), "HH:mm").subtract(1, "years").format('HH:mm');
    const frequency = parseInt($('#frequency').val().trim());
    // object to be pushed to firebase
    const train = {
        name: trainName,
        destination: destination,
        frequency: frequency,
        firstDeparture: firstDeparture
    };
    // push this data to firebase please!
    dbRefObject.push(train);
});

// when a child is added populate that informarion to the DOM
dbRefObject.on("child_added", snap => {
    // using moment.js calculate the next train time and minutes away
    const now = moment();
    const diffTime = now.diff(moment(snap.val().firstDeparture, "HH:mm"), "minutes");
    const tRemainder = diffTime % snap.val().frequency;
    const minutesAway = snap.val().frequency - tRemainder;
    const nextTrain = now.add(minutesAway, "minutes").format("hh:mm");
    // create DOM elements with jQuery 
    const $trainName = $("<td>", { 'class': 'train-name', text: snap.val().name });
    const $destination = $("<td>", { 'class': 'destination', text: snap.val().destination });
    const $frequency = $("<td>", { 'class': 'frequency', text: snap.val().frequency });
    const $nextArrival = $("<td>", { 'class': 'next-arrival', text: nextTrain });
    const $minutesAway = $("<td>", { 'class': 'minutes-away', text: minutesAway });
    // create a new row each time a user adds train information 
    const $newRow = $('<tr>', { id: snap.key }).append($trainName, $destination, $frequency, $nextArrival, $minutesAway);
    // append that information to the body of the table
    $('tbody').append($newRow);

    // update each minute and next arrival of train 
    const arrivalInterval = setInterval(() => {
        const now = moment();
        const diffTime = now.diff(moment(snap.val().firstDeparture, "HH:mm"), "minutes");
        const tRemainder = diffTime % snap.val().frequency;
        const minutesAway = snap.val().frequency - tRemainder;
        const nextTrain = now.add(minutesAway, "minutes").format("hh:mm");
        $('#' + snap.key + "> td.minutes-away").text(parseInt(minutesAway));
        $('#' + snap.key + "> td.next-arrival").text(nextTrain);
        console.log("this is running!");
    }, 60000);
});
