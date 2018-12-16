---
id_disqus: 641
title: Dependency injection in GWT using Dagger 2
date: 2017-06-28T18:34:23+00:00
author: blogger
layout: post
permalink: /2017/06/28/dependency-injection-in-gwt-using-dagger-2/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  Dependency injection is a software development concept where objects are provided with all the objects or values than they need for creation. GWT users have been familiar with GIN, but this last has been deprecated and is not supported anymore, so applications using GIN currently need really to say farewell...
---
<p style="text-align:justify">
  Dependency injection is a software development concept where objects are provided with all the objects or values than they need for creation. GWT users have been familiar with GIN, but this last has been deprecated and is not supported anymore, so applications using GIN currently need really to say farewell. <a href="https://google.github.io/dagger/">Dagger</a> is the new dependency injection framework for GWT. For those unfamiliar with the framework, Dagger was aimed to provide DI for Android, but is now used for general purpose DI. It was adapted to GWT as well. In this post, we will do a brief introduction to Dagger and how to set up DI for a GWT project using Dagger.
</p>

####  **What&#8217;s in it for GWT?** 

<p style="text-align:justify">
  Unlike GIN, which uses Generators ( which will be removed from GWT some time in the future), Dagger uses compile time annotation processors. Projects using Dagger will go through less trouble when upgrading the GWT version. On the other hand, DI usually introduces complexity, so it&#8217;s kind of difficult to debug errors happening during the injection. GIN stack traces are known to be unreadable sometimes. One of Dagger&#8217;s goals is to reduce this shortcoming. Dagger&#8217;s generated code is close to code written by human, so understanding what happens under the hood can be easier, and therefore the developer will have less headaches when debugging.
</p>

#### **Using Dagger in a GWT project:**

  1. _Dependencies_ 
   
	{% highlight xml %}
			<dependency>
				<groupId>javax.inject</groupId>
				<artifactId>javax.inject</artifactId>
				<version>1</version>
				<scope>provided</scope>
			</dependency>
			<dependency>
				<groupId>com.google.dagger</groupId>
				<artifactId>dagger-gwt</artifactId>
				<version>2.5</version>
				<scope>provided</scope>
			</dependency>
			<dependency>
				<groupId>com.google.dagger</groupId>
				<artifactId>dagger-compiler</artifactId>
				<version>2.5</version>
				<scope>provided</scope>
			</dependency>
	{% endhighlight %}
			
Dagger requires [javax.inject](http://docs.oracle.com/javaee/6/api/javax/inject/package-summary.html) annotations to be on the classpath when compiling. Moreover, the Dagger module needs to be added to the .gwt.xml:
    
	{% highlight xml %}
			<inherits name="dagger.Dagger" />
	{% endhighlight %}

  <span>2.</span> _Annotation processor_
<p style="text-align:justify">
  If you are using maven then, you need to use a version higher than 3.5.1 of the compiler plugin if you want the annotation compiler to be automatically executed when the compile goal is called. Otherwise you will need to specify both annotationProcessors and annotationProcessorsPaths in the plugin configuration. Optionally, the dagger-compiler compiler can be removed from dependencies and added to annotationProcessorsPaths, as specified by <a href="https://twitter.com/tbroyer">Thomas Broyer</a> in <a href="https://stackoverflow.com/questions/37255294/how-to-integrate-dagger2-in-gwt-application">SO</a> :
</p>

{% highlight xml %}
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.7</source>
        <target>1.7</target>
        <annotationProcessorPaths>
            <path>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>${dagger.gwt.version}</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
{% endhighlight %}

<p style="text-align:justify">
  It&#8217;s also worth noting that, under dev mode, the annotation processor need to be rerun each time the injected classes change. Under maven, the annotation processor can be run using process-classes goal. I have not tested Gradle, but the concepts should be the same using Gradle as well.
</p>

  <span>3.</span> _Simple dependency injection_
<p style="text-align:justify">
  Suppose that we have a service that compresses images. The service depends on two other services: a service that downloads the image, and a service that uploads the image after compressing. All the objects have zero args constructors.
</p>

{% highlight java  %}
 public class ImageCompressor {
	@Inject public ImageDownloader downloader;
	@Inject public ImageUploader uploader;
	
	@Inject
	public ImageCompressor(){	
	}
	
	public void compress(String url) {
		downloader.download(url);
		GWT.log("compressing image");
		uploader.upload(url);
	}
}
{% endhighlight %}

{% highlight java  %}
public class ImageDownloader {	
	@Inject
	public ImageDownloader() {
	}

	public void download(String url) {
		GWT.log("downloading image at " + url);
	}
}
{% endhighlight %}

{% highlight java  %}
public class ImageUploader {	
	@Inject
	public ImageUploader() {
	}

	public void upload(String url) {
		GWT.log("uploading compresesed image at " + url);
	}
}
{% endhighlight %}

  <span>4.</span> _Defining a module_
<p style="text-align:justify">
  if you need special setup for constructing an object such as setting some values, or specifying constructor arguments then you need to create a module. Suppose that we need to supply a timeout value for our ImageDownloader Object:
</p>

{% highlight java  %}
public class ImageDownloader {
       int timeout;
	
	//@Inject we cannot use inject on the constructor anymore
	public ImageDownloader(int timeout) {
                 this.timeout = timeout;
	}

	public void download(String url) {
		GWT.log("downloading image at " + url);
	}	
}
{% endhighlight %}

Then we will need to specify a module that provides our ImageDownloader:

{% highlight java  %}
@Module
public class ImageCompressionModule {

	@Provides
	public ImageDownloader getImageDowloader(){
		return new ImageDownloader(15);
	}
{% endhighlight %}

  <span>5.</span> _Defining the App component_


Now that we defined our module, and objects, we will create the DI component that will be used to obtain injected objects instances. 

{% highlight java %}
@Component(modules=ImageCompressionModule.class)
public interface AppComponent {
	ImageCompressor getImageCompressor();
}
{% endhighlight %}

  <span>6.</span> _Using the injected objects_
An instance of our app component can be obtained in the following way:

{% highlight java  %}
               AppComponent component = DaggerAppComponent.builder()
               .imageCompressionModule(new ImageCompressionModule())
               .build();
{% endhighlight %}

<p style="text-align:justify">
  If you are using an IDE, then you will notice that it complains about the DaggerAppComponent. This is pretty normal because DaggerAppComponent is only available after running the annotation processor.
</p>

finally, we can use our object : 

{% highlight java %}
       ImageCompressor compressor = component.getImageCompressor();
       compressor.compress("http://www.g-widgets.com/GWTcon.jpg");
{% endhighlight %}

Result:

<pre>
downloading image at http://www.g-widgets.com/GWTcon.jpg
compressing image
uploading compressed image to http://www.g-widgets.com/GWTcon.jpg
</pre>

####  **Wrap-up:** 

<p style="text-align:justify">
  Dagger 2 is the next generation dependency injection for GWT. We have seen basic features of the framework in this post. More advanced DI features can be found in Dagger&#8217;s main users guide: <a href="https://google.github.io/dagger/users-guide">https://google.github.io/dagger/users-guide</a>. Dagger&#8217;s GWT version works in the same way as the backend version: the code can work on both client and server side, so it may be useful to port the DI to the backend in case there are issues to benefit from debugging in the JVM.
</p>

Full code is available at: <https://github.com/zak905/dagger2-gwt-example>