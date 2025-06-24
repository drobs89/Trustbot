
function startWizard() {
  const name = document.getElementById('userName').value.trim();
  const state = document.getElementById('userState').value.trim();
  if (name) localStorage.setItem("trustbot_userName", name);
  if (state) localStorage.setItem("trustbot_userState", state);

  suggestEvolution();
}

function suggestEvolution() {
  const name = localStorage.getItem("trustbot_userName");
  const state = localStorage.getItem("trustbot_userState");
  let msg = `<strong>Hello ${name || "Guest"}</strong><br>`;

  if (state === "Florida") {
    msg += "We see you're in Florida. You may benefit from our <em>Foreclosure Surplus Recovery</em> module.";
  } else if (state) {
    msg += `We can tailor a trust strategy based on ${state} laws.`;
  } else {
    msg += "Start building your trust with our general strategy assistant.";
  }

  document.getElementById("recommendation").innerHTML = msg;
}
