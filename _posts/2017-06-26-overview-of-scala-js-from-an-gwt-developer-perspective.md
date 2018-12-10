---
id: 626
title: Overview of Scala.js from a GWT developer perspective
date: 2017-06-26T20:55:48+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=626
permalink: /2017/06/26/overview-of-scala-js-from-an-gwt-developer-perspective/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
  - Scala.js
excerpt:  This blog is heavily biased towards GWT (and GWT based frameworks), but we are keeping in my mind that GWT may be taken over by other technologies in the future, so we are always open to exploring other platforms/frameworks...
---
<p style="text-align:justify">
  This blog is heavily biased towards GWT (and GWT based frameworks), but we are keeping in my mind that GWT may be taken over by other technologies in the future, so we are always open to exploring other platforms/frameworks. As they say, diversification reduces risk. Every programming language, even the weirdest ones, have their &#8220;to javascript&#8221; compiler: <a href="https://github.com/jashkenas/coffeescript/wiki/List-of-languages-that-compile-to-JS">https://github.com/jashkenas/coffeescript/wiki/List-of-languages-that-compile-to-JS</a>, so GWT can try learn to learn from others in order to improve in the future. Scala.js has been always compared to GWT, because both of them use a JVM based language which implies some similarities in syntax and semantics. Scala.js is a Scala to javascript compiler which works in a similar fashion as GWT. Scala.js has equivalents for things that make GWT attractive like JsInterop, dev mode, pruning, draft compiling, elemental,&#8230;etc. We are planning to do a Scala.js comparison with GWT in one of coming posts, but before that we would like to give a brief introduction to Scala.js, and how to write a simple program.
</p>

####  **This is Scala, not Java** 

<p style="text-align:justify">
  Scala is an object oriented JVM language that has created some hype with its orientation towards functional programming and its built-in immutability. Personally, I have never written any &#8220;real&#8221; applications in Scala, so I am really not aware of all the ins and outs of the language. It seems like anything that you can do with Scala, you can do with Java 8 and vice versa. One thing that catches attention while examining the syntax differences, is that Scala has dynamic type inference, so the types of a variable are not declared. This may be look more similar to javascript, and may give the feeling that we are directly programming in javascript. Scala.js documentation provides a comparison between Scala and Es6: <a href="https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part1.html">https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part1.html</a>
</p>

####  **Project Setup** 

<p style="text-align:justify">
  The initial setup is pretty straightforward. There is only one build tool for scala (<a href="https://github.com/sbt/sbt">sbt</a>), and one plugin for Scala.js, so no questions asked. A Scala.js project does not require any special structure, a simple project structure is enough. A requirement for working with Scala.js is NodeJs. Then, a project can be initialized by running the command:
</p>

<pre class="brush:scala">sbt new scala/scala-seed.g8
</pre>

<p style="text-align:justify">
  from the command line. You will then be prompted to enter the name of the project, the version, and the organization name (equivalent of groupId in Maven). Then, we need to add the Scala.js dependency and configuration to our build.sbt file (equivalent to pom.xml). Our build.sbt file looks something like:
</p>

{% highlight scala %}
enablePlugins(ScalaJSPlugin)

name := "scalajsdemo"

version := "0.1-SNAPSHOT"

scalaVersion := "2.11.8"

libraryDependencies ++= Seq(
  "org.scala-js" %%% "scalajs-dom" % "0.9.1"
)

scalaJSUseMainModuleInitializer := true 
{% endhighlight %}

The configuration is minimal, so no big effort is required.

####  **Using the framework** 

After setting up the project, all we need to do is to create an entry point class which extends JSApp object. 

{% highlight scala %}
object MyForm extends JSApp {
  override def main(): Unit = {
  }
}
{% endhighlight %}

<br />

  <span>1.</span>  _interacting with the DOM:_ 
      Scala.js has a pretty comprehensive API for interacting and manupulating the DOM in the same fashion as from vanilla JS. In fact, this is the core focus of Scala.js: there are no by default custom ui components to build the ui. For example, the code for creating a button with an event listener looks like:
    
  {% highlight scala  %}
      val button = document.createElement("button")
      button.textContent = "Click button"
      button.addEventListener("click", { (e0: dom.Event) =>
        println("clicked")
      }, false)
      document.body.appendChild(button)
  {% endhighlight %}
    
For performing a HTTP request using an XmlHttpRequest, the code would look like: 
    
{% highlight scala %}
    val req = new XMLHttpRequest()
    req.open("GET", "http://www.g-widgets.com/feed/")
    req.setRequestHeader("Access-Control-Allow-Origin", "*")
{% endhighlight %}
    
Let's suppose we want to parse G-Widgets Rss feed and create a list with all the titles, we would then do something like: 
    
{% highlight scala %}
    
    val blogPostsListElement = document.createElement("ul")
    req.onload = {(e: Event) =>
      if (req.status == 200) {
        val parser = new DOMParser();
        val doc = parser.parseFromString(req.responseText, "application/xml")
        val titleList = doc.getElementsByTagName("title")

        for(i <- 0 to titleList.length){
          val listElement = document.createElement("li")
          if(titleList.item(i) != null){
            listElement.textContent = titleList.item(i).textContent
            blogPostsListElement.appendChild(listElement)
          }
        }
      }
    }
    req.send();

    document.body.appendChild(blogPostsListElement)
{% endhighlight %}

<br />

  <span>2.</span>  _Exporting to/from Javascript (JsInterop equivalent):_
      Scala.js has also the possiblity of exporting/importing classes to Javascript using annotations. Let's suppose we want to use the JSON utility object into our code, one way of importing it would be:
    
{% highlight scala %}
    @js.native
    @JSGlobal
    object JSON extends js.Object {
      def parse(data: String): js.Object = js.native
      def stringify(anobject :js.Object): String = js.native
    } 
{% endhighlight %}
    
    In the same way, we can export some object to be used from a javascript script using annotations: 
    
{% highlight scala %}
    @JSExportTopLevel("DummyJs")
    class DummyJs(val dummyValue: String) {

      @JSExport
      def getTheDummyValue(): String = dummyValue
    }
{% endhighlight %}

#### **Compiling and Devmode**

<p style="text-align:justify">
  One really neat thing about Scala.js is its short compile time. After a code change, the compiling does not take more than 9s (for this simple app) to rebuild the .js, which pretty encouraging and less frustrating. The choice of the web server (if needed) is left open. For example, a server with a live reload extension may be come handy. Scala.js offers two compile modes fastOptJS and fullOptJS. when running fastOptJS (equivalent to draft mode in GWT), the compiler does less optimizations and thus the compile time is shorter. This is ideal for development. fullOptJS, on the other hand, uses Google's closure compiler to produces a highly compact and optimized .js file.
</p>

#### **Wrap up**

<p style="text-align:justify">
  This was an opinionated introduction to Scala.js. The main advantages that Scala.js can offer is a boilerplate free project setup and a fast compile time. GWT is more mature and is more used than Scala.js, but GWT can learn from Scala.js in terms of reducing the compile time and the boilerplate to setup the project. On the other hand, some Scala.js advocates are not aware of GWT evolution and sometimes give inaccurate assement of GWT abilities. For example, <a href="https://twitter.com/Grogs">Greg Dorell</a> in his recent Devoxx <a href="https://www.youtube.com/watch?v=NJVL2IsGXZ4">talk</a> stated that "GWT does not work" because it does not provide good import/export to js capabilities. He was clearly ignoring that GWT also introduced JsInterop. GWT still wins in terms of ecosystem and community. We will do a more detailed comparison in the coming posts. To sum up, Scala.Js is an attractive alternative to developing a web application. For Java developers, the language barrier may be present, but the learning curve would not be really steep because both Java and Scala are JVM languages and have similar concepts.
</p>

Full code can be found here: <https://github.com/zak905/scalajsdemo>