# SSE-Node
A complete and minimalist Server-Sent Events (SSE) for server Node.js ≥ v14.x

## Which is?
It is a system real-time, unidirectional (from server to client) and persistent. It is a connection similar to the [websocket](https://github.com/JadsonLucena/WebSocket-Node) in terms of handling received events, more with the possibility of having customized events.

## Interfaces
```javascript
// Constructor
SSE(
    server: object, // HTTP(s) Server Object
    {
        allowOrigin?: string | string[] | null, // Allowed domains (Default: null)
        limitByIP?: number, // IP access limit (Default: 256)
        path?: string, // Path using in route (Default: /sse)
        withCredentials?: boolean // Tells whether the client can use CORSS credentials or not (Default: False)
    }?
): SSE
```

```javascript
// Getters
allowOrigin(): string | string[] | null

clients(): string[] // List of connected user ID's

limitByIP(): number

path(): string

withCredentials(): boolean
```

```javascript
// Setters
allowOrigin(input?: string | string[] | null): Void // (Default: null)

limitByIP(input?: number): Void // (Default: 256)

path(input?: string): Void // (Default: /sse)

withCredentials(input?: boolean): Void // (Default: False)
```

```javascript
// Methods
close(clientId: string): boolean | null

send(
    clientId: string,
    data: string, // Message content
    {
        encoding?: 'utf8' | 'ascii' | 'base64' | 'hex' | 'binary' | 'utf16le' | 'ucs2', // (Default: utf8)
        event?: string, // If specified, an event will be dispatched to the browser on the listener instantiated with the same name.
        id?: string, // Defines the last event ID value of the EventSource object.
        retry?: number // Specifying the reconnection time in milliseconds
    }?
): boolean | null
```

```javascript
// Listeners
on('close', (clientId: string, event: any) => void): void

on('error', (clientId: string, event: any) => void): void

on('open', (clientId: string, lastEventId: string) => void): void
```