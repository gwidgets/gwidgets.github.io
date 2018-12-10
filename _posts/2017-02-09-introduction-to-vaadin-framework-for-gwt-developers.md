---
id: 556
title: Introduction to Vaadin Framework for GWT developers
date: 2017-02-09T09:47:19+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=556
permalink: /2017/02/09/introduction-to-vaadin-framework-for-gwt-developers/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - Vaadin
excerpt:  Vaadin is a known framework to GWT developers. Vaadin used GWT to build a full fledged application framework. It is one of the main GWT based frameworks ( along with Errai framework) and provides some interesting capabilities like addons...
---
<p style="text-align:justify;">
  <a href="https://vaadin.com/framework">Vaadin</a> is a known framework to GWT developers. Vaadin used GWT to build a full fledged application framework. It is one of the main GWT based frameworks ( along with <a href="http://erraiframework.org/">Errai framework</a>) and provides some interesting capabilities like addons, themes, integrations with other Java frameworks such as Spring. Vaadin is based on the same idea as GWT: allowing to develop web application UIs declaratively from Java code. There are some key differences, nevertheless.<br /> The main difference between GWT and Vaadin is where the UI rendering is done. While GWT compiles all the Java code to a ready to use javascript application or a client side application, Vaadin renders the application on the server side, and all the interactions with the application require server side processing. Developers who advocate for Vaadin argue that Vaadin&#8217;s way of doing things relieves the developer from taking care of the communication between the client and the server, in contrast to GWT where the developer needs to handle client to server communication using RPC or HTTP. Another argument in favor of Vaadin&#8217;s way of rendering applications is the possibility to use any Java framework or library ( e.g Spring, Java EE, &#8230;etc), which is not possible all the time in GWT. From another perspective, GWT advocates argue that Vaadin&#8217;s server side rendering makes the performance degrade for UI intensive applications. Finally, since Vaadin is rendered and compiled on the server side, it is not possible to use the <a href="http://www.gwtproject.org/articles/superdevmode.html">Super Dev Mode</a> which allows making changes without restarting the server, so Vaadin&#8217;s developers need to look into other solutions for hot reloading the code like <a href="http://hotswapagent.org/">HotSwap</a> or <a href="https://zeroturnaround.com/software/jrebel/">JRebel</a>.<br /> In any case, it does not really seem right to compare between GWT and Vaadin as Vaadin can be seen as an evolution or a derived framework of GWT. In this tutorial, we will provide a brief introduction to Vaadin framework with some GWT concepts in mind.
</p>

<br />

####  **Initial project Set up:** 

<p style="text-align:justify;">
  To set up a Vaadin project, your can either use Vaadin&#8217;s plugin in your favorite IDE (IntelliJ, Eclipse, Netbeans), or you can use Maven archetype and import the project later. More information on IDE plugins can be found at: <a href="https://vaadin.com/tooling">https://vaadin.com/tooling </a>
</p>

In this tutorial, we are going to use a Maven archetype for quickly setting up our project. There are several available [archetypes](https://vaadin.com/maven#archetypes) provided by Vaadin. In our project, we are going to use the vaadin-archetype-application which creates a single module application. 

<pre>
mvn -B archetype:generate -DarchetypeGroupId=com.vaadin -DarchetypeArtifactId=vaadin-archetype-application -DarchetypeVersion=7.7.6 -DgroupId=com.gwidgets -DartifactId=vaadin-intro -Dversion=0.1
</pre>

<br />

####  **Similarities between GWT and Vaadin:** 

In GWT, a web application needs to implement the [EntryPoint](http://www.gwtproject.org/javadoc/latest/com/google/gwt/core/client/EntryPoint.html) class: 

{% highlight java  %}
public class GWTapp implements EntryPoint {
	@Override
	public void onModuleLoad() {
		//All the app code goes here
	}
}
{% endhighlight %}

In Vaadin, the equivalent is the [UI](https://vaadin.com/api/com/vaadin/ui/UI.html) class: 

{% highlight java  %}
  public class MyUI extends UI {
    @Override
    protected void init(VaadinRequest vaadinRequest) {}
 }
{% endhighlight %}

To be rendered properly, the MyUI class needs to be associated with a Servlet: 

{% highlight java  %}
    @WebServlet(urlPatterns = "/*", name = "MyUIServlet", asyncSupported = true)
    @VaadinServletConfiguration(ui = MyUI.class, productionMode = false)
    public static class MyUIServlet extends VaadinServlet {
    }
{% endhighlight %}

<p style="text-align:justify;">
  Another similarity between GWT and Vaadin is the concept of <a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/user/client/ui/Widget.html">Widget</a>s. <a href="https://vaadin.com/api/7.7.6/com/vaadin/ui/Component.html">Component</a>s in Vaadin are the equivalent of Widgets in GWT. They can be added to the main layout (equivalent to RootPanel in GWT), and they can be added to other Components. For example:
</p>

{% highlight java  %}
      VerticalLayout layout = new VerticalLayout();
       TextField name = new TextField();

        Button button = new Button("Click Me");

        layout.addComponent(name);
        layout.addComponent(button);

        this.setContent(layout);
{% endhighlight %}

is the equivalent in GWT to : 

{% highlight java  %}
   VerticalPanel panel = new VerticalPanel();
   TextBox textField = new TextBox();

    Button button = new Button();

    panel.add(textField);
    panel.add(button);

    RootPanel.get().add(panel);
{% endhighlight %}

Vaadin comes with a more complex and comprehensive set of themable Components than GWT. 

#### **Simple application:**

<p style="text-align:justify;">
  As an example, let&#8217;s develop a simple Vaadin application that reads the submitted form data and prints the result in the system console.
</p>

{% highlight java  %}
@Theme("runo")
public class MyUI extends UI {

    @Override
    protected void init(VaadinRequest vaadinRequest) {
        final VerticalLayout layout = new VerticalLayout();
        
        final TextField name = new TextField();
        final TextArea message = new TextArea();
        name.setCaption("name");
        message.setCaption("message");
       
        Button button = new Button("Send");
        
        button.addClickListener( e -> {
        	//We can use System.out since we are in the server side 
        	System.out.println(name.getValue() + " says : ");
        	System.out.println(message.getValue());
        });
        
        layout.addComponents(name, message, button);
        layout.setMargin(true);
        layout.setSpacing(true);
        setContent(layout);
    }
    @WebServlet(urlPatterns = "/*", name = "MyUIServlet", asyncSupported = true)
    @VaadinServletConfiguration(ui = MyUI.class, productionMode = false)
    public static class MyUIServlet extends VaadinServlet {
    }
}
{% endhighlight %}

<p style="text-align:justify;">
  Explanation: The <a href="https://vaadin.com/api/7.7.7/com/vaadin/annotations/Theme.html">@Theme</a> annotation defines the general theme of the application components. Vaadin has some predefined themes, and offers the possibility to create <a href="https://vaadin.com/docs/-/part/framework/themes/themes-overview.html">custom themes</a>. We have added our components to a layout and added the layout to the main layout using setContent() method. Finally, we have defined a inner class that extends <a href="https://vaadin.com/api/7.7.7/com/vaadin/server/VaadinServlet.html">VaadinServlet</a>, so that we can associate our UI to a path.<br /> Notice that we can use System.out directly in our application, since we are in the server side. In fact, we can use any Java library from our application, thing that was not possible all the time in GWT.
</p>

####  **Take away:** 

<p style="text-align:justify;">
  Vaadin is an interesting alternative to GWT. GWT developers, who has not yet invested time in learning Vaadin, should consider doing so. In this tutorial, we have provided a basic introduction to Vaadin, and we went through some core differences between GWT and Vaadin. We also went through some common concepts between GWT and Vaadin. At first glance, it seems that GWT developers have an edge over developers who have not used GWT before, so the learning process can be faster for GWT developers.
</p>

Example full source code available at: <https://github.com/zak905/vaadin-intro>