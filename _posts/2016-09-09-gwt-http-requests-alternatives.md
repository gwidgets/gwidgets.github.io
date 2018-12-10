---
id: 408
title: GWT HTTP requests alternatives
date: 2016-09-09T21:46:47+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=408
permalink: /2016/09/09/gwt-http-requests-alternatives/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt: For several reasons, many GWT users ditched the RPC mechanism which is the standard way offered by GWT to call the backend. They found themseleves lost between GWT RequestBuilder and other external librairies which may or may not fit their application model...
---
<p style="text-align: justify;" >
  For <a href="http://blog.daniel-kurka.de/2016/07/gwt-rpcs-future.html">several reasons</a>, many GWT users ditched the RPC mechanism which is the standard way offered by GWT to call the backend. They found themseleves lost between GWT <a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/http/client/RequestBuilder.html">RequestBuilder </a>and other external librairies which may or may not fit their application model. The objective of this post is to go through the well known HTTP/Rest libraries in GWT in an attempt to make the picture more clear. The libraries that we will test during this post are: <a href="http://www.gwtproject.org/doc/latest/DevGuideServerCommunication.html#DevGuideHttpRequests">RequestBuilder</a>(part of GWT), <a href="https://github.com/resty-gwt">RestyGwt</a>, <a href="https://github.com/intendia-oss/autorest-gwt">autorest-gwt</a>, and finally Native <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XMLHttpRequest</a> (JsInterop).
</p>

####  **RequestBuilder** 

<p style="text-align: justify;" >
  RequestBuilder is the first thing that comes to mind. It is part of the core GWT classes and allows building and executing HTTP calls. RequestBuilder&#8217;s implementation makes use of JSNI to call the native XMLHttpRequest in the browser. The shortcoming of RequestBuilder is processing the data. It is entirely left to the user which requires additional work, and may require the use of additional libraries such as gwt-jackson.
</p>

{% highlight java  %}
RequestBuilder request = new RequestBuilder(RequestBuilder.GET, "http://localhost:8085/guest");
				        
   try {
      request.sendRequest(null, new RequestCallback(){
	@Override
	public void onResponseReceived(Request request, Response response) {
									
	  GWT.log(response.getText());

	 // You get the response as a String so more processing required to convert/extract data
	  }

	@Override
	public void onError(Request request, Throwable exception) {
									
	  }
	});
								
	} catch (RequestException e) {
           e.printStackTrace();
	}
{% endhighlight %}


####  **RestyGwt** 

<p style="text-align: justify;" >
  RestyGWT is a more comprehensive solution since it offers the ability to send and receive Objects which seems like a good replacement for RPC. RestyGwt works in the same fashion as RPC: the developer defines interfaces that are generated at compile time using deferred binding. It is one of the most popular GWT projects on Github. RestyGWT offers also several handy features such as Dispatchers, JSONP handling, custom annotations, and many more. If the developer wants to do without the boilerplate of creating interfaces, RestyGWT offers a way to call HTTP end points straight away, but without Json serialization/deserialization. An example of simple RestyGwt usage would be:
</p>

{% highlight java  %}
public interface GuestService extends RestService {
	
	@Path("http://localhost:8085/guest")
	@GET
	public void get(MethodCallback<List<Guest> callback);

}

 public void onModuleLoad() {

        GuestService service = GWT.create(GuestService.class);

        service.get(new MethodCallback<List<Guest>>(){

	@Override
        public void onFailure(Method method, Throwable exception) {
		GWT.log("Request Failed");
								
	}

	@Override
	public void onSuccess(Method method, List<Guest> response) {
	       response.forEach((g) -> {GWT.log(g.roomNumber);});
								
	 }
				       
         });
 }
{% endhighlight %}

<p style="text-align: justify;" >
  The cons of RestyGwt is that it relies on Generators which will not be present in the next GWT 3.0 release. There is no indicator that GWT 2.8.0 will be discontinued at that time, but it is sure that developers willing to upgrade to 3.0 will have to do without RestyGwt, at least for while.
</p>

####  **autorest-gwt** 

<p style="text-align: justify;" >
  autorest-gwt is an interesting project that makes use of new paradigms such as streams to generate Rest services interfaces. autorest-gwt is based on <a href="https://github.com/intendia-oss/rxjava-gwt">rxjava-gwt</a> which is the adaptation of <a href="https://github.com/ReactiveX/RxJava">RxJava</a> to GWT. To tackle the asynchronous aspect of HTTP calls, autorest-gwt uses <a href="https://github.com/intendia-oss/rxjava-gwt/blob/master/src/main/super/rx/super/rx/Observable.java">Observable</a>, which is an Object to which you can subscribe and as soon as the result is ready, it will notify you. AutoRest makes also use of JsInterop to serizalize/deserialize objects as from/to Java/Js objects. This method is advantageous in the way that it does not rely on any external library, however, there are some limitations to the Objects that you can serialize (<a href="http://www.g-widgets.com/2016/08/25/serializingdeserializing-json-in-gwt/">JSON serialization in GWT</a> post talks in more details about these limitations). Another advantage of autorest-gwt is that it uses Annotation processors (instead of Generators), which make the library more viable for the future.
</p>

{% highlight java  %}
@AutoRestGwt @Path("guest") 
 interface GuestService2 {
        @GET Observable<Guest> get();
      }

    static ResourceVisitor osm() { return new RequestResourceBuilder().path("http://localhost:8085/"); }

     public void onModuleLoad() {
         GuestService2 gs = new GuestService2_RestServiceModel(() -> osm());
	   gs.get().subscribe(n -> {
	      GWT.log(n.guestId+"");
	   });
        }
{% endhighlight %}

<p style="text-align: justify;" >
  autorest-gwt is still a young project though. It is in its 0.x versions(4 releases so far), and it still needs some time to reach maturity. autorest-gwt also introduces some boiler plate code, but it remains manageable.
</p>

####  **Native XMLHttpRequest (JsInterop)** 

<p style="text-align: justify;" >
  In GWT client side, all the previous libraries boil down to the native XMLHttpRequest, the only thing that makes a difference is how XMLHttpRequest is wrapped.
</p>

<p style="text-align: justify;" >
  Since the introduction of JsInterop, things can be done differently. The developer can make use of native browser functions as if they are Java classes. Using native XMLHttpRequest directly is also an alternative for making HTTP calls from GWT client side. This method is a bit low level, but it definitely allows the developer to gain control over all aspects of requests/responses. For example, Suppose you want to set a response type as a blob, or specify your request type as synchronous because of a special requirement, you have no way of doing so using the previous libraries because you are tied their interfaces. To handle the asynchronous aspect of HTTP, a <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a> can be used which is the natural way for specifying actions to be taken when requests resolve in Javascript. There is for sure more work on the serialization/deserialization of payloads and response objects, but this method allows freedom on every aspect of the HTTP request. For example:
</p>

{% highlight java  %}
//Implemented using JsInterop, can also be used from Elemental 2 
 	private final XMLHttpRequest nativeRequest = new XMLHttpRequest();
    
    //false means that the request is synchronous which can not be done in other librairies
 	nativeRequest.open("GET", "http://localhost:8085/guest", false);

    // there are other events such as progress, abort that are not available in other librairies
 	nativeRequest.addEventListener("load", new Function() {
	@Override
	public Object call(JavaScriptObject event) {

	     GWT.log(nativeRequest.responseText);
						
		return null;
		}
		  });

 	nativeRequest.send(); 
{% endhighlight %}

####  **Others** 

<p style="text-align: justify;" >
  There are other librairies that have not been covered such as <a href="https://github.com/gwtquery/gwtquery">GwtQuery</a>&#8216;s Ajax which is in reality just an interface on the top of XMLHttpRequest, and <a href="https://github.com/ArcBees/GWTP">GWTP</a>&#8216;s <a href="http://dev.arcbees.com/gwtp/communication/">RestDispatch</a> which relies on GIN and which seems to be more suited for applications making use of GWTP.
</p>

####  **Wrap-up** 

<table style="font-size: 14px; border: gray solid 1px; border-collapse: collapse; text-align: center; width: auto; background: #ececec;">
  <tr>
    <th>
      Library
    </th>
    
    <th>
      Current Version
    </th>
    
    <th>
      Pros
    </th>
    
    <th>
      Cons
    </th>
  </tr>
  
  <tr>
    <td>
      Request Builder
    </td>
    
    <td>
      N/A
    </td>
    
    <td>
      &#8211; core GWT library<br /> &#8211; no boilerplate, simple
    </td>
    
    <td>
      &#8211; serialization / deserialization of data has to be done by the developer, only String response / payload is available
    </td>
  </tr>
  
  <tr>
    <td>
      RestyGWT
    </td>
    
    <td>
      2.2.0
    </td>
    
    <td>
      &#8211; serialization / deserialization out of the box<br /> &#8211; Useful features: Dispatchers, JsonP, Handlers&#8230;
    </td>
    
    <td>
      &#8211; Based on Generators<br /> &#8211; issues related to Generics ( more details on <a href="https://github.com/resty-gwt/resty-gwt/issues">Github</a>)
    </td>
  </tr>
  
  <tr>
    <td>
      AutoRest
    </td>
    
    <td>
      0.4
    </td>
    
    <td>
      &#8211; Uses annotation processors<br /> &#8211; Uses Observables (can be a disadvantage as well)
    </td>
    
    <td>
      &#8211; Boilerplate<br /> &#8211; Young project, not mature enough<br /> &#8211; tied to rxjava-gwt
    </td>
  </tr>
  
  <tr>
    <td>
      Native XmlHttpRequest ( JsInterop)
    </td>
    
    <td>
      N/A
    </td>
    
    <td>
      &#8211; Allows custom implementation<br /> &#8211; Allows access to low level API options
    </td>
    
    <td>
      &#8211; needs knowledge of the Javascript API<br /> &#8211; processing responses/payloads needs to be done manually
    </td>
  </tr>
</table>

####  **Future insight** 

<p style="text-align: justify;" >
  HTTP requests is something indispensable for modern web applications, so GWT project needs to provide its users with a solid and effortless standard mechanism for calling HTTP services. Currently, GWT users are in a dilemna between which library is useful and which one will be a viable choice for the future GWT 3.0 release. For now, GWT developers are better off using native XmlHttpRequest and JsInterop because it is the method that provides the best control over request options. GWT developers can create their own reusable interfaces, and maybe a pattern will emerge in the future. Other frameworks remain fancy choices for the ones who want to get things up and running quickly. GWT contributors can maybe get some inspiration from projects such as <a href="http://www.grpc.io/docs/guides/"> gRPC </a> to design the next GWT &#8220;RPC&#8221; mechanism.
</p>