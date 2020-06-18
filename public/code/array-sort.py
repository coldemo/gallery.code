sample = [2, 15, 5, 9, 7, 6, 4, 12, 5, 4, 1, 64, 5, 6, 4, 2, 3, 54, 45, 4, 44]
sample_sorted = [1, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5,
                 6, 6, 7, 9, 12, 15, 44, 45, 54, 64]    # 正确排序

print(sample)
print(sample_sorted)


def assert_list(actual, expected):
    return 'OK' if actual == expected else actual


# 十大经典排序算法（python实现）（原创）
# https://www.cnblogs.com/Mufasa/p/10527387.html


def bubble_sort(lst):
    while 1:
        touched = 0    # 假设本次循环没有改变
        for i in range(len(lst) - 1):
            if lst[i] > lst[i + 1]:
                lst[i], lst[i + 1] = lst[i + 1], lst[i]
                touched = 1    # 有数值交换，那么状态值置1
        if not touched:    # 如果没有数值交换，那么就跳出
            break


dt = sample[:]
bubble_sort(dt)
print('bubble_sort: ' + str(assert_list(dt, sample_sorted)))


def selection_sort(lst):
    d1 = []
    while len(lst):
        min = [0, lst[0]]
        for i in range(len(lst)):
            if min[1] > lst[i]:
                min = [i, lst[i]]
        del lst[min[0]]    # 找到剩余部分的最小值，并且从原数组中删除
        d1.append(min[1])    # 在新数组中添加
    return d1


dt = selection_sort(sample[:])
print('selection_sort: ' + str(assert_list(dt, sample_sorted)))


def direct_insertion_sort(lst):   # 直接插入排序，因为要用到后面的希尔排序，所以转成function
    d1 = [lst[0]]
    for i in lst[1:]:
        state = 1
        for j in range(len(d1) - 1, -1, -1):
            if i >= d1[j]:
                d1.insert(j + 1, i)  # 将元素插入数组
                state = 0
                break
        if state:
            d1.insert(0, i)
    return d1


dt = direct_insertion_sort(sample[:])
print('direct_insertion_sort: ' + str(assert_list(dt, sample_sorted)))


def binary_insertion_sort(lst):
    d1 = [lst[0]]
    for i in lst[1:]:
        index_now = [-1, len(d1)]
        while 1:
            index = index_now[0] + int((index_now[1] - index_now[0]) / 2)
            if i == d1[index]:
                d1.insert(index+1, i)
                break
            elif index in index_now:  # 如果更新的index值在index_now中存在（也有可能是边界），那么就表明无法继续更新
                d1.insert(index+1, i)
                break
            elif i > d1[index]:
                index_now[0] = index
            elif i < d1[index]:
                index_now[1] = index
    return d1


dt = binary_insertion_sort(sample[:])
print('binary_insertion_sort: ' + str(assert_list(dt, sample_sorted)))


# 基于 direct_insertion_sort
def shell_sort(d):  # d 为乱序数组，l为初始增量,其中l<len(d),取为len(d)/2比较好操作。最后还是直接省略length输入
    length = int(len(d) / 2)  # 10
    num = int(len(d) / length)  # 2
    while 1:
        for i in range(length):
            d_mid = []
            for j in range(num):
                d_mid.append(d[i + j * length])
            d_mid = direct_insertion_sort(d_mid)
            for j in range(num):
                d[i + j * length] = d_mid[j]
        length = int(length / 2)
        if length == 0:
            break
        num = int(len(d) / length)


dt = sample[:]
shell_sort(dt)
print('shell_sort: ' + str(assert_list(dt, sample_sorted)))


def merge_sort(lst):  # 分治发的典型应用，大问题拆分成小问题，逐个击破，之后将结果合并
    half_index = int(len(lst) / 2)  # 将数组拆分
    d0 = lst[:half_index]
    d1 = lst[half_index:]

    if len(d0) > 1:
        d0 = merge_sort(d0)
    if len(d1) > 1:
        d1 = merge_sort(d1)

    index = 0
    for i in range(len(d1)):
        state = 1
        for j in range(index, len(d0)):
            if d1[i] < d0[j]:
                state = 0
                index = j + 1
                d0.insert(j, d1[i])
                break
        if state == 1:  # 如果大于d0这个队列的所有值，那么直接extend所有数据
            d0.extend(d1[i:])
            break
    return d0


dt = merge_sort(sample[:])
print('merge_sort: ' + str(assert_list(dt, sample_sorted)))


def quick_sort(lst):
    d = [[], [], []]
    d_pivot = lst[-1]  # 因为是乱序数组，所以第几个都是可以的，理论上是一样的
    for i in lst:
        if i < d_pivot:  # 小于基准值的放在前
            d[0].append(i)
        elif i > d_pivot:  # 大于基准值的放在后
            d[2].append(i)
        else:  # 等于基准值的放在中间
            d[1].append(i)

    if len(d[0]) > 1:  # 大于基准值的子数组，递归
        d[0] = quick_sort(d[0])
    if len(d[2]) > 1:  # 小于基准值的子数组，递归
        d[2] = quick_sort(d[2])

    d[0].extend(d[1])
    d[0].extend(d[2])
    return d[0]


dt = quick_sort(sample[:])
print('quick_sort: ' + str(assert_list(dt, sample_sorted)))


def counting_sort(lst):
    d_max = 0
    d_min = 0
    for i in lst:
        if d_max < i:
            d_max = i
        if d_min > i:
            d_min = i

    d1 = {}
    for i in lst:
        if i in d1.keys():
            d1[i] += 1
        else:
            d1[i] = 1

    d2 = []
    for i in range(d_min, d_max+1):
        if i in d1.keys():
            for j in range(d1[i]):
                d2.append(i)
    return d2


dt = counting_sort(sample[:])
print('counting_sort: ' + str(assert_list(dt, sample_sorted)))


def bucket_sort(lst):
    d1 = [[] for x in range(10)]
    for i in lst:
        d1[int(i / 10)].append(i)
    for i in range(len(d1)):
        if d1[i] != []:
            d2 = [[] for x in range(10)]
            for j in d1[i]:
                d2[j % 10].append(j)
            d1[i] = d2
    d3 = []
    for i in d1:
        if i:
            for j in i:
                if j:
                    for k in j:
                        if k:
                            d3.append(k)
    return d3


dt = bucket_sort(sample[:])
print('bucket_sort: ' + str(assert_list(dt, sample_sorted)))


def radix_sort(lst):
    d1 = [[] for x in range(10)]
    # 第一次 最小位次排序
    for i in lst:
        d1[i % 10].append(i)
    d0_1 = []
    for i in d1:
        if i:
            for j in i:
                d0_1.append(j)
    # 第二次 次低位排序
    d2 = [[] for x in range(10)]
    for i in d0_1:
        d2[int(i / 10)].append(i)
    d0_2 = []
    for i in d2:
        if i:
            for j in i:
                d0_2.append(j)
    return d0_2


dt = radix_sort(sample[:])
print('radix_sort: ' + str(assert_list(dt, sample_sorted)))


# Python 堆排序 - 菜鸟教程
# https://www.runoob.com/python3/python-heap-sort.html


def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1     # left = 2*i + 1
    r = 2 * i + 2     # right = 2*i + 2
    if l < n and arr[i] < arr[l]:
        largest = l
    if r < n and arr[largest] < arr[r]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]  # 交换
        heapify(arr, n, largest)


def heap_sort(arr):
    n = len(arr)
    # Build a maxheap.
    for i in range(n, -1, -1):
        heapify(arr, n, i)
    # 一个个交换元素
    for i in range(n-1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]   # 交换
        heapify(arr, i, 0)


dt = sample[:]
heap_sort(dt)
print('heap_sort: ' + str(assert_list(dt, sample_sorted)))
