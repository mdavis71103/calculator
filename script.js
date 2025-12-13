/* Script */

//declaring elements
let hx = "0"
let curr = []


//declaring buttons and Displays

const historyDisplay = document.querySelector("#historyDiv p");
const currentDisplay = document.querySelector("#currentDiv p");
const buttons = document.querySelectorAll("button");

//Assign Event Listeners to Buttons
buttons.forEach((button) => {

    if(button.className === "num"){
        button.addEventListener("click", function() {
            let func = button.textContent;
            if (curr.length === 0 || 
                (!Number.isFinite(Number(curr[curr.length-1])) &&
                !curr.at(-1).at(-1) === "(")
            ) {
                curr.push(func);
            } else {
                let num = curr.pop();
                num += func;
                curr.push(num);
            }
            displayCurr();
        })
    } else if (button.className === "operator") {
        button.addEventListener("click", function(){
            let func = button.textContent;
            if (curr.length === 0) {
                alert("invalid format used")
            } else {
                curr.push(func);
            }
            displayCurr();
        })
    } else if(button.className === "mod") {
        button.addEventListener("click", function(){
            switch (button.textContent) {
                case "C": 
                    curr = [];
                    currentDisplay.textContent = "0";
                    hx = "0";
                    historyDisplay.textContent = hx;
                    break;

                case "()":
                    //If first (
                    //If after opening (

                    //If no operator before x(
                    // ( = 0 or ( = )
                    //If after number and opening )
                    //( > )

                    if (curr.length === 0) {
                        curr.push("(");
                    } else {
                        if(curr.at(-1).at(-1) === "(") {
                        //Needs to check last char in last array position
                            curr[curr.length-1] += "(";
                        }else {
                            const open = countOccurances(curr, "(");
                            const close = countOccurances(curr, ")");
                            if(open > close){
                                curr[curr.length-1] += ")";
                            }
                            else {
                                curr.push("x");
                                curr.push("(")
                            }
                        }
                    }
                    displayCurr();
                    break;

                case "%":

                case "+/-":

                case ".":

                case "=":
                    hx = curr.join(" ")
                    historyDisplay.textContent = hx;
                    curr = calculate(curr)
                    displayCurr();
                default: 
                    console.log(button.textContent);
            }   
        });
    };
})

function displayCurr(){
    let display = curr.join(" ");
    currentDisplay.textContent = display;
}

function calculate(arr){
    //Takes arr and returns answer

    while (arr.length > 1){
        arr = nextInOrder(arr)
    }

    return arr;
}

function nextInOrder(arr) {
    //Takes an array and does the next step in order of operations.

    let total = 0

    
    //Multiplication and Division
    let index = arr.findIndex(op => op === "÷" || op === "x")
    if(index != -1) {
        
        let next = arr.slice(index -1, index + 2)
        console.log(next[1])
        if(next[1] === "x"){
            total = next[0]*next[2]
        }else if (next[1] === "÷"){
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

function countOccurances(arr, char){
    
    let total = 0

    arr.forEach(e => {
        let arr = e.split(char)
        total += (arr.length - 1)
    })

    return total;
}