---
id: 677
title: 'Vaadin Tip: building UIs declaratively'
date: 2017-07-05T15:10:03+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=677
permalink: /2017/07/05/vaadin-tip-building-uis-declaratively/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - Vaadin
excerpt:  If you have used GWT, then you would have probably found UiBinder quite useful to design complex UIs. In our series of posts about Vaadin, we want to draw parallels between Vaadin and GWT. Vaadin offers several tools and components out of the box for building complex and good looking UIs...

---
<p style="text-align:justify">
  If you have used GWT, then you would have probably found UiBinder quite useful to design complex UIs. In our series of posts about Vaadin, we want to draw parallels between Vaadin and GWT. Vaadin offers several tools and components out of the box for building complex and good looking UIs. One of them is the possiblity of building UIs declaratively, like UiBinder. Compared to GWT, Vaadin offers the possibility to use .html files directly.
</p>

####  **The programmatic way :** 

As in GWT, Vaadin UIs can also be built programmatically.  For example, let&#8217;s suppose we want to build a simple form to add a task to a todo list. One way to do it programmatically:

{% highlight java  %}
public class MainUI extends UI {
@Override
protected void init(VaadinRequest request) {
// TODO Auto-generated method stub
FormLayout layout = new FormLayout();
TextField taskTitle = new TextField();
taskTitle.setCaption("Title");
taskTitle.setIcon(VaadinIcons.CHEVRON_DOWN);
TextArea taskDescription = new TextArea();
taskDescription.setCaption("Description");
taskDescription.setIcon(VaadinIcons.LINES);
DateField taskDate = new DateField();
taskDate.setCaption("Date");

Button button = new Button("Add");
button.setIcon(VaadinIcons.PLUS);

layout.addComponent(taskTitle);
layout.addComponent(taskDescription);
layout.addComponent(taskDate);
layout.addComponent(button);
setContent(layout);
}
}
{% endhighlight %}

Result:

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/07/VaadinForm.png" alt="VaadinForm" width="360" height="322" class="aligncenter size-full wp-image-687" />](https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/07/VaadinForm.png)

#### **The declarative way :**

<p style="text-align:justify">
  The declarative way can be useful if the UI is complex, and has nested components. Vaadin developed HTML custom elements that can be bound to Java components. The custom elements start with <em>vaadin-. </em>The rest of the name of the element can extracted from the java class by separating words and making it lower case, as detailed in <a href="https://vaadin.com/docs/-/part/framework/application/application-declarative.html">Vaadin&#8217;s</a> website. The first step in creating a UI in a declarative way is to  create the html file, let&#8217;s name it Form.html:
</p>

{% highlight html  %}
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<meta name="vaadin-version" content="8.0.5">
</head>
<body>
<vaadin-form-layout>
<vaadin-text-field icon="fonticon://Vaadin-Icons/e7ce" caption="Task Name" _id="todoTitle">
</vaadin-text-field>
<vaadin-text-area icon="fonticon://Vaadin-Icons/e7ef" _id="todoDescription">
</vaadin-text-area>
<vaadin-date-time-field caption="Date" _id="todoDate">
</vaadin-date-time-field>
<vaadin-button icon="fonticon://Vaadin-Icons/e801"_id="todoButton">
Add
</vaadin-button>
</vaadin-form-layout>
</body>
</html>
{% endhighlight %}

The second step is to create a java class that will be bound to this file. 

{% highlight java  %}
@DesignRoot
public class Form extends FormLayout {
	public Form() {
		Design.read("Form.html", this);
	}
}
{% endhighlight %}

now we can use it as a normal Component from our UI class: 

    {% highlight java  %}
      public class MainUI extends UI {
      @Override
      protected void init(VaadinRequest request) {
      setContent(new Form());
      }
      }
    {% endhighlight %}

To bind fields from the .html to fields in the java class, the _id attribute need to be setup. For example, to bind our textfield: 

{% highlight html %}
<vaadin-text-field icon="fonticon://Vaadin-Icons/e7ce" caption="Task Name" _id="todoTitle">
</vaadin-text-field>
{% endhighlight %}

and then we can add it to the java file and it will be automatically bound:

  {% highlight java  %}
  @DesignRoot
  public class Form extends FormLayout {

      TextField todoTitle;

      public Form() {
    Design.read("Form.html", this);
          //we can directly use it without initialization
          }
  }
  {% endhighlight %}

<p style="text-align:justify">
  Vaadin provides also an interesting tool for interactively designing UIs: <a href="https://vaadin.com/designer">Vaadin Designer</a>. Vaadin designer allows designing UIs using the mouse and drag-&-drop. We have used the tool for demo purposes only, so we cannot really evaluate it. Vaadin-Designer can help increasing productivity by reducing the time to build the UIs and taking care of the &#8220;boilerplate&#8221; part. Unfortunately, Vaadin Designer is not free of charge, and its added value depends from one project to another.
</p>

####  **Take away:** 

<p style="text-align:justify">
  Designing UIs in a programmatic way is not always convenient. Vaading has an interesting approach towards building UIs in a declarative way. The HTML custom elements provides a way to directly link .html files to java. Maybe this is a road to explore by GWT developers, as UiBinder will be removed in the next 3.0 version.
</p>