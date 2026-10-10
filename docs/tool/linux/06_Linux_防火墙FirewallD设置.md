---
title: Linux_防火墙FirewallD设置
date: 2026-09-12
---

# Linux_防火墙FirewallD设置

本篇介绍 FirewallD 防火墙的定位与优势、服务的安装与管理、配置集（运行时与持久）的区别，以及区域、服务和端口层面的常用配置命令。

## 1. 简介

FirewallD 是 iptables 的前端控制器，用于实现持久的网络流量规则。它提供命令行和图形界面，在大多数 Linux 发行版的仓库中都有。与直接控制 iptables 相比，使用 FirewallD 有两个主要区别：

- FirewallD 使用**区域**和**服务**而不是链式规则；
- 它动态管理规则集，允许更新规则而不破坏现有会话和连接。

FirewallD 是 iptables 的一个封装，可以让你更容易地管理 iptables 规则，它并**不是** iptables 的替代品。虽然 iptables 命令仍可用于 FirewallD，但建议使用 FirewallD 时仅使用 FirewallD 命令。

## 2. 安装与管理 FirewallD

CentOS 7 已经包含了 FirewallD，如果没有激活，可以像其它的 systemd 单元那样控制它。

### 2.1 启动及开机启动

启动服务，并在系统引导时启动该服务：

```sh
# 启动服务
sudo systemctl start firewalld
# 设置开机启动
sudo systemctl enable firewalld
```

### 2.2 检查防火墙状态

```sh
firewall-cmd --state
```

输出的应该是 `running` 或 `not running`。

### 2.3 查看 FirewallD 守护进程的状态

```sh
systemctl status firewalld
```

示例输出：

```text
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2021-12-02 21:56:04 CST; 12h ago
     Docs: man:firewalld(1)
 Main PID: 544 (firewalld)
   CGroup: /system.slice/firewalld.service
           └─544 /usr/bin/python2 -Es /usr/sbin/firewalld --nofork --nopid
```

### 2.4 重新加载 FirewallD 配置

```sh
firewall-cmd --reload
```

## 3. 配置 FirewallD

FirewallD 使用 XML 进行配置。除非是非常特殊的配置，你不必处理它们，而应该使用 `firewall-cmd`。

配置文件位于两个目录中：

- `/usr/lib/FirewallD` 下保存默认配置，如默认区域和公用服务。**避免修改它们**，因为每次 firewall 软件包更新时都会覆盖这些文件；
- `/etc/firewalld` 下保存系统配置文件，这些文件将覆盖默认配置。

FirewallD 使用两个配置集：**运行时**和**持久**。在系统重新启动或重新启动 FirewallD 时，不会保留运行时的配置更改；而对持久配置集的更改，不会立即应用于正在运行的系统。

默认情况下，`firewall-cmd` 命令适用于运行时配置，但使用 `--permanent` 标志将保存到持久配置中。要添加和激活持久性规则，可以使用两种方法之一。

方法一：将规则同时添加到持久规则集和运行时规则集中：

```sh
firewall-cmd --zone=public --add-service=http
firewall-cmd --zone=public --add-service=http --permanent
```

方法二：将规则添加到持久规则集中并重新加载 FirewallD：

```sh
firewall-cmd --zone=public --add-service=http --permanent
firewall-cmd --reload
```

`reload` 命令会删除所有运行时配置并应用永久配置。因为 firewalld 动态管理规则集，所以它不会破坏现有的连接和会话。

## 4. 防火墙的区域

**区域**是针对给定位置或场景（例如家庭、公共、受信任等）可能具有的各种信任级别的预构建规则集。不同的区域允许不同的网络服务和入站流量类型，而拒绝其他任何流量。首次启用 FirewallD 后，`public` 将是默认区域。

区域也可以用于不同的网络接口。例如，要分离内部网络和互联网的接口，你可以在 `internal` 区域上允许 DHCP，但在 `external` 区域仅允许 HTTP 和 SSH。未明确设置为特定区域的任何接口将添加到默认区域。

获取默认区域：

```sh
firewall-cmd --get-default-zone
```

修改默认区域：

```sh
firewall-cmd --set-default-zone=internal
```

查看网络接口使用的区域：

```sh
firewall-cmd --get-active-zones

# 示例输出
public
  interfaces: eth0
```

获取特定区域的所有配置：

```sh
firewall-cmd --zone=public --list-all
```

获取所有区域的配置：

```sh
firewall-cmd --list-all-zones
```

### 4.1 与服务一起使用

FirewallD 可以根据特定网络服务的预定义规则来允许相关流量。你可以创建自己的自定义规则，并将它们添加到任何区域。默认支持的服务的配置文件位于 `/usr/lib/firewalld/services`，用户创建的服务文件在 `/etc/firewalld/services` 中。

查看默认的可用服务：

```sh
firewall-cmd --get-services
```

启用或禁用 HTTP 服务：

```sh
firewall-cmd --zone=public --add-service=http --permanent
firewall-cmd --zone=public --remove-service=http --permanent
```

### 4.2 允许或者拒绝任意端口/协议

允许或者禁用 12345 端口的 TCP 流量：

```sh
firewall-cmd --zone=public --add-port=12345/tcp --permanent
firewall-cmd --zone=public --remove-port=12345/tcp --permanent
```
