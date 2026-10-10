---
title: Linux_软件安装及Java开发环境搭建
date: 2026-09-12
---

# Linux_软件安装及Java开发环境搭建

本篇介绍在 Linux 下安装 JDK、Tomcat、MySQL，配置 Java 开发环境，以及部署 SSM 工程的完整流程。

## 1. 安装 JDK

在 Linux 下安装 JDK，并配置 `JAVA_HOME` 环境变量。

### 1.1 下载 JDK 的压缩包

去官网下载压缩包。由于 Oracle 官网更新，需要登录并同意协议才允许下载：<https://www.oracle.com/java/technologies/javase-jdk8-downloads.html>

### 1.2 将 JDK 压缩包拉取到 Linux 系统中

需要使用图形化界面的 Xftp 将压缩包拖拽到 Linux 操作系统中。

### 1.3 将 JDK 的压缩包解压

后期大多软件都安装在 `/usr/local` 下，直接使用 tar 解压：

```sh
# 在/usr/local/新建目录jdk
$ mkdir jdk
# 解压到新建的jdk目录
$ tar -zxvf jdk-8u281-linux-x64.tar.gz -C /usr/local/jdk
```

### 1.4 配置环境变量

Linux 提供了两种环境变量文件：

- 第一个是用户级别的环境变量，存放在 `~/.bashrc`；
- **第二个是系统级别的环境变量，存放在 `/etc/profile`**。

修改哪个文件都可以（建议采用第二种方式），毕竟虚拟机就我们自己使用。

```sh
# 编辑/etc/profile
$ vim /etc/profile
# 在环境变量文件中，添加如下内容
export JAVA_HOME=/usr/local/jdk/jdk1.8.0_281
export PATH=$JAVA_HOME/bin:$PATH
# 重新加载环境变量文件
$ source /etc/profile
# 最终测试
$ java -version
java version "1.8.0_281"
Java(TM) SE Runtime Environment (build 1.8.0_281-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.281-b09, mixed mode)
$ javac -version
javac 1.8.0_281
```

## 2. 安装 Tomcat

在 Linux 下安装 Tomcat，以便把工程部署到 Linux 操作系统。

### 2.1 下载 Tomcat 的压缩包

Tomcat 8.x 下载地址：<https://tomcat.apache.org/download-80.cgi>

### 2.2 解压压缩包

同样解压到 `/usr/local` 目录下：

```sh
# 在/usr/local/新建目录tomcat
$ mkdir tomcat
# 解压到新建的tomcat目录
tar -zxvf apache-tomcat-8.5.68.tar.gz -C /usr/local/tomcat/
```

### 2.3 启动 Tomcat 并监听日志

通过 `./` 执行可运行文件，并使用 tail 监控日志信息：

```sh
# 跳转到tomcat的bin目录
cd /usr/local/tomcat/apache-tomcat-8.5.68/bin
# 启动
./startup.sh
# 监控日志
cd ../logs
tail -f catalina.out
# 启动成功如下，看到xxx ms就是成功了
23-Jun-2021 06:08:07.620 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory [/usr/local/tomcat/apache-tomcat-8.5.68/webapps/manager] has finished in [18] ms
23-Jun-2021 06:08:07.623 INFO [main] org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler ["http-nio-8080"]
23-Jun-2021 06:08:07.636 INFO [main] org.apache.catalina.startup.Catalina.start Server startup in 541 ms
```

### 2.4 关闭防火墙并访问 Tomcat

由于 Linux 防火墙的限制，此时我们还不能访问 Linux 中的 Tomcat：

```sh
# 关闭防火墙
$ systemctl stop firewalld.service
# 禁止firewall开机启动
$ systemctl disable firewalld.service 
```

在 Windows 浏览器地址栏输入 `http://Linux虚拟机的IP地址:8080`，能够看到如下页面，证明 Tomcat 配置成功：

![Tomcat 默认欢迎页面](./_pic/image-20210623061645125.png)

## 3. 安装 MySQL

在 Linux 下用 yum 的方式安装 MySQL。

### 3.1 准备工作

```sh
# 查看系统自带的Mariadb
$ rpm -qa | grep mariadb
# 卸载系统自带的Mariadb
$ rpm -e --nodeps 刚才查询到的mariadb版本信息
# 关闭防火墙
$ systemctl stop firewalld.service
# 禁止firewall开机启动
$ systemctl disable firewalld.service 
```

### 3.2 安装 MySQL 的 YUM 存储库

使用 wget 下载即可，不过需要先安装 wget，再通过 wget 下载 rpm 包：

```sh
# 首先通过yum下载wget命令
$ yum -y install wget
# 通过wget下载MySQL存储库
$ wget https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
```

### 3.3 安装下载好的 rpm 包

使用 rpm 包的命令直接安装：

```sh
# 安装Yum Repository
$ yum localinstall mysql57-community-release-el7-11.noarch.rpm
# 检查 mysql 源是否安装成功
$ yum repolist enabled | grep "mysql.*-community.*"
```

### 3.4 安装 MySQL 服务器

开始安装，这一步需要下载一段时间：

```sh
$ yum -y install mysql-community-server --nogpgcheck
```

### 3.5 启动 MySQL 服务并连接

安装成功后手动启动，并使用日志中的密码登录。登录后的第一个操作必须是修改密码，才可以进行后续正常操作：

```sh
# 启动MySQL服务
$ systemctl start mysqld.service
# 查看MySQL运行状态，如果显示running说明运行成功
$ systemctl status mysqld.service
# 查看初始化密码
$ grep 'temporary password' /var/log/mysqld.log
# 连接MySQL服务，使用初始化密码登录
$ mysql -u root -p
Enter password:刚才查询到的密码
# 修改密码校验策略
$ mysql> set global validate_password_policy=0;
# 修改密码最小长度
$ mysql> set global validate_password_length=4;
# 如果没有进行上面两个设置，修改密码，要求密码，必须携带大写字母，小写字母，数字，特殊符号
$ mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
```
> [!NOTE]
> `validate_password_policy` / `validate_password_length` 是 MySQL 5.7 的写法；MySQL 8.0 起该插件变量更名为 `validate_password.policy` / `validate_password.length`，且需先安装 validate_password 组件。

### 3.6 开启远程连接

默认 MySQL 禁止远程连接，需要单独创建一个用户开启远程连接，这样就可以在 Windows 下使用图形化工具连接：

```sh
# 任何库和表使用root用户在任意主机上都可以访问
$ mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '新密码' WITH GRANT OPTION;
$ mysql> FLUSH PRIVILEGES;
```

### 3.7 MySQL 字符编码设置

客户端提供 MySQL 的环境，但是不支持中文。通过以下命令可以查看 mysql 的字符集：

```sh
# 查看mysql的字符集
$ mysql> show variables like 'character_set%';
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8                       |
| character_set_connection | utf8                       |
| character_set_database   | latin1                     |
| character_set_filesystem | binary                     |
| character_set_results    | utf8                       |
| character_set_server     | latin1                     |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.01 sec)
```

为了让 MySQL 支持中文，需要把字符集改成 UTF-8：

```sh
$ vim /etc/my.cnf
```

将文件内容修改如下：

```properties
[client]
port=3306
socket=/var/lib/mysql/mysql.sock
default-character-set=utf8

[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
character-set-server=utf8

[mysql]
no-auto-rehash
default-character-set=utf8

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
```

重启 mysql 服务：

```sh
$ systemctl restart mysqld.service
```

登录 mysql，重新查看数据库编码：

```sh
$ mysql> show variables like 'character_set%';
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8                       |
| character_set_connection | utf8                       |
| character_set_database   | utf8                       |
| character_set_filesystem | binary                     |
| character_set_results    | utf8                       |
| character_set_server     | utf8                       |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.01 sec)
```

### 3.8 使用 Windows 下的客户端工具连接 MySQL

在 Navicat 或 SQLyog 中输入用户名和密码连接 MySQL。

## 4. 部署 SSM 工程

部署项目到 Linux 中需要注意以下内容：

- **项目要保证在 Windows 下是没有问题的，再考虑部署到 Linux。**
- 将开发环境中的内容更改为测试环境：
  - 连接数据库的信息；
  - 存放文件的路径；
  - 日志文件存放的位置；
  - 项目路径问题。
- 将 Maven 项目打包；
- 根据项目路径的不同，将项目部署到 Tomcat 中；
- 在部署到 Linux 操作系统中后，一定要查看日志。
