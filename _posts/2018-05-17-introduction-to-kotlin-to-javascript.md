---
id: 850
title: Introduction to Kotlin (to) JavaScript
date: 2018-05-17T18:51:42+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=850
permalink: /2018/05/17/introduction-to-kotlin-to-javascript/
comments: true
tags:
  - Kotlin to JavaScript
excerpt: Kotlin is a JVM language that borrows from Scala in an attempt to improve Java. In contrast to Java and Scala (GWT and Scala.js), in which the to-JavaScript compiler is an independent framework, Kotlin provides a to-JavaScript compiler as an integral part of its compiler...
---

## Introduction

Kotlin is a JVM language that borrows from Scala in an attempt to improve Java. In contrast to Java and Scala (GWT and Scala.js), in which the to-JavaScript compiler is an independent framework, Kotlin provides a to-JavaScript compiler as an integral part of its compiler. Another difference between Kotlin compiler and other frameworks is that Kotlin provides its lib in a separate file (named `kotlin.js`), in addition to the compiled source code. This leads to the neccessity to include both files, or find tools to concatenate them. In this post, we will go through a simple example of setting up and running Kotlin to JavaScript.

## Setup

There are different ways to setup Kotlin to JavaScript based on the IDE or the used build tool (more details can be found in the [official documentation](https://kotlinlang.org/docs/tutorials/javascript/kotlin-to-javascript/kotlin-to-javascript.html)). For this tutorial, we are going to choose the Maven way, as this is the build tool we use often. After spining up a simple maven project through IntelliJ, the following dependencies and plugins need to be added:

{% highlight xml %}
         <dependencies>
                <dependency>
                    <groupId>org.jetbrains.kotlin</groupId>
                    <artifactId>kotlin-stdlib-js</artifactId>
                    <version>${kotlin.version}</version>
                </dependency>
                <dependency>
                    <groupId>org.jetbrains.kotlin</groupId>
                    <artifactId>kotlin-stdlib</artifactId>
                    <version>${kotlin.version}</version>
                </dependency>
            </dependencies>
            <build>
                <sourceDirectory>src/main/kotlin</sourceDirectory>
                <plugins>
                    <plugin>
                        <groupId>org.jetbrains.kotlin</groupId>
                        <artifactId>kotlin-maven-plugin</artifactId>
                        <version>${kotlin.version}</version>
                        <executions>
                            <execution>
                                <id>compile</id>
                                <phase>compile</phase>
                                <goals>
                                    <goal>js</goal>
                                    <goal>compile</goal>
                                </goals>
                            </execution>
                            <execution>
                                <id>test-compile</id>
                                <phase>test-compile</phase>
                                <goals>
                                    <goal>test-js</goal>
                                    <goal>test-compile</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-dependency-plugin</artifactId>
                        <executions>
                            <execution>
                                <id>unpack</id>
                                <phase>compile</phase>
                                <goals>
                                    <goal>unpack</goal>
                                </goals>
                                <configuration>
                                    <artifactItems>
                                        <artifactItem>
                                            <groupId>org.jetbrains.kotlin</groupId>
                                            <artifactId>kotlin-stdlib-js</artifactId>
                                            <version>${kotlin.version}</version>
                                            <outputDirectory>${project.build.directory}/js/lib</outputDirectory>
                                            <includes>*.js</includes>
                                        </artifactItem>
                                    </artifactItems>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
{% endhighlight %}


the `kotlin-maven-plugin` compiles kotlin to byte code through the `compile` goal and compiles the source code to JavaScript through the `js` goal. The `kotlin-stdlib-js` is used by the `maven-dependency-plugin` for including the `kotlin.js` file which contains the JavaScript version of Kotlin&#8217;s runtime and standard library. `kotlin.js` is static and does not change from an application to another, so it is possible to copy it manually or to import it directly in the HTML page from a link (e.g a CDN). `kotlin.js` is tied to the used Kotlin version.

## Example :

Let&#8217;s print a Hello world to the console and examine the generated JavaScript:

{% highlight kotlin %}
fun main(args: Array<String>) {
    println("Hello World!")
}
{% endhighlight %}

Generated `kotlinjs-intro.js`:

{% highlight js %}
if (typeof kotlin === 'undefined') {
  throw new Error("Error loading module 'kotlinjs-intro'. Its dependency 'kotlin' was not found. 
                   Please, check whether 'kotlin' is loaded prior to 'kotlinjs-intro'.");
}
this['kotlinjs-intro'] = function (_, Kotlin) {
  'use strict';
  var println = Kotlin.kotlin.io.println_s8jyv4$;
  function main(args) {
    println('Hello World!');
  }
  var package$com = _.com || (_.com = {});
  var package$gwidgets = package$com.gwidgets || (package$com.gwidgets = {});
  var package$kotlinjs = package$gwidgets.kotlinjs || (package$gwidgets.kotlinjs = {});
  package$kotlinjs.main_kand9s$ = main;
  main([]);
  Kotlin.defineModule('kotlinjs-intro', _);
  return _;
}(typeof this['kotlinjs-intro'] === 'undefined' ? {} : this['kotlinjs-intro'], kotlin);

{% endhighlight %}

As mentionned earlier, the generated script looks for defined Kotlin runtime methods and classes and throws an error if `kotlin.js` is not already loaded. This may lead to issues if scripts are included in the body or have "defer" attributes because the order is important. One possible solution is to use JavaScript build tools such as Grunt or Gulp to concatenate the two scripts.
  
Another inconvenience is the size of the scripts. Minifying and optimizing the JavaScript code is important for production settings. While GWT and Scala.js provide the user with the option to minify the generated script or run the [Closure compiler](https://github.com/google/closure-compiler) for even more optimization, Kotlin leaves this task to the developer.

![alt](https://s3-eu-west-1.amazonaws.com/gwidgets/kotlinjs_size.png)

For this simple example, the total size loaded is about 1.51 MB, which is not ideal compared to GWT or Scala.js or even other JavaScript frameworks (check out this [comparison](https://gist.github.com/Restuta/cda69e50a853aa64912d) between different front end frameworks). After minifying and concatening both scripts, the result is:

![alt](https://s3-eu-west-1.amazonaws.com/gwidgets/kotlin_size_after.png)

which is is better, but still far behind GWT and Scala.js.

<table>
  <tr>
    <th>
    </th>
    
    <th style="text-align:center">
      Size of .js for printing a Hello World to the console
    </th>
  </tr>
  
  <tr>
    <td>
      GWT
    </td>
    
    <td style="text-align:center">
      59.5 KB (.nocache.js plus the loaded module)
    </td>
  </tr>
  
  <tr>
    <td>
      Scala.js
    </td>
    
    <td style="text-align:center">
      11.6 KB
    </td>
  </tr>
  
  <tr>
    <td>
      Kotlin to JavaScript
    </td>
    
    <td style="text-align:center">
      1.1 MB
    </td>
  </tr>
</table>

## Ecosystem

Kotlin JavaScript seem to have several bindings for popular JavaScript Librairies (<https://github.com/kodando/kodando>, <https://github.com/JetBrains/kotlin-wrappers>, and many others) like react, jquery, and also a dom API, but the ecosystem remains small as Kotlin in itself is a niche and relatively new compared to other JVM languages.

## Wrap-up 

Kotlin to JavaScript is an interesting tool, but it seems like it is still in its infancy and still has a lot to learn. According to Kotlin&#8217;s [documentation](https://kotlinlang.org/docs/reference/js-overview.html), Kotlin to JavaScript can be used to target both front-end and server side JavaScript. From a front-end perspective, Scala.js and GWT seem like better options. We will explore the generation of server side JavaScript in coming posts.