/**
 * 双向链表节点
 */
export class DobuleLinkedListNode<K, V> {
    key: K | undefined;
    value: V | undefined;
    front: DobuleLinkedListNode<K, V> | null;
    back: DobuleLinkedListNode<K, V> | null;
    constructor(k?: K, v?: V) {
        this.key = k;
        this.value = v;
        this.front = null;
        this.back = null;
    }
}

/**
 * 双向链表
 */
export class DobuleLinkedList<K, V> {
    private head_: DobuleLinkedListNode<K, V>;
    private tail_: DobuleLinkedListNode<K, V>;
    constructor() {
        this.head_ = new DobuleLinkedListNode();
        this.tail_ = new DobuleLinkedListNode();
        this.head_.front = this.tail_;
        this.head_.back = this.tail_;
        this.tail_.front = this.head_;
        this.tail_.back = this.head_;
    }
    /**
     * 往链表头部添加节点
     * @param node 链表节点
     * @returns 链表节点对于的 value
     */
    public insertHead(node: DobuleLinkedListNode<K, V>): K {
        let back: DobuleLinkedListNode<K, V> = this.head_.back as DobuleLinkedListNode<K, V>;
        this.head_.back = node;
        back.front = node;
        node.front = this.head_;
        node.back = back;

        return node.value as K;
    }

    /**
     * 从双向链表中删除节点
     * @param node 链表节点
     * @returns 被删除的链表节点的 key
     */
    public delete(node: DobuleLinkedListNode<K, V>): K {
        node.front!.back = node.back;
        node.back!.front = node.front;

        return node.value as K;
    }

    /**
     * 删除双向链表的最后一个节点
     * @returns 删除的节点的 key
     */
    public deleteLast() : K | undefined {
        // 当链表中没有节点，返回undefined
        if (this.head_.back === this.tail_) {
            return;
        } else {
            return this.delete(this.tail_.front!);
        }
    }

    /**
     * 遍历双向链表
     * @param callback 遍历每个节点时需要执行的回调函数
     */
    public forEeach(callback : (key?: K, value?: V) => void) {
        let it = this.head_.back!;
        while(it != this.tail_) {
            callback(it.key, it.value);
            it = it.back!;
        }
    }
}