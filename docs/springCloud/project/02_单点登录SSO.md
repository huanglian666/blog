---
title: 02_单点登录SSO
---

# 一：jwt

## 1.1：jwt令牌简介

JWT概念:

> JWT，全称JSON Web Token，官网地址https://jwt.io ，是一款出色的分布式身份校验方案。可以生成token，也可以解析检验token。

JWT生成的token由三部分组成：

```txt
头部（head）：令牌类型和所使用的签名算法
{
	'alg':'HS256'
	'typ':'JWT'
}
进行base64编码（不是加密）==> 'xxxxxxx'


载荷（payload）： token中存放有效信息的部分，比如用户名，用户角色，过期时间等，但是不要放密码，会泄露！
{
name:'jack',
age:18
}
进行base64编码（不是加密）==> 'yyyyyy'



签名(signatrue)：将头部与载荷分别采用 base64编码后，用“.”相连，再加入盐，最后使用头部声明的编码类型进行加密，就得到了签名。
签名=HS256(xxxxxx.yyyyyyy,salt)

```

## 1.2：jwt入门使用

```xml
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.4.0</version>
</dependency>
```





```java
public static void main(String[] args) throws Exception{
  Calendar c = Calendar.getInstance();
        c.add(Calendar.SECOND,10);


        //生成jwt令牌
        String jwtToken = JWT.create()
//            .withHeader()  使用默认即可
            //payload(用户信息 id、account、role、auth)
            .withClaim("id", "12")
            .withClaim("account", "jack")
            .withClaim("role", "ROLE_ADMIN,ROLE_COPY")
            .withExpiresAt(c.getTime())   //指定令牌的过期时间
            .sign(Algorithm.HMAC256("wfx"));
        System.out.println(jwtToken);

        //校验jwt令牌

        Thread.sleep(15000);

        JWTVerifier wfxVerifier = JWT.require(Algorithm.HMAC256("wfx")).build();
        DecodedJWT verify = wfxVerifier.verify(jwtToken);//校验令牌
        //解析令牌，获取用户信息
        String id = verify.getClaim("id").asString();
        System.out.println("id"+id);
        String account = verify.getClaim("account").asString();
        System.out.println("account"+account);



    }
```



## 1.3：RSA非对称加密

### 1.3.1：为什么RSA非对称加密

JWT生成token的安全性分析:

```txt
从JWT生成的token组成上来看，要想避免token被伪造，主要就得看签名部分了，而签名部分又有三部分组成，其中头部和载荷的base64编码，几乎是透明的，毫无安全性可言，那么最终守护token安全的重担就落在了加入的盐上面了！

如果salt泄漏就会导致token伪造，最终导致系统安全隐患

这时，我们就需要对盐采用非对称加密的方式进行加密，以达到生成token与校验token方所用的盐不一致的安全效果！

RSA非对称加密:私钥加密(生成令牌)  公钥解密（校验令牌）
```



### 1.3.2：生成公钥、私钥秘钥对

#### RsaUtils

```JAVA
package com.wfx.util;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class RsaUtils {
    private static final int DEFAULT_KEY_SIZE = 2048;

    /**
     * @param filename 公钥保存路径，相对于classpath
     * @return 公钥对象
     * @throws Exception
     */
    public static PublicKey getPublicKey(String filename) throws Exception {
        byte[] bytes = readFile(filename);
        return getPublicKey(bytes);
    }

    /**
     * 从文件中读取密钥
     *
     * @param filename 私钥保存路径，相对于classpath
     * @return 私钥对象
     * @throws Exception
     */
    public static PrivateKey getPrivateKey(String filename) throws Exception {
        byte[] bytes = readFile(filename);
        return getPrivateKey(bytes);
    }

    /**
     * 获取公钥
     * @param bytes 公钥的字节形式
     * @return
     * @throws Exception
     */
    public static PublicKey getPublicKey(byte[] bytes) throws Exception {
        bytes = Base64.getDecoder().decode(bytes);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(bytes);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePublic(spec);
    }

    /**
     * 获取密钥
     * @param bytes 私钥的字节形式
     * @return
     * @throws Exception
     */
    public static PrivateKey getPrivateKey(byte[] bytes) throws NoSuchAlgorithmException,
        InvalidKeySpecException {
        bytes = Base64.getDecoder().decode(bytes);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(bytes);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePrivate(spec);
    }

    /**
     * 根据密文，生存rsa公钥和私钥,并写入指定文件
     *
     * @param publicKeyFilename  公钥文件路径
     * @param privateKeyFilename 私钥文件路径
     * @param secret             生成密钥的密文
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



#### 生成秘钥对

```java
public static void main(String[] args)throws Exception {

    String privateFilePath = "E:\\key\\rsa";
    String publicFilePath = "E:\\key\\rsa.pub";

    RsaUtils.generateKey(publicFilePath,privateFilePath,"wfx",2048);
}
```



### 1.3.3：jwt令牌的颁发与校验

> 私钥加密生成jwt令牌，公钥解密jwt令牌工具类

#### pom依赖

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



#### JsonUtils

```java
package com.wfx.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class JsonUtils {

    public static final ObjectMapper mapper = new ObjectMapper();

    private static final Logger logger = LoggerFactory.getLogger(JsonUtils.class);

    /**
     * 将对象转换成json串
     * @param obj
     * @return
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
     * 将json串转换成对象
     * @param json
     * @param tClass
     * @param <T>
     * @return
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



#### JwtUtils

```java
package com.jwt.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.*;

/**
 * 生成token以及校验token相关方法
 */
public class JwtUtils {

    private static final String JWT_PAYLOAD_USER_KEY = "user";

    /**
     * 私钥加密token
     * @param userInfo   载荷中的数据
     * @param privateKey 私钥
     * @param expire     过期时间，单位分钟
     * @return JWT
     */
    public static String generateTokenExpireInMinutes(Object userInfo, PrivateKey privateKey, int expire) {
        //计算过期时间
        Calendar c = Calendar.getInstance();
        c.add(Calendar.MINUTE,expire);

        return Jwts.builder()
                .claim(JWT_PAYLOAD_USER_KEY, JsonUtils.toString(userInfo))//将用户信息放入payload
                .setId(new String(Base64.getEncoder().encode(UUID.randomUUID().toString().getBytes())))
                .setExpiration(c.getTime())
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    /**
     * 私钥加密token
     * @param userInfo   载荷中的数据
     * @param privateKey 私钥
     * @param expire     过期时间，单位秒
     * @return JWT
     */
    public static String generateTokenExpireInSeconds(Object userInfo, PrivateKey privateKey, int expire) {
        //计算过期时间
        Calendar c = Calendar.getInstance();
        c.add(Calendar.SECOND,expire);

        return Jwts.builder()
                .claim(JWT_PAYLOAD_USER_KEY, JsonUtils.toString(userInfo))
                .setId(new String(Base64.getEncoder().encode(UUID.randomUUID().toString().getBytes())))
                .setExpiration(c.getTime())
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }






    /**
     * 获取token中的用户信息
     *
     * @param token     用户请求中的令牌
     * @param publicKey 公钥
     * @return 用户信息
     */
    public static  Object getInfoFromToken(String token, PublicKey publicKey, Class userType) {
        //解析token
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(publicKey).parseClaimsJws(token);

        Claims body = claimsJws.getBody();//获取payload
        String userInfoJson = body.get(JWT_PAYLOAD_USER_KEY).toString();
        return JsonUtils.toBean(userInfoJson, userType);

    }



}
```



测试jw令牌生成与jwt令牌校验

```java

    public static void main(String[] args) throws Exception {
        //生成jwt令牌
        Map userinfo = new HashMap(){{
            put("account","jack");
            put("auth","a,b,c,d");
        }};

        //获取私钥
        String path = ResourceUtils.getFile("classpath:rsa").getPath();
        //构建私钥对象
        PrivateKey privateKey = RsaUtils.getPrivateKey(path);


        String token = JwtUtils.generateTokenExpireInMinutes(userinfo, privateKey, 1);

        System.out.println(token);


        //解析token
        //获取公钥路径
        String path1 = ResourceUtils.getFile("classpath:rsa.pub").getPath();
        //构建公钥对象
        PublicKey publicKey = RsaUtils.getPublicKey(path1);

        Map infoFromToken = (Map) JwtUtils.getInfoFromToken(token, publicKey, Map.class);
        System.out.println(infoFromToken.get("account"));

    }
```



# 二：单点登录服务

> 在分布式系统中，搭建单点登录（SSO）【single sign on】服务，从而实现一次登录  处处使用



后台接口开发

```java
package com.fengmi.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.fengmi.jwt.JwtUtils;
import com.fengmi.jwt.RsaUtils;
import com.fengmi.user.SysUser;
import com.fengmi.user.mapper.SysUserMapper;
import com.fengmi.user.service.ISysUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fengmi.vo.ResultVO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.FileNotFoundException;
import java.security.PrivateKey;

/**
 * <p>
 * 用户信息表 服务实现类
 * </p>
 *
 * @author zhuxm
 * @since 2021-10-19
 */
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements ISysUserService {

    @Override
    public ResultVO login(SysUser user) {
        if (user == null) {
            return  new ResultVO(false, "用户或者密码必须填写");
        }

        //获取用户信息
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("account", user.getAccount());
        queryWrapper.eq("user_type", "6");
        SysUser sysUserFromDB = this.baseMapper.selectOne(queryWrapper);
        if (sysUserFromDB == null) {
            return  new ResultVO(false, "用户或者密码错误");
        }


        //比较密码
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if(!encoder.matches(user.getPassword(),sysUserFromDB.getPassword())){
            return  new ResultVO(false, "用户或者密码错误");
        }

        //颁发jwt令牌
        //加载私钥
        try {
            String path = ResourceUtils.getFile("classpath:rsa_pri").getPath();
            PrivateKey privateKey = RsaUtils.getPrivateKey(path);
            sysUserFromDB.setPassword("");
            String token = JwtUtils.generateTokenExpireInMinutes(sysUserFromDB, privateKey, 40);

            return  new ResultVO(true, "success",token);

        } catch (Exception e) {
            e.printStackTrace();
            return  new ResultVO(false, "用户或者密码错误");

        }

    }

    @Override
    public ResultVO login(String phone, String code) {
        return null;
    }
}

```



# 三：网关全局认证

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
 * <p>title: com.portal.filters</p>
 * <p>Company: wendao</p>
 * author zhuximing
 * date 2021/7/30
 * description:
 */
@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

//    public static void main(String[] args) {
//        boolean matches =;
//        System.out.println(matches);
//    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {







        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        try {

            //定义白名单
            String[] whiteUris = {"/auth/login","/auth/verify","/index/(.*)","/search/goods"};

            //获取用户请求的uri
            String uri = request.getPath().toString();

            for (String uris : whiteUris) {
                if( Pattern.matches(uris, uri)){
                    return  chain.filter(exchange);  //放行
                }
            }



            //请求头中获取token
            String token = request.getHeaders().getFirst("token");
            if(StringUtils.isEmpty(token)){
                return response(response,new ResultVO(false, "非法访问"));
            }


            //校验令牌
            PublicKey publicKey = RsaUtils.getPublicKey(ResourceUtils.getFile("classpath:rsa_pub").getPath());

            SysUser infoFromToken = (SysUser) JwtUtils.getInfoFromToken(token, publicKey, SysUser.class);
            String str = JSONUtil.toJsonStr(infoFromToken);
            //将用户信息存放到http请求头
            ServerHttpRequest newHttpRequest = request.mutate().header("userinfo", str).build();
            ServerWebExchange newexchange = exchange.mutate().request(newHttpRequest).build();


            return  chain.filter(newexchange);  //放行


        } catch (MalformedJwtException e) {
            e.printStackTrace();
            return response(response,new ResultVO(false, "非法令牌"));
        }catch (ExpiredJwtException e) {
            e.printStackTrace();
            return response(response,new ResultVO(false, "令牌已过期"));
        }catch (Exception e) {
            e.printStackTrace();
            return response(response,new ResultVO(false, "其他异常"));
        }
    }

    private Mono<Void> response(ServerHttpResponse response, ResultVO res){
        //不能放行，直接返回，返回json信息
        response.getHeaders().add("Content-Type", "application/json;charset=UTF-8");

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonStr = null;
        try {
            jsonStr = objectMapper.writeValueAsString(res);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }


        DataBuffer dataBuffer = response.bufferFactory().wrap(jsonStr.getBytes());

        return response.writeWith(Flux.just(dataBuffer));//响应json数据
    }




    @Override
    public int getOrder() {
        return 0;
    }
}
```





# 四：资源服务获取用户信息

```java
package com.wfx.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * <p>title: com.wfx.interceptor</p>
 * author zhuximing
 * description:
 */
public class UserInfoInterceptor implements HandlerInterceptor {


   private static ThreadLocal<String> local = new ThreadLocal<>();


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //获取用户id
        String userId = request.getHeader("userId");

        //将userId放入到threadLocal
        local.set(userId);


        return true;
    }


    //请求结束
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

        local.remove();
    }



    public static String  getUserInfo(){
        return  local.get();
    }
}
```





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



