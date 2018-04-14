//firebase
var trainData = new Firebase("https://trainschedule-f1c17.firebaseio.com/");

//triggers button to add trains
$('#submitButton').on('click', function(){
        
        //create user inputs
        var trainName = $('#trainNameInput').val().trim();
        var destination = $('#destinationInput').val().trim();
        var firstTime = moment($('#trainTimeInput').val().trim(), "HH:mm").format("");
        var frequency = $('#frequecyInput').val().trim();

        //creates local holder for train times
	    var newTrains = {
		name: trainName,
		trainDest: destination,
		trainFirst: firstTime,
        trainFreq: frequency,
        
        }

        //upload train data into database
        trainData.push(newTrains);

      

        $('#trainNameInput').val("");
        $('#destinationInput').val("");
        $('#timeInput').val("");
        $('#frequencyInput').val("");

        

});


trainData.on("child_added", function(childSnapshot, prevChildKey){

	var trainName = childSnapshot.val().name;
	var destination = childSnapshot.val().trainDest;
	var firstTime = childSnapshot.val().trainFirst;
	var frequency = childSnapshot.val().trainFreq;

	

	//convert first time (push back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
	// console.log(firstTimeConverted);

	//current time
	var currentTime = moment();
	// console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	//difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	// console.log("DIFFERENCE IN TIME: " + diffTime);

	//time apart (remainder)
	var tRemainder = diffTime % frequency;
	// console.log(tRemainder);

	//minute until train
	var tMinutesTillTrain = frequency - tRemainder;
	// console.log("MINUTES TIL TRAIN: " + tMinutesTillTrain);

	//next train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	var nextTrainConverted = moment(nextTrain).format("hh:mm a");
	// console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

	//add each trains data into the table
	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td>" + nextTrainConverted + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});
