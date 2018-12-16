---
id_disqus: 540
title: How to use GWT gradle plugin
date: 2017-01-18T19:43:11+00:00
author: blogger
layout: post
permalink: /2017/01/18/how-to-use-gwt-gradle-plugin/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  If Maven is to build systems what Coca-cola is to beverages, Gradle can be considered as Pepsi; both are great, but it's a matter of preference. Gradle is on the rise, and many developers and ops people see in Gradle the solution to their Maven problems. Maven is still the most used build system...
---
<p style="text-align:justify;">
  If Maven is to build systems what Coca-cola is to beverages, Gradle can be considered as Pepsi: both are great, but it&#8217;s a matter of preference. Gradle is on the rise, and many developers and ops people see in Gradle the solution to their Maven problems. Maven is still the most used build system, but it could be taken over by Gradle, so GWT developers should know how to operate both. Gradle provides a plugin for GWT, and the setup is relatively simple. The goal of this post is not to make a comparison between Gradle and Maven performance, but to provide a brief explanation on how to configure Gradle for GWT projects.
</p>

In this tutorial, we are going to use the Gradle plugin developped by [Steffen Schäfer](https://github.com/steffenschaefer): <https://github.com/steffenschaefer/gwt-gradle-plugin>, which can be considered as the official Gradle plugin. There is another plugin for Gradle: <https://github.com/Putnami/putnami-gradle-plugin>, but it won&#8217;t be covered in this tutorial.
  
To generate a simple java project in Gradle, you can use: 

<pre>gradle init --type java-library </pre>

which generate simple project structure with a build.gradle file. 

We can then add our GWT plugin configuration to the build file.

{% highlight groovy  %}
buildscript {
repositories {
jcenter()
}
dependencies {
classpath 'de.richsource.gradle.plugins:gwt-gradle-plugin:0.6'
}
}

apply plugin: 'gwt'
apply plugin: 'war'

repositories {
jcenter()
}

repositories { mavenCentral() }

dependencies {
providedCompile('com.vaadin.polymer:vaadin-gwt-polymer-elements:1.7.0.0')
providedCompile('org.fusesource.restygwt:restygwt:2.2.0')
testCompile('junit:junit:4.11')
}
gwt {
gwtVersion='2.8.0'

modules 'com.example.gwtmodulename'

maxHeapSize = "1024M"

superDev {
noPrecompile=true
}
}
{% endhighlight %}

<p style="text-align:justify;">
  The minimal gwt configuration is pretty simple. After we configured our dependencies, we told the gwt plugin about our gwt version and the location of our gwt module. That&#8217;s all. We have also used the war plugin to package our application and copy the static resource.
</p>

Using the command: &#8220;gradle tasks&#8221;, we can list the set of commands/taks offered by the plugin:

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/01/GradleTasks.png" alt="GradleTasks" width="962" height="139" class="aligncenter size-full wp-image-543" />](http://www.g-widgets.com/wp-content/uploads/2017/01/GradleTasks.png)

<p style="text-align:justify;">
  Gradle plugin offers also the possiblity to specify the type of project as either a gwt library or gwt application in the same way as the <a href="https://github.com/tbroyer/gwt-maven-plugin">Maven net.ltgt.gwt.maven plugin</a>. This can be done by specifying the type of plugin:
</p>

For a gwt library:

<pre>apply plugin: 'gwt-base'</pre>

For a gwt application:

<pre>apply plugin: 'gwt'</pre>

<p style="text-align:justify;">
  Another option to generate a GWT gradle project, is to use the <a href="https://gwt-project-generator.cfapps.io/"> GWT project generator</a> which allows to preconfigure all the dependencies and to generate a ready to use project.
</p>

One of the pitfalls of the Gradle GWT plugin, is its lack of documentation. The official documentation is minimal and lacks clear examples and explanations. 

To conclude, Gradle is a pretty simple build system to use and configure for GWT applications, and should be fairly simple to adopt or to convert to from an existing Maven project. 

A Sample project can be found here: <https://github.com/zak905/gradle-gwt-example>