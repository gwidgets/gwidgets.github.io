---
id: 827
title: Working with JSON in Scala.js
date: 2018-05-08T08:30:10+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=827
permalink: /2018/05/08/working-with-json-in-scala-js/
comments: true
tags:
  - Scala.js
excerpt: Working with JSON is almost inevitable regardless of the environment. In this post, we will go through different ways of serializing/deserializing (or encoding/decoding as some may call it) objects from/to JSON in Scala.js...
---

## Introduction

Working with JSON is almost inevitable regardless of the environment. In this post, we will go through different ways of serializing/deserializing (or encoding/decoding as some may call it) objects from/to JSON in Scala.js. As of the date this post is written, there are three main tools that convert objects to/from JSON:

  * [uPickle](https://github.com/lihaoyi/upickle)
  * [Circe](https://github.com/circe/circe)
  * [scalajs-dom](https://github.com/scala-js/scala-js-dom) (using JSON.stringify() and parse())

We will use the following object for all the examples for uPickle and Circe:

<pre class="brush:scala">case class Car(id: String, brand: String, model: String) {}</pre>

using scalajs-dom requires a slight modification to the object as only `js.Object` is allowed

{% highlight scala %}
 class Car extends js.Object {
  var id: String = _
  var brand: String = _
  var model: String = _
}
{% endhighlight %}

## Serializing

  * uPickle:

Using uPickle, it is enough to create an object that configures the types to be read/written :

{% highlight scala %}
import upickle.default.{ReadWriter => RW, macroRW}

object Car{
  implicit def rw: RW[Car] = macroRW
}
{% endhighlight %}

and then:

{% highlight scala %}
  val mercedes = new Car("1", "Mercedes", "2015")
    
    val mercedesJSON = write[Car](mercedes)

     println(mercedesJSON)
{% endhighlight %}

     {% highlight js %}
     //result: {"id":"1","brand":"Mercedes","model":"2015"}
     {% endhighlight %}

  * Circe:

Circe requires the configuration of encoders/decoders:

{% highlight scala %}
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

object Expense {
  implicit val carDecoder: Decoder[Car] = deriveDecoder
  implicit val carEncoder: Encoder[Car] = deriveEncoder
}
{% endhighlight %}

and then:

{% highlight scala %}
   import io.circe.syntax._
    val mercedes = new Car("1", "Mercedes", "2015")

    val mercedesJSON = mercedes.asJson

    println(mercedes.asJson)
     
     //result is indented by default 🙂 for making the output oneline : .asJson.noSpaces
     /*  {
      "id": "1",
      "brand": "Mercedes",
      "model": "2015"
      }
      */
{% endhighlight %}

  * scalajs-dom:

using `scalajs-dom` requires the addition of `scalacOptions += "-P:scalajs:sjsDefinedByDefault"` to the build file, since `@ScalaJSDefined` is meant to be deprecated.

and then :

{% highlight scala %}
    val mercedes = new Car()
    mercedes.id = "10"
    mercedes.model = "1980"
    mercedes.brand = "Mercedes"
    println(JSON.stringify(mercedes))
{% endhighlight %}

{% highlight js %}
    //result: {"id":"10","brand":"Mercedes","model":"1980"}
{% endhighlight %}

## Deserializing

  * uPickle:

{% highlight scala %}
    val mercedesJSON = """{"id":"10","brand":"Mercedes","model":"1980"}"""
    val mercedes = read[Car](mercedesJSON)
    println(mercedes.id)
    // 10
    println(mercedes.model)
    //  1980
    println(mercedes.brand)
    // Mercedes
{% endhighlight %}

  * Circe:

{% highlight scala %}
     val mercedesJSON = """{"id":"10","brand":"Mercedes","model":"1980"}"""
    val mercedes = decode[Car](mercedesJSON).toTry.get
    println(mercedes.id)
    // 10
    println(mercedes.model)
    //  1980
    println(mercedes.brand)
    // Mercedes
{% endhighlight %}

  * scalajs-dom:

{% highlight scala %}
    val mercedesJSON = """{"id":"10","brand":"Mercedes","model":"1980"}"""
    val mercedes = JSON.parse(mercedesJSON).asInstanceOf[Car]
    println(mercedes.id)
    // 10
    println(mercedes.model)
    //  1980
    println(mercedes.brand)
    // Mercedes
{% endhighlight %}

## Wrap up

We have walked through different libraries that allow serializing/deserializing JSON in Scala.Js. All the methods work in pretty much the same way, so there is no preferred way. The choice is left to the developer.