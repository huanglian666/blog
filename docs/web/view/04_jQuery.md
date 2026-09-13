---
title: 04_jQuery
date: 2026-09-12
---

## 一、jQuery介绍

### 1.1、jQuery概述

> jQuery是一个快速、简洁的JavaScript代码库。jQuery设计的宗旨是“Write Less，Do More”，即倡导写更少的代码，做更多的事情。它封装JavaScript常用的功能代码，提供一种简便的JavaScript操作方式，优化HTML文档操作、事件处理、动画设计和Ajax交互。

#### 1.2、jQuery特点

> 具有独特的链式语法；
>
> 支持高效灵活的CSS选择器；
>
> 拥有丰富的插件；
>
> 兼容各种主流浏览器，如IE 6.0+、FF 1.5+、Safari 2.0+、Opera 9.0+等。

#### 1.3 为什么要用jQuery

> 目前网络上有大量开源的JavaScript框架，但是jQuery是目前最流行的JavaScript框架，而且提供了大量的扩展。很多大公司都在使用 jQuery， 例如：Google、Microsoft、IBM、Netflix。

## 二、引入jQuery

### 2.1、直接引入

> 去jQuery官网([Download jQuery | jQuery](https://jquery.com/download/))下载，放入服务器的合适目录中，在页面中直接引用。

```javascript
<head>
    <!-- 注意这里的script标签要成对 -->
	<script src="js/jquery-3.4.1.min.js"></script>
</head>
```

### 2.2、CDN引入

> CDN的全称是Content Delivery Network，即**内容分发网络**，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。
>
> BootCDN是[猫云](https://www.maoyun.com/)联合[Bootstrap 中文网](https://www.bootcss.com/)共同支持并维护的前端开源项目免费CDN服务，致力于为Bootstrap、jQuery、React、Vue.js一样优秀的前端开源项目提供稳定、快速的免费CDN加速服务。
>
> BootCDN

```html
<head>
	<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
</head>
```

## 三、jQuery语法

### 3.1、基本使用

>`$(document).ready(匿名函数)`表示页面加载完毕，执行匿名函数。
>
>`$(匿名函数)`是`$(document).ready(匿名函数)`的简写。

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

> `$(选择器).action()`通过选取HTML元素，并对选取的元素执行某些操作。
>
> * 选择器表示`查找`HTML元素的选择器，和CSS中的选择器是通用的；
> * `action()`执行对元素的操作。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery Start</title>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function () {
            $("#p1").text("...");//修改#p1元素的内容
            $(".c1").hide();//隐藏class为c1的元素
        });
    </script>
</head>
<body>
    <p id="p1">这是一个段落</p>
    <p class="c1">这是另一个段落</p>
</body>
</html>
```

### 3.2、jQuery事件及常用事件方法

> 什么是事件？页面对不同访问者的响应叫做事件。
>
> 事件处理程序指的是当HTML中发生某些事件时所调用的方法。
>
> 常见 DOM 事件：

| 鼠标事件     | 键盘事件   | 表单事件 | 文档/窗口事件 |
| ------------ | ---------- | -------- | ------------- |
| `click`      | `keypress` | `submit` | `load`        |
| `dblclick`   | `keydown`  | `change` | `resize`      |
| `mouseenter` | `keyup`    | `focus`  | `scroll`      |
| `mouseleave` |            | `blur`   | `unload`      |

> jQuery 事件方法语法：
>
> * 在 jQuery 中，**大多数 DOM 事件都有一个等效的jQuery方法**。
>
> 页面中指定一个点击事件：

```javascript
$("p").click();
```

> 下一步指定动作触发后执行的操作

```javascript
$("p").click(function(){
    // 动作触发后执行的代码!
});
```

> 总结：也就是说，不传参数是点击，传参数是设置触发事件后对应的操作。

### 3.3、jQuery选择器（重点）

> 作用：获取元素，相当于JavaScript中DOM操作document.getElementXXX()；
>
> JQuery选择器基于元素的Id、类型、属性、属性值等，查找或选择HTML元素，它基于已经存在的CSS选择器，除此之外，它还有一些自定义的选择器。

#### 3.3.1、基本选择器

> ID选择器
>
> * `$("#id")`，通过id获取jQuery元素
>
> 类选择器
>
> * `$(".className")`，通过元素的类名来获取jQuery元素
>
> 元素选择器
>
> * `$("elementName")`，通过元素名来获取jQuery元素
>
> 通配选择器
>
> * `$("*")`，匹配所有元素
>
> 选择器合并
>
> * `$("选择器1,选择器2,选择器3, ....")`，将每个选择器匹配到的元素合并到一起返回

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>基本选择器</title>
		<script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
		<script>
			$(function() {
				//#btn1  id选择器
				//click() 单击事件
				$("#btn1").click(function() {
					//id选择器
					//css() css设置
					$("#p1").css("color", "blue").css("border", "1px solid black").text("hello");
					//$("#p1").css("border", "1px solid black");
				});
				
				$("#btn2").click(function() {
					//类选择器
					$(".pclass").css("background-color", "cornflowerblue");
				});
				
				$("#btn3").click(function() {
					//元素选择器
					$("p").css("color", "chartreuse");
				});
				
				$("#btn4").click(function() {
					//通配选择器
					$("*").css("background-color", "chocolate");
				});
				
				$("#btn5").click(function() {
					//选择器合并
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

#### 3.3.2、层次选择器

> 通过DOM元素之间的层次关系来获取特定元素，后代元素、子元素、相邻元素和同辈元素等。
>
> * `$("x y")`选取x元素里的所有后代元素y
> * `$("parent>child")`选取parent元素下的child子元素
> * `$("prev+next")`选取紧接在prev元素后的next元素
> * `$("prev~siblings")`选取prev元素之后的所有siblings元素
>
> 注意：
>
> * `$("div span")`会选取`div`里所有的`span`元素
> * `$("div>span")`只会选取`div`直属的`span`子元素

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
				 	div p 后面所有的子元素
				 	div>p 紧挨着的子元素
				 * */
				$("#btn1").click(function() {
					//div中所有的p元素
					$("div p").css("color", "cornflowerblue");
				});
				
				$("#btn2").click(function() {
					//div下一级的所有p元素
					$("div>p").css("color", "chartreuse");
				});
				
				$("#btn3").click(function() {
					//紧接在div后的p元素
					$("div+p").css("color", "yellow");
				});
				
				$("#btn4").click(function() {
					//div后面所有的p元素
					$("div~p").css("color", "yellow");
				});
				
				$("#btn5").click(function() {
					//div后面所有的元素
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

#### 3.3.3、表单选择器

> 为了使用户能够更加灵活地操作表单，jQuery中专门加入了表单选择器。利用表单选择器，能够极其方便地获取到表单的某个或某些类型的元素。
>
> * `$(":input")`查询所有表单元素，包括：input、textarea、select、button
> * `$(":text")`查询所有`<input type="text" .../>`元素
> * `$(":password")`查询所有`<input type="password" .../>`元素
> * `$(":radio")`查询所有`<input type="radio" .../>`元素
> * `$(":checkbox")`查询所有`<input type="checkbox" .../>`元素

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
					/*
					 	:text 文本框
					 	val() 文本框中的内容
					 * */
					var $txt = $(":text").val();
					console.log($txt);
				});
				$("#btn2").click(function() {
					/*
					 	:password密码框
					 * */
					var $pwd = $(":password").val();
					console.log($pwd);
				});
				$("#btn3").click(function() {
					/*
					 	prop() 获取/设置元素的属性
					 	attr() 获取/设置元素的属性
					 	javascript setAttribute() getAttribute()
					 	：checkbox 多选框
					 * */
					console.log($(":checkbox").prop("checked"));
				});
				$("#btn4").click(function() {
					/*
					 	:radio 单选按钮
					 * */
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
		<button	id="btn2">密码框</button>
		<button	id="btn3">多选框</button>
		<button id="btn4">单选按钮</button>
		<button id="btn5">div里面的text</button>
		<!-- bootstrap -->
		<div class="divclass1 divclass2 divclass3">1111</div>
	</body>
</html>
```

#### 3.3.4、过滤选择器

> 过滤选择器主要是通过特定的过滤规则来筛选出所需的DOM元素。

##### 3.3.4.1、基本过滤选择器

> `:first` $("p:first")选取第一个p元素
>
> `:last` $("p:last") 选取最后一个p元素
>
> `:even偶数元素` $("tr:even") 所有偶数tr元素
>
> `:odd奇数元素` $("tr:odd") 所有奇数 tr元素
>
> `:eq(index)` $("ul li:eq(3)")  列表中第四个元素(index从0开始)
>
> `:gt(no)` $("ul li:gt(3)")列出index大于3的元素
>
> `:lt(no)` 小于...元素

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>基本过滤选择器</title>
		<script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
		<style>
			table, tr, td, th{
				border: 1px solid black;
			}
			table {
				border-collapse: collapse;
				width: 500px;
				text-align: center;
			}
			td[colspan]{
				text-align: left;
			}
		</style>
		<script>
			$(function() {
				/*
				 	基本过滤选择器
				 	:first 第一个元素
				 	:last  最后一个元素
				 	:even  偶数
				 	:eq(index) 第index个元素
				 	:gt(index) 大于index的元素
				 	:lt(index) 小于index的元素
				 * */
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

##### 3.3.4.2、可视化过滤选择器

`$("div:hidden")` 选择所有的被hidden的div元素 

`$("div:visible")` 选择所有的可视化的div元素

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>可视化过滤选择器</title>
		<script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
		<script>
			$(function() {
				$("#div2").hide();//隐藏
				//$("#div2").show();//显示
				/*
				 	:hidden 隐藏的元素
				 	:visible 可见的元素 
				 * */
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

> 调查问卷

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
                $('#input_lang:hidden').show()
            })

            $('.lang').click(function () {
                $('#input_lang:visible').hide()
            })
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

##### 3.3.4.3、属性过滤选择器

> `$("div[id]")` 选择所有含有id属性的div元素，$("div[id]:eq(2)")
>
> `$("input[name='newsletter']")` 选择所有的name属性等于'newsletter'的input元素
>
> `$("input[name!='newsletter']")` 选择所有的name属性不等于'newsletter'的input元素  
>
> `$("input[name^='news']")` 选择所有的name属性以'news'开头的input元素        
>
> `$("input[name$='news']")` 选择所有的name属性以'news'结尾的input元素
>
> `$("input[name*='man']") `选择所有的name属性包含'man'的input元素 
>
> `$("input[id][name$='man']")` 可以使用多个属性进行联合选择，该选择器是得到所有的含有id属性并且那么属性以man结尾的元素

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>属性过滤选择器</title>
		<script type="text/javascript" src="js/jquery-3.4.1.min.js" ></script>
		<script>
			$(function() {
				//$("p[class]") 选取含有class属性的p标签
				//$("p[class]").css("border", "1px solid black");
				
				//$("p[id=p1]") 选择id属性为p1的标签
				//$("p[id=p1]").css("color", "yellow");
				
				//$("p[id!=p1]") 选择id属性不等于p1的标签
				//$("p[id!=p1]").css("color", "yellow");
				
				//$("p[class^=pclass]") 选择class属性以pclass开头的标签
				//$("p[class^=pclass]").css("color", "yellow");
				
				//$("p[class$=1]") 选择class属性以1结尾的标签
				//$("p[class$=1]").css("color", "yellow");
				
				//$("p[class*=p]") 选择class属性包含p的标签
				//$("p[class*=p]").css("color", "yellow");		
				
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

### 3.4、jQuery遍历

> 查询到的元素可能不只一个，有时我们需要循环遍历，这时需要使用`each()`方法来完成。
>
> `each()`方法的参数是函数，每次循环都会调用一次这个函数。
>
> 在函数内部可以使用`$(this)`来获取当前遍历到的元素。

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

> `next()`等价于`$("prev + next")`，紧接在prev元素后的next元素
>
> `nextAll()`等价于`$("prev～siblings")`，prev元素之后的所有siblings元素
>
> `siblings()`选择所有同辈节点
>
> `children()`获取匹配元素的所有子元素
>
> `parent() `获取匹配元素的父元素
>
> `parents()`获取匹配元素的所有父元素

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>遍历</title>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script>
        $(function () {
            //之后的元素
            console.log($("#div1").next().text());

            //之后的所有元素
            $("#div1").nextAll().each(function () {
                console.log($(this).text());
            });

            //同辈节点
            $("#p3").siblings().each(function () {
                $(this).css("color", "#eeaabb");
            });

            //所有字节点
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

## 四、jQuery DOM（重点）

### 4.1、设置和获取HTML、文本值

> HTML的操作方法
>
> * `html()`：获取元素的HTML
> * `html(val)`：设置元素的HTML
>
> 文本内容的操作方法
>
> * `text()`：获取元素的文本内容
> * `text(txt)`：设置元素的文本内容
>
> value的操作方法
>
> * `val()`：获取元素的value内容
> * `val(val)`：设置元素的value内容

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
        //非空校验
        function checkEmpty(id, infoId, info) {
            if($(id).val() == '') {
                $(infoId).text(info);
                return false;
            }

            return true;
        }

        //校验所有
        function checkAll() {
            if(checkEmpty("#username", "#usernameInfo", "用户名不能为空") 
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
               if(!checkAll()) {
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

### 4.2、节点操作

> 创建节点
>
> * `$(html)`，该方法会根据传入的html字符串返回一个DOM对象
>
> 插入节点
>
> * `append()`向每个匹配的元素内部追加内容
> * `appendTo()`将所有匹配的元素追加到指定的元素中
>   * 使用该方法是颠倒了常规的`$(A).append(B)`的操作，即不是将B追加到A中，而是将A追加到B中
> * `prepend()`每个匹配的元素内部前置内容
> * `prependTo()`将所有匹配的元素前置到指定的元素中
>   * 使用该方法是颠倒了常规的`$(A).prepend(B)`的操作，即不是将B前置到A中，而是将A前置到B中
> * `after()`在每个匹配的元素之后插入内容
> * `insertAfter()`将所有匹配的元素插入到指定元素的后面
>   * 使用该方法是颠倒了常规的`$(A).after(B)`的操作，即不是将B插入到A后面，而是将A插入到B后面
> * `before()`在每个匹配元素之前插入内容
> * `insertBefore()`将所有匹配的元素插入到指定的元素的前面
>   * 使用该方法是颠倒了常规的`$(A).before(B)`的操作，即不是将B插入到A前面，而是将A插入到B前面
>
> 查找结点
>
> * 通过选择器查找
>
> 删除节点
>
> * `remove()`从DOM中删除所有匹配的元素
>   * 当某个节点用`remove()`方法删除后，该节点所包含的所有后代节点将同时被删除
> * `empty()`该方法不删除节点，而是清空节点，它能清空元素中的所有后代节点

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>元素操作</title>
		<script type="text/javascript" src="../js/jquery-3.3.1.min.js" ></script>
		<style>
			#main {
				margin: 0 auto;/*设置整个盒子居中,一定要设置宽度*/
				width: 500px;
			}
			
			p {
				text-align: center;/*设置段落中的内容居中*/
			}
			
			table {
				width: 500px;
				border-collapse: collapse;/*去除边框中间的空白区域*/
			}
			
			table, tr, td {
				border: 1px solid black;
			}
		</style>
		<script>
			/*
			 	$(html) 创建表示html的节点
			 	append() 在元素内部追加
			 * */
			function addItem() {
				//获取table
				var $tb = $("#tb1");
				//获取表示行的节点
				var $line = $("<tr></tr>");
				
				//创建存放姓名的单元格
				var $tdName = $("<td></td>");
				//获取表单中的姓名
				var $txtName = $("#username").val();
				//设置单元格的内容
				$tdName.text($txtName);
				
				//创建存放年龄的单元格
				var $tdAge = $("<td></td>");
				//获取表单中的年龄
				var $txtAge = $("#age").val();
				//设置单元格的内容
				$tdAge.text($txtAge);
				
				//创建存放电话的单元格
				var $tdTel = $("<td></td>");
				//获取表单中的电话
				var $txtTel = $("#tel").val();
				//设置单元格的内容
				$tdTel.text($txtTel);
				
				//创建存放删除按钮的单元格
				var $tdDel = $("<td></td>");
				//创建按钮
				var $btnDel = $("<button>删除</button>");
				$btnDel.prop("type", "button");
				//为删除按钮设置单击事件,删除按钮所在行
				$btnDel.click(function() {
					$(this).parent().parent().remove();
				});
				//将按钮放入单元格中
				$tdDel.append($btnDel);
				
				//在行中追加元素
				$line.append($tdName);
				$line.append($tdAge);
				$line.append($tdTel);
				$line.append($tdDel);
				
				//将行追加到table中
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

> 另一个案例

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
                    if($(this).prop("selected")) {
                        $("#selectRight").append($(this));
                    }
                });
            });

            $("#checkToLeft").click(function () {
                $("#selectRight option").each(function () {
                    if($(this).prop("selected")) {
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

### 4.3、属性操作

> `attr(name)`读取指定属性的值
>
> `attr(name, value)`设置指定属性的值
>
> `removeAttr(name)`删除指定属性
>
> `prop()`
>
> * 如果有相应的属性，返回指定属性值
> * 如果没有相应的属性，返回值是空字符串
> * 处理元素本来就有的属性
>
> `attr()`
>
> * 如果有相应的属性，返回指定属性值
> * 如果没有相应的属性，返回值是undefined
> * 处理自定义属性

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
						//$(this)表示当前遍历到的元素
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

### 4.4、CSS操作

> `css(name)`获取指定名称的样式值
>
> `css(name,value)`设置指定名称的样式值

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

## 五、jQuery效果（了解）

### 5.1、隐藏和显示

> `hide()`隐藏html元素
>
> `show()`显示html元素

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.min.js">
    </script>
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
    <p>如果你点击“隐藏” 按钮，我将会消失。</p>
    <button id="hide">隐藏</button>
    <button id="show">显示</button>
</body>
</html>
```

> `$(selector).hide(speed,callback);`
>
> `$(selector).show(speed,callback);`
>
> 可选的speed参数规定隐藏/显示的速度，可以取以下值："slow"、"fast" 或毫秒。
>
> 可选的callback参数是隐藏或显示完成后所执行的函数名称。

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
                    alert("Hide() 方法已完成!");
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

> 可以使用toggle()方法来切换hide()和show()方法。

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

### 5.2、淡入淡出

> `fadeIn()`用于淡入已隐藏的元素

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.min.js">
    </script>
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

> `fadeOut()`方法用于淡出可见元素

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

> `fadeToggle()`方法可以在 fadeIn() 与 fadeOut() 方法之间进行切换

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
    <p>实例演示了 fadeToggle() 使用了不同的 speed(速度) 参数。</p>
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

