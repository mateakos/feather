class EventEmitter{
    constructor() {
        this.events = {};
    }

    emit(event, ...args){
        if (this.events[event]){
            console.debug(`Emitting ${event}`);
            this.events[event].forEach(element => 
                element(...args)
            );
        }
        return this;
    }

    on(event, fn){
        if(this.events[event]){
            this.events[event].push(fn);
        }else {
            this.events[event] = [fn];
        }
        return this;
    }

    off(event, fn){
        if (event && (typeof fn === 'function')){
            let listeners = this.events[event];
            let index = listeners.findIndex(element => element === fn);
            listeners.splice(index,1);
        } else {
            this.events[event] = [];
        }
        return this;
    }
}

export default EventEmitter;