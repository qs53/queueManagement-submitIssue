const firebaseRef = firebase.database();
let tokenNumber = 1000;
let counters = {};
let counterDetails = [];
let tokenData = {};
let tokenProperties = [];

firebaseRef.ref().once("value", function (snapshot) {
    counters = snapshot.toJSON().counters;
    counterDetails = Object.keys(counters);
    let displayIssueButtons = "";
    for (let i = 0; i < counterDetails.length; i++) {
        displayIssueButtons += "<button type='button' class='btn btn-primary btn-lg btn-block my-btn' value='" + counters[counterDetails[i]].name + "' onclick='getCounterName(event)'>" + counters[counterDetails[i]].name + "</button>"
    }
    document.querySelector("div.issue-buttons").innerHTML = displayIssueButtons;
});

function getCounterName(event) {
    firebaseRef.ref().once("value", function (snapshot) {
        counters = snapshot.toJSON().counters;
        counterDetails = Object.keys(counters);

        for (let i = 0; i < counterDetails.length; i++) {
            if (counters[counterDetails[i]].name === event.target.getAttribute("value")) {
                if (snapshot.toJSON().tokens) {
                    tokenData = snapshot.toJSON().tokens;
                    tokenProperties = Object.keys(tokenData);
                    for (var j = 0; j < tokenProperties.length; j++) {
                        let existingToken = Number(tokenProperties[j]);
                        if (existingToken > tokenNumber) {
                            tokenNumber = existingToken;
                        }
                    }
                }
                console.log(tokenNumber);
                tokenNumber++;
                if (tokenNumber >= 0 && tokenNumber <= 999) {
                    tokenNumber = ("000" + tokenNumber).substr(-3);
                }

                firebaseRef.ref("tokens/" + tokenNumber).set({
                    token: tokenNumber,
                    prefix: counters[counterDetails[i]].prefix,
                    issue: counters[counterDetails[i]].name,
                    pending: true
                });
                console.log("Data submitted: \nToken Number: " + tokenNumber + "\nIssue: " + counters[counterDetails[i]].name);
            }
          document.getElementsByClassName("submitText")[0].style.display = "block";
        }
        setTimeout(() => {
            document.getElementsByClassName("submitText")[0].style.display = "none";
        }, 6000);
    });
}



