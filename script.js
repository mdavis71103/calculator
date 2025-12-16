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
                curr.at(-1).at(0) != "(")
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
                    //Decides when to use ( or )
                    if (curr.length === 0) {
                        curr.push("(");
                    } else {
                        if(curr.at(-1).at(-1) === "(") {
                            curr[curr.length-1] += "(";
                        }else if (!Number.isFinite(Number(curr.at(-1))) &&
                             curr.at(-1).at(-1) != ")") {
                                 curr.push("x");
                                 curr.push("(");
                        }else {
                            const open = countOccurances(curr, "(");
                            const close = countOccurances(curr, ")");
                            if(open > close){
                                curr[curr.length-1] += ")";
                            } else {
                                curr.push("x");
                                curr.push("(");
                            }
                        }
                    }
                    displayCurr();
                    break;

                case "%":

                case "+/-":

                case ".":
                    // if (){

                    // }else if(curr === "0") {
                    //     curr = "0."
                    // } else {
                    //     curr += func;
                    // }
                    // currentDisplay.textContent = curr;
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

    //Seperate multiple parentheses without altering display
    for(let i = 0; i < arr.length; i++){
        let e = arr[i];
         if(e.includes("((")) {
             e = e.replace("((", "( (").split(" ");
             arr.splice(i, 1, ...e);
         } else if (e.includes("))")) {
             e = e.replace("))", ") )").split(" ");
             arr.splice(i, 1, ...e);
         }
    }

    //Calculates one step at a time to ensure Order is followed
    while (arr.length > 1){
        arr = nextInOrder(arr)
    }

    return arr;
}

function nextInOrder(arr) {
    //Takes an array and does the next step in order of operations.

    let total = 0

    //Parentheses
    //find innermost set in parentheses and send it back throguh this function

    let index = arr.findIndex(op => op.toString().at(0) ==="(") 
    if (index != -1){ 
        parentheses(arr, index);
        return arr;
    }
    
    //Multiplication and Division
    index = arr.findIndex(op => op === "÷" || op === "x")
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
        let splitArr = e.toString().split(char)
        total += (splitArr.length - 1)
    })

    return total;
}

function parentheses(arr, index){

   
        let end = 0;
        while(end === 0){
            for(let i = index + 1; i < arr.length; i++){
                if(arr[i].at(0) === "("){
                    parentheses(arr, i)
                }else if(arr[i].at(-1) === ")") {
                    end = i;
                    break;
                }
            }
            if(end === 0 ){arr.push(")")};
        }
        let nextArr = arr.slice(index, end + 1);
        let nextArrEnd = nextArr.length - 1;

        //Remove paraentheses and blank elements
        nextArr[0] = nextArr[0].replace("(", "");
        nextArr[nextArrEnd] = nextArr[nextArrEnd].replace(")", "");
        nextArr = nextArr.filter(e => e != "");

        //Run until one number remains
        while(nextArr.length > 1){
            nextArr = nextInOrder(nextArr);
        }

        arr.splice(index, (end - index)+1, nextArr[0].toString());
        return arr;
}