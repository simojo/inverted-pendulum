let l = 1;                               // m
let g = 9.81;                            // m/s
let thetaDesired = 0;                    // rad
let theta = Math.random() * 2 * Math.PI; // rad, clockwise [0, 2pi)
let thetaDot = 0;                        // rad/s
let thetaDotDot = 0;                     // rad/s/s

// PID values
let P = -9.81 / 4;
let I = -2;
let D = 0;

let errorsLength = 100;
let errors = Array(errorsLength).fill(0);
let errorsIndex = 0;

Number.prototype.mod = function (n) {
  "use strict";
  return ((this % n) + n) % n;
};

let controlLoopPeriodMs = 10;
let controlLoop = () => {};
window.onload = () => {
  main();
  // begin control loop at constant frequency
  controlLoop = setInterval(() => {
    input();
    gravity();
  }, controlLoopPeriodMs);
};

window.onclose = () => {
  // stop running the loop
  clearInterval(controlLoop);
};

function main() {
  let container0 = document.createElement("div");
  container0.id = "container0";

  let container1 = document.createElement("div");
  container1.id = "container1";

  let pendulum = document.createElement("div");
  pendulum.appendChild(document.createElement("div"));
  pendulum.appendChild(document.createElement("div"));
  pendulum.id = "pendulum";

  container1.appendChild(pendulum);
  container0.appendChild(container1);
  document.body.appendChild(container0);
}

function input() {
  let currentError = (Math.PI - theta) - thetaDesired;
  errors[errorsIndex] = currentError;
  let proportional = P * currentError;
  let integral = I * errors.reduce((acc, current) => acc + current * (controlLoopPeriodMs / 1000), 0);
  let derivative = D * (errors[errorsIndex] - errors[(errorsIndex + 1).mod(errorsLength)]) / (errorsLength * controlLoopPeriodMs / 1000);
  thetaDotDot = proportional + integral + derivative;
  errorsIndex = (errorsIndex + 1).mod(errorsLength);
}

function gravity() {
  let pendulum = document.getElementById("pendulum");

  thetaDotDot += g / l * Math.sin(Math.PI - theta);
  thetaDot = thetaDot + (thetaDotDot * controlLoopPeriodMs / 1000);
  theta = (theta + (thetaDot * controlLoopPeriodMs / 1000)).mod(2 * Math.PI);

  pendulum.style.transform = `rotate(${theta}rad)`;
}
