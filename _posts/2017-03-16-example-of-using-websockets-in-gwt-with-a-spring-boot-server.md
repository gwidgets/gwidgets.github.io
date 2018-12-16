---
id_disqus: 590
title: Example of Using WebSockets in GWT ( with a Spring Boot Server)
date: 2017-03-16T14:26:58+00:00
author: blogger
layout: post
permalink: /2017/03/16/example-of-using-websockets-in-gwt-with-a-spring-boot-server/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
  - Spring
excerpt:  a WebSocket is a protocol that allows bidirectional communication between a client(running on a browser) and a server. It can have interesting applications such as push notifications and chat. As of HTML 5, WebSocket...

---
<p style="text-align:justify;">
  a <a href="https://www.html5rocks.com/en/tutorials/websockets/basics/">WebSocket</a> is a protocol that allows bidirectional communication between a client(running on a browser) and a server. It can have interesting applications such as push notifications and chat. As of HTML 5, WebSocket has been introduced as part of the standard javascript. WebSocket operation depends on the browser type and its version, but normally it is supported by all the modern browsers. In this example, we are going to wrap the <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API">WebSocket</a> API using JsInterop, and then use it from a GWT app to send and receive messages from a Spring Boot based server.
</p>


#### The WebSocket wrapper

{% highlight java  %}
@JsType(isNative=true, namespace=JsPackage.GLOBAL)
public class WebSocket extends EventTarget {
	@JsProperty
	public Function onclose;
	@JsProperty
	public Function onerror;
	@JsProperty
	public Function onmessage;
	@JsProperty
	public Function onopen;
	@JsProperty
	public String url;
	@JsConstructor
	public WebSocket(String url){
	
	}
	@JsMethod
	public native void send(String data);
	
	@JsMethod
	public native void close();
}
{% endhighlight %}

<br />

#### The Server

Then we can initialize a WebSocket from our application: 

{% highlight java  %}
    WebSocket socket = new WebSocket("ws://localhost:8082/gwidgets-ws");
		
		socket.onmessage = (evt) -> {
			   MessageEvent event = evt.cast();
			   DivElement div = DOM.createDiv().cast();
			   div.setInnerText(event.getData());
			   homePanel.appendChild(div);
			   notificationsToast.toggle();
			return evt;
		};
		
		socket.onopen = (evt) -> {  
			   GWT.log("socket open");
			return evt;
		};
		
		socket.onclose = (evt) -> {
			   GWT.log("socket closed");
			return evt;
		};
{% endhighlight %}

<p style="text-align:justify;">
  We have used lambdas for event handlers to take advantage of GWT 2.8.0 Java 8 capabilities. Finally, we have used Spring Boot, and Spring&#8217;s support for <a href="https://docs.spring.io/spring/docs/current/spring-framework-reference/html/websocket.html">WebSockets</a> to implement a server that sends a notification each 2 mins to our app, and also can receive messages and display them on the console.
</p>

Our WebSocket configuration looks like:

{% highlight java  %}
@Configuration
@EnableWebSocket
public class SocketConfig implements WebSocketConfigurer{	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(handler(), "/gwidgets-ws").setAllowedOrigins("*");
	}
	
	@Bean
	public SocketHandler handler(){
		return new SocketHandler();
	}
}
{% endhighlight %}

The SocketHandler implementation can be found [here](https://github.com/zak905/gwt-websocket-spring/blob/master/websocket-server/src/main/java/com/gwidgets/examples/SocketHandler.java). 

and finally, we need to implement our scheduling module that sends a message every two minutes: 

{% highlight java  %}
@Component
public class ScheduledTemplate {
   @Autowired
   SocketHandler socketHandler;

   @Scheduled(cron="0 0/2 * * * ?")
    public void publishUpdates(){
	   socketHandler.brodcastMessage("server notification " + LocalDateTime.now().toString());
    }
}
{% endhighlight %}

Full source code can be found here: <https://github.com/zak905/gwt-websocket-spring>