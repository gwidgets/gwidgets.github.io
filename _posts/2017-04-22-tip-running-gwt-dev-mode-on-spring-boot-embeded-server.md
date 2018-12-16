---
id_disqus: 607
title: 'TIP: Running GWT dev mode on Spring Boot Embeded Server'
date: 2017-04-22T15:04:01+00:00
author: blogger
layout: post
permalink: /2017/04/22/tip-running-gwt-dev-mode-on-spring-boot-embeded-server/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
  - Spring
excerpt:  Spring Boot is a framework that provides auto configuration capabilities to quickly package and deploy Spring ecosystem based applications. It allows developers to focus the core function of their application...
---
<p style="text-align:justify;">
  Spring Boot is a framework that provides auto configuration capabilities to quickly package and deploy Spring ecosystem based applications. It allows developers to focus the core function of their application, rather than spending time on configuration and project set up. Spring Boot is meant for Spring framework based applications but it can also integrate with other frameworks and utilities. Spring Boot provides integration with <a href="https://www.youtube.com/watch?v=6FjjVKmEdY4">Vaadin</a>, which is partly based on GWT. GWT can also effortlessly integrate into a Spring Boot application, with the right configuration in place. In this tutorial, we will go through how to integrate GWT into a SB application, and how to run the GWT dev mode on SB&#8217;s embeded web server.
</p>

<p style="text-align:justify;">
  The first step is to generate a SB project. In this tutorial, we will make use of <a href="https://start.spring.io/">INITIALIZR</a>, which is Spring&#8217;s tool for quickly bootstrapping projects. For this project, we will only need the Web dependency.
</p>

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/04/initialzr.png" alt="initialzr" width="1238" height="456" class="aligncenter size-full wp-image-611" />](http://www.g-widgets.com/wp-content/uploads/2017/04/initialzr.png)

The structure of the generated project is a standard maven project structure.
  
[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/04/bootFileStrucutre.png" alt="bootFileStrucutre" width="221" height="255" class="aligncenter size-full wp-image-612" />](http://www.g-widgets.com/wp-content/uploads/2017/04/bootFileStrucutre.png)

<p style="text-align:justify;">
  One of the SB conventions to keep in mind is that files present in the resources/static directory are treated as static resources, and served by SB embedded server. Since we need our GWT project(HTML, CSS + our Js module) to be served as static resources, we need to put them in the static folder. However, when running spring-boot &#8220;locally&#8221;, the static files that our app uses are copied to the build directory, within the classes folder (normally the path is stored in project.build.directory property in Maven, which points to /target by the default). Therefore we need to point our Dev mode to this directory. For example, we can use the following properties in the GWT maven plugin:
</p>



  {% highlight xml %}
                  <devmodeWorkDir>${project.build.directory}/classes/static</devmodeWorkDir>
                  <launcherDir>${project.build.directory}/classes/static</launcherDir>
                  <warDir>${project.build.directory}/classes/static</warDir>
  {% endhighlight %}



Full example available at: <https://github.com/zak905/boot-gwt>