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

    public insertHead(node: DobuleLinkedListNode<K, V>): K {
        let back: DobuleLinkedListNode<K, V> = this.head_.back as DobuleLinkedListNode<K, V>;
        this.head_.back = node;
        back.front = node;
        node.front = this.head_;
        node.back = back;

        return node.value as K;
    }

    public delete(node: DobuleLinkedListNode<K, V>): K {
        node.front!.back = node.back;
        node.back!.front = node.front;

        return node.value as K;
    }

    public deleteLast() : K | undefined {
        if (this.head_.back === this.tail_) {
            return;
        } else {
            return this.delete(this.tail_.front!);
        }
    }

    public forEeach(callback : (key?: K, value?: V) => void) {
        let it = this.head_.back!;
        while(it != this.tail_) {
            callback(it.key, it.value);
            it = it.back!;
        }
    }
}