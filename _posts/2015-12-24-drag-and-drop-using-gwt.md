---
id: 217
title: Drag and Drop using GWT
date: 2015-12-24T20:15:47+00:00
author: blogger
layout: post
guid: http://localhost/wordpress2/?p=217
permalink: /2015/12/24/drag-and-drop-using-gwt/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  Drag and drop can be an important feature in web apps. It allows adding a human touch to UIs. Drag and drag can be easily implemented using Html5 and Javascript, and also using other frameworks such as jquery. For Java web development, GWT provides a good solution. GWT have added a native feature to enable drag and drop for widgets and components...

---
<div dir="ltr" style="text-align: left;" trbidi="on">
  <div class="separator" style="clear: both; text-align: center;">
    <a href="http://3.bp.blogspot.com/--d_5KLDVwUI/Vls88yeweUI/AAAAAAAAAqg/ISientf4PTM/s1600/DragAndDrop.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" src="http://3.bp.blogspot.com/--d_5KLDVwUI/Vls88yeweUI/AAAAAAAAAqg/ISientf4PTM/s1600/DragAndDrop.png" /></a>
  </div>
 
  
  <p style="text-align:justify;">
    Drag and drop can be an important feature in web apps. It allows adding a human touch to UIs. Drag and drag can be easily implemented using Html5 and Javascript, and also using other frameworks such as jquery. For Java web development, GWT provides a good solution. GWT have added a native feature to enable drag and drop for widgets and components. We are going to walk through it in this tutorial.
  </p>
  
  <p>
    As the name implies, drag and drop has two sides: the element to be dragged, and the element to be dropped on.
  </p>
  
  <p>
    To enable drag for any widget or component in GWT, we have to use the addDragHandler method. For example:<span style="background-color: white;"></span>
  </p>
  
{% highlight java  %}

Image image = new Image("images/car.png");
image.addDragStartHandler(new DragStartHandler(){
   @Override
 public void onDragStart(DragStartEvent event) {
       // required: data to be transferred to the drop handler
              event.setData("text", image.getElement().getInnerHTML()); 
   }});

{% endhighlight %}
  
  <p>
    Not all elements have the addDragHandler by default. If an element is not implementing the&nbsp;<a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/event/dom/client/DragHandler.html">DragHandler </a> interface, the developper needs to add the handler to the DOM handlers:
  </p>
  
{% highlight java  %}
image.addDomHandler(new DragStartHandler(){
     @Override
     public void onDragStart(DragStartEvent event) {
         // required: data to be transferred to the drop handler
   event.setData("text", image.getElement().getInnerHTML());
    }}, DragStartEvent.getType());
{% endhighlight %}
  
  <p>
    For the drop, we need to implement two handlers: DropHandler and DragOverHandler. Suppose we want to use a FlowPanel as a drop target:
  </p>
  
{% highlight java  %}
FlowPanel target = new FlowPanel();

target.addDomHandler(new DragOverHandler() {
           @Override
           public void onDragOver(DragOverEvent event) {
               //Do something like changing background
       }
   }, DragOverEvent.getType());
   
    target.addDomHandler(new DropHandler() {
      @Override
      public void onDrop(DropEvent event) {
          // required
       event.preventDefault();
        
          // get the data out of the event
          String data = event.getData("text");
          Image image = new Image(data);
   
      }
  }, DropEvent.getType());
{% endhighlight %}
  
  <p style="text-align:justify;">
    That&#8217;s it. Now we can drag the Image into the FlowPanel.
  </p>
  
  <div class="separator" style="clear: both; text-align: center;">
    <a href="http://4.bp.blogspot.com/-Ae5BrTtxZBU/Vlsvy4A_OVI/AAAAAAAAAqQ/yzHHPZ5trm4/s1600/draggableCar.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="195" src="http://4.bp.blogspot.com/-Ae5BrTtxZBU/Vlsvy4A_OVI/AAAAAAAAAqQ/yzHHPZ5trm4/s320/draggableCar.png" width="320" /></a>
  </div>
  

  <div class="separator" style="clear: both; text-align: left;">
    There are other GWT libraries that implements Drag and Drop out of the box such as:&nbsp;
  </div>
  
  <div class="separator" style="clear: both; text-align: left;">
    - gwt-dnd: <a href="https://github.com/fredsa/gwt-dnd">https://github.com/fredsa/gwt-dnd</a>
  </div>
  
  <div class="separator" style="clear: both; text-align: left;">
    - <a href="https://www.sencha.com/products/gxt/"> Sencha GXT</a>
  </div>
  
  <div class="separator" style="clear: both; text-align: left;">
    It is recommended for developpers to roll their own drag and drop in order not to depend on any implementation.&nbsp;</p>
  </div>
