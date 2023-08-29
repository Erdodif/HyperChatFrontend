import type { Readable, Writable } from "svelte/store";

export abstract class CustomStore<T> implements Readable<T> {
    protected _value: T;
    callbacks: Array<(value: T) => void>

    constructor(initialValue: T) {
        this._value = initialValue;
        this.callbacks = [];
    }

    subscribe(callback: (value: T) => void): (() => void) {
        callback(this._value);
        this.callbacks.push(callback);
        return () => this.unsubscribe(callback);
    }

    unsubscribe(callback: (value: T) => void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    protected notify() {
        for (const callback of this.callbacks) {
            callback(this._value);
        }
    }
}

export abstract class IndirectStore<T, R> implements Readable<T>{

    protected _value: R;
    abstract get value(): T;
    callbacks: Array<(value: T) => void>


    constructor(initialValue: R) {
        this._value = initialValue;
        this.callbacks = [];
    }

    subscribe(callback: (value: T) => void): (() => void) {
        callback(this.value);
        this.callbacks.push(callback);
        return () => this.unsubscribe(callback);
    }

    unsubscribe(callback: (value: T) => void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    protected notify() {
        for (const callback of this.callbacks) {
            callback(this.value);
        }
    }
}

export abstract class CustomDerivedStore<T> implements Readable<T> {
    protected value: T;
    protected readonly _stores: (Readable<any> | Writable<any>)[];
    protected callbacks: Array<(value: T) => void>

    protected abstract setValue();

    constructor(stores: (Readable<any> | Writable<any>)[], initValue: T=null) {
        this.value = initValue;
        this.callbacks = [];
        this._stores = stores;
        for (const store of this._stores) {
            store.subscribe(() => { this.setValue(); this.nofity(); });
        }
    }

    subscribe(callback: (value: T) => void): (() => void) {
        callback(this.value);
        this.callbacks.push(callback);
        return () => this.unsubscribe(callback);
    }

    unsubscribe(callback: (value: T) => void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    protected nofity() {
        for (const callback of this.callbacks) {
            callback(this.value);
        }
    }
}