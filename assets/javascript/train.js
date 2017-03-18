// remove icon <i class="fa fa-times" aria-hidden="true"></i>
// pencil icon  <i class="fa fa-pencil" aria-hidden="true"></i>
// save icon  <i class="fa fa-check" aria-hidden="true"></i>

var config = {
    apiKey: "AIzaSyBEDvLJv4xyHrV4p4nZz9onZWhNi12pERU",
    authDomain: "train-times-421d2.firebaseapp.com",
    databaseURL: "https://train-times-421d2.firebaseio.com",
    storageBucket: "train-times-421d2.appspot.com",
    messagingSenderId: "173621060607"
};

firebase.initializeApp(config);
// initialize database object 
const rootRef = firebase.database().ref();
const dbRefObject = rootRef.child('train');

const meridiem = time => {
    const timeArr = time.split(':');
    if (parseInt(timeArr[0]) >= 12) {
        return String(timeArr[0] - 12) + ':' + timeArr[1] + ' pm';
    } else {
        return time + ' am';
    }
};

// when the submit button is clicked capture train values and create object to push to firebase
$('#submit').on('click', function(event) {

    event.preventDefault();
    // initialize user's input as variables
    const trainName = $('#train-name').val().trim();
    const destination = $('#destination').val().trim();
    const firstDeparture = moment($('#first-departure-time').val().trim(), "HH:mm").subtract(1, "years").format('HH:mm');
    const frequency = parseInt($('#frequency').val().trim());

    const now = moment();
    const diffTime = now.diff(moment(firstDeparture, "HH:mm"), "minutes");
    const tRemainder = diffTime % frequency;
    const minutesAway = frequency - tRemainder;
    const nextTrain = now.add(minutesAway, "minutes").format("HH:mm");
    // object to be pushed to firebase
    const train = {
        name: trainName,
        destination: destination,
        frequency: frequency,
        firstDeparture: firstDeparture,
        nextTrain: nextTrain,
        minutesAway: minutesAway
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
    // create DOM elements with jQuery 
    const $trainName = $("<td>", { 'class': 'train-name editable', text: snap.val().name });
    const $destination = $("<td>", { 'class': 'destination editable', text: snap.val().destination });
    const $frequency = $("<td>", { 'class': 'frequency editable', text: snap.val().frequency });
    const $nextArrival = $("<td>", { 'class': 'next-arrival editable', text: meridiem(snap.val().nextTrain, 'hh:mm') });
    const $minutesAway = $("<td>", { 'class': 'minutes-away', text: minutesAway });
    const $iconEdit = $('<td>', { 'class': 'update' }).html('<i class="fa fa-pencil" aria-hidden="true"></i>');
    const $iconRemove = $('<td>', { 'class': 'remove' }).html('<i class="fa fa-times" aria-hidden="true"></i>');
    // create a new row each time a user adds train information 
    const $newRow = $('<tr>', { id: snap.key }).append($trainName, $destination, $frequency, $nextArrival, $minutesAway, $iconEdit, $iconRemove);
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
    }, 60000);

    $('.minutes-away').html(Math.abs(snap.val().minutesAway - 1));
});

$('table').on('click', '.fa-pencil', event => {
    //replace the edit icon with the save icon
    const $this = $(event.target);
    console.log("event target: " + $this);
    const $row = $this.closest('tr');
    console.log("This is the row: " + $row);
    const rowId = $row.attr('id');
    console.log("This is the row id: " + rowId);


    $row.find('.editable').each((idx, elem) => {
        console.log(elem);
        const $cell = $(elem);
        if ($cell.hasClass('train-name')) {
            $cell.html($('<input>', { id: "name", 'class': 'edit', type: 'text', value: $cell.text(), required: 'true' }));
        } else if ($cell.hasClass('destination')) {
            $cell.html($('<input>', { id: "destination", 'class': 'edit', type: 'text', value: $cell.text(), required: 'true' }));
        } else if ($cell.hasClass('frequency')) {
            $cell.html($('<input>', { id: "frequency", 'class': 'edit', type: 'number', min: '1', value: $cell.text(), required: 'true' }));
        } else if ($cell.hasClass('next-arrival')) {
            $cell.html($('<input>', { id: "next-arrival", 'class': 'edit', type: 'text', value: $cell.text(), pattern: '[0-9]{2}:[0-6]{2}', required: 'true' }));
        }
    });

    $($this).replaceWith($('<i class="fa fa-check" aria-hidden="true"></i>'));

    // now to save the edited data
    $('.fa-check').on('click', event => {

        const _this = $(event.target);
        const name = $('#name').val();
        const destination = $('#destination').val();
        const frequency = $('#frequency').val();
        const nextArrival = moment($('#next-arrival').val(), 'HH:mm').add(12, 'hours').format('HH:mm');
        console.log(nextArrival);

        const updates = {};
        const entry = {
            name: name,
            destination: destination,
            frequency: frequency,
            nextTrain: nextArrival,
        };
        updates[rowId] = entry;
        _this.replaceWith($('<i>', { 'class': 'fa fa-pencil', 'aria-hidden': 'true' }));
        const updateKey = dbRefObject.child(rowId);
        updateKey.update(entry);

    });
});

dbRefObject.on('child_changed', snap => {

    const entryId = snap.key;
    const $row = $('#' + entryId);
    const now = moment();
    const newArrivalTime = moment(snap.val().nextTrain, "HH:mm");
    const minutesAway = moment(now, 'HH:mm').diff(moment(newArrivalTime, 'HH:mm'), "minutes");
    console.log(Math.abs(minutesAway));
    // const nextTrain = now.add(minutesAway, "minutes").format("hh:mm");

    const updates = {};
    const entry = {
        minutesAway: minutesAway
    };

    console.log(entry);

    updates[entryId] = entry;
    const updateKey = dbRefObject.child(entryId);
    updateKey.update(entry);

    console.log(snap.val().minutesAway);

    $('.minutes-away').replaceWith(Math.abs(snap.val().minutesAway - 1));

    $row.find('.editable input').each((idx, elem) => {
        const $input = $(elem);
        console.log($input);
        if ($input.attr('id') === "name") {
            $input.replaceWith(snap.val().name);
        } else if ($input.attr('id') === 'destination') {
            $input.replaceWith(snap.val().destination);
        } else if ($input.attr('id') === 'frequency') {
            $input.replaceWith(snap.val().frequency);
        } else if ($input.attr('id') === 'next-arrival') {
            $input.replaceWith(meridiem(snap.val().nextTrain));
        }
    });
});
