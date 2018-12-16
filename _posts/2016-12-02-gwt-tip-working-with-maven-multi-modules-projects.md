---
id_disqus: 483
title: 'GWT Tip: working with maven multi-modules projects'
date: 2016-12-02T10:06:26+00:00
author: blogger
layout: post
permalink: /2016/12/02/gwt-tip-working-with-maven-multi-modules-projects/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  Many question have been asked recently in the GWT Users Group about how to work with GWT maven projects that contain multiple GWT modules...

---
<p style="text-align:justify;">
  Many question have been asked recently in the GWT Users <a href="https://groups.google.com/forum/#!forum/google-web-toolkit">Group</a> about how to work with GWT maven projects that contain multiple GWT modules, and how to properly set up the dev mode. This post aims to provide an example of a maven configuration for a project with multiple modules. There is off course no one right way to do this, and the configuration may differ from one project to another.
</p>

Before getting started, it&#8217;s worth taking a look at the existing maven plugins in GWT ecosystem. There are two GWT maven plugins: 

<ul style="
    font-family: Raleway!important;
    font-size: 18px;
">
  
  <li>
    <a href="https://gwt-maven-plugin.github.io/gwt-maven-plugin/">org.codehaus.mojo</a>: This plugin is considered as the legacy plugin. it is tied to a GWT version, because it brings the gwt-dev and gwt-servlet to the classpath ( so no need to include them). The advantage of this plugin is the configuration of gwt compiler options provided as maven properties.
  </li>
  <li>
    <a href="https://tbroyer.github.io/gwt-maven-plugin/">net.ltgt.gwt.maven</a>: This plugin is considered as the new generation maven project. it&#8217;s not tied to a sepecific GWT version, so you have to bring in gwt-dev, and gwt-servlet. This plugin provides two different packaging (gwt-lib, gwt-app), and provides freedom on the arguments provided to the gwt compiler.
  </li>
</ul>

<p style="text-align:justify;">
  For a more detailed comparison between the two plugins, you can refer to <a href="https://twitter.com/tbroyer">Thomas Broyer</a>&#8216;s <a href="http://stackoverflow.com/questions/37910365/what-is-the-difference-between-net-ltgt-gwt-maven-and-org-codehaus-mojo-gwt-mave">answer on stackoverflow</a>.
</p>

<p style="text-align:justify;">
  Although both of them could be used, net.ltgt.gwt.maven is likely to be more suited for projects with multiple modules because it&#8217;s designed to support reactor builds. If org.codehaus.mojo is to be used, the user need to explicitely run mvn install.
</p>

####  **A GWT app with Java EE backend** 

<p style="text-align:justify;">
  To provide an example, let&#8217;s suppose that we have an application with two GWT modules for the client side (module1, module2), and a server module that uses Java EE servlets to handle server requests. Our parent pom.xml looks something like:
</p>

{% highlight xml %}
   <dependencies>
		<dependency>
			<groupId>com.google.gwt</groupId>
			<artifactId>gwt-user</artifactId>
			<version>${gwtVersion}</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>com.google.gwt</groupId>
			<artifactId>gwt-dev</artifactId>
			<version>${gwtVersion}</version>
			<scope>provided</scope>
		</dependency>
	</dependencies>
	<modules>
		<module>client-module1</module>
		<module>client-module2</module>
		<module>server</module>
  </modules>
{% endhighlight %}

In our server module, we have two servlets that manage the context for /module1 and /module2. 

Module1Servlet.java

{% highlight java  %}
@WebServlet("/module1")
public class Module1Servlet extends HttpServlet {
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.getRequestDispatcher("/module1.jsp").forward(req, resp);
	}
}
{% endhighlight %}

Module2Servlet.java

{% highlight java  %}
@WebServlet("/module2")
public class Module2Servlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		 req.getRequestDispatcher("/module2.jsp").forward(req, resp);
	}
}
{% endhighlight %}

Our 2 GWT modules display a simple Label widget. 

<p style="text-align:justify;">
  We are going to configure our GWT client modules to output the result of the Java to Javascript compilation directly into the server module. Here is a snippet of the pom.xml:
</p>

{% highlight xml  %}
<build>
		<resources>
			<resource>
				<directory>src/main/java</directory>
			</resource>
		</resources>

		<outputDirectory>${project.build.directory}/${project.build.finalName}/WEB-INF/classes</outputDirectory>


		<plugins>
			<plugin>
				<groupId>net.ltgt.gwt.maven</groupId>
				<artifactId>gwt-maven-plugin</artifactId>
				<version>1.0-rc-6</version>
				<extensions>true</extensions>
				<configuration>
					<classpathScope>compile</classpathScope>
					<moduleName>com.gwidgets.Module1</moduleName>
					<moduleShortName>module1</moduleShortName>
 				    <warDir>${basedir}/../server/target/server-${project.version}</warDir>
					<devmodeWorkDir>${basedir}/../server/target/server-${project.version}</devmodeWorkDir>
					<webappDirectory>${basedir}/../server/target/server-${project.version}</webappDirectory> 
					<devmodeArgs>
						<arg>-noserver</arg>
						<arg>-codeServerPort</arg>
						<arg>4522</arg>
					</devmodeArgs>
				</configuration>
			</plugin>
		</plugins>
	</build>
{% endhighlight %}

 **Explanation :** 

<p style="text-align:justify;">
  In this configuration, we provided the <strong>-noserver</strong> argument which tells GWT not to run its own dev server(jetty). We also provided a custom port because we want to run the dev mode for the two modules at the same time, so we would want to avoid running both modules on default port.<br /> We also provided the <strong>devmodeWorkDir</strong> property, which tells the GWT compiler where to output the compiled javascript files. The reason for choosing the project build directory (refered to by the ${project.build.directory} property) for the server module is that once the server is run, it uses the /target (or the build directory) as a source directory, so any changes that, for example, are introduced in our modules during the dev mode need to be reflected in the source directory of the running server.<br /> We also provided the <strong>webappDirectory</strong> which is used by the dev mode as a war directory. It is usually the same as <strong>devmodeWorkDir</strong>.<br /> Finally, the <strong>warDir</strong> tells GWT compiler where to write the deployable file. This option will be helpful when packaging the application for deploying.
</p>

####  **Running the dev mode:** 

<p style="text-align:justify;">
  First of all, we need to compile our GWT modules and run the dev mode. We need to run the following goals on both modules:
</p>

{% highlight shell  %}
mvn gwt:generate-module compile gwt:devmode 
{% endhighlight %}

To run the dev mode, we have to first launch the server module. Any server can be used for this purpose. In this example, we used jetty plugin for maven. Here is a snippet for the configuration: 

{% highlight xml %}
   <plugin>
			<groupId>org.eclipse.jetty</groupId>
			<artifactId>jetty-maven-plugin</artifactId>
			<version>9.2.0.M0</version>
			<configuration>
			<webAppSourceDirectory>${project.build.directory}/${project.build.finalName}</webAppSourceDirectory>
			</configuration>
		</plugin> 
{% endhighlight %}

Now we can run our server using : 

<pre>mvn package jetty:run </pre>

<p style="text-align:justify;">
  Result: we can run dev mode for both modules at the same time, and debug both at the same time.<br /> <a href="http://www.g-widgets.com/wp-content/uploads/2016/12/devmode-md1-md2.png"><img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/12/devmode-md1-md2.png" alt="devmode-md1-md2" width="1268" height="552" class="aligncenter size-full wp-image-495" /></a>
</p>

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/12/loaded-md1-md2.png" alt="loaded-md1-md2" width="1267" height="501" class="aligncenter size-full wp-image-496" />](http://www.g-widgets.com/wp-content/uploads/2016/12/loaded-md1-md2.png)

####  **Packaging the app** 

<p style="text-align:justify;">
  For packaging our modules as a depolyable war file, we need to first run
</p>

<pre>mvn gwt:compile</pre>

on both our GWT modules and run 

<pre>mvn package </pre>

on our server module. 

#### **Take away** 

<p style="text-align:justify;">
  This example illustrates the flexibilty of net.ltgt.gwt.maven plugin in working with multiple GWT modules. Configurations may differ from a project to another, but the concept remains the same: directing the GWT compiler output and source directory to where want to run our server. For further examples, you can check out <a href="https://www.youtube.com/watch?v=-_YcBeI_Feo">this tutorial</a> by <a href="https://twitter.com/branflake2267">Brandon Donnelson</a> on how to use dev mode with Tomcat Plugin in Eclipse IDE.
</p>

Full example code: <https://github.com/zak905/gwt-multimodule-example>