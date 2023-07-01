import { LruCache } from "../lru_cache"

const testFunc = () => {
    let cache = new LruCache<number, string>(15);
    cache.put(0, "zhangsan");
    cache.put(1, "lishi");
    cache.put(2, "wangwu");
    cache.put(3, "xiaoming");
    cache.put(4, "dongdong");
    console.log("*********1*********")
    cache.forEeach((k?: number, v?: string) => {
        console.log(k, v);
    })

    cache.put(2, "fufu");
    console.log("*********2*********")
    cache.forEeach((k?: number, v?: string) => {
        console.log(k, v);
    })

    cache.get(3);
    console.log("*********3*********")
    cache.forEeach((k?: number, v?: string) => {
        console.log(k, v);
    })
}

testFunc();