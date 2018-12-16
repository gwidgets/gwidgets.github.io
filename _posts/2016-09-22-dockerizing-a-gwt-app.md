---
id_disqus: 456
title: Dockerizing a GWT app
date: 2016-09-22T10:11:47+00:00
author: blogger
layout: post
permalink: /2016/09/22/dockerizing-a-gwt-app/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  Docker is one the most popular tools, if not the most popular, for virtual "infrastructure". It provides a special lightweight vm-like structure called containers that can be used for packaging, building, and deploying an application...
---
<p style="text-align:justify;">
  Docker is one the most popular tools, if not the most popular, for virtual &#8220;infrastructure&#8221;. It provides a special lightweight vm-like structure called containers that can be used for packaging, building, and deploying an application. Some of the key advantages of Docker is resource efficiency ( compared to a virtual machine), and portability: as you long as docker is there, the container will work the same way on different environments(Package Once Deploy everywhere). Because of these advantages, Docker has become a must for the build / test / deploy cycle. It&#8217;s about time for GWT developers to make Docker part of their development and build routine. In this post, we will go through how to use docker for building and deploying a GWT application. Before taking off, some basic knowledge of how Docker works is required. The Docker for Java Developpers <a href="http://zeroturnaround.com/rebellabs/docker-for-java-developers-how-to-sandbox-your-app-in-a-clean-environment/">tutorial</a> by <a href="http://zeroturnaround.com/">Zero Turnaround</a> is a good starting point.
</p>

####  **Building/Testing a GWT application in Docker:**

  Besides deploying applications, Docker can also be used to create a sandbox environment for building an application. In GWT, the environment has to have GWT libraries, Java, and maybe a build system like maven. To demonstrate this use case, we are going to use docker to build the <a href="https://github.com/gwidgets/gwt-polymer-starter-kit">gwt-polymer-starter-kit</a> application. For our build, we are going to need a Docker image with maven, and Java 8:

{% highlight dockerfile  %}
FROM java:8 

RUN  \
  export DEBIAN_FRONTEND=noninteractive && \
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  apt-get update && \
  apt-get -y upgrade && \
  apt-get install -y wget curl maven

  RUN mkdir gwt-polymer-starter-kit

  WORKDIR /gwt-polymer-starter-kit

  CMD ["mvn", "package"]
{% endhighlight %}

<p style="text-align:justify;">
  In this image, we made use of an already existing Java 8 <a href="https://hub.docker.com/_/java/">image</a> and added maven on the top of it. We told docker to apply <em> mvn package </em> on start up. We also added some linux package upgrade, since java:8 image is based on a Debian linux image. Once the command will finish, the docker container will shutdown. Finally, we are going to build and run our image using the following docker commands:
</p>

{% highlight docker  %}
docker build -t gwidgets/polymer-starter-build .
{% endhighlight %}

{% highlight docker  %}
docker run -ti --rm -v /c/GWidgets/workspace/test/gwt-polymer-starter-kit:/gwt-polymer-starter-kit 
--name gwt-build gwidgets/polymer-starter-build
{% endhighlight %}

<p style="text-align:justify;">
  In this way, we are making sure that our build is clean and that no other settings from other projects or from the host OS are interfering with our build.
</p>

####  **Deploying a GWT application in Docker** 

<p style="text-align:justify;">
  A GWT application can have many forms or architectures. Some common ones are: monolithic application (single war with both the front and backend), a client side only application, or a multi layered application. let&#8217;s see how we can apply docker in each of these cases.
</p>
  <span>1.</span>  _Monolithic application:_ 
<br />

<p style="text-align:justify;">
  To deploy a monolithic GWT application, an application server is needed. We are going to use Jetty for demonstration purposes. In order not to reivent the wheel, we are going to use the official <a href="https://hub.docker.com/_/jetty/">jetty image</a> which is available on <a href="https://hub.docker.com/">Docker Hub</a>.
</p>

Our DockerFile looks like :

{% highlight dockerfile  %}
FROM jetty

VOLUME /c/Users/GWidgets/workspace/test/test-pwa2/

COPY target/test-pwa2-0.1.war /var/lib/jetty/webapps
{% endhighlight %}

<p style="text-align:justify;">
  Explanation: we basically told docker to attach our app directory as a volume using the <a href="https://docs.docker.com/engine/reference/builder/#/volume">VOLUME</a> command and then copy our app war file into the webapps folder of jetty. The application will automatically be deployed on start up. Now, we need to build our image and run it:
</p>

{% highlight docker  %}
docker build -t gwidgets/gwt-jetty .
{% endhighlight %}

{% highlight docker  %}
docker run -ti -p 8080:8080 --rm --name gwt-jetty gwidgets/gwt-jetty
{% endhighlight %}

Result:

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/09/docker-jetty_cp.png" alt="docker-jetty_cp" width="500" height="400" class="aligncenter size-full wp-image-460" />](http://www.g-widgets.com/wp-content/uploads/2016/09/docker-jetty_cp.png)

  <span>2.</span>  _a client side only application:_ 
<br />

<p style="text-align:justify;">
  A client side only application contains only static files like html, js, css,..etc, so we can do without an application server. We can use any web server like Apache or Nginx. We can also use Node Js modules like Express or http-sever to write our own server functionalities or Python <a href="https://docs.python.org/2/library/simplehttpserver.html">SimpleHTTPServer</a> module for an even simpler web server. Since we only need minimal functionalities in this example we are going to use SimpleHTTPServer for serving our files.
</p>

For this purpose, we are going to use the official [python docker](https://hub.docker.com/_/python/) image. Our dockfile looks like:

{% highlight dockerfile %}
FROM python:2.7

WORKDIR /test/
EXPOSE 8080

CMD python -m SimpleHTTPServer 8080
{% endhighlight %}

{% highlight docker  %}
docker build -t gwidgets/gwt-client-python-server .
</pre>
{% endhighlight %}

{% highlight docker  %}
docker run --rm -ti -p 8080:8080 -v /c/GWidgets/workspace/test/python-server-docker:/tes
t/ --name gwt-client2 gwidgets/gwt-client-python-server
{% endhighlight %}

Explanation: 

<p style="text-align:justify;">
  We built our image using the <a href="https://docs.docker.com/engine/reference/commandline/build/">build command</a> and gave it a tag using the -t flag, and then we used <a href="https://docs.docker.com/engine/reference/commandline/run/">docker run</a> with the -p option which specifies which port on the host machine is to be interfaced with the docker container port. the -v option specifies which file on our host system to be associated with the container specified mount point, in our case /test/.
</p>

Result: 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/09/docker-polymer_cp.png" alt="docker-polymer_cp" width="500" height="400" class="aligncenter size-full wp-image-461" />](http://www.g-widgets.com/wp-content/uploads/2016/09/docker-polymer_cp.png)
  
<br />
  <span>3.</span>  _Multi layered application:_ 
<br />

<p style="text-align:justify;">
  Multi layered application are usually decoupled into a client side and several back-end services where the communication is carried out using HTTP. In this case we are going to combine what we have learned in previous sections. For the client side, we can use a container with a web server like we have seen in section two. For the backend services, we can use an application server container or just a container with java8 if an embedded server is used like the case of Spring boot. Since we have now a set of interdependent containers, we need to use <a href="https://docs.docker.com/compose/overview/">docker-compose</a> which is a tool provided by Docker to help run multiple containers applications. docker-compose rely on a yaml file that describes the containers that an application is composed of. Supposing our GWT application is divided into a client side, and two Restful backend services, our docker compose would look like:
</p>

{% highlight yaml %}
version: '2'
services:
  client:
    build: gwidgets/gwt-client
    ports:
     - "8080:8080"
    volumes:
     - .:/client
  rest-service1:
    image: gwidgets/service1
    ports:
     - "8081:8081"
  rest-service2:
    image: gwidgets/service2
    ports:
     - "8082:8082"
       depends_on:
     - service1
{% endhighlight %}

<p style="text-align:justify;">
  After defining our system of interdependant containers using in the docker-compose.yml file, we can run our application using the following docker command: <em> docker-compose up </em>
</p>

####  **Wrap-up:** 

<p style="text-align:justify;">
  Docker can make developing GWT applications a better experience, especially when it concerns large scale applications with complex environments, and a long compile time. Docker may help provide a better test and build environment and allocate resources more effectively when deploying.
</p>