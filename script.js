const firebaseRef = firebase.database();
let tokenNumber = 0;

document.querySelector("button.submitButton").addEventListener("click", () => {
  firebaseRef.ref().once('value', function(snapshot) {
    if (snapshot.toJSON().tokens) {
      tokenData = snapshot.toJSON().tokens;
      tokenProperties = Object.keys(tokenData);
      for (var i = 0; i < tokenProperties.length  ; i++) {
        let existingToken = Number(tokenProperties[i]);
        if (existingToken > tokenNumber) {
          tokenNumber = existingToken;
        }
      }
    }
    const selectRef = document.querySelector("select.issues");
    const issueSubmitted = selectRef.options[selectRef.selectedIndex].text;
    tokenNumber++;
    if (tokenNumber >= 0 && tokenNumber <= 999) {
      tokenNumber = ("000" + tokenNumber).substr(-3);
    }

    firebaseRef.ref("tokens/" + tokenNumber).set({
      token: tokenNumber,
      issue: issueSubmitted,
      pending: true
    });
    console.log("Data submitted: \nToken Number: " + tokenNumber + "\nIssue: " + issueSubmitted);
    document.getElementsByClassName("submitText")[0].style.display = "block";
    setTimeout(() => {
      document.getElementsByClassName("submitText")[0].style.display = "none";
    }, 6000);
  });
});
