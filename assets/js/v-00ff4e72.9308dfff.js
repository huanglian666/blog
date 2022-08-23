"use strict";(self.webpackChunkhuanglian=self.webpackChunkhuanglian||[]).push([[629],{38455:(l,e,i)=>{i.r(e),i.d(e,{data:()=>a});const a={key:"v-00ff4e72",path:"/sql/mysql/01_MySQL%E6%A6%82%E8%BF%B0.html",title:"",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"一、目前存在的问题",slug:"一、目前存在的问题",children:[{level:3,title:"1.1、方式1存在的问题",slug:"_1-1、方式1存在的问题",children:[]},{level:3,title:"1.2、方式2存在的问题",slug:"_1-2、方式2存在的问题",children:[]}]},{level:2,title:"二、关于数据库",slug:"二、关于数据库",children:[{level:3,title:"2.1、什么是数据库（理解）",slug:"_2-1、什么是数据库-理解",children:[]},{level:3,title:"2.2、数据库的发展历程（了解）",slug:"_2-2、数据库的发展历程-了解",children:[]},{level:3,title:"2.3、常见的关系型数据库产品（了解）",slug:"_2-3、常见的关系型数据库产品-了解",children:[]},{level:3,title:"2.4、理解数据库（理解）",slug:"_2-4、理解数据库-理解",children:[]},{level:3,title:"2.5、应用程序与数据库（暂时了解就可以）",slug:"_2-5、应用程序与数据库-暂时了解就可以",children:[]},{level:3,title:"2.6、接下来我们的工作",slug:"_2-6、接下来我们的工作",children:[]}]}],filePathRelative:"sql/mysql/01_MySQL概述.md",git:{updatedTime:1661237516e3,contributors:[{name:"黄健",email:"huang.jian@trs.com.cn",commits:1}]}}},62638:(l,e,i)=>{i.r(e),i.d(e,{default:()=>s});var a=i(66252);const t=i.p+"assets/img/28.db356d20.jpg",r=i.p+"assets/img/28.ee2e77a5.png",n=(0,a.uE)('<h2 id="一、目前存在的问题" tabindex="-1"><a class="header-anchor" href="#一、目前存在的问题" aria-hidden="true">#</a> 一、目前存在的问题</h2><blockquote><p>通过之前的学习，我们能够使用以下两种方式进行数据存储：</p><ol><li><strong>使用变量、对象、数组、集合存储数据</strong>，数据保存在内存（RAM）中；</li><li><strong>使用文件（File）存储数据</strong>，保存在硬盘上。</li></ol></blockquote><h3 id="_1-1、方式1存在的问题" tabindex="-1"><a class="header-anchor" href="#_1-1、方式1存在的问题" aria-hidden="true">#</a> 1.1、方式1存在的问题</h3><blockquote><p>不能持久化（永久保存数据），程序关闭数据就会消失。</p></blockquote><h3 id="_1-2、方式2存在的问题" tabindex="-1"><a class="header-anchor" href="#_1-2、方式2存在的问题" aria-hidden="true">#</a> 1.2、方式2存在的问题</h3><blockquote><ul><li>没有数据类型的区分；</li><li>存储数据量级较小；</li><li>没有访问安全限制；</li><li>没有备份、恢复机制。</li></ul><p>数据需要持久化存储，如何解决上述问题：</p><ul><li>使用数据库。</li></ul></blockquote><h2 id="二、关于数据库" tabindex="-1"><a class="header-anchor" href="#二、关于数据库" aria-hidden="true">#</a> 二、关于数据库</h2><h3 id="_2-1、什么是数据库-理解" tabindex="-1"><a class="header-anchor" href="#_2-1、什么是数据库-理解" aria-hidden="true">#</a> 2.1、什么是数据库（理解）</h3><blockquote><p><strong>用来存储和管理数据的仓库。</strong></p><p>优点：</p><ul><li>可存储大量数据；</li><li><strong>方便检索</strong>；</li><li>保持数据的一致性、完整性；</li><li>安全、可共享；</li><li>通过组合分析，可产生新数据。</li></ul></blockquote><h3 id="_2-2、数据库的发展历程-了解" tabindex="-1"><a class="header-anchor" href="#_2-2、数据库的发展历程-了解" aria-hidden="true">#</a> 2.2、数据库的发展历程（了解）</h3><blockquote><ul><li>无数据库，使用磁盘文件存储数据；</li><li>层次结构数据库：IBM公司IMS（Information Management System）定向有序的树状结构实现存储和访问；</li><li>网状结构数据库：美国通用电气公司IDS（Integrated Data Store），以节点形式存储和访问；</li><li><strong>关系结构数据库</strong>：Oracle、DB2、<strong>MySQL</strong>、SQL Server，使用二维表格来存储数据；</li><li><strong>非关系型数据库</strong>：<strong>ElasticSearch</strong>、MongoDB、<strong>Redis</strong>，多数使用哈希表，表中以键值（key-value）的方式实现特定的键和一个指针指向的特定数据。</li></ul></blockquote><h3 id="_2-3、常见的关系型数据库产品-了解" tabindex="-1"><a class="header-anchor" href="#_2-3、常见的关系型数据库产品-了解" aria-hidden="true">#</a> 2.3、常见的关系型数据库产品（了解）</h3><blockquote><ul><li>Oracle（神谕）：美国Oracle（甲骨文）公司，主要用在电信，金融领域，下载免费，服务需要收费；</li><li>DB2：IBM，主要用在金融领域；</li><li>SQL Server：微软，只能用在微软平台上；</li><li><strong>MySQL</strong>：瑞典MySQL AB公司开发，属于 Oracle旗下产品，分为社区版和收费版，在国内互联网公司使用广泛。</li></ul></blockquote><h3 id="_2-4、理解数据库-理解" tabindex="-1"><a class="header-anchor" href="#_2-4、理解数据库-理解" aria-hidden="true">#</a> 2.4、理解数据库（理解）</h3><blockquote><p>我们通常所说的数据库其实是<strong>RDBMS</strong>（Relational Database Management System，关系型数据库管理系统），其包括两个部分：</p><ul><li>管理员，Manager；</li><li>仓库，Database。</li></ul><p>Database包括：N张表（Table）；</p><p>Table包括两个部分：</p><ul><li>表结构：<strong>定义</strong>表的列名和列类型(理解成类)；</li><li>表记录：一行一行的记录(理解成对象)。</li></ul></blockquote><p><img src="'+t+'" alt="" title=":size=70%"></p><h3 id="_2-5、应用程序与数据库-暂时了解就可以" tabindex="-1"><a class="header-anchor" href="#_2-5、应用程序与数据库-暂时了解就可以" aria-hidden="true">#</a> 2.5、应用程序与数据库（暂时了解就可以）</h3><p><img src="'+r+'" alt=""></p><blockquote><ul><li><p>通常情况下，数据库都是安装在独立的设备（服务器，一台物理主机，可以理解为单独的一台电脑）上；</p></li><li><p>应用程序（客户端工具/Java程序）安装在另一台设备上；</p></li><li><p>应用程序和数据库基于客户端-服务器模型进行通信，应用程序发送请求，数据库响应数据；</p></li><li><p>应用程序使用数据库完成对数据的存储。</p></li></ul><p><em>注意：我们在目前的学习阶段，应用程序和数据库都安装在自己的电脑上。</em></p></blockquote><h3 id="_2-6、接下来我们的工作" tabindex="-1"><a class="header-anchor" href="#_2-6、接下来我们的工作" aria-hidden="true">#</a> 2.6、接下来我们的工作</h3><blockquote><p>基于2.5的分析，我们要解决如下的几个问题：</p><ol><li>MySQL服务器和客户端如何安装；</li><li><strong>如何使用客户端工具对数据库进行操作；</strong></li><li><strong>如何使用Java程序对数据库进行操作。</strong></li></ol></blockquote>',21),o={},s=(0,i(83744).Z)(o,[["render",function(l,e){return n}]])}}]);