/* Script */

//declaring elements
let func, hx, curr, workingNum, operators;

hx = "0";
curr = [];
operators = ["+", "-", "x", "÷", "(", ")"];


//declaring buttons and Displays

const historyDisplay = document.querySelector("#historyDiv p");
const currentDisplay = document.querySelector("#currentDiv p");
const buttons = document.querySelectorAll("button");


//Declaring functions
function addButtonEventListeners(){
    //Assign Event Listeners to Buttons
    buttons.forEach((button) => {

        if(button.className === "num"){
            button.addEventListener("click", function() {
                func = button.textContent;
                addNumber(func);
            })
        } else if (button.className === "operator") {
            button.addEventListener("click", function(){
                func = button.textContent;
                addOperator(func);
            })
        } else if(button.className === "mod") {
            button.addEventListener("click", function(){
                func = button.textContent;
                addModifier(func)
            });
        };
    })
}

function addKeyboardEventListeners(){

}

function addNumber(num){
    let workingNum

    if (curr.length === 0 || 
                    (!Number.isFinite(Number(curr[curr.length-1])) &&
                    curr.at(-1).at(0) != "(")
                ) {
                    curr.push(num);
                } else {
                    workingNum = curr.pop();
                    num += workingNum;
                    curr.push(num);
                }
                displayCurr();
}

function addOperator(){

    if (curr.length === 0 || operators.includes(curr.at(-1))) {
                    alert("invalid format used")
                } else {
                    curr.push(func);
                }
                displayCurr();
}

function addModifier(mod){
    switch (mod) {
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
            workingNum = curr.pop();

            if (workingNum === undefined || 
                workingNum === "0" || 
                operators.includes(workingNum)){
                    curr.push(workingNum)
                    alert("Invalid Format Used")
                    break;
            }else {
                curr.push(workingNum + "%")
            }
            
            displayCurr();
            break;

        case "+/-":

            //Check if element can become negative
            if(operators.includes(curr.at(-1)) || 
            curr.at(-1) === "0" || 
            curr.length === 0) {
                alert("Invalid Function");
                break;
            } 
            
            workingNum = curr.pop();

            //Check if number is negative
            if(workingNum.at(0) === "-"){
                
                curr.push(workingNum.replace("-", ""));
                displayCurr();
                break;
            }

            //Makes last element negative
            curr.push("-" + workingNum);
            displayCurr();
            break;

        case ".":
            workingNum = curr.pop();

            if (workingNum === undefined || workingNum === "0"){
                curr.push("0.")
            } else if(workingNum.at(-1) === ")"){
                curr.push(workingNum)
                alert("Invalid Function")
                break;
            }else if(operators.includes(workingNum)){
                curr.push(workingNum, "0.")
            }else {curr.push(workingNum + ".")}
            
            displayCurr();
            break;

        case "=":
            hx = curr.join(" ")
            historyDisplay.textContent = hx;
            curr = calculate(curr)
            displayCurr();
        default: 
            console.log(button.textContent);
    }
}

function displayCurr(){
    let display;
    
    if(curr.length > 1){display = curr.join(" ");}
    else {display = curr;}
    currentDisplay.textContent = display;
}

function calculate(arr){
    //Takes arr and returns answer
    let total;

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

    //Calculates one step at a time to ensure Order of Operations is followed
    if(!Number.isInteger(arr)){
        while((Array.isArray(arr) && arr.length > 1) || arr.at(-1).at(-1) === "%"){
            arr = nextInOrder(arr);
        }
    }

    total = [];
    total.push((Math.round(arr * 100000) / 100000).toString());
    return total;
}

function nextInOrder(arr) {
    //Takes an array and does the next step in order of operations.
    let index, total, next;

    total = 0

    //Parentheses
    index = arr.findIndex(op => op.toString().at(0) ==="(") 
    if (index != -1){ 
        parentheses(arr, index);
        return arr;
    }

    //percent
    index = arr.findIndex(op => op.toString().at(-1).at(-1) === "%")
    if(index != -1){
        if(arr.length === 1){
            console.log("Percent")
            workingNum = arr.pop();
            workingNum = workingNum.replace("%", "");
            workingNum = workingNum * 0.01;
            arr.push(workingNum.toString());
            return arr;
        }else{
            switch(arr.at(-1)){
                case "+":
                    console.log("Plus");
                    return arr;
                case "-":
                    console.log("Minus");
                    return arr;
                case "x":
                    console.log("Multiply");
                    return arr;
                case "÷":
                    console.log("Divide");
                    return arr;
            }
        }
    }
    
    //Multiplication and Division
    index = arr.findIndex(op => op === "÷" || op === "x")
    if(index != -1) {
        
        next = arr.slice(index -1, index + 2)
        console.log(next[1])
        if(next[1] === "x"){
            total = (next[0]*next[2]).toString();
        }else if (next[1] === "÷"){
            total =(next[0]/next[2]).toString();
        } else alert(`There has been an issue with ${next[1]}`)
        
        arr.splice(index - 1, 3, total);
        return arr;
    }

    //Addition and Subtraction
    index = arr.findIndex(op => op === "+" || op === "-")
    if(index != -1) {
        
        let next = arr.slice(index -1, index + 2)

        if(next[1] === "+"){
            total = (Number(next[0])+Number(next[2])).toString();
        }else if (next[1] === "-"){
            total = (next[0]-next[2]).toString();
        } else alert(`There has been an issue with ${next[1]}`)
        
        arr.splice(index - 1, 3, total);
        return arr;
    }

}

function countOccurances(arr, char){
//For finding which parentheses to use
//Takes array and char to count
//Returns total of char in array
    let total = 0

    arr.forEach(e => {
        let splitArr = e.toString().split(char)
        total += (splitArr.length - 1)
    })

    return total;
}

function parentheses(arr, index){
//Takes full array and the index from where parentheses was found
//Calculates total inside parentheses, recalling this function if nested is found
//returns array with total spliced in

    let end, nextArr, nextArrEnd;

        //Finds slice of array inside paraentheses, if nested is found, recall with nested 
        end = 0;
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
        nextArr = arr.slice(index, end + 1);
        nextArrEnd = nextArr.length - 1;

        //Remove paraentheses
        nextArr[0] = nextArr[0].replace("(", "");
        nextArr[nextArrEnd] = nextArr[nextArrEnd].replace(")", "");
        nextArr = nextArr.filter(e => e != "");

        //Run until one number remains
        while(nextArr.length > 1){
            nextArr = nextInOrder(nextArr);
        }

        //splice and return
        arr.splice(index, (end - index)+1, nextArr[0].toString());
        return arr;
}

//Run initial setup
addButtonEventListeners();
addKeyboardEventListeners();