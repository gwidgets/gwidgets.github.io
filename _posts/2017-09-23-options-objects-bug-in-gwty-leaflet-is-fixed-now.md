---
id_disqus: 711
title: Options objects bug in gwty-leaflet is fixed now.
date: 2017-09-23T14:25:29+00:00
author: blogger
layout: post
permalink: /2017/09/23/options-objects-bug-in-gwty-leaflet-is-fixed-now/
comments: true
dsq_needs_sync:
  - "1"
excerpt:  A member of the users community reported a bug recently related with the use of <a>TileLayerOptions</a> object. The reason for that is this code:...

---
A member of the users community reported a bug recently related with the use of <a>TileLayerOptions</a> object. The reason for that is this code:

	{% highlight java  %}
			public TileLayerOptions build(){		
				TileLayerOptions options = new TileLayerOptions();
				options.minZoom = this.minZoom;
				options.maxZoom = this.maxZoom;
				options.maxNativeZoom = this.maxNativeZoom;
				options.tileSize = this.tileSize;
				options.subdomains = this.subdomains;
				options.errorTileUrl = this.errorTileUrl;
				options.attribution = this.attribution;
				options.tms = this.tms;
				options.noWrap = this.noWrap;
				options.zoomOffset = this.zoomOffset;
				options.zoomReverse = this.zoomReverse;
				options.opacity = this.opacity;
				options.zIndex = this.zIndex;
				options.updateWhenIdle = this.updateWhenIdle;
				options.detectRetina = this.detectRetina;
				options.bounds = this.bounds;
				options.crossOrigin = this.crossOrigin;
				options.pane = this.pane;
				options.className = this.className;
				options.keepBuffer = this.keepBuffer;
				options.updateWhenZooming = this.updateWhenZooming;	 
				options.updateInterval = this.updateInterval;
				options.minNativeZoom = this.minNativeZoom;		
				return options;	
			}
	{% endhighlight %}

In the code above, if the user only sets few options, the result will be a Js object with all the options, even the null ones. For example, if we run the map initialization code below from the Starter Guide: 

{% highlight java  %}
		MapOptions options = new MapOptions.Builder(L.latLng(52.485611, 13.416460), 11.0, 10.0)
	    		                       .maxZoom(17.0).build();
		
		final Map map = L.map("map", options);
			
		TileLayerOptions tloptions = new TileLayerOptions.Builder().minZoom(1).maxZoom(17).build();
		L.tileLayer(MAP_URL, tloptions).addTo(map);	
{% endhighlight %}

The created passed to the JavaScript L.setOptions(this, options) is : 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/09/object-js.png" alt="object-js" width="520" height="368" class="aligncenter size-full wp-image-715" />](http://www.g-widgets.com/wp-content/uploads/2017/09/object-js.png)

This is not what leaflet expects. So the below error is thrown in the leaflet js: 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/09/Error-Js.png" alt="Error-Js" width="728" height="160" class="aligncenter size-full wp-image-714" />](http://www.g-widgets.com/wp-content/uploads/2017/09/Error-Js.png)

TitleLayer options, and possibly options of other Leaflet objects, expects an object with only the initialized values, and any undefined value may cause an error like the one above. So the solution was to get rid of default values, which are provided in the js( no need to set them), and to change the types of objects inside the builder from primitives to wrappers. Finally, before each object build a null check is introduced to avoid setting uninitialized objects: 

{% highlight java  %}
    public TileLayerOptions build(){
			//the ifs statement are for preventing the creation of undefined attributes => mimicking original Leaflet behavior
			TileLayerOptions options = new TileLayerOptions();
			if(this.minZoom != null)
			 options.minZoom = this.minZoom;
			if(this.maxZoom != null)
			options.maxZoom = this.maxZoom;
			if(this.maxNativeZoom != null)
			options.maxNativeZoom = this.maxNativeZoom;
			if(this.tileSize != null)
			options.tileSize = this.tileSize;
			if(this.subdomains != null)
			options.subdomains = this.subdomains;
			if(this.errorTileUrl != null)
			options.errorTileUrl = this.errorTileUrl;
			if(this.attribution != null)
			options.attribution = this.attribution;
			if(this.tms != null)
			options.tms = this.tms;
			if(this.noWrap != null)
			options.noWrap = this.noWrap;
			if(this.zoomOffset != null)
			options.zoomOffset = this.zoomOffset;
			if(this.zoomReverse != null)
			options.zoomReverse = this.zoomReverse;
			if(this.opacity != null)
			options.opacity = this.opacity;
			if(this.zIndex != null)
			options.zIndex = this.zIndex;
			if(this.updateWhenIdle != null)
			options.updateWhenIdle = this.updateWhenIdle;
			if(this.detectRetina != null)
			options.detectRetina = this.detectRetina;
			if(this.bounds != null)
			options.bounds = this.bounds;
			if(this.crossOrigin != null)
			options.crossOrigin = this.crossOrigin;
			if(this.pane != null)
			options.pane = this.pane;
			if(this.className != null)
			options.className = this.className;
			if(this.keepBuffer != null)
			options.keepBuffer = this.keepBuffer;
			if(this.updateWhenZooming != null)
			options.updateWhenZooming = this.updateWhenZooming;	 
			if(this.updateInterval != null)
			options.updateInterval = this.updateInterval;
			if(this.minNativeZoom != null)
			options.minNativeZoom = this.minNativeZoom;
			
			return options;
		}
{% endhighlight %}

More details can be found in the github issue: <https://github.com/gwidgets/gwty-leaflet/issues/12>, and the commit:
   
<https://github.com/gwidgets/gwty-leaflet/commit/35a91a6eb2bcabd11f68fbfe6bd3bab26ce259f7>