# SSE-Node
A complete and minimalist Server-Sent Events (SSE) for server Node.js ≥ v14.x

## Which is?
It is a system real-time, unidirectional (from server to client) and persistent. It is a connection similar to the [websocket](https://github.com/JadsonLucena/WebSocket-Node) in terms of handling received events, more with the possibility of having customized events.

## Interfaces
```javascript
// Constructor
SSE(
    server: Object, // HTTP(s) Server Object
    {
        allowOrigin?: String | Array<String> | Null, // Allowed domains (Default: Null)
        limitByIP?: UInteger, // IP access limit (Default: 256)
        path?: String, // Path using in route (Default: /sse)
        withCredentials?: Boolean // Tells whether the client can use CORSS credentials or not (Default: False)
    }?
): Class
```

```javascript
// Getters
allowOrigin(): String | Array<String> | Null

clients(): Array<String> // List of connected user ID's

limitByIP(): UInteger

path(): String

withCredentials(): Boolean
```

```javascript
// Setters
allowOrigin(input?: String | Array<String> | Null): Void // (Default: Null)

limitByIP(input?: UInteger): Void // (Default: 256)

path(input?: String): Void // (Default: /sse)

withCredentials(input?: Boolean): Void // (Default: False)
```

```javascript
// Methods
close(clientId: String): Boolean | Null

send(
    clientId: String,
    data: String, // Message content
    {
        encoding?: String, // [utf8 | ascii | base64 | hex | binary | utf16le | ucs2] (Default: utf8)
        event?: String, // If specified, an event will be dispatched to the browser on the listener instantiated with the same name.
        id?: String, // Defines the last event ID value of the EventSource object.
        retry?: Integer // This must be an integer, specifying the reconnection time in milliseconds
    }?
): Boolean | Null
```

## How to use
```javascript
// Front-end
var source = new EventSource('/sse');

source.onerror = e => console.log('Error', e);

source.onopen = e => {

    console.log('Open', e);

    source.addEventListener('custom', e => console.log('Custon', e));
    
    source.onmessage = e => console.log('Message', e);

};
```

```javascript
// Back-end
const SSE = require('@jadsonlucena/sse'); // npm i @jadsonlucena/sse

let sse = new SSE(server);

sse.on('close', (clientId, e) => console.log('Close', clientId, e));

sse.on('error', (clientId, e) => console.log('Error', clientId, e));

sse.on('open', (clientId, lastEventId) => {
    
    console.log('Open', clientId, lastEventId);

    // Custom events
    sse.send(clientId, 'Hello World', {
        event: 'custom'
    });

    // Single Client
    sse.send(clientId, 'Hello World');

    // Broadcast
    sse.clients.forEach(clientId => sse.send(clientId, 'Hello World'));

});
```

> By default the lib constructor on the back-end expects the /sse path to be inserted into the front-end constructor. If you prefer another path on the front-end, it must be specified in the back-end constructor.

> Custom events must be instantiated on the front-end and referenced on the back-end.

### References

> [Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)\
> [Using server-sent events](https://developer.mozilla.org/pt-BR/docs/Web/API/Server-sent_events/Using_server-sent_events)