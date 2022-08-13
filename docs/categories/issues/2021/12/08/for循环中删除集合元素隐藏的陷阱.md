---
title: for循环中删除集合元素隐藏的陷阱
author: 查尔斯
date: 2021/12/08 20:00
categories:
 - Bug万象集
tags:
 - Java集合
---

# for循环中删除集合元素隐藏的陷阱

## 前言

**C：** 今天在审查代码时，发现某位同事提交的代码中有一个比较基础性的错误。

这部分需求的主要目的是将集合中指定的元素删除掉，而这位同事采用的方法是用 for 循环来循环集合索引，然后通过索引从集合中取出每一个元素，判断是否是要删除的元素，如果是就直接删除掉。

**大概意思的代码，如下：** 

```java {11,15}
// 创建集合，并初始化数据
List<Integer> list = new ArrayList<>(4);
list.add(1);
list.add(2);
list.add(3);
list.add(4);

// 删除元素值为 2 的元素
for (int i = 0; i < list.size(); i++) {
    if (Objects.equals(list.get(i), 2)) {
        list.remove(i);
    }
}

System.out.println(list); // [1, 3, 4]
```

笔者知道，肯定有同学会好奇，这结果是正确的啊，哪里有什么问题？的确，这个思路没问题，问题的关键是这位同事采用的循环方式存在问题。

别着急，接下来，笔者就带各位同学好好测试一下。

## 测试代码

### 基础for循环中删除

直接放代码吧，下方是使用基础的 for 循环（循环索引）来实现的集合元素删除，比之 前言 中的代码，无非是要删除的元素 2 有重复，变成了两个。

```java {30,33}
/**
 * List集合-循环中删除元素-测试
 *
 * @author Charles7c
 * @date 2021/12/8 20:59
 */
@DisplayName("List集合-循环中删除元素-测试")
public class ListRemoveEleInForLoopTest {

    private List<Integer> list;

    /** 初始化数据 */
    @BeforeEach
    public void init() {
        list = new ArrayList<>(5);
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        list.add(2);
    }

    /** 运行无异常，测试符合预期 */
    @Test
    @DisplayName("基础for循环中删除元素测试")
    void testBasicForLoop() {
        for (int i = 0; i < list.size(); i++) {
            if (Objects.equals(list.get(i), 2)) {
                // IDEA警告：Suspicious 'List.remove()' in the loop
                list.remove(i);
            }
        }
        System.out.println(list); // [1, 3, 4]
        Assertions.assertEquals(list.size(), 3);
    }

}
```

测试结果也是正常的啊，莫非笔者失手了？别着急 ...

我们再来测试一下，这回我们稍微调整下重复元素的位置，将重复的元素移动到相邻位置。

```java {30,33}
/**
 * List集合-循环中删除元素-测试
 *
 * @author Charles7c
 * @date 2021/12/8 20:59
 */
@DisplayName("List集合-循环中删除元素-测试")
public class ListRemoveEleInForLoopTest {

    private List<Integer> list;

    /** 初始化数据 */
    @BeforeEach
    public void init() {
        list = new ArrayList<>(5);
        list.add(1);
        list.add(2);
        list.add(2);
        list.add(3);
        list.add(4);
    }

    /** 运行无异常，测试不通过 */
    @Test
    @DisplayName("基础for循环中删除元素测试")
    void testBasicForLoop() {
        for (int i = 0; i < list.size(); i++) {
            if (Objects.equals(list.get(i), 2)) {
                // IDEA警告：Suspicious 'List.remove()' in the loop
                list.remove(i);
            }
        }
        System.out.println(list); // [1, 2, 3, 4]
        Assertions.assertEquals(list.size(), 3);
    }

}
```

测试不通过，why？

**原因很简单：** ArrayList 是基于数组结构而来的，在实现 E remove(int index) 方法时，也是在操作数组而已。

**E remove(int index) 方法的源代码，如下：** 

```java {20,25}
/**
 * Removes the element at the specified position in this list.
 * Shifts any subsequent elements to the left (subtracts one from their
 * indices).
 *
 * @param index the index of the element to be removed
 * @return the element that was removed from the list
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public E remove(int index) {
    rangeCheck(index);

    modCount++;
    E oldValue = elementData(index);

    int numMoved = size - index - 1;
    if (numMoved > 0)
        // 表面看是在拷贝数组，但是源数组和目标数组都是同一个，所以是移动数组元素而已
        // 例如：[1, 2, 3, 4] -> [1, 3, 4, 4]
        System.arraycopy(elementData, index+1, elementData, index,
                numMoved);
    // 元素数量-1，并清除多余元素
    // 例如：[1, 2, 3, 4] -> [1, 3, 4, 4]
    // 最后一个4就是多余的，置为默认值 null
    elementData[--size] = null; // clear to let GC do its work
	
    return oldValue;
}
```

这样的话就会导致，在循环索引中删除完某个元素，其后面的元素移动到这个元素的位置，但是循环的索引可没回退，这样在取值时就会 **跳过下一个元素** 。（看不懂的话，可以debug一下，很清晰的）

如果被删除元素的下一个元素不是匹配条件的，那还问题不显，但是如果被删除元素的下一个元素也是匹配条件的，也就会出现刚才测试的结果了。

知道了问题的根源，要是还想要用这种循环，加一行代码就可以了。

```java {30,32,35}
/**
 * List集合-循环中删除元素-测试
 *
 * @author Charles7c
 * @date 2021/12/8 20:59
 */
@DisplayName("List集合-循环中删除元素-测试")
public class ListRemoveEleInForLoopTest {

    private List<Integer> list;

    /** 初始化数据 */
    @BeforeEach
    public void init() {
        list = new ArrayList<>(5);
        list.add(1);
        list.add(2);
        list.add(2);
        list.add(3);
        list.add(4);
    }

    /** 运行无异常，测试不通过 */
    @Test
    @DisplayName("基础for循环中删除元素测试")
    void testBasicForLoop() {
        for (int i = 0; i < list.size(); i++) {
            if (Objects.equals(list.get(i), 2)) {
                // IDEA警告：Suspicious 'List.remove()' in the loop
                list.remove(i);
                // !!!回退索引!!!
                i--;
            }
        }
        System.out.println(list); // [1, 3, 4]
        Assertions.assertEquals(list.size(), 3);
    }

}
```

### 增强for循环中删除

显然，在基础 for 循环中删除元素，这种方法并不是最好的，那我们就再来看看其他的循环方式吧。

简单改动下代码，看看平时出场频率也很高的增强 for 循环会如何？

```java {29}
/**
 * List集合-循环中删除元素-测试
 *
 * @author Charles7c
 * @date 2021/12/8 20:59
 */
@DisplayName("List集合-循环中删除元素-测试")
public class ListRemoveEleInForLoopTest {

    private List<Integer> list;

    /** 初始化数据 */
    @BeforeEach
    public void init() {
        list = new ArrayList<>(5);
        list.add(1);
        list.add(2);
        list.add(2);
        list.add(3);
        list.add(4);
    }

    /** 运行时异常：java.util.ConcurrentModificationException */
    @Test
    @DisplayName("增强for循环中删除元素测试")
    void testForEachLoop() {
        for (Integer num : list) {
            if (Objects.equals(num, 2)) {
                list.remove(num);
            }
        }
        System.out.println(list);
        Assertions.assertSame(list.size(), 3);
    }

}
```

测试中断，删除一个元素后继续循环会抛出运行时异常：java.util.ConcurrentModificationException。 Pass ...

### 迭代器中删除

最后，我们再尝试一种循环：迭代器，可能对于部分同学来说，平时使用相对要少一些。

```java {31,34}
/**
 * List集合-循环中删除元素-测试
 *
 * @author Charles7c
 * @date 2021/12/8 20:59
 */
@DisplayName("List集合-循环中删除元素-测试")
public class ListRemoveEleInForLoopTest {

    private List<Integer> list;

    /** 初始化数据 */
    @BeforeEach
    public void init() {
        list = new ArrayList<>(5);
        list.add(1);
        list.add(2);
        list.add(2);
        list.add(3);
        list.add(4);
    }

    /** 运行无异常，测试符合预期 */
    @Test
    @DisplayName("迭代器中删除元素测试")
    void testIterator() {
        Iterator<Integer> iterator = list.iterator();
        while (iterator.hasNext()) {
            Integer num = iterator.next();
            if (Objects.equals(num, 2)) {
                iterator.remove();
            }
        }
        System.out.println(list); // [1, 3, 4]
        Assertions.assertSame(list.size(), 3);
    }

}
```

测试通过，这种方式也是平时 **推荐大家采用** 的，而且在 Java 8 中，官方还为我们在 Collection 接口中提供了一个 default 方法来简化集合删除元素。

```java {28}
/**
 * List集合-循环中删除元素-测试
 *
 * @author Charles7c
 * @date 2021/12/8 20:59
 */
@DisplayName("List集合-循环中删除元素-测试")
public class ListRemoveEleInForLoopTest {

    private List<Integer> list;

    /** 初始化数据 */
    @BeforeEach
    public void init() {
        list = new ArrayList<>(5);
        list.add(1);
        list.add(2);
        list.add(2);
        list.add(3);
        list.add(4);
    }

    /** 运行无异常，测试符合预期 */
    @Test
    @DisplayName("迭代器中删除元素测试")
    void testIterator() {
        // Java 8 在 Collection 接口中提供的 default 方法
        list.removeIf(num -> Objects.equals(num, 2));
        System.out.println(list); // [1, 3, 4]
        Assertions.assertSame(list.size(), 3);
    }

}
```

**Collection 接口的 removeIf() 方法的源代码，如下：** 

```java {27,30}
public interface Collection<E> extends Iterable<E> {
    /**
     * Removes all of the elements of this collection that satisfy the given
     * predicate.  Errors or runtime exceptions thrown during iteration or by
     * the predicate are relayed to the caller.
     *
     * @implSpec
     * The default implementation traverses all elements of the collection using
     * its {@link #iterator}.  Each matching element is removed using
     * {@link Iterator#remove()}.  If the collection's iterator does not
     * support removal then an {@code UnsupportedOperationException} will be
     * thrown on the first matching element.
     *
     * @param filter a predicate which returns {@code true} for elements to be
     *        removed
     * @return {@code true} if any elements were removed
     * @throws NullPointerException if the specified filter is null
     * @throws UnsupportedOperationException if elements cannot be removed
     *         from this collection.  Implementations may throw this exception if a
     *         matching element cannot be removed or if, in general, removal is not
     *         supported.
     * @since 1.8
     */
    default boolean removeIf(Predicate<? super E> filter) {
        Objects.requireNonNull(filter);
        boolean removed = false;
        final Iterator<E> each = iterator();
        while (each.hasNext()) {
            if (filter.test(each.next())) {
                each.remove();
                removed = true;
            }
        }
        return removed;
    }
    
    // 省略其他代码...
}
```

很显然，官方也是用的迭代器来实现的。

## 后记

**C：** 虽然是一个小问题，但是见到的犯错者无数，以前并未当回事，这次遇到正好记录一下，给各位同学一个提醒。