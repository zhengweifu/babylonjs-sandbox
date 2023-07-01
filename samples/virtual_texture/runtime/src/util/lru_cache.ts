import { DobuleLinkedListNode, DobuleLinkedList } from "./dobule_linked_list";

export class LruCache<K, V> {
    private capacity_: number;
    private map_: Map<K, DobuleLinkedListNode<K, V>>;
    private list_: DobuleLinkedList<K, V>;

    constructor(capacity: number) {
        this.capacity_ = capacity;
        this.map_ = new Map();
        this.list_ = new DobuleLinkedList();
    }

    public put(key: K, value: V) {
        if(this.map_.has(key)) {
            let node = this.map_.get(key)!;
            node.value  = value; // 更新链表节点的 value 值
            this.list_.delete(node); // 从链表中删除
            this.list_.insertHead(node); // 插入链表的头部
        } else {
            // 1. 如果链表已经满了，就先删除链表中的最后一个节点
            if(this.capacity_ == this.map_.size) {
                
                let k = this.list_.deleteLast();
                if(k !== undefined) {
                    this.map_.delete(k);
                }
            }
            // 2. 创建新的链表节点
            let node = new DobuleLinkedListNode(key, value);
            // 3. 插入到链表的头部
            this.list_.insertHead(node);
            // 4. 链表节点添加到 map 中
            this.map_.set(key, node);
        }
    }

    public get(key: K) : V | undefined {
        if(this.map_.has(key)) {
            // 如果存在 key，返回 value， 并更新到链表的头部
            let node = this.map_.get(key)!;
            let value = node.value!
            this.put(key, value);
            return value!;
        } else {
            return;
        }
    }

    public forEeach(callback : (key?: K, value?: V) => void) {
        this.list_.forEeach(callback);
    }
}