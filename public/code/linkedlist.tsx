/** @jsx React.createElement */
/* global React */

appendCss(`
section { margin-bottom: 20px }
`)

let sections = [
  // 141. 环形链表 - 双指针-快慢指针
  () => {
    function detectCycle<T>(head: ListNode<T>): boolean {
      let fast = head
      let slow = head
      while (fast && fast.next) {
        fast = fast.next.next ? fast.next.next : null
        slow = slow.next ? slow.next : null
        if (fast && slow && fast.value === slow.value) return true
      }
      return false
    }
    let before = createLinkedListWithCycle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    let before1 = createLinkedListWithCycle([1, 2, 3, 4, 5, 6, 7, 8, 9, 7])
    let after = detectCycle(before)
    let after1 = detectCycle(before1)
    return (
      <section>
        <h4>141. 环形链表</h4>
        <div>{stringifyLinkedListWithCycle(before)}</div>
        <div>Detect cycle: {String(after)}</div>
        <div>{stringifyLinkedListWithCycle(before1)}</div>
        <div>Detect cycle: {String(after1)}</div>
      </section>
    )
  },

  // 142. 环形链表 II - 双指针-快慢指针
  () => {
    function detectCycleListNode<T>(head: ListNode<T>): ListNode<T> {
      let fast = head
      let slow = head
      while (fast && fast.next) {
        fast = fast.next.next ? fast.next.next : null
        slow = slow.next ? slow.next : null
        if (fast && slow && fast.value === slow.value) { // intersected - has cycle
          let start = head
          while (start.next) {
            start = start.next
            slow = slow.next
            if (start && slow && start.value === slow.value) { // intersected - get node
              return slow
            }
          }
        }
      }
      return null
    }
    let before = createLinkedListWithCycle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    let before1 = createLinkedListWithCycle([1, 2, 3, 4, 5, 6, 7, 8, 9, 7])
    let after = detectCycleListNode(before)
    let after1 = detectCycleListNode(before1)
    return (
      <section>
        <h4>142. 环形链表 II</h4>
        <div>{stringifyLinkedListWithCycle(before)}</div>
        <div>Cycle-node: {stringifyListNode(after)}</div>
        <div>{stringifyLinkedListWithCycle(before1)}</div>
        <div>Cycle-node: {stringifyListNode(after1)}</div>
      </section>
    )
  },

  // 206. 反转链表
  () => {
    function reverseLinkedList<T>(head: ListNode<T>): ListNode<T> {
      head = _.cloneDeep(head)
      let prev = null
      let curr = head
      while (curr) {
        let next = curr.next
        curr.next = prev
        prev = curr
        curr = next
      }
      return prev
    }
    let before = createLinkedList([1, 2, 3, 4])
    let after = reverseLinkedList(before)
    return (
      <section>
        <h4>206. 反转链表</h4>
        <div>{stringifyLinkedList(before)}</div>
        <div>Reverse: {stringifyLinkedList(after)}</div>
      </section>
    )
  },

  // 876. 链表的中间节点 - 双指针-快慢指针
  () => {
    function getMiddleListNode<T>(head: ListNode<T>): ListNode<T> {
      let fast = head
      let slow = head
      while (fast && fast.next) {
        fast = fast.next.next ? fast.next.next : null
        slow = slow.next ? slow.next : slow
      }
      return slow
    }
    let before = createLinkedList([1, 2, 3, 4, 5, 6, 7])
    let before1 = createLinkedList([1, 2, 3, 4, 5, 6, 7, 8])
    let middle = getMiddleListNode(before)
    let middle1 = getMiddleListNode(before1)
    return (
      <section>
        <h4>876. 链表的中间节点</h4>
        <div>{stringifyLinkedList(before)}</div>
        <div>Middle-node: {(middle.value)}</div>
        <div>{stringifyLinkedList(before1)}</div>
        <div>Middle-node: {(middle1.value)}</div>
      </section>
    )
  }
]

let App = () => {
  return (
    <main style={{ padding: 20 }}>
      {sections.map((Comp, idx) => {
        return <Comp key={idx} />
      })}
    </main>
  )
}

interface ListNode<T = any> {
  value: T
  next: ListNode<T>
}
function createLinkedListWithCycle<T>(arr: T[]): ListNode<T> {
  let head = null
  let prev = null
  let cache = new Map<T, ListNode<T>>()
  arr.forEach(val => {
    let curr: ListNode
    if (cache.has(val)) {
      curr = cache.get(val)
    } else {
      curr = { value: val, next: null }
      cache.set(val, curr)
    }
    if (prev) {
      prev.next = curr
    } else {
      head = curr
    }
    prev = curr
  })
  return head
}
function createLinkedList<T>(arr: T[]): ListNode<T> {
  let head = null
  let prev = null
  arr.forEach(val => {
    let curr: ListNode = { value: val, next: null }
    if (prev) {
      prev.next = curr
    } else {
      head = curr
    }
    prev = curr
  })
  return head
}
function stringifyLinkedListWithCycle<T>(head: ListNode<T>): string {
  let arr = []
  let curr = head
  let cache = new Set<T>()
  while (curr) {
    let val = curr.value
    let taken = cache.has(val)
    cache.add(val)
    arr.push(val)
    if (taken) break
    curr = curr.next
  }
  return arr.join(' -> ')
}
function stringifyLinkedList<T>(head: ListNode<T>): string {
  let arr = []
  let curr = head
  while (curr) {
    arr.push(curr.value)
    curr = curr.next
  }
  return arr.join(' -> ')
}
function stringifyListNode<T>(head: ListNode<T>): string {
  return String(head ? head.value : null)
}
