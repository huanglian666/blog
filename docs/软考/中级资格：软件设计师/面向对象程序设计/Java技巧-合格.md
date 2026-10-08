---
title: Java技巧-合格
date: 2026-10-08T19:17:32+08:00
lastmod: 2026-10-08T19:39:40+08:00
---

# Java技巧-合格

## 1. 考点：类的定义

### 1.1 类的定义格式

Java 中定义一个类的标准语法结构如下：

```JAVA
[import包]

[类修饰符] class xxxClass [extends 超类][implements 接口] {
    public
        公有数据成员或公有函数成员的定义;
    protected
        保护数据成员或保护函数成员的定义;
    private
        私有数据成员或私有函数成员的定义;
}
```

### 1.2 核心语法说明

- **​`import包`​**：用于引入包中的类。
- **类修饰符**​：主要有 3 个修饰符：​`public`​、​`abstract`​、​`final`。
- **类名结构**​：​`class`​ 为关键字，​`xxxClass` 为类名，其命名需遵循 Java 标识符的命名规则。
- **继承与实现**：​`extends`​ 为继承关键字，​`implements` 为接口实现关键字。

## 2. 考点：父类与父接口的区别

### 2.1 核心区别简述

- **​`extends`​**​ **（继承父类）** ：用于类与类、或接口与接口之间的继承。子类可以继承父类的属性和方法，并可重写父类的方法。
- **​`implements`​**​ **（实现接口）** ：用于类实现接口。类必须实现接口中定义的所有抽象方法。

### 2.2 代码示例对比

#### 2.2.1 类实现接口 (​`implements`)

展示了折扣收费类 ​`CashDiscount`​ 实现 ​`CashSuper` 接口的代码结构：

```JAVA
class CashDiscount implements CashSuper {
    private double moneyDiscount; // 折扣率
    public CashDiscount(double moneyDiscount) {
        this.moneyDiscount = moneyDiscount;
    }
}
```

#### 2.2.2 类继承父类 (​`extends`)

展示了装饰者模式中，奶泡类 ​`Whip`​ 继承抽象调料装饰者父类 ​`CondimentDecorator` 的代码结构：

```JAVA
class Whip extends CondimentDecorator { // 奶泡
    private final int WHIP_PRICE = 8;
    public Whip (Beverage beverage) {
        this.beverage = beverage; 
    }
    public String getDescription () {
        return beverage.getDescription () + ", Whip";
    }
    public int cost() {
        return WHIP_PRICE + beverage.cost();
    }
}
```

## 3. 考点；abstract关键字

### 3.1 代码示例

以装饰者模式中的饮料抽象基类（​`Beverage`）为例：

```JAVA
import java.util.*;

abstract class Beverage { // (1) 抽象类必须用 abstract 修饰
    String description = "Unknown Beverage";
    
    public String getDescription () { 
        return description; 
    }
    
    public abstract int cost(); // 抽象方法
}
```

### 3.2 核心总结

- **抽象类与抽象方法**​：包含抽象方法的类必须被声明为抽象类（使用 ​`abstract` 修饰）。
- **规范要求**​：抽象方法所在的类必须用 ​`abstract` 修饰。

## 4. 考点：继承

### 4.1 示例一：类继承（​`extends`）

```JAVA
class Department {/*代码省略*/}
class SqlserverDepartment extends Department {/*代码省略*/}
```

- **解析**​：​`SqlserverDepartment`​ 是 ​`Department`​ 的子类，使用 ​`extends` 关键字实现继承。

### 4.2 示例二：抽象类与抽象方法

```JAVA
abstract class Shape{
    abstract public void draw();
}
class Rectangle extends Shape{
    public void draw() {/*代码省略*/}
}
```

- **解析**：

  - 包含抽象方法的类必须定义为抽象类，因此第一个括号处应填 ​**​`abstract`​**。
  - 子类 ​`Rectangle`​ 继承抽象类后，必须实现父类中的抽象方法，因此第二个括号处应填具体的重写方法声明，如 ​**​`public void draw()`​** 。

## 5. 考点：接口的定义

### 5.1 接口的定义格式

Java 中定义一个接口的标准语法结构如下：

```JAVA
[修饰符] interface I接口名 [extends 父接口名列表]{
    [public] [static] [final] 常量;
    [public] [abstract] 方法;
}
```

### 5.2 具体代码示例

以工厂方法模式中的工厂接口定义及实现类为例：

```JAVA
interface IFactory{}

class SqlServerFactory implements IFactory{}
```

### 5.3 接口案例实战

#### 5.3.1 题目

```JAVA
（1）Drawing {
    （2）;
    （3）;
}

class V1Drawing implements Drawing {
    public void drawLine(double x1, double y1, double x2, double y2) {/*代码省略*/}
    public void drawCircle (double x, double y, double r) {/*代码省略*/}
}
```

#### 5.3.2 核心解析

- **第一空（接口声明）** ​：定义接口使用 ​**​`interface`​**​ 关键字（而不是 ​`class`​），即 ​`interface Drawing`。
- **第二、三空（接口方法）** ​：接口中的方法默认为抽象方法，只需声明方法签名并以分号 ​`;` 结尾，不需要方法体。

  - `void drawLine(double x1, double y1, double x2, double y2);`
  - `void drawCircle(double x, double y, double r);`
- **实现类要求**：子类 ​`V1Drawing`​ 通过 ​`implements`​ 关键字实现 ​`Drawing`​ 接口，并必须使用 ​`public` 访问修饰符完整重写接口中的所有抽象方法。

#### 5.3.3 正确答案

<span data-type="text" style="color: var(--b3-font-color6);">（1）：</span>​**​`interface`​**​<span data-type="text" style="color: var(--b3-font-color6);">。</span>

<span data-type="text" style="color: var(--b3-font-color6);">（2）：</span>​`void drawLine(double x1, double y1, double x2, double y2)`​

<span data-type="text" style="color: var(--b3-font-color6);">（3）：</span>​`void drawCircle(double x, double y, double r)`​

## 6. 考点：设计模式技巧总结

### 6.1 继承、抽象与接口规则 (1-3点)

1. **子类与父类的关系**​：子类继承父类使用 ​`extends`​，子类实现父接口使用 ​`implements`。
2. **抽象方法的定义**​：抽象方法没有方法体，没有 ​`{}`​，结尾必须带有分号 ​`;`。

   - **代码示例**：
   - ```JAVA
     abstract class A {
         public void method1() {
             // 普通方法有方法体
         }
         public abstract void method2(); // 抽象方法无方法体，以分号结尾
     }
     ```
3. **修饰规则**​：类中只要含有抽象方法，该类就必须用 ​`abstract`​ 修饰；接口中的所有方法默认都是 ​`abstract`，通常不需要显式添加。

   - **代码示例**：
   - ```JAVA
     interface B {
         public void method1(); // 接口中的方法默认是抽象方法
     }
     ```

### 6.2 方法重写、静态调用与规范

4. **抽象方法重写**：父类（或父接口）中的抽象方法，子类必须进行重写。解题时可以通过父类/父接口反推子类代码，反之亦然。
5. **静态方法调用**​：用 ​`static` 修饰的方法，可以直接通过类名进行调用。

   - **代码示例**：
   - ```JAVA
     class A {
         public static void method1() { }
     }

     // 调用示例
     A.method1();
     ```
6. **大小写规范**：Java 语言严格区分大小写，写代码时务必注意区分。

### 6.3 构造方法、​`this` 与代码填空实战技巧 (7-12点)

7. **构造方法与属性**：构造方法一般用于初始化属性；如果当前子类没有该属性，那么父类中肯定包含该属性。

   - **代码示例**：
   - ```JAVA
     class Son extends Father {
         public Son(List l) {
             this.l = l;
         }
     }
     ```
8. **​`this`​**​ **关键字**：表示当前对象，一般用于区分属性和参数，也可以作为数据传递给方法。

   - **代码示例**：
   - ```JAVA
     method(Xx) {
         x.___(this);
     }
     ```
9. **填空识别技巧**：代码方法内部的空白处通常是调用方法，可以是参数对象的方法、该类其他方法，或者是某个属性的方法。

   - **代码示例**：
   - ```JAVA
     method1 (Xx) {
         x.___;
         method2 ();
         s._______;
     }
     method2()
     ```
10. **UML 可见性符号**​：​`#`​ 代表 ​`protected`​，​`+`​ 代表 ​`public`​，​`-`​ 代表 ​`private`。
11. **代入数据调试**​：带入具体数据去理解代码逻辑时，尤其要注意 ​`null` 值的处理。
12. **核心背诵要求**：理解并背诵 23 个设计模式的类图与代码。

‍
