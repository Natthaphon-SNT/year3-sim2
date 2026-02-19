function greeting(Message) {
    alert(Message);
}

function updateName() {
    let cell1 = document.getElementById("cell1").value;
    let cell2 = document.getElementById("cell2").value;
    let cell3 = document.getElementById("cell3").value;
    // let cell4 = document.getElementById("cell4").value;

    let cell1Value = parseInt(cell1);
    let cell2Value = parseInt(cell2);
    let cell3Value = parseInt(cell3);
    // let cell4Value = parseInt(cell4);

    let row = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");

    td1.innerHTML = cell1Value;
    td2.innerHTML = cell2Value;
    td3.innerHTML = cell3Value;

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.onclick = function() {
        table.removeChild(row);
    };
    td4.appendChild(deleteBtn);

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);

    if (!cell1 || !cell2 || !cell3) {
        alert("Please fill in all fields");
        return;
    }

    let table = document.getElementById("t2");
    table.appendChild(row);
}