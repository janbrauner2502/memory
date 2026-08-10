// primitive Types

let myString:string = "Hello World";
let myNumber:number = 12345678;
let myBoolean:boolean = true;

let myNull = null;
let myUndefined:undefined;


// Zuweisungen

let myVariable:string | number = "Hallo Welt" //bsp. UNION-Types
myVariable = 12345678;

let anotherMyVariable:number | undefined; //sollte im Zweifel vermieden werden
anotherMyVariable = 12345678;

class MyClass {
    myAttr:string;

    constructor() {
        this.myAttr = "12345678";
    }
}


//Literals

let myLiteral: "admin" | "staff" | "member" | 42 = "admin";


//Arrays

let myFirstArray:string[] = ["admin", "staff", "member"];
let mySecondArray:number[] = [123, 456, 789];
let myThirdArray: (string | number | boolean)[] = [123, 456, "Hallo Welt", true];


//Tupel

let myFirstTupelArray:[string, number] = ["admin", 42];
let mySecondTupelArray:[string, 41 | 42, number] = ["admin", 42, 101];


//Functions

function withReturn(a:number, b:number) {
    return a + b;
}

function withoutReturn(a:number, b:number):void { //Funktion gib nur was aus, daher :void
    console.log(a + b);
}


//Object

let product: {
    name: string,
    price?: number,
    logger: (msg:string) => void
} = {
    name: "book",
    logger: (msg) => {
        console.log(msg);}
}


//Interfaces

interface User {
    name: string,
    role?: string
}

function getUser(user: User):User {
    return user;}