"use strict";(self.webpackChunkhuanglian=self.webpackChunkhuanglian||[]).push([[6975],{72030:(s,n,a)=>{a.r(n),a.d(n,{data:()=>e});const e={key:"v-cd346d00",path:"/tool/linux/05_Linux_%E6%90%AD%E5%BB%BA%E5%9F%BA%E4%BA%8ESFTP%E6%9C%8D%E5%8A%A1%E7%9A%84%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8.html",title:"",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"一、背景",slug:"一、背景",children:[]},{level:2,title:"二、目标",slug:"二、目标",children:[]},{level:2,title:"三、具体配置",slug:"三、具体配置",children:[{level:3,title:"3.1、创建SFTP用户",slug:"_3-1、创建sftp用户",children:[]},{level:3,title:"3.2、设置允许SFTP用户访问目录的权限",slug:"_3-2、设置允许sftp用户访问目录的权限",children:[]},{level:3,title:"3.3、设置该账户不允许登录",slug:"_3-3、设置该账户不允许登录",children:[]},{level:3,title:"3.4、设置SFTP的账户权限",slug:"_3-4、设置sftp的账户权限",children:[]},{level:3,title:"3.5、重启SSH服务",slug:"_3-5、重启ssh服务",children:[]}]}],filePathRelative:"tool/linux/05_Linux_搭建基于SFTP服务的文件服务器.md",git:{updatedTime:1661237516e3,contributors:[{name:"黄健",email:"huang.jian@trs.com.cn",commits:1}]}}},9937:(s,n,a)=>{a.r(n),a.d(n,{default:()=>l});const e=(0,a(66252).uE)('<h2 id="一、背景" tabindex="-1"><a class="header-anchor" href="#一、背景" aria-hidden="true">#</a> 一、背景</h2><p>在一些场景中，我么需要搭建文件服务器，用来实现文件的分享，但是配置FTP服务比较麻烦，此时，我们可以为用户创建SFTP账户，让用户使用SFTP来上传下载所需的数据。SFTP账号即为系统账号，将账户密码给用户，用户除了能登录SFTP上传下载数据外，还可以访问系统中的其他目录，由此，给我们的系统带来了安全隐患，我们需要配置用户<strong>只能通过SFTP登录系统下载上传所需的数据，而不能进行其他操作</strong>。</p><h2 id="二、目标" tabindex="-1"><a class="header-anchor" href="#二、目标" aria-hidden="true">#</a> 二、目标</h2><p>实现<strong>特定用户</strong>如下功能：</p><ol><li><strong>只能下载特定目录的内容</strong>，不能新建、上传、修改、重命名文件和目录；</li><li>该特定用户不能访问特定目录之外的内容；</li><li>该特定用户不能通过SSH协议登录Linux。</li></ol><h2 id="三、具体配置" tabindex="-1"><a class="header-anchor" href="#三、具体配置" aria-hidden="true">#</a> 三、具体配置</h2><h3 id="_3-1、创建sftp用户" tabindex="-1"><a class="header-anchor" href="#_3-1、创建sftp用户" aria-hidden="true">#</a> 3.1、创建SFTP用户</h3><p>此处我们以<code>student</code>为例进行配置。</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>添加student用户\n$ <span class="token function">useradd</span> student\n<span class="token comment"># 修改student用户密码</span>\n$ <span class="token function">passwd</span> student\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>新建用户后在/home目录下生成了student目录，该目录就是student用户的家目录，我们后续通过配置让student用户只能访问该目录中的内容。</p><h3 id="_3-2、设置允许sftp用户访问目录的权限" tabindex="-1"><a class="header-anchor" href="#_3-2、设置允许sftp用户访问目录的权限" aria-hidden="true">#</a> 3.2、设置允许SFTP用户访问目录的权限</h3><p>SFTP用户访问目录需要设置所有者和所属组的权限均为root，并设置目录的权限为755，但此目录下的文件及目录的权限我们可根据自己的需求任意设置。</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 修改所属用户和所属组</span>\n$ <span class="token function">chown</span> root:root /home/student\n<span class="token comment"># 修改权限</span>\n$ <span class="token function">chmod</span> <span class="token number">755</span> /home/student\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="_3-3、设置该账户不允许登录" tabindex="-1"><a class="header-anchor" href="#_3-3、设置该账户不允许登录" aria-hidden="true">#</a> 3.3、设置该账户不允许登录</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>$ <span class="token function">usermod</span> student -s /sbin/nologin\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="_3-4、设置sftp的账户权限" tabindex="-1"><a class="header-anchor" href="#_3-4、设置sftp的账户权限" aria-hidden="true">#</a> 3.4、设置SFTP的账户权限</h3><p>设置SFTP的账号权限需要通过修改SSH配置文件进行，SSH配置文件修改内容如下：</p><div class="language-properties ext-properties line-numbers-mode"><pre class="language-properties"><code><span class="token comment"># override default of no subsystems</span>\n<span class="token comment"># Subsystem\tsftp\t/usr/libexec/openssh/sftp-server #注释掉此行并添加下一行</span>\n<span class="token key attr-name">Subsystem</span> <span class="token value attr-value">sftp internal-sftp  </span>\n\n<span class="token comment"># Example of overriding settings on a per-user basis</span>\n<span class="token comment">#Match User anoncvs</span>\n<span class="token comment">#\tX11Forwarding no</span>\n<span class="token comment">#\tAllowTcpForwarding no</span>\n<span class="token comment">#\tPermitTTY no</span>\n<span class="token comment">#\tForceCommand cvs server</span>\n<span class="token key attr-name">Match</span> <span class="token value attr-value">User student #此处设置控制的用户</span>\n<span class="token key attr-name">\tChrootDirectory</span> <span class="token value attr-value">/home/student/ #允许用户访问的目录,此处我们设置为用户家目录</span>\n<span class="token key attr-name">\tForceCommand</span> <span class="token value attr-value">internal-sftp</span>\n<span class="token key attr-name">\tAllowTcpForwarding</span> <span class="token value attr-value">no</span>\n<span class="token key attr-name">\tX11Forwarding</span> <span class="token value attr-value">no</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h3 id="_3-5、重启ssh服务" tabindex="-1"><a class="header-anchor" href="#_3-5、重启ssh服务" aria-hidden="true">#</a> 3.5、重启SSH服务</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>$ systemctl restart sshd\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>通过上面的命令我们就达成了目标，如果我们需要上传文件，我们使用xftp工具通过root用户登录，切换到/home/student目录下，就可以将windows下的文件上传到/home/student。</p><p>由于我的Linux进行了特殊设置，无法直接通过root用户登录，多数时候我使用普通用户solar登录。此时由于/home/student目录权限为755（必须为755），我无法使用solar（这是一个普通用户）上传文件。为了解决solar用户不能上传文件的问题，需要进行如下操作：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 使用root用户在/home/student下新建目录，这个目录就是sola让用户上传文件的目录</span>\n$ <span class="token function">mkdir</span> sftpdir\n<span class="token comment"># 将solar用户添加到root组</span>\n$ <span class="token function">usermod</span> -a -G root solar\n<span class="token comment"># 修改sftpdir目录的权限</span>\n$ <span class="token function">chmod</span> g+w sftpdir\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>通过上述配置，普通用户solar就拥有了向/home/student/sftpdir目录上传文件的权限，同时student用户可以从sftpdir目录中下载内容。</p>',24),t={},l=(0,a(83744).Z)(t,[["render",function(s,n){return e}]])}}]);