const firebaseRef = firebase.database();
let tokenNumber = 0;
let counters = {};
let counterDetails = [];
let tokenData = {};
let tokenProperties = [];
let counterNames = [];

firebaseRef.ref().once("value", function (snapshot) {
    if (snapshot.toJSON().counters) {
        counters = snapshot.toJSON().counters;
        counterDetails = Object.keys(counters);
        counterDetails.forEach((counter) => {
            counterNames.push(counters[counter].name);
        });
        counterNames = counterNames.filter(removeDuplicates);
        let displayIssueButtons = "";
        for (let i = 0; i < counterNames.length; i++) {
            displayIssueButtons += "<button type='button' class='btn block btn-primary' value='" + counterNames[i] + "' onclick='getCounterName(event)'>" + counterNames[i] + "</button>"
        }
        document.querySelector("div.container").style.display = "block";
        document.getElementsByClassName("noTokens")[0].style.display = "none";
        document.querySelector("div.issue-buttons").innerHTML = displayIssueButtons;
    } else {
        document.querySelector("div.container").style.display = "none";
        document.getElementsByClassName("noTokens")[0].style.display = "block";
    }
});

function getCounterName(event) {
    firebaseRef.ref().once("value", function (snapshot) {
            counters = snapshot.toJSON().counters;
            counterDetails = Object.keys(counters);
            counterDetails.forEach((counter) => {
                counterNames.push(counters[counter].name);
            });
            counterNames = counterNames.filter(removeDuplicates);

            for (let i = 0; i < counterNames.length; i++) {
                if (counterNames[i] === event.target.getAttribute("value")) {
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

                    tokenNumber++;
                    if (tokenNumber >= 0 && tokenNumber <= 999) {
                        tokenNumber = ("000" + tokenNumber).substr(-3);
                    }

                    let prefix = "";
                    let name = "";

                    counterDetails.forEach((counter) => {
                        if (counters[counter].name === counterNames[i]) {
                            name = counters[counter].name;
                            prefix = counters[counter].prefix;
                        }
                    });

                    firebaseRef.ref("tokens/" + tokenNumber).set({
                        token: tokenNumber,
                        prefix: prefix,
                        issue: name,
                        pending: true
                    });

                    $("#token").show();
                    var tokenHTML = '<h1 style="color: black">Ashara Mubarak 1441H</h1>' +
                        '<h1 style="color: black">' + name + '</h1>' +
                        '<h3 style="color: black">Token No</h3>' +
                        '<div style="font-size: 90px; color: black" id="tokenNo">' + tokenNumber + '</div>';
                    $("#token").html(tokenHTML);
                    window.print();
                    console.log("Data submitted: \nToken Number: " + tokenNumber + "\nIssue: " + name);
                }
            }
            setTimeout(() => {
                document.getElementsByClassName("submitText")[0].style.display = "none";
                $("#token").hide();
            }, 0);
    });
}

function removeDuplicates(value, index, self) {
    return self.indexOf(value) === index;
}



