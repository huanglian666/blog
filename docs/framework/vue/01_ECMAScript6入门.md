## 一、ECMAScript6简介

> ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。

### 1.1、ECMAScript 和 JavaScript 的关系

> 一个常见的问题是，ECMAScript 和 JavaScript 到底是什么关系？
>
> 要讲清楚这个问题，需要回顾历史。1996 年 11 月，JavaScript 的创造者 Netscape 公司，决定将 JavaScript 提交给标准化组织 ECMA，希望这种语言能够成为国际标准。次年，ECMA 发布 262 号标准文件（ECMA-262）的第一版，规定了浏览器脚本语言的标准，并将这种语言称为 ECMAScript，这个版本就是 1.0 版。
>
> 因此，ECMAScript 和 JavaScript 的关系是，前者是后者的规范，后者是前者的一种实现（另外的 ECMAScript 方言还有 Jscript 和 ActionScript）。

### 1.2、ES6 与 ECMAScript 2015 的关系

> ECMAScript 2015（简称 ES2015）这个词，也是经常可以看到的。它与 ES6 是什么关系呢？
>
> 2011 年，ECMAScript 5.1 版发布后，就开始制定 6.0 版了。因此，ES6 这个词的原意，就是指 JavaScript 语言的下一个版本。
>
> ES6 的第一个版本，在 2015 年 6 月发布，正式名称是《ECMAScript 2015 标准》（简称 ES2015）。
>
> 2016 年 6 月，小幅修订的《ECMAScript 2016 标准》（简称 ES2016）如期发布，这个版本可以看作是 ES6.1 版，因为两者的差异非常小，基本上是同一个标准。根据计划，2017 年 6 月发布 ES2017 标准。
>
> 因此，ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。本教程中提到 ES6 的地方，一般是指 ES2015 标准，但有时也是泛指“下一代 JavaScript 语言”。

## 二、基本语法

> ES标准中不包含 DOM 和 BOM的定义，只涵盖基本数据类型、关键字、语句、运算符、内建对象、内建函数等通用语法。
>
> **本部分只学习前端开发中ES6的最少必要知识**，方便后面开发中对代码的理解。

### 2.1、let变量声明

> `var`声明的变量，没有局部作用域
> `let`声明的变量 ，有局部作用域

```javascript
{
    var a = 0
	let b = 1
}

console.log(a)  // 0
console.log(b)  // ReferenceError: b is not defined
```

> `var`可以声明多次
> `let`只能声明一次

```javascript
var m = 1
var m = 2

let n = 3
let n = 4
console.log(m)  // 2
console.log(n)  // Identifier 'n' has already been declared
```

### 2.2、const常量声明

> 声明之后不允许改变
>
> 一但声明必须初始化，否则会报错

```javascript
// 1、声明之后不允许改变    
const PI = "3.1415"
PI = 3  // TypeError: Assignment to constant variable.

// 2、一但声明必须初始化，否则会报错
const MY_AGE  // SyntaxError: Missing initializer in const declaration
```

### 2.3、解构赋值

> 解构赋值是对赋值运算符的扩展。
>
> 他是一种针对**数组或者对象**进行模式匹配，然后对其中的变量进行赋值。
>
> 在代码书写上简洁且易读，语义更加清晰明了；也方便了复杂对象中数据字段获取。

```javascript
//1、数组解构
// 传统
let a = 12, b = 24, c = 36
console.log(a, b, c)

// ES6
let [x, y, z] = [12, 24, 36]
console.log(x, y, z)

//2、对象解构
let user = {name: 'Peter', age: 28}
// 传统
let n = user.name
let a = user.age
console.log(n, a)
// ES6
let { name, age } =  user//注意：结构的变量必须是user中的属性
console.log(name, age)
```

### 2.4、模板字符串

> 模板字符串相当于加强版的字符串，用反引号“`”，除了作为普通字符串，还可以用来定义多行字符串，还可以在字符串中加入变量和表达式。

```javascript
// 1、多行字符串
let string1 =  `Hey,
can you stop angry now?`
console.log(string1)
// Hey,
// can you stop angry now?

// 2、字符串插入变量和表达式。变量名写在 ${} 中，${} 中可以放入 JavaScript 表达式。
let name = "Tom"
let age = 21
let info = `My Name is ${name},I am ${age+1} years old next year.`
console.log(info)
// My Name is Tom,I am 21 years old next year.


// 3、字符串中调用函数
function f(){
    return "have fun!"
}
let string2 = `Game start,${f()}`
console.log(string2);  // Game start,have fun!
```

### 2.5、声明对象简写

```javascript
const age = 20
const name = "Tom"

// 传统
const person1 = {age: age, name: name}
console.log(person1)

// ES6
const person2 = {age, name}
console.log(person2) //{age: 20, name: "Tom"}
```

### 2.6、定义方法简写

```javascript
// 传统
const person1 = {
    sayHi:function(){
        console.log("Hi")
    }
}
person1.sayHi();//"Hi"
// ES6
const person2 = {
    sayHi(){
        console.log("Hi")
    }
}
person2.sayHi()  //"Hi"
```

### 2.7、对象拓展运算符

> 拓展运算符`...`用于取出参数对象所有可遍历属性然后拷贝到当前对象。

```javascript
// 1、拷贝对象
let person1 = {name: "Amy", age: 15}
let someone = { ...person1 }
console.log(someone)  //{name: "Amy", age: 15}

// 2、合并对象
let age = {age: 15}
let name = {name: "Amy"}
let person2 = {...age, ...name}
console.log(person2)  //{age: 15, name: "Amy"}
```

### 2.8、箭头函数

> 箭头函数提供了一种更加简洁的函数书写方式，类似Java8的Lambda表达式。基本语法是：
>
> `参数 => 函数体`

```javascript
//传统
var f1 = function(a){
    return a
}
console.log(f1(1))

// ES6
var f2 = a => a
console.log(f2(1))

// 当箭头函数没有参数或者有多个参数，要用 () 括起来。
// 当箭头函数函数体有多行语句，用 {} 包裹起来，表示代码块，
// 当只有一行语句，并且需要返回结果时，可以省略 {} , 结果会自动返回。
var f3 = (a,b) => {
    let result = a+b
    return result
}
console.log(f3(6,2))  // 8
// 前面代码相当于：
var f4 = (a,b) => a+b

//定义函数
function test1(a, f) {
    return f(a);
}

//使用箭头函数
let r = test1(10, a => {
    return a * a;
});

//let r = test1(10, function (a) {
//    return a * a;
//})
console.log(r);

//使用箭头函数
let r1 = test1(11, a => {
    return a + 100;
});

//let r1 = test1(11, function (a){
//    return a + 100;
//});
console.log(r1);
```

> 箭头函数多用于匿名函数的定义。
