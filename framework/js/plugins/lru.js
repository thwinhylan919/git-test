define([], function () {
    "use strict";

    const LRUCache = function (capacity) {
        this.capacity = capacity;
        this.length = 0;
        this.map = {};
        this.head = null;
        this.tail = null;
    };

    LRUCache.prototype.node = function (key, value) {
        this.key = key;
        this.val = value;
        this.newer = null;
        this.older = null;
    };

    LRUCache.prototype.get = function (key) {
        if (Object.prototype.hasOwnProperty.call(this.map, key)) {
            this.updateKey(key);

            return this.map[key].val;
        }

        return -1;
    };

    LRUCache.prototype.updateKey = function (key) {
        const node = this.map[key];

        if (node.newer) {
            node.newer.older = node.older;
        } else {
            this.head = node.older;
        }

        if (node.older) {
            node.older.newer = node.newer;
        } else {
            this.tail = node.newer;
        }

        node.older = this.head;
        node.newer = null;

        if (this.head) {
            this.head.newer = node;
        }

        this.head = node;

        if (!this.tail) {
            this.tail = node;
        }
    };

    LRUCache.prototype.set = function (key, value) {
        const node = new this.node(key, value);

        if (Object.prototype.hasOwnProperty.call(this.map, key)) {
            this.map[key].val = value;
            this.updateKey(key);

            return;
        }

        if (this.length >= this.capacity) {
            const dKey = this.tail.key;

            this.tail = this.tail.newer;

            if (this.tail) {
                this.tail.older = null;
            }

            delete this.map[dKey];
            this.length--;
        }

        node.older = this.head;

        if (this.head) {
            this.head.newer = node;
        }

        this.head = node;

        if (!this.tail) {
            this.tail = node;
        }

        this.map[key] = node;
        this.length++;
    };

    return LRUCache;
});