---
id_disqus: 272
title: 'JsInterop, Web Components, Polymer: A beginner&#8217;s guide'
date: 2016-08-01T14:27:36+00:00
author: blogger
layout: post
permalink: /2016/08/01/jsinterop-web-components-polymer-a-beginners-guide/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
  - Web Components
excerpt:  Back when GWT was released, there wasn&#8217;t that much of Javascript libraries, so having a two way interoperability between Java and JS was not that attractive. GWT offered a way to write Javascript inside Java classes using JSNI. But now with the changing landscape of the Javascript ecosystem, GWT developers need something more elaborate than JSNI...

---
### JsInterop

  Back when GWT was released, there wasn&#8217;t that much of Javascript libraries, so having a two way interoperability between Java and JS was not that attractive. GWT offered a way to write Javascript inside Java classes using JSNI. But now with the changing landscape of the Javascript ecosystem, GWT developers need something more elaborate than JSNI. From version 2.7, JsInterop was introduced in GWT as an experimental feature to replace JSNI. As its name suggests, JsInterop is a way of interoperating Java (GWT) with Javascript. it offers a better way of communication between the two using annotations instead of having to write JavaScript in your classes. JSInterop is defined by the following interfaces: `@JsType`, `@JsProperty`, `@JSMethod`, `@JSConstructor`, `@JSFunction`, `@JsExport`.

The first utility of JsInterop is to expose your java classes to a javascript script. For example:

{% highlight java  %}
@JsType
public class myClasse {

public String name;

public myClass(String name){
this.name = name;
}
public void sayHello(){
return 'Hello' + this.name;
}
}
{% endhighlight %}

From a browser, we can do something like:

{% highlight js %}
//the package name serves as JS namespace
var aClass = new com.jsinterop.myClasse('developpez.com');

console.log(aClass.sayHello());

// result: 'Hello developpez.com'
{% endhighlight %}

<p style="text-align:justify;">
  The second utility of JsInterop is the ability to import existing Javascript libraries into GWT without having to re-write any line of code. This is where things get interesting. Imagine that you can make use of all the major frameworks that exist in javascript ecosystem (Angular, Polymer, React &#8230;) from your Java code.<br /> For example, suppose we want to use Leaflet, which is a JS library to manipulate the maps from our GWT project. All we need to do is wrap the methods using JsInterop annotations:
</p>

{% highlight java  %}
public class L {


public static native Map map(String id);

}

@JsType(isNative=true)
public class Map {


@JsMethod
public native L setView(double[] center, int zoom);

}
{% endhighlight %}

<p style="text-align:justify;">
  Please note that we used the same variable names as those in the source code of the Leaflet library. Class names, in our example L and Map, and method names are very important in JsInterop because from the moment when we specify <code class="java">isNative = true</code>, GWT will automatically set the variables types as the types in the browser environment.
</p>

Now we can initialize a Leafet map in our GWT application without handling any javascript code:

{% highlight java  %}
public class Leafletwrapper implements EntryPoint {

double[] positions = {51.505, -0.09};

public void onModuleLoad() {

//ça marche
L.map("map").setView(positions, 13);
}
}
{% endhighlight %}

The full example is available at : <https://github.com/zak905/jsinterop-leaflet>

<p style="text-align:justify;">
  Currently there is no tool for automatically converting a Js library into JsInterop-like classes. While waiting for a tool to do so (something like the gwt-api-generator which is used for Polymer elements only), the developer must know how to walk through the Javascript library (methods, arguments, fields, namespaces,. ..etc) and do the mapping manually. There is no doubt that manual mapping is not error prone, but this is the only way for now. Another disadvantage of manual mapping is when a Js library gets updated. Again, the developper must incorporate the changes manually for the continuity of the interoperability.
</p>

Here is another interesting example that can help you understand JsIntrop. It implements interoperability between AngularJs and GWT: <https://github.com/bitwerk/AngularGwtExample>

### Polymer and Web Components: the big picture

<p style="text-align:justify;">
  With the emergence of the new generation of web applications, web developers are now required to handle a great deal of HTML, CSS, and Javascript. Working with the three at once is not simple sometimes, so developers and the web community felt the need to have something more standard to better manage complex HTML, CSS and Js. The idea of ​​Web Components is born from this need. The purpose behind the creation of WCs is reusability. Reusability was one of the main goals of object-oriented languages ​​such as Java, but has not been really considered for the front end. There are obviously lots of patterns that repeat themselve, so the question is why not port them and reuse them. Imagine you have created a menu bar for an application: you spent time on things such as html, style, animations, events, etc &#8230; While developing a new application, you realize that you need the same menu, so you return to your previous project and start picking up pieces of HTML, Js, CSS and try adapt it to your new application. This process gets tedious over time and is more prone to errors. Web Components provide an answer to the question. WCs provide a way to carry and reuse HTML, CSS and JS, all encapsulated in a HTML tag. WCs are defined by 4 specifications that are now part of the W3C HTML specification:
</p>

&#8211; Custom Elements: allowing to create your own components `<my-element> </ my-element>`
  
&#8211; HTML imports: import these items in any DOM
  
&#8211; Templates: defining custom html templates that can be manipulated by JS
  
&#8211; Shadow Dom: hiding the complexity of Components by hiding the underlying html.

<p style="text-align:justify;">
  WCs are raw specifications. There are several frameworks that are built on the top of these specifications and allow the user to take advantage of their features. Polymer is among these frameworks. Polymer is a project built and maintained by Google. It&#8217;s a framework for building optimized applications, with high performance and a stylish look. Polymer also provides the ability to extend its functionality and create your own reusable components.
</p>

<p style="text-align:justify;">
  To illustrate the use of the Web Components, we will create a Polymer component with a green background that displays a pop up with each click. we&#8217;ll call this cool-div element. To do this, we need to create an element definition in a file named cool-div.html:
</p>

{% highlight html  %}
<dom-module id="cool-div">
<template>
<style>
:host {
display: block;
}
#mydiv{
background-color: green;
max-width: 100px;
color: white;
}

</style>
<div id="mydiv">
<content></content>
</div>
</template>

<script>
Polymer({

is: 'cool-div',

properties: {
prop1: {
type: String,
value: 'cool-div',
},
},

listeners :{
click:'divClicked'
},

divClicked: function(){
alert('cool div clicked');
}

});
</script>
</dom-module>
{% endhighlight %}

<p style="text-align:justify;">
  Now we can use this element simply by importing the definition from the head section in our HTML page:
</p>

{% highlight html  %}
<link rel="import" href="cool-div.html">
{% endhighlight %}

and then we can do something like:

{% highlight html  %}
<cool-div>my first Polymer element</cool-div>
{% endhighlight %}

Full example: <https://github.com/zak905/cool-div>

### The intersection between GWT and Polymer

<p style="text-align:justify;">
  Vaadin team has done some interesting things with GWT. One of them was the adaptation of Polymer elements to GWT. <a href="https://github.com/vaadin/gwt-polymer-elements">gwt-polymer-elements</a> brings not only a new potential to GWT, but can also be a replacement for Widgets which are to be removed from the version 3.0 of GWT. To adapt Polymer Elements to GWT, Vaadin chose the JsInterop approach instead of rewriting everything from scratch. In this way, the adapatation of Polymer was done in a very smooth way and without errors. Vaadin created a generator named <a href="https://github.com/vaadin/gwt-api-generator">gwt-api-generator</a> which automatically wraps the library as an API. The generator can also be used to generate Java APIs for your own Polymer elements.
</p>

### Building your first Polymer application in GWT

<p style="text-align:justify;">
  It&#8217;s not complicated to create a Polymer application in GWT. All you need to do is to import gwt-polymer-elements and use the -generateJsInteropExports flag. Some knowledge of Polymer components and their use is necessary, don&#8217;t worry, it comes with practice. There is a great series of podcasts that explains the basics of Polymer on Youtube called <a href="https://www.youtube.com/playlist?list=PLNYkxOF6rcIDdS7HWIC_BYRunV6MHs5xo">Polycasts</a> presented by <a href="https://twitter.com/rob_dodson">Rob Dodson </a>(Polymer team). The documentation of Polymer Elements is also well developed and provides all the necessary information. There are also some projects in Github that can help you get some inspiration, and overcome the blank page syndrome:
</p>

&#8211; <https://github.com/manolo/gwt-polymer-todo-list>
  
&#8211; <https://github.com/gwidgets/gwt-polymer-starter-kit>
  
&#8211; <https://github.com/cdigiano/polymergwt> 

### Wrap-up :

<p style="text-align:justify;">
  JsInterop brings infinite possibilities to GWT. it opens a new world to GWT developers, and this is only the experimental phase. We&#8217;ll have to wait until the stable version of GWT 2.8 is launched to be able use JsInterop in production.
</p>

French version of this post is sponsored by [Developpez.com](http://www.developpez.com/) and is available at: [http://zakariaamine.developpez.com/tutoriels/java/gwt/utiliser-webcomponents-polymer-jsinterop/?utm\_source=twitterfeed&utm\_medium=twitter](http://zakariaamine.developpez.com/tutoriels/java/gwt/utiliser-webcomponents-polymer-jsinterop/?utm_source=twitterfeed&utm_medium=twitter)