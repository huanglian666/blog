---
title: Linux_搭建基于SFTP服务的文件服务器
date: 2026-09-12
---

# Linux_搭建基于SFTP服务的文件服务器

本篇介绍如何在 Linux 上搭建基于 SFTP 服务的文件服务器，并通过 SSH 配置限制特定用户只能通过 SFTP 上传下载数据。

## 1. 背景

在一些场景中，我们需要搭建文件服务器，用来实现文件的分享，但是配置 FTP 服务比较麻烦。此时，我们可以为用户创建 SFTP 账户，让用户使用 SFTP 来上传下载所需的数据。

SFTP 账号即为系统账号。将账户密码交给用户后，用户除了能登录 SFTP 上传下载数据外，还可以访问系统中的其他目录，由此给我们的系统带来了安全隐患。因此我们需要配置用户**只能通过 SFTP 登录系统下载上传所需的数据，而不能进行其他操作**。

## 2. 目标

实现**特定用户**的如下功能：

1. **只能下载特定目录的内容**，不能新建、上传、修改、重命名文件和目录；
2. 该特定用户不能访问特定目录之外的内容；
3. 该特定用户不能通过 SSH 协议登录 Linux。

## 3. 具体配置

### 3.1 创建 SFTP 用户

此处我们以 `student` 为例进行配置：

```bash
# 添加student用户
$ useradd student
# 修改student用户密码
$ passwd student
```

新建用户后在 `/home` 目录下生成了 `student` 目录，该目录就是 student 用户的家目录，我们后续通过配置让 student 用户只能访问该目录中的内容。

### 3.2 设置允许 SFTP 用户访问目录的权限

SFTP 用户访问目录需要设置所有者和所属组的权限均为 root，并设置目录的权限为 755；但此目录下的文件及子目录的权限，我们可以根据自己的需求任意设置。

```bash
# 修改所属用户和所属组
$ chown root:root /home/student
# 修改权限
$ chmod 755 /home/student
```

### 3.3 设置该账户不允许登录

```bash
$ usermod student -s /sbin/nologin
```

### 3.4 设置 SFTP 的账户权限

设置 SFTP 的账号权限需要通过修改 SSH 配置文件进行，SSH 配置文件修改内容如下：

```properties
# override default of no subsystems
# Subsystem	sftp	/usr/libexec/openssh/sftp-server #注释掉此行并添加下一行
Subsystem sftp internal-sftp  

# Example of overriding settings on a per-user basis
#Match User anoncvs
#	X11Forwarding no
#	AllowTcpForwarding no
#	PermitTTY no
#	ForceCommand cvs server
Match User student #此处设置控制的用户
	ChrootDirectory /home/student/ #允许用户访问的目录,此处我们设置为用户家目录
	ForceCommand internal-sftp
	AllowTcpForwarding no
	X11Forwarding no
```

### 3.5 重启 SSH 服务

```bash
$ systemctl restart sshd
```

通过上面的命令我们就达成了目标。如果我们需要上传文件，可以使用 Xftp 工具通过 root 用户登录，切换到 `/home/student` 目录下，就可以将 Windows 下的文件上传到 `/home/student`。

由于我的 Linux 进行了特殊设置，无法直接通过 root 用户登录，多数时候我使用普通用户 solar 登录。此时由于 `/home/student` 目录权限为 755（必须为 755），我无法使用 solar（这是一个普通用户）上传文件。为了解决 solar 用户不能上传文件的问题，需要进行如下操作：

```bash
# 使用root用户在/home/student下新建目录，这个目录就是solar用户上传文件的目录
$ mkdir sftpdir
# 将solar用户添加到root组
$ usermod -a -G root solar
# 修改sftpdir目录的权限
$ chmod g+w sftpdir
```

通过上述配置，普通用户 solar 就拥有了向 `/home/student/sftpdir` 目录上传文件的权限，同时 student 用户可以从 sftpdir 目录中下载内容。
