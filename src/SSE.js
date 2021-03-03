const EventEmitter = require('events');
const crypto = require('crypto');

class SSE extends EventEmitter {

    #allowOrigin;
    #clients;
    #limitByIP;
    #path;
    #withCredentials;

    constructor(server, {
        allowOrigin = null, // The value should be similar to what Access-Control-Allow-Origin would receive
        limitByIP = 256, // IP connection limit (Must be greater than zero)
        path = '/sse', // Path using in route
        withCredentials = false // Tells whether or not the client should use credentials
    } = {}) {

        super({captureRejections: true});

        this.setMaxListeners(0);

        this.#allowOrigin = allowOrigin;
        this.#clients = {};
        this.#limitByIP = limitByIP;
        this.#path = path;
        this.#withCredentials = withCredentials;

        server.on('request', (request, response) => {

            if (request.method == 'GET' && request.path == this.#path) {
                
                if (request.headers['accept'] != 'text/event-stream') {

                    response.status(406).send('Not Acceptable');
                    response.end();
                    response.destroy();

                } else if (this.#limitByIP >= 1 && Object.keys(this.#clients).filter(clientId => this.#clients[clientId].connection.remoteAddress == request.connection.remoteAddress).length + 1 > this.#limitByIP) {

                    response.status(429).send('Too Many Requests');
                    response.end();
                    response.destroy();

                } else {

                    if (this.#allowOrigin && request.headers['origin'] && (this.#allowOrigin == '*' || this.#allowOrigin.includes(request.headers['origin']))) {

                        response.setHeader('Access-Control-Allow-Origin', request.headers['origin']);

                    }

                    if (this.#withCredentials) {

                        response.setHeader('Access-Control-Allow-Credentials', true);

                    }

                    response.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive'
                    });


                    /* Begin generate unique ID */
                    let clientId;
                    while ((clientId = crypto.randomBytes(5).toString("hex")) in this.#clients);
                    /* End generate unique ID */


                    this.#clients[clientId] = response;


                    this.#clients[clientId].on('error', e => {

                        if (this.close(clientId)) {

                            this.emit('error', clientId, e);

                        }

                    });

                    this.#clients[clientId].on('close', e => {

                        if (this.close(clientId)) {

                            this.emit('close', clientId, e);

                        }

                    });


                    this.emit('open', clientId, request.headers['last-event-id']);

                }

            }

        });

    }


    get allowOrigin() { return this.#allowOrigin }

    get clients() { return Object.keys(this.#clients) }

    get limitByIP() { return this.#limitByIP }

    get path() { return this.#path }

    get withCredentials() { return this.#withCredentials }


   close(clientId) {

        if (clientId in this.#clients) {

            this.#clients[clientId].removeAllListeners();

            return delete this.#clients[clientId];

        } else {

            return null;

        }

    }

};