---
title: 用Java8获取近N天日期
author: 查尔斯
date: 2021/11/18 20:55
categories:
 - 方案春秋志
tags:
 - Java
---

# 用Java8获取近N天日期

## 前言

**C：** 登录进入管理类系统，首页一般都是以展示数据仪表盘为主。例如：展示一些总量、展示近一周或是近 N 天的某数据的折线图、柱状图等等。

那在展示这类近 N 天的图表时，后端必然要给前端提供一个近 N 天的日期集合用于显示。

至于实现的方法也有很多种，笔者在这儿就记录一种目前看来扩展性相对较好的方案。

## 涉及技术栈

- Spring Boot 2.3.1.RELEASE
- MyBatis Plus 3.1.0（使用了 MyBatis Plus 的代码生成器）

## Controller层

```java
/**
 * 统计控制器
 *
 * @author Charles7c
 * @date 2021/11/18 20:55
 */
@Api(value = "统计接口", tags = "统计接口集")
@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    
    @Resource
    private IRequestService requestService;
    
    @GetMapping("/request/{days}")
    @ApiOperation(value = "日请求数据统计", notes = "日请求数据统计接口")
    public R<Map<String, Object>> requestByDays(@ApiParam(value = "days", required = true) @PathVariable("days") Integer days) {
        return R.ok(requestService.getRequestTotal(day));
    }
}
```

## Service层

::: tip 笔者说
Service 层接口内容略，这个应该对你没影响吧？
:::

```java {28,30,35,37}
/**
 * 请求服务实现类
 *
 * @author Charles7c
 * @date 2021/11/18 20:55
 */
@Service
public class RequestServiceImpl extends ServiceImpl<RequestMapper, Request> implements IRequestService {
    
    @Override
    public Map<String, Object> getRequestTotal(int days) {
        // 响应数据
        Map<String, Object> respMap = MapUtil.newHashMap(2);
    
        // 日期列表
    	List<String> dateList = new ArrayList<>(days);
		// 请求列表
        List<String> requestList = new ArrayList<>();
        // ...
    
        // 指定日期格式
    	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        // 遍历生成日期列表
        // 例如：days 为 5，现在是 2021-11-18,
        // 则可以获取到 2021-11-14、2021-11-15、2021-11-16、2021-11-17、2021-11-18
    	for (int i = days - 1; i >= 0; i--) {
            // 当前日期 - i天
    		LocalDateTime plusDate = LocalDateTime.now().plusDays(-i);
            // 将日期转换为 yyyy-MM-dd 格式字符串
        	String plusDateStr = formatter.format(plusDate);
            // 添加到日期列表
        	dateList.add(plusDateStr);
            
            // [根据日期查询指定统计数据列表（具体使用时，根据你自己需求决定查询什么表，什么字段...，此处仅为样例）]
			LambdaQueryWrapper<Request> queryWrapper = Wrappers.lambdaQuery();
            // 拼接 SQL，apply 用法，参见：https://mp.baomidou.com/guide/wrapper.html#apply
			queryWrapper.apply("date_format(create_time, '%Y-%m-%d') = {0}", plusDateStr);
			requestList.add(baseMapper.selectCount(queryWrapper).toString());
            
            // ...
    	}
        
        // 添加响应数据
        respMap.put("dateList", dateList);
        respMap.put("requestList", requestList);
        // ...
        return respMap;
    }
}
```
