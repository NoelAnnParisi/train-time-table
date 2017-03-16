var config = {
    apiKey: "AIzaSyBEDvLJv4xyHrV4p4nZz9onZWhNi12pERU",
    authDomain: "train-times-421d2.firebaseapp.com",
    databaseURL: "https://train-times-421d2.firebaseio.com",
    storageBucket: "train-times-421d2.appspot.com",
    messagingSenderId: "173621060607"
};

firebase.initializeApp(config);

const dbRefObject = firebase.database().ref().child('train');

$('#submit').on('click', function(event) {

    event.preventDefault();

    const trainName = $('#train-name').val().trim();
    const destination = $('#destination').val().trim(); 
    const firstDeparture = moment($('#first-departure-time').val().trim(), "HH:mm").subtract(1, "years").format('HH:mm');
    const frequency = parseInt($('#frequency').val().trim());

    const train = {
        name: trainName,
        destination: destination,
        frequency: frequency,
        firstDeparture: firstDeparture
    };

    dbRefObject.push(train);
});


dbRefObject.on("child_added", snap => {

    const now = moment();
    const diffTime = now.diff(moment(snap.val().firstDeparture, "HH:mm"), "minutes");
    const tRemainder = diffTime % snap.val().frequency;
    const minutesAway = snap.val().frequency - tRemainder;
    const nextTrain = now.add(minutesAway, "minutes").format("hh:mm");

    const $trainName = $("<td>", { 'class': 'train-name', text: snap.val().name });
    const $destination = $("<td>", { 'class': 'destination', text: snap.val().destination });
    const $frequency = $("<td>", { 'class': 'frequency', text: snap.val().frequency });
    const $nextArrival = $("<td>", { 'class': 'next-arrival', text: nextTrain });
    const $minutesAway = $("<td>", { 'class': 'minutes-away', text: minutesAway });

    const $newRow = $('<tr>').append($trainName, $destination, $frequency, $nextArrival, $minutesAway);

    $('tbody').append($newRow);
});
