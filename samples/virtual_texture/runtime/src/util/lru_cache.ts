import { DobuleLinkedListNode, DobuleLinkedList } from "./dobule_linked_list";

/**
 * LRU 缓存
 */
export class LruCache<K, V> {
    // 缓存的最大值
    private capacity_: number;
    private map_: Map<K, DobuleLinkedListNode<K, V>>;
    private list_: DobuleLinkedList<K, V>;

    constructor(capacity: number) {
        this.capacity_ = capacity;
        this.map_ = new Map();
        this.list_ = new DobuleLinkedList();
    }

    /**
     * 往缓存中添加节点
     * @param key 缓存节点的 key 值
     * @param value 缓存节点的 value 值
     */
    public put(key: K, value: V) {
        if(this.map_.has(key)) { // 当字典中存在缓存节点，则需要更新缓存节点中 value 值，并将该缓存节点移动到链表的头部。
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

    /**
     * 根据给定的key值，查询缓存节点
     * @param key 缓存节点的 key 值
     * @returns 获取到的节点的value值
     */  
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
    /**
     * 遍历缓存
     * @param callback 遍历每个缓存时需要执行的回调函数
     */
    public forEeach(callback : (key?: K, value?: V) => void) {
        this.list_.forEeach(callback);
    }
}