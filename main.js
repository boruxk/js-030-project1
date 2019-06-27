var textarea = document.querySelector('textarea');

//dynamic textarea
function dynTextArea() {
    textarea.addEventListener('keydown', autosize);
    textarea.addEventListener('change', autosize);
    textarea.addEventListener('cut', autosize);
    textarea.addEventListener('paste', autosize);
    textarea.addEventListener('drop', autosize);
    function autosize() {
        var el = this;
        setTimeout(function () {
            el.style.cssText = 'height:auto;';
            el.style.cssText = 'height:' + (el.scrollHeight+3) + 'px';
        }, 0);
    }
}
dynTextArea();

//buttons
document.getElementById("btn-save").addEventListener("click", save);
document.getElementById("btn-reset").addEventListener("click", function () { 
    textarea.value = ""; 
    date.value = ""; 
    time.value = "";
    document.getElementById("date").style.border = "2px solid #1705d3";
    document.getElementById("new-note").style.border = "2px solid #1705d3"; 
});

//reset required onclick
document.getElementById("date").onclick = function () {
    document.getElementById("date").style.border = "2px solid #1705d3";
};
document.getElementById("new-note").onclick = function () {
    document.getElementById("new-note").style.border = "2px solid #1705d3";
};

// ***save note***
function save() {
    //set date with format
    var date = document.getElementById("date");
    var dateFormated = new Date(date.value);
    var month = dateFormated.getMonth() + 1;
    var day = dateFormated.getDate();
    var year = dateFormated.getFullYear();
    dateFormated.value = day + "/" + month + "/" + year;

    //set time
    var time = document.getElementById("time");

    //test required
    if (textarea.value == "" || date.value == "") {

        //required allert popup
        function tempAlert(msg, duration) {
            var el = document.createElement("div");
            el.setAttribute("style", "position:absolute;top:20%;left:42%;background-color:white; border:2px solid #ff3333; padding: 20px; border-radius: 5px; font-size:20px;");
            el.innerHTML = msg;
            setTimeout(function () {
                el.parentNode.removeChild(el);
            }, duration);
            document.body.appendChild(el);
        }

        //required notifictions
        if (date.value == "" && textarea.value == "") {
            document.getElementById("new-note").style.border = "3px solid #ff3333"; 
            document.getElementById("date").style.border = "2px solid #ff3333"; 
            tempAlert("Date and Textarea are required", 2000);
        } else if (date.value == "") {
            document.getElementById("date").style.border = "2px solid #ff3333";
            tempAlert("Date is required", 2000);
        } else if (textarea.value == "") {
            document.getElementById("new-note").style.border = "3px solid #ff3333"; 
            tempAlert("Textarea is required", 2000);
        }
    } else {

        //set localStorage.key
        if (localStorage.clickcount) {
            localStorage.clickcount = Number(localStorage.clickcount) + 1;
        } else {
            localStorage.clickcount = 1;
        }

        //set note
        localStorage.setItem(localStorage.clickcount, textarea.value);
        localStorage.setItem(localStorage.clickcount + "d", dateFormated.value);
        localStorage.setItem(localStorage.clickcount + "t", time.value);
        read(localStorage.clickcount);

        //reset after save
        textarea.value = "";
        date.value = "";
        time.value = "";
        document.getElementById("new-note").style.height = "135px";
    }
}

//***add note to screen***
function read(i) {
    var x = localStorage.getItem(i);
    var d = localStorage.getItem(i + "d");
    var t = localStorage.getItem(i + "t");
    var note = document.createElement("div");
    note.innerHTML = "<div class='note fadeIn' id='note" + i + "'><span class='fas fa-trash-alt' id='trash" + i + "'></span><div>" + x + "</div>" + "<div class ='dField' id='" + i + "d'><div>" + d + "<br>" + t + "</div></div>" + "</div>";
    document.getElementById("notes").appendChild(note);
    
    //invisible fading-in bin
    var binStyle = document.getElementById("trash" + i);
    document.getElementById("note" + i).addEventListener("mouseenter", function () {
        binStyle.style.visibility = 'visible';
        binStyle.className = 'fas fa-trash-alt fadeIn';
    });
    document.getElementById("note" + i).addEventListener("mouseleave", function () {
        binStyle.style.visibility = 'hidden';
        binStyle.className = 'fas fa-trash-alt';
    });
    document.getElementById("trash" + i).style.cursor = "pointer"; 

    //***remove note***
    if (document.getElementById("note" + i) != null) {
        document.getElementById("trash" + i).addEventListener("click", function () {
            var j = this.id.substring(5, 8);
            localStorage.removeItem(j);
            localStorage.removeItem(j + "d");
            localStorage.removeItem(j + "t");
            document.getElementById("note" + j).remove();
        });
    }
}

//***initial screen or reloaded screen***
function readAll() {
    var keys = Object.keys(localStorage);
    for (a = 0; a < keys.length; a++) {
        if (keys[a] !== "clickcount" && keys[a].includes("d") === false && keys[a].includes("t") === false){
            read(keys[a]);
        }
    }
}
readAll();
