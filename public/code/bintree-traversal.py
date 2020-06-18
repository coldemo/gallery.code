# 144. 二叉树的前序遍历 - 145. 二叉树的后序遍历 - 94. 二叉树的中序遍历

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None


# 面试题07. 重建二叉树
# https://leetcode-cn.com/problems/zhong-jian-er-cha-shu-lcof/solution/mian-shi-ti-07-zhong-jian-er-cha-shu-by-leetcode-s/
def buildTree(preorder, inorder):
    root, length, stack, index = TreeNode(preorder[0]), len(preorder), [], 0
    stack.append(root)
    for i in range(1, length):
        preorderval, node = preorder[i], stack[-1]
        if node.val != inorder[index]:  # 每次比较栈顶元素和inorder[index]
            node.left = TreeNode(preorderval)
            stack.append(node.left)
        else:
            # 栈顶元素等于inorder[index],弹出；并且index += 1
            while stack and stack[-1].val == inorder[index]:
                node = stack[-1]
                stack.pop()
                index += 1
            node.right = TreeNode(preorderval)
            stack.append(node.right)
    return root


preorder = [3, 9, 20, 15, 7]
inorder = [9, 3, 15, 20, 7]
print(str(["preorder", preorder]))
print(str(["inorder", inorder]))
root = buildTree(preorder, inorder)


# 4. 前序-中序-后序 通用模板
# https://leetcode-cn.com/problems/binary-tree-postorder-traversal/solution/mo-fang-di-gui-zhi-bian-yi-xing-by-sonp/
def preorderTraversal4(root):
    result, stack = [], [root]
    while stack:
        p = stack.pop()
        if p is None:
            p = stack.pop()
            result.append(p.val)
        else:
            # 先append的最后访问
            if p.right:  # 1
                stack.append(p.right)
            if p.left:  # 2
                stack.append(p.left)
            stack.append(p)  # 3
            stack.append(None)  # 3.1
    return result


print(str(["Universal preorder", preorderTraversal4(root)]))


# 3. 前序 - 莫里斯遍历
# todo


# 2. 后序 - 迭代
# 执行用时: 16 ms , 在所有 Python 提交中击败了 88.59% 的用户
# 内存消耗: 12.8 MB , 在所有 Python 提交中击败了 16.67% 的用户
def postorderTraversal2(root):
    ans, stack = [], [root]
    while stack:
        node = stack.pop()
        if node:
            ans.append(node.val)
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
    return ans[::-1]  # 逆序


# 2. 中序 - 迭代
# 执行用时: 12 ms , 在所有 Python 提交中击败了 98.00% 的用户
# 内存消耗: 12.6 MB , 在所有 Python 提交中击败了 7.14% 的用户
def inorderTraversal2(root):
    ans, stack, curr = [], [], root
    while curr or len(stack):
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        ans.append(curr.val)
        curr = curr.right
    return ans


# 2. 前序 - 迭代
# 执行用时: 28 ms , 在所有 Python 提交中击败了 16.30% 的用户
# 内存消耗: 13 MB , 在所有 Python 提交中击败了 5.56% 的用户
def preorderTraversal2(root):
    ans, stack = [], [root]
    while stack:
        node = stack.pop()
        if node:
            ans.append(node.val)
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
    return ans


print(str(["Iteration preorder", preorderTraversal2(root)]))
print(str(["Iteration inorder", inorderTraversal2(root)]))
print(str(["Iteration postorder", postorderTraversal2(root)]))


# 1. 前序 - 递归
# 执行用时: 20 ms , 在所有 Python 提交中击败了 69.51% 的用户
# 内存消耗: 12.7 MB , 在所有 Python 提交中击败了 5.56% 的用户
def preorderTraversal1(root):
    ans = []

    def walk(node):
        if not node:
            return
        ans.append(node.val)
        walk(node.left)
        walk(node.right)
    walk(root)
    return ans


print(str(["Recursion preorder", preorderTraversal1(root)]))
