---
title: jQuery
date: 2026-09-12
icon: fa-solid fa-code
category: [Web开发]
tag: [前端基础]
---

# jQuery

本篇整理 jQuery 基础内容：jQuery 介绍与引入、基本语法、常用选择器、遍历、DOM 操作（内容、节点、属性、CSS）以及隐藏显示与淡入淡出等常用效果。

## 1. jQuery 介绍

### 1.1 jQuery 概述

**jQuery** 是一个快速、简洁的 JavaScript 代码库。jQuery 设计的宗旨是"Write Less，Do More"，即倡导写更少的代码，做更多的事情。它封装了 JavaScript 常用的功能代码，提供一种简便的 JavaScript 操作方式，优化 HTML 文档操作、事件处理、动画设计和 Ajax 交互。

### 1.2 jQuery 特点

- 具有独特的链式语法；
- 支持高效灵活的 CSS 选择器；
- 拥有丰富的插件；
- 兼容各种主流浏览器，如 IE 6.0+、FF 1.5+、Safari 2.0+、Opera 9.0+ 等。

### 1.3 为什么要用 jQuery

目前网络上有大量开源的 JavaScript 框架，而 jQuery 是其中最流行的 JavaScript 框架，并且提供了大量的扩展。很多大公司都在使用 jQuery，例如 Google、Microsoft、IBM、Netflix。

## 2. 引入 jQuery

### 2.1 直接引入

去 jQuery 官网 [Download jQuery | jQuery](https://jquery.com/download/) 下载，放入服务器的合适目录中，在页面中直接引用：

```html
<head>
    <!-- 注意：这里的 script 标签要成对，不能写成自闭合形式 -->
    <script src="js/jquery-3.4.1.min.js"></script>
</head>
```

### 2.2 CDN 引入

**CDN** 的全称是 Content Delivery Network，即**内容分发网络**，可以使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。

BootCDN 是由 Bootstrap 中文网等共同支持并维护的前端开源项目免费 CDN 服务，致力于为 Bootstrap、jQuery、React、Vue.js 等优秀的前端开源项目提供稳定、快速的免费 CDN 加速服务。

```html
<head>
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
</head>
```

## 3. jQuery 语法

### 3.1 基本使用

`$(document).ready(匿名函数)` 表示页面加载完毕后执行匿名函数；`$(匿名函数)` 是 `$(document).ready(匿名函数)` 的简写：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery Start</title>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(document).ready(function () {
            console.log("hello jquery");
        });

        $(function () {
            console.log("hello jquery");
        });
    </script>
</head>
<body>
</body>
</html>
```

`$(选择器).action()` 通过选取 HTML 元素，并对选取的元素执行某些操作：

- 选择器表示"查找"HTML 元素的选择器，和 CSS 中的选择器是通用的；
- `action()` 执行对元素的操作。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery Start</title>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function () {
            $("#p1").text("..."); // 修改 #p1 元素的内容
            $(".c1").hide();      // 隐藏 class 为 c1 的元素
        });
    </script>
</head>
<body>
    <p id="p1">这是一个段落</p>
    <p class="c1">这是另一个段落</p>
</body>
</html>
```

### 3.2 jQuery 事件及常用事件方法

**事件**是页面对不同访问者的响应，**事件处理程序**指的是当 HTML 中发生某些事件时所调用的方法。

常见 DOM 事件：

| 鼠标事件 | 键盘事件 | 表单事件 | 文档/窗口事件 |
| --- | --- | --- | --- |
| `click` | `keypress` | `submit` | `load` |
| `dblclick` | `keydown` | `change` | `resize` |
| `mouseenter` | `keyup` | `focus` | `scroll` |
| `mouseleave` | | `blur` | `unload` |

jQuery 事件方法语法：在 jQuery 中，**大多数 DOM 事件都有一个等效的 jQuery 方法**。

页面中指定一个点击事件：

```javascript
$("p").click();
```

下一步指定动作触发后执行的操作：

```javascript
$("p").click(function(){
    // 动作触发后执行的代码!
});
```

总结：不传参数是触发点击动作，传函数参数是设置事件触发后对应的操作。

### 3.3 jQuery 选择器（重点）

**作用**：获取元素，相当于 JavaScript 中 DOM 操作的 `document.getElementXXX()`。

jQuery 选择器基于元素的 Id、类型、属性、属性值等查找或选择 HTML 元素。它基于已经存在的 CSS 选择器，除此之外还有一些自定义的选择器。

#### 3.3.1 基本选择器

| 选择器 | 说明 |
| --- | --- |
| `$("#id")` | ID 选择器，通过 id 获取 jQuery 元素 |
| `$(".className")` | 类选择器，通过元素的类名来获取 jQuery 元素 |
| `$("elementName")` | 元素选择器，通过元素名来获取 jQuery 元素 |
| `$("*")` | 通配选择器，匹配所有元素 |
| `$("选择器1,选择器2,选择器3, ....")` | 选择器合并，将每个选择器匹配到的元素合并到一起返回 |

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>基本选择器</title>
        <script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
        <script>
            $(function() {
                // #btn1 id 选择器；click() 单击事件
                $("#btn1").click(function() {
                    // id 选择器；css() 样式设置，支持链式调用
                    $("#p1").css("color", "blue").css("border", "1px solid black").text("hello");
                });

                $("#btn2").click(function() {
                    // 类选择器
                    $(".pclass").css("background-color", "cornflowerblue");
                });

                $("#btn3").click(function() {
                    // 元素选择器
                    $("p").css("color", "chartreuse");
                });

                $("#btn4").click(function() {
                    // 通配选择器
                    $("*").css("background-color", "chocolate");
                });

                $("#btn5").click(function() {
                    // 选择器合并
                    $("#p1,h1").css("color", "green");
                });
            });
        </script>
    </head>
    <body>
        <p id="p1">这是段落1</p>
        <p class="pclass">这是段落2</p>
        <p class="pclass">这是段落3</p>
        <p>这是段落4</p>
        <h1>这是一级标题</h1>
        <button id="btn1">id选择器</button>
        <button id="btn2">类选择器</button>
        <button id="btn3">元素选择器</button>
        <button id="btn4">通配选择器</button>
        <button id="btn5">选择器合并</button>
    </body>
</html>
```

#### 3.3.2 层次选择器

通过 DOM 元素之间的层次关系来获取特定元素，如后代元素、子元素、相邻元素和同辈元素等：

| 写法 | 说明 |
| --- | --- |
| `$("x y")` | 选取 x 元素里的所有后代元素 y |
| `$("parent>child")` | 选取 parent 元素下的 child 子元素（直接子元素） |
| `$("prev+next")` | 选取紧接在 prev 元素后的 next 元素 |
| `$("prev~siblings")` | 选取 prev 元素之后的所有 siblings 同辈元素 |

注意：`$("div span")` 会选取 `div` 里所有的 `span` 元素（包括更深层级的后代）；`$("div>span")` 只会选取 `div` 直属的 `span` 子元素。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>层次选择器</title>
        <script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
        <script>
            $(function() {
                /*
                    div p：div 中所有的后代 p 元素
                    div>p：div 的直接子元素 p
                */
                $("#btn1").click(function() {
                    // div 中所有的 p 元素
                    $("div p").css("color", "cornflowerblue");
                });

                $("#btn2").click(function() {
                    // div 下一级的所有 p 元素
                    $("div>p").css("color", "chartreuse");
                });

                $("#btn3").click(function() {
                    // 紧接在 div 后的 p 元素
                    $("div+p").css("color", "yellow");
                });

                $("#btn4").click(function() {
                    // div 后面所有的 p 元素
                    $("div~p").css("color", "yellow");
                });

                $("#btn5").click(function() {
                    // div 后面所有的元素
                    $("div~*").css("color", "gray");
                });

                //$("div").next().css("color", "yellow");
                //$("div").nextAll().css("color", "yellow");
            });
        </script>
    </head>
    <body>
        <div>
            <p>这是段落1</p>
            <span>
                <p>这是段落2</p>
                <span>
                    <p>这是段落3</p>
                </span>
            </span>
            <p>这是段落4</p>
        </div>
        <p>这是段落5</p>
        <h5>这是五级标题</h5>
        <p>这是段落6</p>
        <button id="btn1">div中所有的p元素</button>
        <button id="btn2">div中下一级p元素</button>
        <button id="btn3">紧接在div后的p元素</button>
        <button id="btn4">div后面所有的p元素</button>
        <button id="btn5">div后面所有的元素</button>
    </body>
</html>
```

#### 3.3.3 表单选择器

为了使用户能够更加灵活地操作表单，jQuery 中专门加入了表单选择器。利用表单选择器，能够极其方便地获取到表单的某个或某些类型的元素：

| 选择器 | 说明 |
| --- | --- |
| `$(":input")` | 查询所有表单元素，包括 input、textarea、select、button |
| `$(":text")` | 查询所有 `<input type="text" .../>` 元素 |
| `$(":password")` | 查询所有 `<input type="password" .../>` 元素 |
| `$(":radio")` | 查询所有 `<input type="radio" .../>` 元素 |
| `$(":checkbox")` | 查询所有 `<input type="checkbox" .../>` 元素 |

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>表单选择器</title>
        <script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
        <script>
            $(function() {
                $("#btn1").click(function() {
                    // :text 文本框；val() 获取文本框中的内容
                    var $txt = $(":text").val();
                    console.log($txt);
                });
                $("#btn2").click(function() {
                    // :password 密码框
                    var $pwd = $(":password").val();
                    console.log($pwd);
                });
                $("#btn3").click(function() {
                    /*
                        prop() / attr()：获取/设置元素的属性
                        对应原生 JavaScript 的 setAttribute() / getAttribute()
                        :checkbox 多选框
                    */
                    console.log($(":checkbox").prop("checked"));
                });
                $("#btn4").click(function() {
                    // :radio 单选按钮
                    console.log($(":radio").prop("checked"));
                });
                $("#btn5").click(function() {
                    var $txt = $("div>:text").val();
                    console.log($txt);
                });

                $(".divclass1").css("color", "yellow");
                $(".divclass2").css("border", "1px solid black");
                $(".divclass3").css("background-color", "cadetblue");
            });
        </script>
    </head>
    <body>
        文本框<input type="text" /><br/>
        密码框<input type="password" /><br/>
        多选框<input type="checkbox" /><br/>
        单选按钮<input type="radio" /><br/>
        <div>
            div里面的text<input type="text"/>
        </div>
        <button id="btn1">文本框</button>
        <button id="btn2">密码框</button>
        <button id="btn3">多选框</button>
        <button id="btn4">单选按钮</button>
        <button id="btn5">div里面的text</button>
        <div class="divclass1 divclass2 divclass3">1111</div>
    </body>
</html>
```

#### 3.3.4 过滤选择器

过滤选择器主要是通过特定的过滤规则来筛选出所需的 DOM 元素。

##### 3.3.4.1 基本过滤选择器

| 选择器 | 示例 | 说明 |
| --- | --- | --- |
| `:first` | `$("p:first")` | 选取第一个 p 元素 |
| `:last` | `$("p:last")` | 选取最后一个 p 元素 |
| `:even` | `$("tr:even")` | 选取所有偶数下标的 tr 元素 |
| `:odd` | `$("tr:odd")` | 选取所有奇数下标的 tr 元素 |
| `:eq(index)` | `$("ul li:eq(3)")` | 选取列表中第四个元素（index 从 0 开始） |
| `:gt(no)` | `$("ul li:gt(3)")` | 选取下标大于 3 的元素 |
| `:lt(no)` | `$("ul li:lt(3)")` | 选取下标小于 3 的元素 |

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>基本过滤选择器</title>
        <script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
        <style>
            table, tr, td, th {
                border: 1px solid black;
            }
            table {
                border-collapse: collapse;
                width: 500px;
                text-align: center;
            }
            td[colspan] {
                text-align: left;
            }
        </style>
        <script>
            $(function() {
                /*
                    基本过滤选择器
                    :first 第一个元素
                    :last  最后一个元素
                    :even  偶数下标
                    :odd   奇数下标
                    :eq(index) 第 index 个元素
                    :gt(index) 大于 index 的元素
                    :lt(index) 小于 index 的元素
                */
                $("tr:first,tr:last").css("background-color", "blue");
                $(".info:even").css("background-color", "cyan");
                $(".info:odd").css("background-color", "burlywood");
                $("p:eq(3)").css("color", "yellow");
                $("p:gt(0)").css("border", "1px solid yellow");
                $("p:lt(3)").css("border", "1px solid black");
            });
        </script>
    </head>
    <body>
        <table>
            <tr>
                <th>姓名</th>
                <th>性别</th>
                <th>年龄</th>
            </tr>
            <tr class="info">
                <td>zhangsan</td>
                <td>男</td>
                <td>20</td>
            </tr>
            <tr class="info">
                <td>Tom</td>
                <td>男</td>
                <td>10</td>
            </tr>
            <tr class="info">
                <td>Lucy</td>
                <td>女</td>
                <td>10</td>
            </tr>
            <tr class="info">
                <td>Robin</td>
                <td>男</td>
                <td>20</td>
            </tr>
            <tr>
                <td colspan="3">备注：这是一个信息表</td>
            </tr>
        </table>
        <p>这是段落1</p>
        <p>这是段落2</p>
        <p>这是段落3</p>
        <p>这是段落4</p>
    </body>
</html>
```

##### 3.3.4.2 可视化过滤选择器

- `$("div:hidden")`：选择所有被隐藏的 div 元素；
- `$("div:visible")`：选择所有可视的 div 元素。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>可视化过滤选择器</title>
        <script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
        <script>
            $(function() {
                $("#div2").hide(); // 隐藏
                // $("#div2").show(); // 显示
                /*
                    :hidden 隐藏的元素
                    :visible 可见的元素
                */
                $("#btn1").click(function() {
                    $("div:hidden").show();
                });
                $("#btn2").click(function() {
                    $("div:visible").hide();
                });
                $("div[aaa]").text("*****");
            });
        </script>
    </head>
    <body>
        <div id="div1">
            111111111111111111111111111
        </div>
        <div id="div2">
            2222222222222222222222222222
        </div>
        <button id="btn1">让隐藏的元素显示</button>
        <button id="btn2">让显示的元素隐藏</button>
        <div aaa="bbb"></div>
    </body>
</html>
```

调查问卷案例：选择"其他"时显示自定义输入框，选择其他选项时隐藏：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>可视化选择器</title>
    <style>
        #input_lang {
            display: none;
        }
    </style>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function () {
            $('#ch_other').click(function () {
                $('#input_lang:hidden').show();
            });

            $('.lang').click(function () {
                $('#input_lang:visible').hide();
            });
        })
    </script>
</head>
<body>
    <div>
        <p>请选择你心目中最好的编程语言</p>
        <p>Java<input class="lang" type="radio" name="lang" /></p>
        <p>Python<input class="lang" type="radio" name="lang" /></p>
        <p>JavaScript<input class="lang" type="radio" name="lang" /></p>
        <p>PHP<input class="lang" type="radio" name="lang" /></p>
        <p>Kotlin<input class="lang" type="radio" name="lang" /></p>
        <p>其他 <input id="ch_other" type="radio" name="lang" /></p>
        <p id="input_lang"><input type="text" name="input_lang" /></p>
    </div>
</body>
</html>
```

##### 3.3.4.3 属性过滤选择器

| 写法 | 说明 |
| --- | --- |
| `$("div[id]")` | 选择所有含有 id 属性的 div 元素，还可以继续追加过滤，如 `$("div[id]:eq(2)")` |
| `$("input[name='newsletter']")` | 选择所有 name 属性等于 'newsletter' 的 input 元素 |
| `$("input[name!='newsletter']")` | 选择所有 name 属性不等于 'newsletter' 的 input 元素 |
| `$("input[name^='news']")` | 选择所有 name 属性以 'news' 开头的 input 元素 |
| `$("input[name$='news']")` | 选择所有 name 属性以 'news' 结尾的 input 元素 |
| `$("input[name*='man']")` | 选择所有 name 属性包含 'man' 的 input 元素 |
| `$("input[id][name$='man']")` | 多个属性联合选择：得到所有含有 id 属性并且 name 属性以 man 结尾的元素 |

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>属性过滤选择器</title>
        <script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
        <script>
            $(function() {
                //$("p[class]") 选取含有 class 属性的 p 标签
                //$("p[class]").css("border", "1px solid black");

                //$("p[id=p1]") 选择 id 属性为 p1 的标签
                //$("p[id=p1]").css("color", "yellow");

                //$("p[id!=p1]") 选择 id 属性不等于 p1 的标签
                //$("p[id!=p1]").css("color", "yellow");

                //$("p[class^=pclass]") 选择 class 属性以 pclass 开头的标签
                //$("p[class^=pclass]").css("color", "yellow");

                //$("p[class$=1]") 选择 class 属性以 1 结尾的标签
                //$("p[class$=1]").css("color", "yellow");

                //$("p[class*=p]") 选择 class 属性包含 p 的标签
                //$("p[class*=p]").css("color", "yellow");

                // 联合选择：有 id 属性且 class 属性以 p 开头的标签
                $("p[id][class^=p]").css("color", "yellow");
            });
        </script>
    </head>
    <body>
        <p id="p1" class="pclass">这是段落1</p>
        <p class="pclass1">这是段落2</p>
        <p class="pclass2">这是段落3</p>
        <p class="p2">这是段落4</p>
        <p>这是段落5</p>
    </body>
</html>
```

### 3.4 jQuery 遍历

查询到的元素可能不只一个，有时需要循环遍历，这时使用 `each()` 方法完成。

- `each()` 方法的参数是函数，每次循环都会调用一次这个函数；
- 在函数内部可以使用 `$(this)` 获取当前遍历到的元素。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>遍历</title>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function () {
            $("p").each(function () {
                console.log($(this).text());
            });
        });
    </script>
</head>
<body>
    <p>段落1</p>
    <p>段落2</p>
    <p>段落3</p>
    <p>段落4</p>
    <p>段落5</p>
</body>
</html>
```

常用的遍历相关方法：

| 方法 | 说明 |
| --- | --- |
| `next()` | 等价于 `$("prev + next")`，紧接在 prev 元素后的 next 元素 |
| `nextAll()` | 等价于 `$("prev~siblings")`，prev 元素之后的所有同辈元素 |
| `siblings()` | 选择所有同辈节点 |
| `children()` | 获取匹配元素的所有子元素 |
| `parent()` | 获取匹配元素的父元素 |
| `parents()` | 获取匹配元素的所有父元素 |

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>遍历</title>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function () {
            // 之后的元素
            console.log($("#div1").next().text());

            // 之后的所有元素
            $("#div1").nextAll().each(function () {
                console.log($(this).text());
            });

            // 同辈节点
            $("#p3").siblings().each(function () {
                $(this).css("color", "#eeaabb");
            });

            // 所有子节点
            $("#div1").children().css("border", "1px solid black");
        });
    </script>
</head>
<body>
    <div id="div1">
        <p>段落1</p>
        <p>段落2</p>
    </div>
    <p id="p3">段落3</p>
    <p>段落4</p>
    <p>段落5</p>
</body>
</html>
```

## 4. jQuery DOM（重点）

### 4.1 设置和获取 HTML、文本值

| 分类 | 方法 | 说明 |
| --- | --- | --- |
| HTML 操作 | `html()` / `html(val)` | 获取 / 设置元素的 HTML |
| 文本操作 | `text()` / `text(txt)` | 获取 / 设置元素的文本内容 |
| value 操作 | `val()` / `val(val)` | 获取 / 设置元素的 value 内容 |

使用上面的方法完成登录表单的非空校验：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>登录</title>
    <style>
        table {
            width: 500px;
            margin: auto;
        }
    </style>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        // 非空校验
        function checkEmpty(id, infoId, info) {
            if ($(id).val() == '') {
                $(infoId).text(info);
                return false;
            }
            return true;
        }

        // 校验所有
        function checkAll() {
            if (checkEmpty("#username", "#usernameInfo", "用户名不能为空")
               && checkEmpty("#password", "#passwordInfo", '密码不能为空')) {
                return true;
            }
            return false;
        }

        function clearInfo(infoId) {
            $(infoId).text("");
        }

        $(function () {
            $("#username").blur(function () {
                checkEmpty("#username", "#usernameInfo", "用户名不能为空");
            }).focus(function () {
                clearInfo("#usernameInfo");
            });

            $("#password").blur(function () {
                checkEmpty("#password", "#passwordInfo", '密码不能为空');
            }).focus(function () {
                clearInfo("#passwordInfo");
            });

            $("#fm").submit(function (e) {
               if (!checkAll()) {
                   e.preventDefault();
               }
            });
        });
    </script>
</head>
<body>
    <form id="fm" action="#" method="post">
        <table>
            <tr>
                <td>
                    <label for="username">账号</label>
                </td>
                <td>
                    <input id="username" type="text"/>
                </td>
                <td>
                    <span id="usernameInfo"></span>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="password">密码</label>
                </td>
                <td>
                    <input id="password" type="password"/>
                </td>
                <td>
                    <span id="passwordInfo"></span>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center;">
                    <button type="submit">登录</button>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>
```

### 4.2 节点操作

**创建节点**：`$(html)`，该方法会根据传入的 html 字符串返回一个 DOM 对象。

**插入节点**：

| 方法 | 说明 |
| --- | --- |
| `append()` | 向每个匹配的元素内部追加内容 |
| `appendTo()` | 将所有匹配的元素追加到指定的元素中。颠倒了常规的 `$(A).append(B)` 操作：不是将 B 追加到 A 中，而是将 A 追加到 B 中 |
| `prepend()` | 在每个匹配的元素内部前置内容 |
| `prependTo()` | 将所有匹配的元素前置到指定的元素中。颠倒了常规的 `$(A).prepend(B)` 操作 |
| `after()` | 在每个匹配的元素之后插入内容 |
| `insertAfter()` | 将所有匹配的元素插入到指定元素的后面。颠倒了常规的 `$(A).after(B)` 操作 |
| `before()` | 在每个匹配元素之前插入内容 |
| `insertBefore()` | 将所有匹配的元素插入到指定的元素前面。颠倒了常规的 `$(A).before(B)` 操作 |

**查找节点**：通过选择器查找。

**删除节点**：

- `remove()`：从 DOM 中删除所有匹配的元素。当某个节点用 remove() 方法删除后，该节点所包含的所有后代节点将同时被删除；
- `empty()`：该方法不删除节点本身，而是清空节点，它能清空元素中的所有后代节点。

案例：动态添加表格行、删除行（与 JavaScript DOM 操作的案例对应）：

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>元素操作</title>
        <script type="text/javascript" src="../js/jquery-3.3.1.min.js" ></script>
        <style>
            #main {
                margin: 0 auto; /* 设置整个盒子居中，一定要设置宽度 */
                width: 500px;
            }

            p {
                text-align: center; /* 设置段落中的内容居中 */
            }

            table {
                width: 500px;
                border-collapse: collapse; /* 去除边框中间的空白区域 */
            }

            table, tr, td {
                border: 1px solid black;
            }
        </style>
        <script>
            /*
                $(html) 创建表示 html 的节点
                append() 在元素内部追加
            */
            function addItem() {
                // 获取 table
                var $tb = $("#tb1");
                // 获取表示行的节点
                var $line = $("<tr></tr>");

                // 创建存放姓名的单元格
                var $tdName = $("<td></td>");
                // 获取表单中的姓名
                var $txtName = $("#username").val();
                // 设置单元格的内容
                $tdName.text($txtName);

                // 创建存放年龄的单元格
                var $tdAge = $("<td></td>");
                // 获取表单中的年龄
                var $txtAge = $("#age").val();
                // 设置单元格的内容
                $tdAge.text($txtAge);

                // 创建存放电话的单元格
                var $tdTel = $("<td></td>");
                // 获取表单中的电话
                var $txtTel = $("#tel").val();
                // 设置单元格的内容
                $tdTel.text($txtTel);

                // 创建存放删除按钮的单元格
                var $tdDel = $("<td></td>");
                // 创建按钮
                var $btnDel = $("<button>删除</button>");
                $btnDel.prop("type", "button");
                // 为删除按钮设置单击事件，删除按钮所在行
                $btnDel.click(function() {
                    $(this).parent().parent().remove();
                });
                // 将按钮放入单元格中
                $tdDel.append($btnDel);

                // 在行中追加元素
                $line.append($tdName);
                $line.append($tdAge);
                $line.append($tdTel);
                $line.append($tdDel);

                // 将行追加到 table 中
                $tb.append($line);
            }

            $(function() {
                $("#btnAdd").click(function() {
                    addItem();
                });
            });
        </script>
    </head>
    <body>
        <div id="main">
            <div id="divform">
                <form>
                    <p>
                        <label>姓名</label>
                        <input type="text" id="username" />
                    </p>
                    <p>
                        <label>年龄</label>
                        <input type="text" id="age" />
                    </p>
                    <p>
                        <label>电话</label>
                        <input type="text" id="tel"/>
                    </p>
                    <p>
                        <button type="button" id="btnAdd">添加</button>
                    </p>
                </form>
            </div>
            <hr/>
            <div id="divtable">
                <table id="tb1">
                    <tr>
                        <td>姓名</td>
                        <td>年龄</td>
                        <td>电话</td>
                        <td>操作</td>
                    </tr>
                </table>
            </div>
        </div>
    </body>
</html>
```

另一个案例：用 jQuery 实现左右列表元素的移动：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function () {
            $("#allToRight").click(function () {
                $("#selectLeft option").each(function () {
                    $("#selectRight").append($(this));
                });
            });

            $("#allToLeft").click(function () {
                $("#selectRight option").each(function () {
                    $("#selectLeft").append($(this));
                });
            });

            $("#checkToRight").click(function () {
                $("#selectLeft option").each(function () {
                    if ($(this).prop("selected")) {
                        $("#selectRight").append($(this));
                    }
                });
            });

            $("#checkToLeft").click(function () {
                $("#selectRight option").each(function () {
                    if ($(this).prop("selected")) {
                        $("#selectLeft").append($(this));
                    }
                });
            });
        });
    </script>
</head>
<body>
    <div id="s1" style="float:left;">
        <div>
            <select id="selectLeft" multiple="multiple" style="width:100px;height:200px;">
                <option>Java</option>
                <option>Python</option>
                <option>C++</option>
                <option>C#</option>
                <option>JavaScript</option>
            </select>
        </div>

        <div>
            <button id="checkToRight" type="button">选中添加到右边</button><br/>
            <button id="allToRight" type="button">全部添加到右边</button>
        </div>
    </div>

    <div id="s2" style="float: left;">
        <div>
            <select id="selectRight" multiple="multiple" style="width:100px;height:200px;">
                <option>Perl</option>
            </select>
        </div>

        <div>
            <button id="checkToLeft" type="button">选中添加到左边</button><br/>
            <button id="allToLeft" type="button">全部添加到左边</button>
        </div>
    </div>
</body>
</html>
```

### 4.3 属性操作

- `attr(name)`：读取指定属性的值；
- `attr(name, value)`：设置指定属性的值；
- `removeAttr(name)`：删除指定属性。

`prop()` 与 `attr()` 的区别：

| 方法 | 有该属性时 | 没有该属性时 | 适用场景 |
| --- | --- | --- | --- |
| `prop()` | 返回指定属性值 | 返回值是空字符串 | 处理元素本来就有的属性 |
| `attr()` | 返回指定属性值 | 返回值是 undefined | 处理自定义属性 |

全选案例：

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>全选</title>
        <script type="text/javascript" src="../js/jquery-3.3.1.min.js" ></script>
        <script>
            $(function() {
                $("#btnAll").click(function() {
                    var $hobbys = $(".hobby");
                    $hobbys.each(function() {
                        // $(this) 表示当前遍历到的元素
                        $(this).prop("checked", true);
                    });
                });
                $("#btnNo").click(function() {
                    var $hobbys = $(".hobby");
                    $hobbys.each(function() {
                        $(this).prop("checked", false);
                    });
                });
                $("#btnOpt").click(function() {
                    var $hobbys = $(".hobby");
                    $hobbys.each(function() {
                        var $state = $(this).prop("checked");
                        $(this).prop("checked", !$state);
                    });
                });
                $("#allOrNot").change(function() {
                    var $hobbys = $(".hobby");
                    var $state = $(this).prop("checked");
                    $hobbys.each(function() {
                        $(this).prop("checked", $state);
                    });
                });
            });
        </script>
    </head>
    <body>
        <form>
            <p>
                你喜欢的运动是?<input id="allOrNot" type="checkbox"/>全选/全不选
            </p>
            <p>
                <input type="checkbox" class="hobby" />足球
                <input type="checkbox" class="hobby" />篮球
                <input type="checkbox" class="hobby" />乒乓球
                <input type="checkbox" class="hobby" />拳击
            </p>
            <p>
                <button type="button" id="btnAll">全选</button>
                <button type="button" id="btnNo">全不选</button>
                <button type="button" id="btnOpt">反选</button>
                <button type="submit">提交</button>
            </p>
        </form>
    </body>
</html>
```

### 4.4 CSS 操作

- `css(name)`：获取指定名称的样式值；
- `css(name, value)`：设置指定名称的样式值。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CSS</title>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function () {
            $("#p1").css("text-align", "right");
        });
    </script>
</head>
<body>
    <p id="p1">这是一个段落</p>
</body>
</html>
```

## 5. jQuery 效果（了解）

### 5.1 隐藏和显示

- `hide()`：隐藏 HTML 元素；
- `show()`：显示 HTML 元素。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function(){
              $("#hide").click(function(){
                $("p").hide();
            });
            $("#show").click(function(){
                $("p").show();
            });
        });
    </script>
</head>
<body>
    <p>如果你点击"隐藏"按钮，我将会消失。</p>
    <button id="hide">隐藏</button>
    <button id="show">显示</button>
</body>
</html>
```

两个方法都支持可选参数：`$(selector).hide(speed, callback);`、`$(selector).show(speed, callback);`

- 可选的 speed 参数规定隐藏/显示的速度，可以取以下值："slow"、"fast" 或毫秒数；
- 可选的 callback 参数是隐藏或显示完成后所执行的函数名称。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(document).ready(function(){
            $("button").click(function(){
                //$("p").hide(1000);
                //$("p").hide("slow");
                //$("p").hide("fast");
                $("p").hide(1000, function(){
                    alert("hide() 方法已完成!");
                });
            });
        });
    </script>
</head>
<body>
    <button>隐藏</button>
    <p>这是个段落，内容比较少。</p>
    <p>这是另外一个小段落</p>
</body>
</html>
```

可以使用 `toggle()` 方法来切换 hide() 和 show() 方法：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(document).ready(function(){
            $("button").click(function(){
                $("p").toggle();
            });
        });
    </script>
</head>
<body>
    <button>隐藏/显示</button>
    <p>这是一个文本段落。</p>
    <p>这是另外一个文本段落。</p>
</body>
</html>
```

### 5.2 淡入淡出

**fadeIn()** 用于淡入已隐藏的元素：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(document).ready(function(){
            $("button").click(function(){
                $("#div1").fadeIn();
                $("#div2").fadeIn("slow");
                $("#div3").fadeIn(3000);
            });
        });
    </script>
</head>

<body>
    <p>以下实例演示了 fadeIn() 使用了不同参数的效果。</p>
    <button>点击淡入 div 元素。</button>
    <br><br>
    <div id="div1" style="width:80px;height:80px;display:none;background-color:red;"></div><br>
    <div id="div2" style="width:80px;height:80px;display:none;background-color:green;"></div><br>
    <div id="div3" style="width:80px;height:80px;display:none;background-color:blue;"></div>
</body>
</html>
```

**fadeOut()** 方法用于淡出可见元素：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(document).ready(function(){
            $("button").click(function(){
                $("#div1").fadeOut();
                $("#div2").fadeOut("slow");
                $("#div3").fadeOut(3000);
            });
        });
    </script>
</head>

<body>
    <p>以下实例演示了 fadeOut() 使用了不同参数的效果。</p>
    <button>点击淡出 div 元素。</button>
    <br><br>
    <div id="div1" style="width:80px;height:80px;background-color:red;"></div><br>
    <div id="div2" style="width:80px;height:80px;background-color:green;"></div><br>
    <div id="div3" style="width:80px;height:80px;background-color:blue;"></div>
</body>
</html>
```

**fadeToggle()** 方法可以在 fadeIn() 与 fadeOut() 方法之间进行切换：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(document).ready(function(){
            $("button").click(function(){
                $("#div1").fadeToggle();
                $("#div2").fadeToggle("slow");
                $("#div3").fadeToggle(3000);
            });
        });
    </script>
</head>
<body>
    <p>实例演示了 fadeToggle() 使用了不同的 speed（速度）参数。</p>
    <button>点击淡入/淡出</button>
    <br><br>
    <div id="div1" style="width:80px;height:80px;background-color:red;"></div>
    <br>
    <div id="div2" style="width:80px;height:80px;background-color:green;"></div>
    <br>
    <div id="div3" style="width:80px;height:80px;background-color:blue;"></div>
</body>
</html>
```

## 6. 本章小结

- jQuery 的核心写法是 `$(选择器).action()`：选择器与 CSS 选择器通用，链式调用可以连续设置多个操作；
- 页面加载完成后再执行代码用 `$(function(){})`，等价于 `$(document).ready()`；
- 选择器分为基本、层次、表单、过滤四大类，过滤选择器又包括基本过滤、可视化和属性过滤；
- `each()` 用于遍历元素集合，函数内用 `$(this)` 获取当前元素；
- DOM 操作：`html()`/`text()`/`val()` 读写内容，`$(html)` 创建节点，`append()`/`appendTo()` 等插入节点，`remove()`/`empty()` 删除或清空节点；
- 原生属性用 `prop()`，自定义属性用 `attr()`；效果方面 `hide()`/`show()`/`toggle()` 控制显示隐藏，`fadeIn()`/`fadeOut()`/`fadeToggle()` 控制淡入淡出。
