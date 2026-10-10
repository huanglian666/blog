---
title: 自定义Spring框架
date: 2026-09-12
icon: fa-solid fa-toolbox
category: [设计模式]
tag: [综合案例]
---

# 自定义Spring框架

## 1. Spring使用回顾

自定义 Spring 框架前，先回顾一下 Spring 框架的使用，从而分析 Spring 的核心，并对核心功能进行模拟。

- 数据访问层。定义 `UserDao` 接口及其子实现类：

  ```java
  public interface UserDao {
      public void add();
  }

  public class UserDaoImpl implements UserDao {

      public void add() {
          System.out.println("userDaoImpl ....");
      }
  }
  ```

- 业务逻辑层。定义 `UserService` 接口及其子实现类：

  ```java
  public interface UserService {
      public void add();
  }

  public class UserServiceImpl implements UserService {

      private UserDao userDao;

      public void setUserDao(UserDao userDao) {
          this.userDao = userDao;
      }

      public void add() {
          System.out.println("userServiceImpl ...");
          userDao.add();
      }
  }
  ```

- 定义 `UserController` 类，使用 main 方法模拟 controller 层：

  ```java
  public class UserController {
      public static void main(String[] args) {
          // 创建spring容器对象
          ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
          // 从IOC容器中获取UserService对象
          UserService userService = applicationContext.getBean("userService", UserService.class);
          // 调用UserService对象的add方法
          userService.add();
      }
  }
  ```

- 编写配置文件。在类路径下编写一个名为 `applicationContext.xml` 的配置文件：

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://www.springframework.org/schema/beans"
         xmlns:context="http://www.springframework.org/schema/context"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd
          http://www.springframework.org/schema/context
          http://www.springframework.org/schema/context/spring-context.xsd">

      <bean id="userService" class="com.itheima.service.impl.UserServiceImpl">
          <property name="userDao" ref="userDao"></property>
      </bean>

      <bean id="userDao" class="com.itheima.dao.impl.UserDaoImpl"></bean>

  </beans>
  ```

代码运行结果如下：

![Spring容器运行结果](./_pic/image-20200429165544151.png)

通过上面代码及结果可以看出：

- `userService` 对象是从 `applicationContext` 容器对象获取到的，也就是 `userService` 对象交由 Spring 进行管理；
- 上面结果可以看到调用了 `UserDao` 对象中的 `add` 方法，也就是说 `UserDao` 子实现类对象也交由 Spring 管理了；
- `UserServiceImpl` 中的 `userDao` 变量我们并没有进行赋值，但是可以正常使用，说明 Spring 已经将 `UserDao` 对象赋值给了 `userDao` 变量。

上面三点体现了 Spring 框架的 IOC（Inversion of Control，控制反转）和 DI（Dependency Injection，依赖注入）。

## 2. Spring核心功能结构

Spring 大约有 20 个模块，由 1300 多个不同的文件构成。这些模块可以分为：核心容器、AOP 和设备支持、数据访问与集成、Web 组件、通信报文和集成测试等，下面是 Spring 框架的总体架构图：

![Spring框架总体架构图](./_pic/image-20200429111324770.png)

核心容器由 beans、core、context 和 expression（Spring Expression Language，SpEL）4 个模块组成。

- **spring-beans 和 spring-core** 模块是 Spring 框架的核心模块，包含了控制反转（Inversion of Control，IOC）和依赖注入（Dependency Injection，DI）。`BeanFactory` 使用控制反转对应用程序的配置和依赖性规范与实际的应用程序代码进行了分离。`BeanFactory` 属于延时加载，也就是说在实例化容器对象后并不会自动实例化 Bean，只有当 Bean 被使用时，`BeanFactory` 才会对该 Bean 进行实例化与依赖关系的装配；
- **spring-context** 模块构架于核心模块之上，扩展了 `BeanFactory`，为它添加了 Bean 生命周期控制、框架事件体系及资源加载透明化等功能。此外，该模块还提供了许多企业级支持，如邮件访问、远程访问、任务调度等。`ApplicationContext` 是该模块的核心接口，它的超类是 `BeanFactory`。与 `BeanFactory` 不同，`ApplicationContext` 实例化后会自动对所有的单实例 Bean 进行实例化与依赖关系的装配，使之处于待用状态；
- **spring-context-support** 模块是对 Spring IoC 容器及 IoC 子容器的扩展支持；
- **spring-context-indexer** 模块是 Spring 的类管理组件和 Classpath 扫描组件；
- **spring-expression** 模块是统一表达式语言（EL）的扩展模块，可以查询、管理运行中的对象，同时也可以方便地调用对象方法，以及操作数组、集合等。它的语法类似于传统 EL，但提供了额外的功能，最出色的要数函数调用和简单字符串的模板函数。EL 的特性是基于 Spring 产品的需求而设计的，可以非常方便地同 Spring IoC 进行交互。

### 2.1 bean概述

Spring 就是面向 `Bean` 的编程（BOP，Bean Oriented Programming），Bean 在 Spring 中处于核心地位。Bean 对于 Spring 的意义就像 Object 对于 OOP 的意义一样，Spring 中没有 Bean 也就没有 Spring 存在的意义。Spring IoC 容器通过配置文件或者注解的方式来管理 bean 对象之间的依赖关系。

Spring 中 bean 用于对一个类进行封装。如下面的配置：

```xml
<bean id="userService" class="com.itheima.service.impl.UserServiceImpl">
    <property name="userDao" ref="userDao"></property>
</bean>
<bean id="userDao" class="com.itheima.dao.impl.UserDaoImpl"></bean>
```

为什么 Bean 如此重要呢？

- Spring 将 bean 对象交由一个叫 IOC 容器进行管理；
- bean 对象之间的依赖关系在配置文件中体现，并由 Spring 完成。

## 3. Spring IOC相关接口分析

### 3.1 BeanFactory解析

Spring 中 Bean 的创建是典型的工厂模式，这一系列的 Bean 工厂，即 IoC 容器，为开发者管理对象之间的依赖关系提供了很多便利和基础服务。在 Spring 中有许多 IoC 容器的实现供用户选择，其相互关系如下图所示。

![Spring IOC容器继承体系](./_pic/image-20200429185050396.png)

其中，`BeanFactory` 作为最顶层的一个接口，定义了 IoC 容器的基本功能规范。`BeanFactory` 有三个重要的子接口：`ListableBeanFactory`、`HierarchicalBeanFactory` 和 `AutowireCapableBeanFactory`。但是从类图中我们可以发现最终的默认实现类是 `DefaultListableBeanFactory`，它实现了所有的接口。

那么为何要定义这么多层次的接口呢？

每个接口都有它的使用场合，主要是为了区分在 Spring 内部操作过程中对象的传递和转化，对对象的数据访问所做的限制。例如：

- `ListableBeanFactory` 接口表示这些 Bean 可列表化；
- `HierarchicalBeanFactory` 表示这些 Bean 是有继承关系的，也就是每个 Bean 可能有父 Bean；
- `AutowireCapableBeanFactory` 接口定义 Bean 的自动装配规则。

这三个接口共同定义了 Bean 的集合、Bean 之间的关系及 Bean 行为。最基本的 IoC 容器接口是 `BeanFactory`，来看一下它的源码：

```java
public interface BeanFactory {

    String FACTORY_BEAN_PREFIX = "&";

    // 根据bean的名称获取IOC容器中的bean对象
    Object getBean(String name) throws BeansException;
    // 根据bean的名称获取IOC容器中的bean对象，并指定获取到的bean对象的类型，这样我们使用时就不需要进行类型强转了
    <T> T getBean(String name, Class<T> requiredType) throws BeansException;
    Object getBean(String name, Object... args) throws BeansException;
    <T> T getBean(Class<T> requiredType) throws BeansException;
    <T> T getBean(Class<T> requiredType, Object... args) throws BeansException;

    <T> ObjectProvider<T> getBeanProvider(Class<T> requiredType);
    <T> ObjectProvider<T> getBeanProvider(ResolvableType requiredType);

    // 判断容器中是否包含指定名称的bean对象
    boolean containsBean(String name);
    // 根据bean的名称判断是否是单例
    boolean isSingleton(String name) throws NoSuchBeanDefinitionException;
    boolean isPrototype(String name) throws NoSuchBeanDefinitionException;
    boolean isTypeMatch(String name, ResolvableType typeToMatch) throws NoSuchBeanDefinitionException;
    boolean isTypeMatch(String name, Class<?> typeToMatch) throws NoSuchBeanDefinitionException;
    @Nullable
    Class<?> getType(String name) throws NoSuchBeanDefinitionException;
    String[] getAliases(String name);
}
```

在 `BeanFactory` 里只对 IoC 容器的基本行为做了定义，根本不关心你的 Bean 是如何定义及怎样加载的。正如我们只关心能从工厂里得到什么产品，不关心工厂是怎么生产这些产品的。

`BeanFactory` 有一个很重要的子接口，就是 `ApplicationContext` 接口，该接口主要来规范容器中的 bean 对象是非延时加载，即在创建容器对象的时候就对 bean 进行初始化，并存储到一个容器中。

![ApplicationContext接口继承体系](./_pic/image-20200430220155371.png)

要知道工厂是如何产生对象的，我们需要看具体的 IoC 容器实现。Spring 提供了许多 IoC 容器实现，比如：

| 容器实现 | 说明 |
| --- | --- |
| `ClassPathXmlApplicationContext` | 根据类路径加载 xml 配置文件，并创建 IOC 容器对象 |
| `FileSystemXmlApplicationContext` | 根据系统路径加载 xml 配置文件，并创建 IOC 容器对象 |
| `AnnotationConfigApplicationContext` | 加载注解类配置，并创建 IOC 容器 |

### 3.2 BeanDefinition解析

Spring IoC 容器管理我们定义的各种 Bean 对象及其相互关系，而 Bean 对象在 Spring 实现中是以 `BeanDefinition` 来描述的，如下面配置文件：

```xml
<bean id="userDao" class="com.itheima.dao.impl.UserDaoImpl"></bean>
```

bean 标签还有很多属性：`scope`、`init-method`、`destroy-method` 等。

其继承体系如下图所示。

![BeanDefinition继承体系](./_pic/image-20200429204239868.png)

### 3.3 BeanDefinitionReader解析

Bean 的解析过程非常复杂，功能被分得很细，因为这里需要被扩展的地方很多，必须保证足够的灵活性，以应对可能的变化。Bean 的解析主要就是对 Spring 配置文件的解析。这个解析过程主要通过 `BeanDefinitionReader` 来完成，看看 Spring 中 `BeanDefinitionReader` 的类结构图，如下图所示。

![BeanDefinitionReader类结构图](./_pic/image-20200429204700956.png)

看看 `BeanDefinitionReader` 接口定义的功能来理解它具体的作用：

```java
public interface BeanDefinitionReader {

    // 获取BeanDefinitionRegistry注册器对象
    BeanDefinitionRegistry getRegistry();

    @Nullable
    ResourceLoader getResourceLoader();

    @Nullable
    ClassLoader getBeanClassLoader();

    BeanNameGenerator getBeanNameGenerator();

    /*
     * 下面的loadBeanDefinitions都是加载bean定义，从指定的资源中
     */
    int loadBeanDefinitions(Resource resource) throws BeanDefinitionStoreException;
    int loadBeanDefinitions(Resource... resources) throws BeanDefinitionStoreException;
    int loadBeanDefinitions(String location) throws BeanDefinitionStoreException;
    int loadBeanDefinitions(String... locations) throws BeanDefinitionStoreException;
}
```

### 3.4 BeanDefinitionRegistry解析

`BeanDefinitionReader` 用来解析 bean 定义，并封装 `BeanDefinition` 对象。而我们定义的配置文件中定义了很多 bean 标签，所以就有一个问题：解析的 `BeanDefinition` 对象存储到哪儿？答案就是 BeanDefinition 的注册中心，而该注册中心顶层接口就是 `BeanDefinitionRegistry`。

```java
public interface BeanDefinitionRegistry extends AliasRegistry {

    // 往注册表中注册bean
    void registerBeanDefinition(String beanName, BeanDefinition beanDefinition)
            throws BeanDefinitionStoreException;

    // 从注册表中删除指定名称的bean
    void removeBeanDefinition(String beanName) throws NoSuchBeanDefinitionException;

    // 获取注册表中指定名称的bean
    BeanDefinition getBeanDefinition(String beanName) throws NoSuchBeanDefinitionException;

    // 判断注册表中是否已经注册了指定名称的bean
    boolean containsBeanDefinition(String beanName);

    // 获取注册表中所有的bean的名称
    String[] getBeanDefinitionNames();

    int getBeanDefinitionCount();
    boolean isBeanNameInUse(String beanName);
}
```

继承结构图如下：

![BeanDefinitionRegistry继承体系](./_pic/image-20200429211132185.png)

从上面类图可以看到 `BeanDefinitionRegistry` 接口的子实现类主要有以下几个：

- `DefaultListableBeanFactory`，在该类中定义了如下代码，就是用来注册 bean：

  ```java
  private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(256);
  ```

- `SimpleBeanDefinitionRegistry`，在该类中定义了如下代码，就是用来注册 bean：

  ```java
  private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(64);
  ```

### 3.5 创建容器

`ClassPathXmlApplicationContext` 对 Bean 配置资源的载入是从 `refresh()` 方法开始的。`refresh()` 方法是一个模板方法，规定了 IoC 容器的启动流程，有些逻辑要交给其子类实现。它对 Bean 配置资源进行载入，`ClassPathXmlApplicationContext` 通过调用其父类 `AbstractApplicationContext` 的 `refresh()` 方法启动整个 IoC 容器对 Bean 定义的载入过程。

## 4. 自定义Spring IOC

现要对下面的配置文件进行解析，并自定义 Spring 框架的 IOC 对涉及到的对象进行管理。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans>
    <bean id="userService" class="com.itheima.service.impl.UserServiceImpl">
        <property name="userDao" ref="userDao"></property>
    </bean>
    <bean id="userDao" class="com.itheima.dao.impl.UserDaoImpl"></bean>
</beans>
```

### 4.1 定义bean相关的pojo类

#### 4.1.1 PropertyValue类

用于封装 bean 的属性，体现到上面的配置文件就是封装 bean 标签的子标签 property 标签数据。

```java
public class PropertyValue {

    private String name;
    private String ref;
    private String value;

    public PropertyValue() {
    }

    public PropertyValue(String name, String ref, String value) {
        this.name = name;
        this.ref = ref;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
```

#### 4.1.2 MutablePropertyValues类

一个 bean 标签可以有多个 property 子标签，所以再定义一个 `MutablePropertyValues` 类，用来存储并管理多个 `PropertyValue` 对象。

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class MutablePropertyValues implements Iterable<PropertyValue> {

    private final List<PropertyValue> propertyValueList;

    public MutablePropertyValues() {
        this.propertyValueList = new ArrayList<PropertyValue>();
    }

    public MutablePropertyValues(List<PropertyValue> propertyValueList) {
        this.propertyValueList = (propertyValueList != null ? propertyValueList : new ArrayList<PropertyValue>());
    }

    public PropertyValue[] getPropertyValues() {
        return this.propertyValueList.toArray(new PropertyValue[0]);
    }

    public PropertyValue getPropertyValue(String propertyName) {
        for (PropertyValue pv : this.propertyValueList) {
            if (pv.getName().equals(propertyName)) {
                return pv;
            }
        }
        return null;
    }

    @Override
    public Iterator<PropertyValue> iterator() {
        return propertyValueList.iterator();
    }

    public boolean isEmpty() {
        return this.propertyValueList.isEmpty();
    }

    public MutablePropertyValues addPropertyValue(PropertyValue pv) {
        for (int i = 0; i < this.propertyValueList.size(); i++) {
            PropertyValue currentPv = this.propertyValueList.get(i);
            if (currentPv.getName().equals(pv.getName())) {
                this.propertyValueList.set(i, new PropertyValue(pv.getName(), pv.getRef(), pv.getValue()));
                return this;
            }
        }
        this.propertyValueList.add(pv);
        return this;
    }

    public boolean contains(String propertyName) {
        return getPropertyValue(propertyName) != null;
    }
}
```

#### 4.1.3 BeanDefinition类

`BeanDefinition` 类用来封装 bean 信息的，主要包含 id（即 bean 对象的名称）、class（需要交由 Spring 管理的类的全类名）及子标签 property 数据。

```java
public class BeanDefinition {
    private String id;
    private String className;

    private MutablePropertyValues propertyValues;

    public BeanDefinition() {
        propertyValues = new MutablePropertyValues();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public void setPropertyValues(MutablePropertyValues propertyValues) {
        this.propertyValues = propertyValues;
    }

    public MutablePropertyValues getPropertyValues() {
        return propertyValues;
    }
}
```

### 4.2 定义注册表相关类

#### 4.2.1 BeanDefinitionRegistry接口

`BeanDefinitionRegistry` 接口定义了注册表的相关操作，定义如下功能：

- 注册 `BeanDefinition` 对象到注册表中；
- 从注册表中删除指定名称的 `BeanDefinition` 对象；
- 根据名称从注册表中获取 `BeanDefinition` 对象；
- 判断注册表中是否包含指定名称的 `BeanDefinition` 对象；
- 获取注册表中 `BeanDefinition` 对象的个数；
- 获取注册表中所有的 `BeanDefinition` 的名称。

```java
public interface BeanDefinitionRegistry {

    // 注册BeanDefinition对象到注册表中
    void registerBeanDefinition(String beanName, BeanDefinition beanDefinition);

    // 从注册表中删除指定名称的BeanDefinition对象
    void removeBeanDefinition(String beanName) throws Exception;

    // 根据名称从注册表中获取BeanDefinition对象
    BeanDefinition getBeanDefinition(String beanName) throws Exception;

    boolean containsBeanDefinition(String beanName);

    int getBeanDefinitionCount();

    String[] getBeanDefinitionNames();
}
```

#### 4.2.2 SimpleBeanDefinitionRegistry类

该类实现了 `BeanDefinitionRegistry` 接口，定义了 Map 集合作为注册表容器。

```java
import java.util.HashMap;
import java.util.Map;

public class SimpleBeanDefinitionRegistry implements BeanDefinitionRegistry {

    private Map<String, BeanDefinition> beanDefinitionMap = new HashMap<String, BeanDefinition>();

    @Override
    public void registerBeanDefinition(String beanName, BeanDefinition beanDefinition) {
        beanDefinitionMap.put(beanName, beanDefinition);
    }

    @Override
    public void removeBeanDefinition(String beanName) throws Exception {
        beanDefinitionMap.remove(beanName);
    }

    @Override
    public BeanDefinition getBeanDefinition(String beanName) throws Exception {
        return beanDefinitionMap.get(beanName);
    }

    @Override
    public boolean containsBeanDefinition(String beanName) {
        return beanDefinitionMap.containsKey(beanName);
    }

    @Override
    public int getBeanDefinitionCount() {
        return beanDefinitionMap.size();
    }

    @Override
    public String[] getBeanDefinitionNames() {
        return beanDefinitionMap.keySet().toArray(new String[1]);
    }
}
```

### 4.3 定义解析器相关类

#### 4.3.1 BeanDefinitionReader接口

`BeanDefinitionReader` 是用来解析配置文件并在注册表中注册 bean 的信息。定义了两个规范：

- 获取注册表的功能，让外界可以通过该对象获取注册表对象；
- 加载配置文件，并注册 bean 数据。

```java
public interface BeanDefinitionReader {

    // 获取注册表对象
    BeanDefinitionRegistry getRegistry();

    // 加载配置文件并在注册表中进行注册
    void loadBeanDefinitions(String configLocation) throws Exception;
}
```

#### 4.3.2 XmlBeanDefinitionReader类

`XmlBeanDefinitionReader` 类是专门用来解析 xml 配置文件的。该类实现 `BeanDefinitionReader` 接口并实现接口中的两个功能。

```java
import java.io.InputStream;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

public class XmlBeanDefinitionReader implements BeanDefinitionReader {

    private BeanDefinitionRegistry registry;

    public XmlBeanDefinitionReader() {
        this.registry = new SimpleBeanDefinitionRegistry();
    }

    @Override
    public BeanDefinitionRegistry getRegistry() {
        return registry;
    }

    @Override
    public void loadBeanDefinitions(String configLocation) throws Exception {

        InputStream is = this.getClass().getClassLoader().getResourceAsStream(configLocation);
        SAXReader reader = new SAXReader();
        Document document = reader.read(is);
        Element rootElement = document.getRootElement();
        // 解析bean标签
        parseBean(rootElement);
    }

    private void parseBean(Element rootElement) {

        List<Element> elements = rootElement.elements();
        for (Element element : elements) {
            String id = element.attributeValue("id");
            String className = element.attributeValue("class");
            BeanDefinition beanDefinition = new BeanDefinition();
            beanDefinition.setId(id);
            beanDefinition.setClassName(className);
            List<Element> list = element.elements("property");
            MutablePropertyValues mutablePropertyValues = new MutablePropertyValues();
            for (Element propertyElement : list) {
                String name = propertyElement.attributeValue("name");
                String ref = propertyElement.attributeValue("ref");
                String value = propertyElement.attributeValue("value");
                PropertyValue propertyValue = new PropertyValue(name, ref, value);
                mutablePropertyValues.addPropertyValue(propertyValue);
            }
            beanDefinition.setPropertyValues(mutablePropertyValues);

            registry.registerBeanDefinition(id, beanDefinition);
        }
    }
}
```

> [!NOTE]
> `SAXReader`、`Document`、`Element` 均来自 dom4j（`org.dom4j`），使用本例需要先引入 dom4j 依赖。

### 4.4 IOC容器相关类

#### 4.4.1 BeanFactory接口

在该接口中定义 IOC 容器的统一规范，即获取 bean 对象。

```java
public interface BeanFactory {
    // 根据bean对象的名称获取bean对象
    Object getBean(String name) throws Exception;

    // 根据bean对象的名称获取bean对象，并进行类型转换
    <T> T getBean(String name, Class<? extends T> clazz) throws Exception;
}
```

#### 4.4.2 ApplicationContext接口

该接口的所有子实现类对 bean 对象的创建都是非延时的，所以在该接口中定义 `refresh()` 方法，该方法主要完成以下两个功能：

- 加载配置文件；
- 根据注册表中的 `BeanDefinition` 对象封装的数据进行 bean 对象的创建。

```java
public interface ApplicationContext extends BeanFactory {
    // 进行配置文件加载并进行对象创建
    void refresh() throws Exception;
}
```

#### 4.4.3 AbstractApplicationContext类

- 作为 `ApplicationContext` 接口的子类，所以该类也是非延时加载，所以需要在该类中定义一个 Map 集合，作为 bean 对象存储的容器；
- 声明 `BeanDefinitionReader` 类型的变量，用来进行 xml 配置文件的解析，符合单一职责原则。`BeanDefinitionReader` 类型的对象创建交由子类实现，因为只有子类明确到底创建 `BeanDefinitionReader` 哪个子实现类对象。

```java
import java.util.HashMap;
import java.util.Map;

public abstract class AbstractApplicationContext implements ApplicationContext {

    protected BeanDefinitionReader beanDefinitionReader;
    // 用来存储bean对象的容器，key存储的是bean的id值，value存储的是bean对象
    protected Map<String, Object> singletonObjects = new HashMap<String, Object>();

    // 存储配置文件的路径
    protected String configLocation;

    @Override
    public void refresh() throws Exception {

        // 加载BeanDefinition
        beanDefinitionReader.loadBeanDefinitions(configLocation);

        // 初始化bean
        finishBeanInitialization();
    }

    // bean的初始化
    private void finishBeanInitialization() throws Exception {
        BeanDefinitionRegistry registry = beanDefinitionReader.getRegistry();
        String[] beanNames = registry.getBeanDefinitionNames();

        for (String beanName : beanNames) {
            getBean(beanName);
        }
    }
}
```

> [!NOTE]
> 该类 `finishBeanInitialization()` 方法中调用 `getBean()` 方法使用到了模板方法模式：父类规定"初始化时逐个创建 bean"的骨架，而 `getBean()` 的具体实现延迟到子类。

#### 4.4.4 ClassPathXmlApplicationContext类

该类主要是加载类路径下的配置文件，并进行 bean 对象的创建，主要完成以下功能：

- 在构造方法中，创建 `BeanDefinitionReader` 对象；
- 在构造方法中，调用 `refresh()` 方法，用于进行配置文件加载、创建 bean 对象并存储到容器中；
- 重写父接口中的 `getBean()` 方法，并实现依赖注入操作。

```java
import java.lang.reflect.Method;

public class ClassPathXmlApplicationContext extends AbstractApplicationContext {

    public ClassPathXmlApplicationContext(String configLocation) {
        this.configLocation = configLocation;
        // 构建XmlBeanDefinitionReader对象
        beanDefinitionReader = new XmlBeanDefinitionReader();
        try {
            this.refresh();
        } catch (Exception e) {
        }
    }

    // 根据bean的id属性值获取bean对象
    @Override
    public Object getBean(String name) throws Exception {

        Object obj = singletonObjects.get(name);
        if (obj != null) {
            return obj;
        }

        BeanDefinitionRegistry registry = beanDefinitionReader.getRegistry();
        BeanDefinition beanDefinition = registry.getBeanDefinition(name);
        if (beanDefinition == null) {
            return null;
        }
        String className = beanDefinition.getClassName();
        Class<?> clazz = Class.forName(className);
        Object beanObj = clazz.newInstance();
        MutablePropertyValues propertyValues = beanDefinition.getPropertyValues();
        for (PropertyValue propertyValue : propertyValues) {
            String propertyName = propertyValue.getName();
            String value = propertyValue.getValue();
            String ref = propertyValue.getRef();
            if (ref != null && !"".equals(ref)) {

                Object bean = getBean(ref);
                String methodName = StringUtils.getSetterMethodNameByFieldName(propertyName);
                Method[] methods = clazz.getMethods();
                for (Method method : methods) {
                    if (method.getName().equals(methodName)) {
                        method.invoke(beanObj, bean);
                    }
                }
            }

            if (value != null && !"".equals(value)) {
                String methodName = StringUtils.getSetterMethodNameByFieldName(propertyName);
                Method method = clazz.getMethod(methodName, String.class);
                method.invoke(beanObj, value);
            }
        }
        singletonObjects.put(name, beanObj);
        return beanObj;
    }

    @Override
    public <T> T getBean(String name, Class<? extends T> clazz) throws Exception {

        Object bean = getBean(name);
        if (bean != null) {
            return clazz.cast(bean);
        }
        return null;
    }
}
```

> [!NOTE]
> 代码中的 `StringUtils.getSetterMethodNameByFieldName()` 是一个工具方法：把属性名拼装成 setter 方法名，比如 `userDao` 拼成 `setUserDao`，用于反射调用。`getBean()` 里递归调用 `getBean(ref)`，先创建出依赖的 bean，再通过 setter 注入，这就是最朴素的依赖注入实现。

### 4.5 自定义Spring IOC总结

#### 4.5.1 使用到的设计模式

| 模式 | 体现 |
| --- | --- |
| 工厂模式 | 使用工厂模式 + 配置文件的方式创建对象 |
| 单例模式 | Spring IOC 管理的 bean 对象都是单例的。此处的单例不是通过构造器进行控制，而是 Spring 框架对每一个 bean 只创建了一个对象 |
| 模板方法模式 | `AbstractApplicationContext` 类中的 `finishBeanInitialization()` 方法调用了子类的 `getBean()` 方法，因为 `getBean()` 的实现和环境息息相关 |
| 迭代器模式 | `MutablePropertyValues` 类使用到了迭代器模式。因为此类存储并管理 `PropertyValue` 对象，也属于一个容器，所以给该容器提供一个遍历方式 |

Spring 框架其实使用到了很多设计模式，如 AOP 使用到了代理模式，选择 JDK 代理或者 CGLIB 代理使用到了策略模式，还有适配器模式、装饰者模式、观察者模式等。

#### 4.5.2 符合大部分设计原则

自定义 Spring IOC 的整体设计遵循了大部分设计原则，比如单一职责（解析、注册、容器各司其职）、开闭原则（通过接口和扩展点留出变化的空间）。

#### 4.5.3 整个设计和Spring的设计还是有一定的出入

Spring 框架底层是很复杂的，进行了很深入的封装，并对外提供了很好的扩展性。而我们自定义 Spring IOC 有以下几个目的：

- 了解 Spring 底层对对象的大体管理机制；
- 了解设计模式在具体的开发中的使用；
- 以后学习 Spring 源码，通过该案例的实现，可以降低 Spring 学习的入门成本。
