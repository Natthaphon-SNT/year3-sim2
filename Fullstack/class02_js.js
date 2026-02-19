
const constVariable = 30;

function testScope1() {
let letVariable = 10;
var varVariable = 10;
    {
        let letVariable = 20;
        var varVariable = 20;
        alert(varVariable)
    }
    alert(varVariable)
};


//testScope1();


//Assignment + Operators
let operator1 = 10;
let operator2 = 20;
// operator2 = 30;

let greetingMessage = "Hello";
let operator3 = "30";

//this will concenate the values as strings
//alert(operator1 + operator3); //1030
// if (operator2 === operator3) {
//     alert("Equal");
// } else {
//     alert("Not Equal");
// }


function greeting(Message) {
    alert(Message);
}

function sum() {
    var op1 = document.getElementById("op1").value;
    var op2 = document.getElementById("op2").value;
    
    var op1Value = parseInt(op1);
    var op2Value = parseInt(op2);

    let resultElement = document.getElementById("result");
    resultElement.innerHTML = op1Value + op2Value;

    return a + b
}
// greeting(greetingMessage);

for (let i = 0; i < 5; i++) {
    alert(i);
}

while (constVariable > 25) {
    alert("Constant is greater than 25");
    break;
}
