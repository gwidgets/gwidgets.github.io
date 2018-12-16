---
id_disqus: 388
title: Serializing/Deserializing Json in GWT
date: 2016-08-25T16:20:35+00:00
author: blogger
layout: post
permalink: /2016/08/25/serializingdeserializing-json-in-gwt/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  There was recently an interesting discussion in GWT Users group about best practices for serializing/deserializing JSON in the client side....

---
### JSON & GWT 

<p style="text-align: justify;" >
  There was recently an interesting <a href="https://groups.google.com/forum/#!topic/google-web-toolkit/KpL48B_zkOk">discussion</a> in <a href="https://groups.google.com/forum/#!forum/google-web-toolkit">GWT Users</a> group about best practices for serializing/deserializing JSON in the client side. This post aims to highlight its important points. There is so far three different ways of converting an object to JSON and back from the client side in GWT:
</p>

####  **gwt-jackson framework:** 

<p style="text-align: justify;" >
  <a href="https://github.com/nmorel/gwt-jackson">gwt-jackson</a> wraps some of the functionalities of the famous <a href="https://github.com/FasterXML">Jackson</a> Library. It allows converting an object using an interface called <a href="https://github.com/nmorel/gwt-jackson/blob/master/gwt-jackson/src/main/java/com/github/nmorel/gwtjackson/client/ObjectMapper.java">ObjectMapper</a>. The advantage of using gwt-jackson is that it takes care of serializing complex Objects such as Collections and Maps. It also allows fancy conversion using annotations such as @JsonProperty, and @JsonCreator. The only bummer of gwt-jackson is that it uses <a href="https://github.com/nmorel/gwt-jackson/blob/master/gwt-jackson/src/main/resources/com/github/nmorel/gwtjackson/GwtJackson.gwt.xml">Generators</a> which will be deprecated in the version 3.0 of GWT. It&#8217;s also worth noting that gwt-jackson is used by <a href="https://github.com/resty-gwt/">RestyGWT</a> which is one of alternatives for making HTTP Requests from the client side.
</p>

Examples can be found in the Github Page: <https://github.com/nmorel/gwt-jackson/tree/master/examples>

####  **using JavaScriptObject:** 

<p style="text-align: justify;" >
  This is one of the traditional methods. <a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/core/client/JavaScriptObject.html">JavaScriptObject </a> makes use of JSNI to create a plain JS object. It can be extended and has a cast() method that allows &#8220;safe&#8221; casting the object to its sub-types. A JavaScriptObject can be converted to a JSON String using JsonUtils.stringify() method, and can be converted back using JsonUtils.safeEval(). JavaScriptObject works in conjunction with <a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/core/client/JsArray.html">JsArray</a> which represents a collection of JavaScriptObject, and extends JavaScriptObject. The only disadvantage of this method is the boilerplate associated with creating objects. For example:
</p>

{% highlight java  %}
public class Person extends JavaScriptObject {
	 //Constructor needs to be protected and zero-arguments
	  protected Person() { }

          // JSNI is used for setting/getting properties 
	  public final native String getFirstName() /*-{ return this.FirstName; }-*/;
	  public final native String getLastName()  /*-{ return this.LastName;  }-*/;
	  
	  public final native void setFirstName(String firstName) /*-{ this.FirstName = firstName; }-*/;
	  public final native void setLastName(String lastName)  /*-{ this.LastName = lastName; }-*/;
} 
{% endhighlight %}

Then: 

{% highlight java  %}
             Person person = JavaScriptObject.createObject().cast();
				        JsArray<Person> array = JavaScriptObject.createArray().cast();
				        
				        person.setFirstName("first Name");
				        person.setLastName("last Name");
				        
				        array.push(person);
				        
				       
				        
				        GWT.log(JsonUtils.stringify(person));
				        GWT.log(JsonUtils.stringify(array));
{% endhighlight %}

Result: 

{% highlight js %}
{"FirstName":"first Name","LastName":"last Name"}
[{"FirstName":"first Name","LastName":"last Name"}]
{% endhighlight %}


####  **using JsInterop annotations:** 

<p style="text-align: justify;" >
  JsInterop annotations allow treating a java type/class as a Javascript object, and exporting or importing functionalities to/from the application Js environment. Using JsInterop is the recommended method by some of the GWT project members (<a href="https://github.com/tbroyer">Thomas Broyer</a>, <a href="https://github.com/jnehlmeier">Jens Nehlmeier</a>), because JsInterop is an important part of the future of GWT, and it will be the main way of handling Javascript Objects from GWT. The only shortcoming for using JsInterop is that Elemental 2 is still in experimental phase, so until it gets stable. Developers are better off usng their own snippets for native Javascript utilities such as the Json class, for example:
</p>

{% highlight java  %}
@JsType(isNative=true, namespace=GLOBAL)
public class JSON {
	public native static String stringify(Object obj);
	
	public native static Object parse(String obj);
}
{% endhighlight %}

if our object looks like: 

{% highlight java  %}
@JsType(isNative=true, namespace=GLOBAL, name="Object")
public class Record {
	String id;
	String date;
	String data;
	
	public Record() {
		
	}
}
{% endhighlight %}

Then : 

{% highlight java  %}
Record record = new Record();
  record.id = "1";
  record.date = "20";
  record.data = "30";

String json = JSON.stringify(recod);

 GWT.log(json);
// Result: {"id":"1","date":"20","data":"30"}			        			      
{% endhighlight %}

<p style="text-align: justify;" >
  JsInterop is used by <a href="https://github.com/intendia-oss/autorest-gwt">autorest-gwt</a>, which is also one of the options for making HTTP calls, to serialize/serialize objects prior to making HTTP requests.
</p>

<span style="color:red;"><strong>It is important to note</strong> </span>that Maps are not handled by JSON.stringify() method, an attempt to stringify a Map throws the following error: 

{% highlight java  %}
Map<String, String> mapTest = new HashMap<String, String>();
				        mapTest.put("v1", "v2");
				        mapTest.put("v3", "v4");
 GWT.log(JSON.stringify(mapTest));
{% endhighlight %}

<pre style="color:red;">Uncaught TypeError: Converting circular structure to JSON
</pre>

Converting a Collection such as an ArrayList does not throw any error, but creates additional JSON fields that the developper would want to get rid of:

{% highlight java  %}
  List<Record> test2 = new ArrayList<Record>();			       
	test2.add(record2);
	test2.add(record);
  GWT.log(JSON.stringify(test2));
{% endhighlight %}

Result: 

<pre>{"array_3_g$":[{"id":"1","date":"50","data":"90"},{"id":"1","date":"20","data":"30"}]}
</pre>

The &#8220;array\_3\_g$&#8221; is added by GWT compiler for some reason, so the user needs to find a way to remove it for a clean conversion like: 

<pre>{[{"id":"1","date":"50","data":"90"},{"id":"1","date":"20","data":"30"}]}
</pre>

Plain Arrays is the only structure that is converted properly, so far. 

####  **Take Away:** 

<p style="text-align: justify;" >
  Out of the three methods, JsInterop seems the most viable method for handling JSON. The main concern for now is handling objects such as Collections and Maps which require some further manual processing by the developer. Plain Arrays is the only structure that is converted properly for now, so developers can try to simplify or convert to Plain Arrays for a clean conversion.
</p>

While JavaScriptObject offers its own way of dealing with &#8220;lists&#8221; using JsArray. gwt-jackson remains the only option now that offers the conversion of Collections and Maps out of the box.