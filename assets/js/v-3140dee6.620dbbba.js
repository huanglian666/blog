"use strict";(self.webpackChunkhuanglian=self.webpackChunkhuanglian||[]).push([[4814],{27982:(n,s,a)=>{a.r(s),a.d(s,{data:()=>t});const t={key:"v-3140dee6",path:"/web/javaweb/06_%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0.html",title:"",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"一、简介",slug:"一、简介",children:[]},{level:2,title:"二、什么是文件上传",slug:"二、什么是文件上传",children:[]},{level:2,title:"三、上传的相关限制",slug:"三、上传的相关限制",children:[{level:3,title:"3.1、上传对表单的限制",slug:"_3-1、上传对表单的限制",children:[]},{level:3,title:"3.2、上传对Servlet的限制",slug:"_3-2、上传对servlet的限制",children:[]},{level:3,title:"3.3、如何实现文件上传",slug:"_3-3、如何实现文件上传",children:[]},{level:3,title:"3.4、需要注意的细节",slug:"_3-4、需要注意的细节",children:[]}]}],filePathRelative:"web/javaweb/06_文件上传.md",git:{updatedTime:1661237516e3,contributors:[{name:"黄健",email:"huang.jian@trs.com.cn",commits:1}]}}},11316:(n,s,a)=>{a.r(s),a.d(s,{default:()=>e});const t=(0,a(66252).uE)('<h2 id="一、简介" tabindex="-1"><a class="header-anchor" href="#一、简介" aria-hidden="true">#</a> 一、简介</h2><blockquote><p>在项目中，文件的上传是常见的功能。很多程序或者软件中都经常使用到文件的上传。</p><ul><li>邮箱中有附件的上传；</li><li>图片上传。</li></ul></blockquote><h2 id="二、什么是文件上传" tabindex="-1"><a class="header-anchor" href="#二、什么是文件上传" aria-hidden="true">#</a> 二、什么是文件上传</h2><blockquote><p>当用户在前端页面点击文件上传后，用户上传的文件数据提交给服务器端，实现保存。</p></blockquote><h2 id="三、上传的相关限制" tabindex="-1"><a class="header-anchor" href="#三、上传的相关限制" aria-hidden="true">#</a> 三、上传的相关限制</h2><h3 id="_3-1、上传对表单的限制" tabindex="-1"><a class="header-anchor" href="#_3-1、上传对表单的限制" aria-hidden="true">#</a> 3.1、上传对表单的限制</h3><blockquote><ul><li><code>method=&quot;post&quot;</code>；</li><li><code>enctype=&quot;multipart/form-data&quot;</code>；</li><li>表单中需要添加文件表单项：<code> &lt;input type=&quot;file&quot; name=&quot;xxx&quot; /&gt;</code></li></ul></blockquote><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>form</span> <span class="token attr-name">action</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>xxx<span class="token punctuation">&quot;</span></span> <span class="token attr-name">method</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>post<span class="token punctuation">&quot;</span></span> <span class="token attr-name">enctype</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>multipart/form-data<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n  用户名；<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>text<span class="token punctuation">&quot;</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>username<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">/&gt;</span></span>\n  照　片：<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>file<span class="token punctuation">&quot;</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>photo<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>submit<span class="token punctuation">&quot;</span></span> <span class="token attr-name">value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>上传<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>form</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="_3-2、上传对servlet的限制" tabindex="-1"><a class="header-anchor" href="#_3-2、上传对servlet的限制" aria-hidden="true">#</a> 3.2、上传对Servlet的限制</h3><blockquote><p><code>request.getParameter(&quot;xxx&quot;)</code>这个方法在表单为<code>enctype=&quot;multipart/form-data&quot;</code>时，它作废了，它永远都返回<code>null</code>。</p></blockquote><h3 id="_3-3、如何实现文件上传" tabindex="-1"><a class="header-anchor" href="#_3-3、如何实现文件上传" aria-hidden="true">#</a> 3.3、如何实现文件上传</h3><h4 id="_3-3-1、相关jar包" tabindex="-1"><a class="header-anchor" href="#_3-3-1、相关jar包" aria-hidden="true">#</a> 3.3.1、相关Jar包</h4><blockquote><ul><li>commons-fileupload-1.4.jar</li><li>commons-io-2.2.jar</li></ul><p>它会帮我们解析request中的上传数据，解析后的结果是一个表单项数据封装到一个FileItem对象中。我们只需要调用FileItem的方法即可。</p></blockquote><h4 id="_3-3-2、具体步骤" tabindex="-1"><a class="header-anchor" href="#_3-3-2、具体步骤" aria-hidden="true">#</a> 3.3.2、具体步骤</h4><blockquote><ol><li><p>创建工厂：<code>DiskFileItemFactory factory = new DiskFileItemFactory()</code>；</p></li><li><p>创建解析器：<code>ServletFileUpload sfu = new ServletFileUpload(factory)</code>；</p></li><li><p>使用解析器来解析<code>request</code>，得到<code>FileItem</code>集合：</p><p><code>List&lt;FileItem&gt; fileItemList = sfu.parseRequest(request)</code>，</p><p><code>FileItem</code>中常用方法：</p><ul><li><code>boolean isFormField()</code>：是否为普通表单项！返回true为普通表单项，如果为false即文件表单项</li><li><code>String getFieldName()</code>：返回当前表单项的名称；</li><li><code>String getString(String charset)</code>：返回表单项的值；</li><li><code>String getName()</code>：返回上传的文件名称；</li><li><code>long getSize()</code>：返回上传文件的字节数；</li><li><code>InputStream getInputStream()</code>：返回上传文件对应的输入流；</li><li><code>void write(File destFile)</code>：把上传的文件内容保存到指定的文件中。</li></ul></li></ol></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">//创建工厂</span>\n<span class="token class-name">DiskFileItemFactory</span> factory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DiskFileItemFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">//创建解析器</span>\n<span class="token class-name">ServletFileUpload</span> sfu <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ServletFileUpload</span><span class="token punctuation">(</span>factory<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">//使用解析器来解析request，得到FileItem集合</span>\n<span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">FileItem</span><span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> sfu<span class="token punctuation">.</span><span class="token function">parseRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">FileItem</span> item <span class="token operator">:</span> list<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">if</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token function">isFormField</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token class-name">String</span> fieldName <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getFieldName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">String</span> value <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getString</span><span class="token punctuation">(</span><span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>fieldName <span class="token operator">+</span> <span class="token string">&quot;:&quot;</span> <span class="token operator">+</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n            <span class="token class-name">String</span> fileName <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">long</span> size <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;文件名：&quot;</span> <span class="token operator">+</span> fileName<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;文件大小&quot;</span> <span class="token operator">+</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            \n            <span class="token class-name">ServletContext</span> servletContext <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getServletConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getServletContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">String</span> realPath <span class="token operator">=</span> servletContext<span class="token punctuation">.</span><span class="token function">getRealPath</span><span class="token punctuation">(</span><span class="token string">&quot;/img&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            \n            item<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span>realPath <span class="token operator">+</span> <span class="token string">&quot;/&quot;</span> <span class="token operator">+</span> fileName<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">FileUploadException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><h3 id="_3-4、需要注意的细节" tabindex="-1"><a class="header-anchor" href="#_3-4、需要注意的细节" aria-hidden="true">#</a> 3.4、需要注意的细节</h3><h4 id="_3-4-1、文件名或普通表单项乱码" tabindex="-1"><a class="header-anchor" href="#_3-4-1、文件名或普通表单项乱码" aria-hidden="true">#</a> 3.4.1、文件名或普通表单项乱码</h4><blockquote><p>如何解决：</p><ul><li><code>request.setCharacterEncoding(&quot;utf-8&quot;);</code></li><li><code>servletFileUpload.setHeaderEncoding(&quot;utf-8&quot;);</code></li></ul><p>以上两个方案二选一</p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">//创建工厂</span>\n<span class="token class-name">DiskFileItemFactory</span> factory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DiskFileItemFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">//创建解析器</span>\n<span class="token class-name">ServletFileUpload</span> sfu <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ServletFileUpload</span><span class="token punctuation">(</span>factory<span class="token punctuation">)</span><span class="token punctuation">;</span>\nrequest<span class="token punctuation">.</span><span class="token function">setCharacterEncoding</span><span class="token punctuation">(</span><span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">//sfu.setHeaderEncoding(&quot;utf-8&quot;);</span>\n\n<span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token comment">//使用解析器来解析request，得到FileItem集合</span>\n    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">FileItem</span><span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> sfu<span class="token punctuation">.</span><span class="token function">parseRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">FileItem</span> item <span class="token operator">:</span> list<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">if</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token function">isFormField</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token class-name">String</span> fieldName <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getFieldName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">String</span> value <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getString</span><span class="token punctuation">(</span><span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>fieldName <span class="token operator">+</span> <span class="token string">&quot;:&quot;</span> <span class="token operator">+</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n            <span class="token class-name">String</span> fileName <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">long</span> size <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;文件名：&quot;</span> <span class="token operator">+</span> fileName<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;文件大小&quot;</span> <span class="token operator">+</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            \n            <span class="token class-name">ServletContext</span> servletContext <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getServletConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getServletContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">String</span> realPath <span class="token operator">=</span> servletContext<span class="token punctuation">.</span><span class="token function">getRealPath</span><span class="token punctuation">(</span><span class="token string">&quot;/img&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            \n            item<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span>realPath <span class="token operator">+</span> <span class="token string">&quot;/&quot;</span> <span class="token operator">+</span> fileName<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">FileUploadException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><h4 id="_3-4-2、同名文件上传问题" tabindex="-1"><a class="header-anchor" href="#_3-4-2、同名文件上传问题" aria-hidden="true">#</a> 3.4.2、同名文件上传问题</h4><blockquote><p>使用UUID：<code>fileName = UUID.randomUUID().toString().replace(&quot;-&quot;, &quot;&quot;) + &quot;_&quot; + fileName;</code></p></blockquote><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token comment">//创建工厂</span>\n<span class="token class-name">DiskFileItemFactory</span> factory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DiskFileItemFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">//创建解析器</span>\n<span class="token class-name">ServletFileUpload</span> sfu <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ServletFileUpload</span><span class="token punctuation">(</span>factory<span class="token punctuation">)</span><span class="token punctuation">;</span>\nrequest<span class="token punctuation">.</span><span class="token function">setCharacterEncoding</span><span class="token punctuation">(</span><span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">//sfu.setHeaderEncoding(&quot;utf-8&quot;);</span>\n\n<span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token comment">//使用解析器来解析request，得到FileItem集合</span>\n    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">FileItem</span><span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> sfu<span class="token punctuation">.</span><span class="token function">parseRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">FileItem</span> item <span class="token operator">:</span> list<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">if</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token function">isFormField</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token class-name">String</span> fieldName <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getFieldName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">String</span> value <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getString</span><span class="token punctuation">(</span><span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>fieldName <span class="token operator">+</span> <span class="token string">&quot;:&quot;</span> <span class="token operator">+</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n            <span class="token class-name">String</span> fileName <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">long</span> size <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;文件名：&quot;</span> <span class="token operator">+</span> fileName<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;文件大小&quot;</span> <span class="token operator">+</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            \n            <span class="token class-name">ServletContext</span> servletContext <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getServletConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getServletContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token class-name">String</span> realPath <span class="token operator">=</span> servletContext<span class="token punctuation">.</span><span class="token function">getRealPath</span><span class="token punctuation">(</span><span class="token string">&quot;/img&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            \n            item<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span>realPath <span class="token operator">+</span> \n                                <span class="token string">&quot;/&quot;</span> <span class="token operator">+</span> \n                                UUID<span class="token punctuation">.</span><span class="token function">randomUUID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token string">&quot;-&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span> <span class="token operator">+</span> \n                                <span class="token string">&quot;_&quot;</span> <span class="token operator">+</span> \n                                fileName<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">FileUploadException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br></div></div>',23),p={},e=(0,a(83744).Z)(p,[["render",function(n,s){return t}]])}}]);