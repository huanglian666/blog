---
title: 单点登录SSO
date: 2022-10-05
icon: fa-solid fa-right-to-bracket
category: [SpringCloud]
tag: [综合项目]
---

# 单点登录SSO

本篇先介绍 JWT 令牌的组成与使用（含 HMAC 对称签名与 RSA 非对称签名两种方案），再落地完整的单点登录链路：单点登录服务颁发令牌 → 网关全局过滤器统一校验 → 资源服务通过拦截器获取用户信息。

## 1. JWT

### 1.1 JWT 令牌简介

**JWT**（JSON Web Token，官网 <https://jwt.io>）是一款出色的分布式身份校验方案，可以生成 token，也可以解析校验 token。

JWT 生成的 token 由三部分组成：

- **头部（header）**：声明令牌类型和所使用的签名算法，进行 Base64 编码（**不是加密**）；
- **载荷（payload）**：token 中存放有效信息的部分，比如用户名、用户角色、过期时间等。**注意不要放密码等敏感信息，Base64 是可逆编码，会泄露**；
- **签名（signature）**：将头部与载荷分别采用 Base64 编码后用 `.` 相连，再加入盐（salt），最后使用头部声明的算法进行加密，就得到了签名。

```text
头部（header）：令牌类型和所使用的签名算法
{
  "alg": "HS256",
  "typ": "JWT"
}
进行 base64 编码（不是加密） ==> 'xxxxxxx'

载荷（payload）：token 中存放有效信息的部分，比如用户名、用户角色、过期时间等（不要放密码，会泄露！）
{
  "name": "jack",
  "age": 18
}
进行 base64 编码（不是加密） ==> 'yyyyyyy'

签名（signature）：头部与载荷分别 base64 编码后用 "." 相连，加入盐，再用头部声明的算法加密
signature = HS256(xxxxxxx.yyyyyyy, salt)
```

### 1.2 JWT 入门使用

引入 `java-jwt` 依赖：

```xml
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.4.0</version>
</dependency>
```

生成、校验并解析令牌的示例：

```java
public static void main(String[] args) throws Exception {
    Calendar c = Calendar.getInstance();
    c.add(Calendar.SECOND, 10);

    // 生成 jwt 令牌
    String jwtToken = JWT.create()
        // .withHeader() 使用默认即可
        // payload（用户信息 id、account、role、auth）
        .withClaim("id", "12")
        .withClaim("account", "jack")
        .withClaim("role", "ROLE_ADMIN,ROLE_COPY")
        .withExpiresAt(c.getTime())   // 指定令牌的过期时间
        .sign(Algorithm.HMAC256("wfx"));
    System.out.println(jwtToken);

    // 校验 jwt 令牌（等待令牌过期后再校验，验证过期时间生效）
    Thread.sleep(15000);

    JWTVerifier wfxVerifier = JWT.require(Algorithm.HMAC256("wfx")).build();
    DecodedJWT verify = wfxVerifier.verify(jwtToken); // 校验令牌
    // 解析令牌，获取用户信息
    String id = verify.getClaim("id").asString();
    System.out.println("id=" + id);
    String account = verify.getClaim("account").asString();
    System.out.println("account=" + account);
}
```

> [!WARNING]
> 上例使用 `HMAC256("wfx")` 对称加密，生成 token 与校验 token 用的是**同一个盐**。一旦盐泄露，任何人都能伪造 token，这是引入 RSA 非对称加密的原因。

### 1.3 RSA 非对称加密

#### 1.3.1 为什么需要 RSA 非对称加密

从 JWT 生成的 token 组成上来分析安全性：

- 头部和载荷只是 Base64 编码，几乎是透明的，毫无安全性可言；
- 要想避免 token 被伪造，关键看签名部分，而签名真正起作用的就是加入的盐；
- 如果盐（salt）泄露，就会导致 token 被伪造，最终带来系统安全隐患。

解决办法是对盐采用非对称加密的方式处理，达到**生成 token 与校验 token 双方所用的密钥不一致**的安全效果：

| 密钥 | 用途 | 持有方 |
| --- | --- | --- |
| 私钥 | 加密生成 JWT 令牌 | 认证中心（单点登录服务） |
| 公钥 | 解密校验 JWT 令牌 | 网关、各资源服务 |

#### 1.3.2 生成公钥、私钥密钥对

RsaUtils 工具类：

```java
package com.wfx.util;

import java.io.File;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class RsaUtils {
    private static final int DEFAULT_KEY_SIZE = 2048;

    /**
     * 从文件中读取公钥
     *
     * @param filename 公钥保存路径，相对于 classpath
     * @return 公钥对象
     * @throws Exception 读取或解析失败抛出
     */
    public static PublicKey getPublicKey(String filename) throws Exception {
        byte[] bytes = readFile(filename);
        return getPublicKey(bytes);
    }

    /**
     * 从文件中读取私钥
     *
     * @param filename 私钥保存路径，相对于 classpath
     * @return 私钥对象
     * @throws Exception 读取或解析失败抛出
     */
    public static PrivateKey getPrivateKey(String filename) throws Exception {
        byte[] bytes = readFile(filename);
        return getPrivateKey(bytes);
    }

    /**
     * 从字节中获取公钥
     *
     * @param bytes 公钥的字节形式（Base64 编码）
     * @return 公钥对象
     * @throws Exception 解析失败抛出
     */
    public static PublicKey getPublicKey(byte[] bytes) throws Exception {
        bytes = Base64.getDecoder().decode(bytes);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(bytes);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePublic(spec);
    }

    /**
     * 从字节中获取私钥
     *
     * @param bytes 私钥的字节形式（Base64 编码）
     * @return 私钥对象
     * @throws NoSuchAlgorithmException 算法不存在
     * @throws InvalidKeySpecException  密钥规格不合法
     */
    public static PrivateKey getPrivateKey(byte[] bytes) throws NoSuchAlgorithmException,
        InvalidKeySpecException {
        bytes = Base64.getDecoder().decode(bytes);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(bytes);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePrivate(spec);
    }

    /**
     * 根据密文生成 RSA 公钥和私钥，并写入指定文件
     *
     * @param publicKeyFilename  公钥文件路径
     * @param privateKeyFilename 私钥文件路径
     * @param secret             生成密钥的密文（种子）
     * @param keySize            密钥长度，小于默认值时按默认值生成
     * @throws Exception 生成或写文件失败抛出
     */
    public static void generateKey(String publicKeyFilename, String privateKeyFilename, String
        secret, int keySize) throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        SecureRandom secureRandom = new SecureRandom(secret.getBytes());
        keyPairGenerator.initialize(Math.max(keySize, DEFAULT_KEY_SIZE), secureRandom);
        KeyPair keyPair = keyPairGenerator.genKeyPair();
        // 获取公钥并写出
        byte[] publicKeyBytes = keyPair.getPublic().getEncoded();
        publicKeyBytes = Base64.getEncoder().encode(publicKeyBytes);
        writeFile(publicKeyFilename, publicKeyBytes);
        // 获取私钥并写出
        byte[] privateKeyBytes = keyPair.getPrivate().getEncoded();
        privateKeyBytes = Base64.getEncoder().encode(privateKeyBytes);
        writeFile(privateKeyFilename, privateKeyBytes);
    }

    private static byte[] readFile(String fileName) throws Exception {
        return Files.readAllBytes(new File(fileName).toPath());
    }

    private static void writeFile(String destPath, byte[] bytes) throws IOException {
        File dest = new File(destPath);
        if (!dest.exists()) {
            dest.createNewFile();
        }
        Files.write(dest.toPath(), bytes);
    }
}
```

生成密钥对：

```java
public static void main(String[] args) throws Exception {
    String privateFilePath = "E:\\key\\rsa";
    String publicFilePath = "E:\\key\\rsa.pub";

    RsaUtils.generateKey(publicFilePath, privateFilePath, "wfx", 2048);
}
```

#### 1.3.3 JWT 令牌的颁发与校验

使用"私钥加密生成 JWT 令牌、公钥解密校验 JWT 令牌"的方式改造工具类。

引入 jjwt 依赖：

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.10.7</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.10.7</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.10.7</version>
</dependency>
```

JsonUtils（JWT 载荷中存的是用户信息序列化后的 JSON 字符串，需要 JSON 工具）：

```java
package com.wfx.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class JsonUtils {

    public static final ObjectMapper mapper = new ObjectMapper();

    private static final Logger logger = LoggerFactory.getLogger(JsonUtils.class);

    /**
     * 将对象转换成 json 串
     *
     * @param obj 待序列化对象
     * @return json 串，序列化失败返回 null
     */
    public static String toString(Object obj) {
        if (obj == null) {
            return null;
        }
        if (obj.getClass() == String.class) {
            return (String) obj;
        }
        try {
            return mapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            logger.error("json序列化出错：" + obj, e);
            return null;
        }
    }

    /**
     * 将 json 串转换成对象
     *
     * @param json   json 串
     * @param tClass 目标类型
     * @param <T>    目标类型泛型
     * @return 目标对象，解析失败返回 null
     */
    public static <T> T toBean(String json, Class<T> tClass) {
        try {
            return mapper.readValue(json, tClass);
        } catch (IOException e) {
            logger.error("json解析出错：" + json, e);
            return null;
        }
    }
}
```

JwtUtils（私钥颁发令牌、公钥校验令牌）：

```java
package com.jwt.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Calendar;
import java.util.UUID;

/**
 * 生成 token 以及校验 token 相关方法
 */
public class JwtUtils {

    private static final String JWT_PAYLOAD_USER_KEY = "user";

    /**
     * 私钥加密 token
     *
     * @param userInfo   载荷中的数据
     * @param privateKey 私钥
     * @param expire     过期时间，单位：分钟
     * @return JWT 令牌
     */
    public static String generateTokenExpireInMinutes(Object userInfo, PrivateKey privateKey, int expire) {
        // 计算过期时间
        Calendar c = Calendar.getInstance();
        c.add(Calendar.MINUTE, expire);

        return Jwts.builder()
            .claim(JWT_PAYLOAD_USER_KEY, JsonUtils.toString(userInfo)) // 将用户信息放入 payload
            .setId(new String(Base64.getEncoder().encode(UUID.randomUUID().toString().getBytes())))
            .setExpiration(c.getTime())
            .signWith(privateKey, SignatureAlgorithm.RS256)
            .compact();
    }

    /**
     * 私钥加密 token
     *
     * @param userInfo   载荷中的数据
     * @param privateKey 私钥
     * @param expire     过期时间，单位：秒
     * @return JWT 令牌
     */
    public static String generateTokenExpireInSeconds(Object userInfo, PrivateKey privateKey, int expire) {
        // 计算过期时间
        Calendar c = Calendar.getInstance();
        c.add(Calendar.SECOND, expire);

        return Jwts.builder()
            .claim(JWT_PAYLOAD_USER_KEY, JsonUtils.toString(userInfo))
            .setId(new String(Base64.getEncoder().encode(UUID.randomUUID().toString().getBytes())))
            .setExpiration(c.getTime())
            .signWith(privateKey, SignatureAlgorithm.RS256)
            .compact();
    }

    /**
     * 获取 token 中的用户信息
     *
     * @param token     用户请求中的令牌
     * @param publicKey 公钥
     * @param userType  载荷用户信息的目标类型
     * @return 用户信息对象
     */
    public static Object getInfoFromToken(String token, PublicKey publicKey, Class userType) {
        // 解析 token
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(publicKey).parseClaimsJws(token);

        Claims body = claimsJws.getBody(); // 获取 payload
        String userInfoJson = body.get(JWT_PAYLOAD_USER_KEY).toString();
        return JsonUtils.toBean(userInfoJson, userType);
    }
}
```

测试 JWT 令牌的生成与校验：

```java
public static void main(String[] args) throws Exception {
    // 生成 jwt 令牌
    Map<String, Object> userinfo = new HashMap<String, Object>() {{
        put("account", "jack");
        put("auth", "a,b,c,d");
    }};

    // 获取私钥路径
    String path = ResourceUtils.getFile("classpath:rsa").getPath();
    // 构建私钥对象
    PrivateKey privateKey = RsaUtils.getPrivateKey(path);

    String token = JwtUtils.generateTokenExpireInMinutes(userinfo, privateKey, 1);
    System.out.println(token);

    // 解析 token
    // 获取公钥路径
    String path1 = ResourceUtils.getFile("classpath:rsa.pub").getPath();
    // 构建公钥对象
    PublicKey publicKey = RsaUtils.getPublicKey(path1);

    Map infoFromToken = (Map) JwtUtils.getInfoFromToken(token, publicKey, Map.class);
    System.out.println(infoFromToken.get("account"));
}
```

## 2. 单点登录服务

在分布式系统中搭建单点登录（SSO，Single Sign On）服务，从而实现**一次登录，处处使用**：用户只需在认证中心登录一次拿到令牌，之后访问各个微服务都凭令牌鉴权。

单点登录的后台接口开发——用户登录成功后用私钥颁发 JWT 令牌：

```java
package com.fengmi.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fengmi.jwt.JwtUtils;
import com.fengmi.jwt.RsaUtils;
import com.fengmi.user.SysUser;
import com.fengmi.user.mapper.SysUserMapper;
import com.fengmi.user.service.ISysUserService;
import com.fengmi.vo.ResultVO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.security.PrivateKey;

/**
 * 用户信息表服务实现类
 *
 * @author zhuxm
 * @since 2021-10-19
 */
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements ISysUserService {

    @Override
    public ResultVO login(SysUser user) {
        if (user == null) {
            return new ResultVO(false, "用户或者密码必须填写");
        }

        // 获取用户信息
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("account", user.getAccount());
        queryWrapper.eq("user_type", "6");
        SysUser sysUserFromDB = this.baseMapper.selectOne(queryWrapper);
        if (sysUserFromDB == null) {
            return new ResultVO(false, "用户或者密码错误");
        }

        // 比较密码（BCrypt 不可逆加密，用 matches 比对）
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(user.getPassword(), sysUserFromDB.getPassword())) {
            return new ResultVO(false, "用户或者密码错误");
        }

        // 颁发 jwt 令牌：加载私钥
        try {
            String path = ResourceUtils.getFile("classpath:rsa_pri").getPath();
            PrivateKey privateKey = RsaUtils.getPrivateKey(path);
            sysUserFromDB.setPassword(""); // 载荷中不放密码
            String token = JwtUtils.generateTokenExpireInMinutes(sysUserFromDB, privateKey, 40);

            return new ResultVO(true, "success", token);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResultVO(false, "用户或者密码错误");
        }
    }

    @Override
    public ResultVO login(String phone, String code) {
        // 手机号 + 验证码登录，略
        return null;
    }
}
```

## 3. 网关全局认证

网关作为所有请求的入口，通过**全局过滤器**统一校验令牌：白名单内的 URI 直接放行，其余请求必须携带合法令牌，校验通过后把用户信息写入请求头转发给下游服务。

```java
package com.portal.filters;

import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portal.auth.entity.SysUser;
import com.portal.util.auth.JwtUtils;
import com.portal.util.auth.RsaUtils;
import com.portal.vo.ResultVO;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.security.PublicKey;
import java.util.regex.Pattern;

/**
 * 网关全局认证过滤器
 *
 * @author zhuximing
 * @date 2021/7/30
 */
@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        try {
            // 定义白名单（支持正则）
            String[] whiteUris = {"/auth/login", "/auth/verify", "/index/(.*)", "/search/goods"};

            // 获取用户请求的 uri
            String uri = request.getPath().toString();

            for (String whiteUri : whiteUris) {
                if (Pattern.matches(whiteUri, uri)) {
                    return chain.filter(exchange);  // 放行
                }
            }

            // 请求头中获取 token
            String token = request.getHeaders().getFirst("token");
            if (StringUtils.isEmpty(token)) {
                return response(response, new ResultVO(false, "非法访问"));
            }

            // 校验令牌
            PublicKey publicKey = RsaUtils.getPublicKey(ResourceUtils.getFile("classpath:rsa_pub").getPath());

            SysUser infoFromToken = (SysUser) JwtUtils.getInfoFromToken(token, publicKey, SysUser.class);
            String str = JSONUtil.toJsonStr(infoFromToken);
            // 将用户信息存放到 http 请求头，转发给下游服务
            ServerHttpRequest newHttpRequest = request.mutate().header("userinfo", str).build();
            ServerWebExchange newExchange = exchange.mutate().request(newHttpRequest).build();

            return chain.filter(newExchange);  // 放行

        } catch (MalformedJwtException e) {
            e.printStackTrace();
            return response(response, new ResultVO(false, "非法令牌"));
        } catch (ExpiredJwtException e) {
            e.printStackTrace();
            return response(response, new ResultVO(false, "令牌已过期"));
        } catch (Exception e) {
            e.printStackTrace();
            return response(response, new ResultVO(false, "其他异常"));
        }
    }

    /**
     * 不放行时，直接响应 json 错误信息
     */
    private Mono<Void> response(ServerHttpResponse response, ResultVO res) {
        response.getHeaders().add("Content-Type", "application/json;charset=UTF-8");

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonStr = null;
        try {
            jsonStr = objectMapper.writeValueAsString(res);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        DataBuffer dataBuffer = response.bufferFactory().wrap(jsonStr.getBytes());

        return response.writeWith(Flux.just(dataBuffer)); // 响应 json 数据
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```

## 4. 资源服务获取用户信息

网关校验通过后会把用户信息放进请求头转发下来，资源服务用拦截器取出并放入 `ThreadLocal`，让当前请求的任何业务代码都能方便地取到用户信息。

UserInfoInterceptor：

```java
package com.wfx.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 用户信息拦截器：从请求头中获取用户信息并放入 ThreadLocal
 *
 * @author zhuximing
 */
public class UserInfoInterceptor implements HandlerInterceptor {

    /**
     * 每个请求线程独立的用户信息存储
     */
    private static ThreadLocal<String> local = new ThreadLocal<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 获取用户信息（网关校验令牌后写入请求头，头名以项目实际约定为准）
        String userId = request.getHeader("userId");

        // 将用户信息放入 ThreadLocal
        local.set(userId);

        return true;
    }

    // 请求结束后清理，防止线程复用导致的数据串用与内存泄漏
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        local.remove();
    }

    /**
     * 业务代码中获取当前请求的用户信息
     *
     * @return 当前请求的用户信息
     */
    public static String getUserInfo() {
        return local.get();
    }
}
```

注册拦截器：

```java
package com.wfx.interceptor;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfiguration implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new UserInfoInterceptor())
            .addPathPatterns("/**")
            .excludePathPatterns("/login");
    }
}
```

> [!NOTE]
> 整条链路的关键点：私钥只在认证服务中持有，负责颁发令牌；网关和资源服务只拿公钥做校验；令牌一旦被篡改，公钥校验就会失败，从而保证令牌不可伪造。
