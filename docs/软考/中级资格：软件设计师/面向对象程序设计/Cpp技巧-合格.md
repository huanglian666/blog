---
title: C++技巧-合格
date: 2026-10-08T14:40:36+08:00
lastmod: 2026-10-08T19:16:43+08:00
icon: fa-solid fa-code
category: [软考]
tag: [面向对象程序设计]
---

# C++技巧-合格

## 1. 考点：类的定义

```cpp
class 类名 (1)
{
    public: (2)
        公有数据成员或公有函数成员的定义; (3)
    protected:
        保护数据成员或保护函数成员的定义;
    private:
        私有数据成员或私有函数成员的定义;
}; (4)
```

### 1.1 核心语法说明

-  **(1) 类名 (** ​**​`class 类名`​**​ **)** ​：使用 ​`class` 关键字声明一个类，后面紧跟自定义的类名。
-  **(2) 访问修饰符**​：包括 ​`public`​（公有）、​`protected`​（保护）和 ​`private`（私有），用于限定类成员的封装与访问权限。
-  **(3) 成员定义**：在不同的访问权限区域内，定义具体的数据成员（变量）与函数成员（方法）。
-  **(4) 结束分号 (** ​ **​`};`​** ​ **)** ：类定义的大括号之后必须加上分号 ​`;`，作为整个类声明结束的标志。

### 1.2 具体示例代码

以策略模式或工厂模式中常见的收费基类（​`CashSuper`）为例：

```cpp
class CashSuper{
	public:
    	virtual double acceptCash(double money){}
};
// 调用示例
CashSuper cs;
cs.acceptCash(100.00);
```

## 2. 考点：派生类的定义

### 2.1 派生类基本语法格式

C++ 中定义一个派生类（继承）的语法结构如下：

```cpp
class 派生类名 : (1) 继承方式1 (2) 基类名1 (, 继承方式2 基类名2, ...)
{
public:
    派生类的公有数据和函数;
protected:
    保护数据成员或保护函数成员的定义;
private:
    派生类的私有数据和函数
};
```

### 2.2 具体代码示例

以继承前面定义的 ​`CashSuper`​ 基类来编写一个正常收费子类（​`CashNormal`）为例：

```cpp
class CashNormal : public CashSuper // 正常子类，public 为继承方式
{
public:
    double acceptCash(double money)
    { return money; }
};
```

### 2.3 核心语法说明

1. **继承声明**​：在派生类名后通过冒号 ​`:`​ 指定继承方式（如 ​`public`​、​`protected`​ 或 ​`private`）和基类名称。支持多继承（用逗号隔开多个基类）。
2. **成员重写**​：子类可以重新定义或实现基类中的虚函数（如 ​`acceptCash`），从而实现面向对象的多态特性。

## 3. 考点：类外定义函数体语法格式

当成员函数不在类的内部直接实现时，可以在类外进行定义，其基本格式如下：

```cpp
返回值类型 类名 :: () 成员函数名 (形参表)
{
    函数体;
}
```

### 3.1 核心语法说明

- **作用域分辨率运算符（** ​ **​`::`​** ​ **）** ：是类的作用域分辨符，放在类名后、成员函数前，用以表明后面的成员函数属于前面的那个类。

### 3.2 具体代码示例

以类外定义 ​`CashNormal`​ 类的 ​`acceptCash` 成员函数为例：

```cpp
double CashNormal :: acceptCash(double money)
{ 
    return money; 
}
```

## 4. 考点：虚函数与纯虚函数（抽象）

### 4.1 语法定义形式

1. 虚函数  
   一般语法形式：virtual 函数类型 函数名 (形参表) { 函数体; }

2. 纯虚函数  
   定义形式：virtual 函数类型 函数名 (形参列表) =0;

### 4.2 具体代码示例

以设计模式中常见的抽象收费超类（CashSuper）定义为例：

```cpp
class CashSuper{
public:
    virtual double acceptCash(double money)=0;
};
```

## 5. 考点：C++ 对象指针与对象引用

### 5.1 语法定义形式

对象指针的定义形式：​`类名*对象指针名`;

对象引用的定义形式：​`类名&对象引用名` = 被引用对象;

### 5.2 访问成员的运算符

通过对象名或对象引用访问对象的成员时，使用的运算符是 ​`.`。

而使用对象指针访问对象的成员时，使用的运算符是​` ->`。

具体的表达式形式如：对象指针名->数据成员名 或 对象指针名->成员函数名 (参数表)。

### 5.3 具体代码示例

以命令模式中的远程控制对象为例：

```cpp
LightOffCommand*remoteControl = new LightOffCommand(kitchenLight);
remoteControl->setCommand(0, livingRoomLightOn, livingRoomLightOff);
```
