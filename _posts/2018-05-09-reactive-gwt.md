---
id: 841
title: Reactive GWT
date: 2018-05-09T15:11:39+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=841
permalink: /2018/05/09/reactive-gwt/
comments: true
tags:
  - GWT
excerpt: Reactive programming&#8217;s popularity has tremendously grown over the last 4 or 5 years. This can tell us that the use case of reactive applications is now valid more than ever. The strain on backend systems has increased and accordingly the need to handle this strain...
---

## Introduction

Reactive programming&#8217;s popularity has tremendously grown over the last 4 or 5 years. This can tell us that the use case of reactive applications is now valid more than ever. The strain on backend systems has increased and accordingly the need to handle this strain with minimal resources. Reactive programming is seen as a way to increase efficiency and throughtput while reducing resource consumption. The popularity of reactive programming led to the development of reactive extensions for most of the programming languages and platforms: GWT is no exception. In this post, we will provide an example of usage for [rxjava-gwt](https://github.com/intendia-oss/rxjava-gwt) which is the reactive extension for GWT.

## About rxjava-gwt

`rxjava-gwt` is the adaptation of [RxJava](https://github.com/ReactiveX/RxJava) to GWT, and not a wrapper for [RxJs](https://github.com/ReactiveX/rxjs) as some may believe. According to the project creator [Ignacio Baca](https://github.com/ibaca), adapating RxJava to GWT is more useful than wrapping RxJs, expecially if the Rx code is shared between the client and the server, because here the behaviour is exactly the same. Also, this introduces the possibility of sharing custom operators or Rx compositions.<h2 class="underline-section id="use-cases">Use Cases</h2> 

From a backend point of view, reactive programming is seen as way to increase efficiency and throughtput, and to achieve requests with the minimal resource consumption, but how about the front-end ? Well, we know that JavaScript is inherently asychronous and the usage of callbacks/Promises is common, so what does reactivity has to add? First, it can help make the application more responsive if the application is calling external datasources (e.g HTTP requests, websockets, server sent events) by transforming those sources into a stream and reacting as data pours in rather than waiting for the integrity of the data to be available. Second, reactive programming can help combine several event sources into one main stream if the action to be taken is common.

## Example

Suppose we want to create a simple UI for the famous `curl` library. We want to have three fields (url, method, and body data), and we want our curl command to be generated as we type along. This looks like a good use case to introduce reactive programming as we have several event sources that require the same kind of processing. Using the traditional mode of programming, we would have to do the same action for every event handler.

HTML

{% highlight html  %}
<pre class="brush:xml"><div class="form-container">
    <label for="url">URL:</label>
    <input id="url" type="text"></input>
    <label for="method">Method: </label>
    <select id="method">
      <option selected value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
      <option value="PATCH">PATCH</option>
      <option value="HEAD">HEAD</option>
      <option value="OPTIONS">OPTIONS</option>
      <option value="CONNECT">CONNECT</option>
      <option value="TRACE">TRACE</option>
    </select>
    <label for="data">Data: </label>
    <textarea id="data"></textarea>
    <div id="result">curl <span id="generatedCommand"></span></div>
  </div>
</pre>

{% endhighlight %}

Code:
{% highlight java  %}
  HTMLInputElement urlInput = (HTMLInputElement) DomGlobal.document.getElementById("url");
  HTMLSelectElement methodInput = (HTMLSelectElement) DomGlobal.document.getElementById("method");
  HTMLTextAreaElement dataInput = (HTMLTextAreaElement) DomGlobal.document.getElementById("data");
  HTMLElement generatedCommand = (HTMLElement) DomGlobal.document.getElementById("generatedCommand");
  final String[] commands = new String[3];

    Observable<Command> urlStream = Observable.create((emitter) -> {
      urlInput.onkeyup = (event) -> {
        HTMLInputElement urlInputTarget = (HTMLInputElement) event.target;
        emitter.onNext(new Command(2, urlInputTarget.value));
        return null;
      };
    });

    Observable<Command> methodStream = Observable.create((emitter) -> {
      methodInput.onchange = (event) -> {
        HTMLSelectElement methodSelect = (HTMLSelectElement) event.target;
        emitter.onNext(new Command(1, "-X"+methodSelect.value));
        return null;
      };
    });


    Observable<Command> dataStream = Observable.create((emitter) -> {
      dataInput.onkeyup = (event) -> {
        HTMLTextAreaElement dataInputTarget = (HTMLTextAreaElement) event.target;
        emitter.onNext(new Command(3, "-d '"+dataInputTarget.value+"'"));
        return null;
      };
    });

    Observable.merge(urlStream, methodStream, dataStream).subscribe((obs) -> {
      commands[obs.position - 1] = obs.value;
      generatedCommand.textContent = String.join(" ", Stream.of(commands)
                                                            .filter(Objects::nonNull)
                                                            .collect(Collectors.toList()));
    });
  }
}
{% endhighlight %}

## Conclusion

`rxjava-gwt` opens the doors to the reactive world for GWT developers. We have seen some use cases that make sens for reactive programming to be used, so it is about time for GWT developers to try the reactive model in their applications when it make sens.

Source code: <https://github.com/zak905/reactive-gwt>

Other examples:

  * Snake game <https://github.com/ibaca/rxsnake-gwt>
  * Classic breakout game <https://github.com/ibaca/rxbreakout-gwt>
  * Paint app <https://github.com/ibaca/rxcanvas-gwt>