const EventEmitter = require('events');

class SSE extends EventEmitter {

    constructor() {

        super({captureRejections: true});

        this.setMaxListeners(0);

    }

};