# Real-Time Chat application with Django channels and Vite

Implementation of a realtime chat application using websockets that are driven with django-channels and work with django native ASGI(Asynchronous Server Gateway Interface) support, but still you can still write custom HTTP long-polling handling, or websocket receivers and have that code sit alongside your existing code, URL routing middleware-they are all just ASGI applications.

![plot](./client/src/assets/Screenshot%20from%202024-10-24%2007-59-05.png)

## Tech-Stack Used
- `Vite`: React frontend framework
- `Django`: A high level python web framework tht encourages rapid development and clean, pragmatic design
- `Redis`:An in memory database, a memory cache, that can persist data on a disk, allowing fast data access and storage
- `Daphne`: Is a HTTP, HTTP2 and websocketts protocol server for ASGI and ASGI-HTTP, developed to power Django channels
- `Django-Channels`: Is a project that takes django and extends its abilities beyond HTTP-to handle websockets, chat protocols and more. It is built on a python specification called ASGI.

## How Channels work

Channels wraps django's native asynchronous view support, allowing Django projects to handle not only HTTP, but protocols that require long running connections too - websockets, MQTT, chatbots, amarteur radio and more. It does this while preserving django's synchronous and easy to use nature, allowing you to chose how you write your code-synchronous in a style like django's view, fully asynchronous, or a mixture of both. On top of this, it provides integration with django's auth system, session system, and more, making it easier than ever to extend your HTTP-only project to other protocols

Channels also bundles this event-driven architecture with channel layers, a system that allows you to easily communicate between processes and separate your project into different processes.

### Turtle all the way down
Channels operate on the principle of "turtles all the way down" - we have a single idea of what a channel's "application" is, and even the simplest of consumers (the equivalent of Django views) are an entirely valid ASGI application you can run by themselves.

Channels gives you the tools to write these basic consumers-individual pieces that might handle chat messaging, or notifications-and tie them together with URL routing, protocol detection and other handy things to make a full application

We treat HTTP and the existing django application as part of a bigger whole. Traditional Django views are still there with channels and still usable with django's native ASGI support but you can also write custom HTTP long-polling handling, or websockets receivers and have that code sit alongside your existing code. URL routing middleware - they are all just ASGI applications

### Scopes and Events

Channels and ASGI split up incoming connections into two components: a scope, and a series of events

The `scope` is a set of details about a single incoming connection - such as the path a web request was made from, or the originating IP address of a websocket, or the user messaging a chatbot. The scope persists throughout the connections.
For HTTP, the scope justs lasts a single request, for websockets, it lasts for the lifetime of a socket(but changes if the socket closes and reconnects)
For other protocols, it varies based on how the protocol's ASGI spec is written; for example, it's likely that a chatbot protocol would keep one scope open for the entirety of a user's conversation with the bot, even if the underlying chat protocol is stateless.

During the lifetime of this scope, a series of events occur. These repersents user interactions-making a HTTP requests, for example, or sending a websocket frame.
Your channels or ASGI applications will be insantiated once per scope, and then be fed the stream of events happening within that scope to decide what actions to take.

#### An example with HTTP:

 - `The user makes an HTTP requests`
 - `We open up a new 'http' type scope with details of the request's path, method, headers, etc`.
 - `We send a 'http.request' event with a HTTP body content`
 - `The channels or ASGI application processes this and generates a 'http.response' event to send back to the browser and close the connections`.
 - `The HTTP request/ response is completed and the scope is destroyed`

 #### An example with a chatbot

 - `The user send a first message to the chatbot`.
 - `This opens a scope containing the user's username, chosen name, and user ID`
 - `The application is given a 'chat.received_message' event with the event text. It does not have o respond, bit could send one, two or more other chat messages back as 'chat.send_message' events if it wanted to`.
 - `The user sends more messages to the chatbot and more 'chat.received_message' events are generated.`
 - `After a timeout or when the application process is restarted the scope is closed`

 Within the lifetime of a scope be that a chat, a HTTP request, a socket connection or something else; you will have one application instance handling all events from it, and you can persist things onto the application as well. You can choose to write a raw ASGI application if you wish, but channels gives you an easy-to use abstraction over them called `consumers`

 ## What is a consumer? 
 A consumer is the basic unit of channels code. We call it consumer as it consumes events, but you can think it as its own tiny little application
 When a request or new socket comes in, channels will follow its routing table, find the right consumer for that incoming connection and start up a copy of it.This means that, unlike django views, consumers are long running.They can also be short running after all, HTTP requests can also be served as consumers - but they're built around the idea of living for a little while (they live for the duration of a scope, as we described above).

## Getting Started

# Prerequisites

- `Python`
- `Node js`
- `Redis`

## Installation

1. `Clone the repo`

```sh
    git clone https://github.com/ce-phus/realtime_chat.git

```

### Client setup

```sh
    cd realtime_chat

    npm install

    npm run dev
```

### Backend setup

- Create a virtual environment  after navigating to the realtime_chat

    `cd realtime_chat`

    `virtualenv venv`

    `source venv/bin/activate`

```sh
    pip install -r requirements.txt

    cd backend/my_app

    python3 manage.py runserver
```


