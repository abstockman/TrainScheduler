// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBLT_DJybpJUqPEdvHjbW9qO-qXwstD8OE",
    authDomain: "train-scheduler-dcaae.firebaseapp.com",
    databaseURL: "https://train-scheduler-dcaae.firebaseio.com",
    projectId: "train-scheduler-dcaae",
    storageBucket: "train-scheduler-dcaae.appspot.com",
    messagingSenderId: "786481996886"
  };
  firebase.initializeApp(config);
      console.log(moment().format("HH:mm"));

  // CREATE VARIABLE TO REF DATABASE
  var database = firebase.database();

  // INTIAL VARIABLES
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;
  var nextArrival = "";



  // CAPTURE BUTTON CLICK
  $("#submit").on("click", function(event) {
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    frequency = $("#frequency").val().trim();


    var json = {
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref("/trains").push(json);

  });

  // Firebase watcher + initial loader. This function fires on page load and when an object is added to the database
  database.ref("/trains").on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().frequency);

    var timeFormat = "HH:mm";
    var convertedTime = moment(childSnapshot.val().firstTrainTime, timeFormat);
    nextArrival = moment(convertedTime).diff(moment(), "mimutes");
    var minutesAway = nextArrival * childSnapshot.val().frequency;

    $("#table-body").append("<tr>" + "<td>" + childSnapshot.val().trainName + "</td>" + "<td>" + childSnapshot.val().destination + "</td>" + "<td>" + childSnapshot.val().frequency + "</td>" + "<td>" + nextArrival + "</td>" + "<td>" + childSnapshot.val().frequency + "</td>" + "<td>" + minutesAway + "</td>" + "</tr>");

  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
