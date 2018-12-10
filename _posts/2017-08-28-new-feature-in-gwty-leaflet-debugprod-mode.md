---
id: 708
title: 'New feature in gwty-leaflet: debug/prod mode.'
date: 2017-08-28T09:40:01+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=708
permalink: /2017/08/28/new-feature-in-gwty-leaflet-debugprod-mode/
comments: true
dsq_needs_sync:
  - "1"
excerpt:  We have added a new feature to gwty-leaflet, choosing whether the injected script is minified or no...

---
We have added a new feature to gwty-leaflet: choosing whether the injected script is minified or no. <a href="https://github.com/gwidgets/gwty-leaflet/blob/master/src/main/java/com/gwidgets/api/leaflet/utils/LeafletResources.java" target="_blank">LeafletResources</a> class can be used to inject leaflet js/css directly from the Java code, and we think having an uniminified script can help in debugging and tracking errors directly in the browser. The new prototype for the whenReady method is:

{% highlight java  %}
public static void whenReady(boolean debug, OnloadCallbackFn function)
{% endhighlight %}

if debug flag is set to yes then the injected script will be unminified. For example:

{% highlight js %}
//will inject leaflet-src.js instead of leaflet.js
LeafletResources.whenReady(true, 
				e -> 
		             {	 
	    MapOptions options = new MapOptions.Builder(L.latLng(52.485611, 13.416460), 11.0, 10.0)
	    		                       .maxZoom(400.0).build();	
		final Map map = L.map("map", options);
		L.tileLayer(MAP_URL, null).addTo(map);	

               return null;
              });
{% endhighlight %}