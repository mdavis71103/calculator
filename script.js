/* Script */

//declaring elements
let hx = "0"
let curr = "0"

//declaring buttons and Displays

const historyDisplay = document.querySelector("#historyDiv p");
const currentDisplay = document.querySelector("#currentDiv p");
const buttons = document.querySelectorAll("button");

//Assign Event Listeners to Buttons
buttons.forEach((button) => {

    if(button.className === "num"){
        button.addEventListener("click", function() {
            let func = button.textContent;
            if (curr === "0") {
                curr = func
            } else {
                curr += func;
            }
            currentDisplay.textContent = curr;
        })
    } else if (button.className === "operator") {
        button.addEventListener("click", function(){
            let func = button.textContent;
            if (curr === "0") {
                alert("invalid format used")
            } else {
                curr += ` ${func} `;
            }
            currentDisplay.textContent = curr;

            //unsure if I'll need to use the switch function
            // switch(button.textContent) {
            //     case "&divide;": 
            //     case "x":
            //     case "-":
            //     case "+":
            // }
        })
    } else if(button.className === "mod") {
        button.addEventListener("click", function(){
            switch (button.textContent) {
                case "C": 
                    curr = "0";
                    currentDisplay.textContent = curr;
                    hx = "0";
                    historyDisplay.textContent = hx;
                    break;

                case "()":

                case "%":

                case "+/-":

                case ".":

                case "=":
                    hx = curr
                    historyDisplay.textContent = curr;
                    curr = calculate(curr)
                    currentDisplay.textContent = curr;
                default: 
                    console.log(button.textContent);
            }   
        });
    };
})

function calculate(equation){
    //Takes string and returns answer
    console.log(equation);

    arr = equation.split(" ")

    while (arr.length > 1){
        arr = nextInOrder(arr)
    }

    return arr;
}

function nextInOrder(arr) {
    //Takes an array and does the next step in order of operations.

    let total = 0

    
    //Multiplication and Division
    let index = arr.findIndex(op => op === "&divide;" || op === "x")
    if(index != -1) {
        
        let next = arr.slice(index -1, index + 2)

        if(next[1] === "x"){
            total = next[0]*next[2]
        }else if (next[1] === "&divide;"){
            total = next[0]/next[2]
        } else alert(`There has been an issue with ${next[1]}`)
        
        arr.splice(index - 1, 3, total);
        return arr;
    }

    //Addition and Subtraction
    index = arr.findIndex(op => op === "+" || op === "-")
    if(index != -1) {
        
        let next = arr.slice(index -1, index + 2)

        if(next[1] === "+"){
            total = Number(next[0])+Number(next[2])
        }else if (next[1] === "-"){
            total = next[0]-next[2]
        } else alert(`There has been an issue with ${next[1]}`)
        
        arr.splice(index - 1, 3, total);
        return arr;
    }

}