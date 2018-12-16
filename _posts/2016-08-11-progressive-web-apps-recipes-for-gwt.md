---
id_disqus: 301
title: Progressive Web apps recipes for GWT
date: 2016-08-11T09:03:55+00:00
author: blogger
layout: post
permalink: /2016/08/11/progressive-web-apps-recipes-for-gwt/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
  - Web Components
excerpt:  If you have been designing or developing web applications for a while, you would have probably came across the term Progressive Web application a tons of times, and will probably do so for the coming years. You probably wondered what exactly is the definition of PWAs, how we identify one...
---
## Progressive or not progressive&#8230;

  If you have been designing or developing web applications for a while, you would have probably came across the term Progressive Web application a tons of times, and will probably do so for the coming years. You probably wondered what exactly is the definition of PWAs, how we identify one, and how we build one. According to the dictionary, the term progressive refers to something that improves or gets better, but how would that relate to a web application ? We really don&#8217;t know. PWAs seems like a buzz word invented by Google to get people&#8217;s interest, and does not really relates to what the PWAs really are. PWAs have been defined by <a href="https://twitter.com/slightlylate">Alex Russel</a> as &#8220;Web sites that took the right vitamins&#8221;. For the sake of simplicity let&#8217;s start by saying that PWAs are web applications that are optimized to fit in their environment: they can play the role of mobile native apps when on mobile or tablet, and the role of regular web apps when on PC.

## The rationale behind PWAs:

  PWAs are an alternative to having a regular web application plus a bundled application for different mobile platforms. Maintaining and upgrading all of these can be costly especially if the application is changing frequently. With PWAs, there is only one application that works for all platforms which is accessible from a link in a browser. PWAs are meant to be designed using a Mobile first approach. They can be installed, but they also work well as regular websites. Google have created a dedicated <a href="https://developers.google.com/web/progressive-web-apps">web site</a> to PWAs and presents different cases of companies who gained from converting their applications/website to a PWA.

## Charachteristics of PWAs:

  In one of his <a href="https://www.youtube.com/watch?v=g7f1Az5fxgU">talks</a>, <a href="https://twitter.com/rob_dodson">Rob Dodson</a>, a developer advocate at Google, highlighted the different characteristics of a Web app:<br /> &#8211; Responsive: adapts to devices<br /> &#8211; Load fast: optimized to paint or render fast<br /> &#8211; Work Offline: use service workers for caching content to allow using the app offline or with slow network connectivity<br /> &#8211; Installable: application can be installed in the home screen (like a native app)<br /> &#8211; Engaging: keep the user informed using push notifications

Now that we know what a progressive web app looks like, we can start looking into different tools that can help us make our GWT app progressive.

## GWT Recipes for PWAs:

- #### #1 Reponsive:

  
  <p style="text-align: justify;">
    To make your GWT application responsive, there are several options for GWT users. If you have design skills, you can make your application responsive using custom code and CSS. Otherwise, you can rely on other frameworks. Bootstrap for GWT (<a href="https://github.com/gwtbootstrap3/gwtbootstrap3">https://github.com/gwtbootstrap3/gwtbootstrap3</a>) is the first thing that comes to mind. It provides all the components of the famous Twitter framework. Another alternative is GWTMaterialDesign (<a href="https://github.com/GwtMaterialDesign/gwt-material">https://github.com/GwtMaterialDesign/gwt-material</a>). It provides repsonsive material design ready to use elements for your application. Finally, <a href="https://github.com/vaadin/gwt-polymer-elements">gwt-polymer-element</a>, which is the Polymer wrapper for GWT, provides also ready to use responsive web components, and can come handy in designing building a reponsive application. We have provided a beginners guide to Polymer in one of our previous posts.
  </p>
  
- #### #2 Load Fast:
  
  <p style="text-align: justify;">
    To reduce the time to the first paint, there are a number of things that can be done. First of all, <a href="http://www.gwtproject.org/doc/latest/DevGuideCodeSplitting.html">code splitting</a> can be used to reduce the size of the gwt module file. It basically splits the module into fragments allowing the GWT module to download only the needed ones on startup. Second, the app shell method, as specified by PWAs <a href="https://developers.google.com/web/fundamentals/getting-started/your-first-progressive-web-app/step-01?hl=en">guidelines</a>, can be applied to a GWT app. This can be done by taking out static elements and data from the application Java code and putting them directly into the .html entry point. For example:
  </p>
  
  <p>
    A common practice that GWT users do is to have the body of the .html empty and to add their views programmatically from the application:
  </p>
  
   <div>
    {% highlight html  %}
    <body>  
    </body>
    {% endhighlight %}
    
    {% highlight java  %}
    //....

    AppMainView view = AppMainView();

    RootPanel.get().add(view);
    {% endhighlight %}
  
  <p style="text-align: justify;">
    While there is nothing wrong with this practice, it can slow down the application loading time because the .js module file will have more instructions, and thus it will take more time to execute. As a remedy, we can try to identify all the static elements in our views and put them into the .html, and then we can load individual views from our entry point:
  </p>
  

    {% highlight html  %}
    <div id="appShell"><img src="logo.png" alt="" />
    <div id="menu"></div>
    <div id="mainContent"></div>
    {% endhighlight %}
    
    {% highlight java  %}
    //...
    MenuView menu = new MenuMeview();
    ContentView content = new ContentView();

    RootPanel.get("menu").add(menu);
    RootPanel.get("mainContent").add(content);
    {% endhighlight %}


This is off course a simplified example for illustration purposes. We have seen so far how code splitting and the app shell can reduce the time to render the application. There is also the async script attribute of HTML5, which is not really specific to GWT. For example:
  
    {% highlight html %}
    <script src="polymerstarter/polymerstarter.nocache.js" async="" type="text/javascript"> </script>
    {% endhighlight %}
  
  <p style="text-align: justify;">
    This would instruct the browser not to block the parsing, and to load our app script as soon as it is available.
  </p>
  
  <p>
    Another option would be to put the application script inside the body.<br />
  </p>
  
  - #### #3 Work Offline:
  
  <p style="text-align: justify;">
    This can be done mainly using service workers. There are no official GWT libraries for interacting with service workers. Even gwt-polymer-elements does not wrap Platinum Elements, which are the Polymer elements meant to interact with the browser&#8217;s service workers. GWT users will have to write some Javascript manually to implement the caching mechanism for the application&#8217;s assets. JSNI or Jsinterop can be used to interact with the browser and call for service workers services. The service worker script that defines caching events needs to be on a separate script so, for now, it is kind of complicated to mix in both the service worker code and GWT app module code in the same .js file. The only task that can be done from GWT is registering the service worker. We will demonstrate that later in the next section. Please also note that service workers are not available on all browsers, you can find more details on that in Mozilla&#8217;s API doc <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API">page.</a>
  </p>
  
  <p style="text-align: justify;">
    For more details about how to cache application data and assets using service workers, Google provides some useful <a href="https://developers.google.com/web/fundamentals/getting-started/your-first-progressive-web-app/step-04?hl=en">guidelines.</a>
  </p>
  
  - #### #4 Intstallable:
  
  <p style="text-align: justify;">
    This receipe is also not specific to GWT. To make a web application installable, you need to add a json file called app manifest and link it to the .html entry point:
  </p>
  
{% highlight html  %}
  	<link rel="manifest" href="manifest.json">
{% endhighlight %}
  
  <p style="text-align: justify;">
    For guidelines on how to write the manifest file you can refer to W3C&#8217;s guidelines: <a href="https://www.w3.org/TR/appmanifest/">https://www.w3.org/TR/appmanifest/</a>. You can also use this online tool: <a href="http://brucelawson.github.io/manifest/">http://brucelawson.github.io/manifest/</a> which generates your manifest for you, but your application need to be already online. You can either use a banner to ask the user to install the application or let him do it manually from the browser&#8217;s options.
  </p>
  
  <p>
    <img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/08/download.jpg" alt="" width="259" height="144" class="aligncenter size-full wp-image-344" />
  </p>
  
  - #### #5 Engaging:

  
  <p style="text-align: justify;">
    Once again there is no official push notification library for GWT. This may be a call to the GWT community to fill in this gap. Until then, GWT users can use either JSNI or Jsinterop to interact with the browser and subscribe to push notifications.
  </p>

## Demo application 

<p style="text-align: justify;">
  To illustrate the characteristics above, we built a map application using gwt-polymer-elements and <a href="https://github.com/gwidgets/gwty-leaflet">gwty-leaflet</a>. The application displays the favorite maps of the user.
</p>

source: <https://github.com/gwidgets/gwt-pwa-demo> 
  
live: [https://gwt-pwa-demo.herokuapp.com/pwademo.html/](https://gwt-pwa-demo.herokuapp.com/pwademo.html)

using Polymer our application is responsive by default, so this step is done. 

<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/08/normalscreen.png" alt="" width="500" height="300" class="alignnone size-full wp-image-357" />

<img src="http://www.g-widgets.com/wp-content/uploads/2016/08/Screenshot_٢٠١٦-٠٨-١٠-١٦-١٧-٢٠.png" alt="" width="250" height="250" class="alignnone size-full wp-image-341" />

To make the application load fast we first of all took off all the static html and we put into the .html entry point file: <https://github.com/gwidgets/gwt-pwa-demo/blob/master/src/main/webapp/pwademo.html>

<p style="text-align: justify;">
  We used Polymer elemental to interact with the dom elements. For example:
</p>

{% highlight java  %}
PaperMenuLEement paperMenu = (PaperMenuElement) Polymer.getDocument().getElementById("paperMenu");
  paperMenu.select("paris");
{% endhighlight %}

We also made our app script load asynchronously: 

<pre class="brush: xml"><script type="text/javascript" language="javascript" src="pwademo/pwademo.nocache.js" async></script></pre>

<p style="text-align: justify;">
  and we introduced some code splitting because we only have one map per section, so we only need to load the map on the section displayed when the page is loaded.
</p>

{% highlight java  %}
loadStartupMap();
		//Maps are not loaded on start up, but only when iron selector selects a new map
ironPages.addEventListener("iron-select", e -> {
			 
	if(ironPages.getSelected().equals("london") && !londonMapInitialized){
				
				//Some code splitting to reduce initial module size
	  GWT.runAsync(new RunAsyncCallback(){
		@Override
		public void onFailure(Throwable reason) {
	Document.get().getElementById("londonMap").setInnerHTML("Could not load this map, please try again later");
					}
		@Override
		public void onSuccess() {
		Maps.initializeLondonMap();	
				}});
		londonMapInitialized = true;
			}
});
{% endhighlight %}

<p style="text-align: justify;">
  We have also added an application manifest to allow the application to be installed manually
</p>

{% highlight js %}
{
  "name": "Favorite Maps PWA",
  "short_name": "Favorite Maps PWA",
  "icons": [{
        "src": "image/mapicon.png",
        "sizes": "144x144",
        "type": "image/png"
      }],
  "start_url": "/pwademo.html",
  "display": "standalone",
  "background_color": "#3E4EB8",
  "theme_color": "#2E3AA1"
}
{% endhighlight %}

<p style="text-align: justify;">
  Finally, we have added JsInterop classes to register the service worker.
</p>

{% highlight java  %}
if (Navigator.serviceWorker != null) {
			Navigator.serviceWorker.register("sw.js")
					.then(new Function<JavaScriptObject, JavaScriptObject>() {
						@Override
						public JavaScriptObject call(JavaScriptObject arg) {
							GWT.log("registred service worker successfully");
							return null;
						}
					});
} else {

	GWT.log("service worker unavailable in this browser");

}
{% endhighlight %}

and we created a service worker script called sw.js and added it to the application&#8217;s resources.

{% highlight js %}
var cacheName = 'GWT-PWA';  
var filesToCache = [  
                     '/gwt-pwa/pwademo.html',  
                     '/gwt-pwa/pwademo.css',  
                     '/gwt-pwa/styles/app-theme.html',  
                     '/gwt-pwa/styles/shared-styles.html',  
                     '/gwt-pwa/leaflet/leaflet.js',  
                     '/gwt-pwa/leaflet/leaflet.css',
                     '/gwt-pwa/image/mapicon.png',
                      '/gwt-pwa/pwademo/pwademo.nocache.js'];

self.addEventListener('install', function(e) {  
  console.log('[ServiceWorker] Install');  
  e.waitUntil(  
    caches.open(cacheName).then(function(cache) {  
      console.log('[ServiceWorker] Caching app shell');  
      return cache.addAll(filesToCache);  
    })  
  );  
});


self.addEventListener('activate', function(e) {  
	  console.log('[ServiceWorker] Activate');  
	  e.waitUntil(  
	    caches.keys().then(function(keyList) {  
	      return Promise.all(keyList.map(function(key) {  
	        console.log('[ServiceWorker] Removing old cache', key);  
	        if (key !== cacheName) {  
	          return caches.delete(key);  
	        }  
	      }));  
	    })  
	  );  
	});

self.addEventListener('fetch', function(e) {  
	  console.log('[ServiceWorker] Fetch', e.request.url);  
	  e.respondWith(  
	    caches.match(e.request).then(function(response) {  
	      return response || fetch(e.request);  
	    })  
	  );  
	});
{% endhighlight %}

the script installs and activates the service worker. It also allows the service worker to subscribe to the fetch event which triggered on each request for a resource. Based on its current state, the service worker decides then whether to use the local cache or to fetch the resource from the network.

After loading the application, we can find our assets in the cache storage in Google chrome: 

![Alt](https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/08/cacheChrome.png)

if we disable the network on Google Chrome and try to run the application, we get something like (Map is not rendering because it is not cached): 

<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/08/noNetwork.png" alt="" width="1257" height="558" class="alignnone size-full wp-image-345" />

The application is serving even without network. If we take a look a the network requests in Chrome dev tools, we notice that the app resources are being served from the service worker:

<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/08/sw-devtools.png" alt="sw-devtools" width="1345" height="409" class="aligncenter size-full wp-image-385" />

<p style="text-align: justify;">
  As this is a demo application we did not add any push notification because it requires the setup of a push server.
</p>

We have installed the application to home screen from an Android phone, and we got something like: 

<div style="display:flex;">
  <div>
    <img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/08/Screenshot_٢٠١٦-٠٨-١٠-١٦-١٨-٣٨.png" alt="" width="250" height="250" class="alignnone wp-image-342" />
  </div>
  
  <div>
    <img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/08/Screenshot_٢٠١٦-٠٨-١٠-١٦-١٧-١٢.png" alt="" width="200" height="200" class="alignnone wp-image-340" />
  </div>
</div>

## Conclusion 

<p style="text-align: justify;">
  PWAs are still something new in the web developement world. Some predict that they will take over native apps in the coming years. We know that GWT developers have been using <a href="http://phonegap.com/">Phonegap</a> to convert their web application to a mobile native app, and maybe with the PWAs they will not have to do so anymore. We have seen in this tutorial how GWT can be used to build a PWA, using libraries such as Polymer. There so far are no GWT libraries to interact with the browser service workers, so this gap needs to be filled by the GWT community.
</p>

## Interesting links: 

[Addy Osmani](https://twitter.com/addyosmani) beginner&#8217;s guide: <https://addyosmani.com/blog/getting-started-with-progressive-web-apps/>

2016 Spring IO talk about PWAs and Spring Boot: <https://www.youtube.com/watch?v=zAZQeQ0CRpQ>

A summary infographic of PWAs use cases from <https://skilled.co/>, a web development online agency: <a href="https://skilled.co/resources/business-need-progressive-web-app-infographic/" target="_blank" title="Does Your Business Need Progressive Web App? [Infographic]"></a>  presented by <a href="https://skilled.co/" target="_blank" title="Skilled.co">Skilled.co</a>