---
id: 502
title: Securing a GWT app using Spring security
date: 2016-12-09T18:29:22+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=502
permalink: /2016/12/09/securing-a-gwt-app-using-spring-security/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
  - Spring
excerpt:   Spring security is one of the most used frameworks for securing java web applications. While it remains biased towards Servlets and server side java applications, it can also be used to secure single page applications like GWT based applications...
---
<p style="text-align:justify;">
  Spring security is one of the most used frameworks for securing java web applications. While it remains biased towards Servlets and server side java applications, it can also be used to secure single page applications like GWT based applications. In this post, we will go through an example of how to secure a GWT application using Spring Security.
</p>

</br>

####  **SPA vs Server Side:** 

<p style="text-align:justify;">
  The main difference between a single page application and a server side application is where the rendering and routing is done. A server side application in java makes use of Servlets (or JSPs) to render views, so a transition from one view to another is done through the server, which makes it possible to filter and check each view/context change. For a single page application, the rendering and the routing is done through a script which loaded only once, so there is no way for the server to know which route/view the user is in, unless explicitly done by the developer. Because of the asynchronous nature of Ajax, a SPA would not know what to do with a redirect response (HTTP 302), so it is up to the developer to manually handle redirects by changing the URL.
</p>

</br>

####  **Securing an SPA:** 

<p style="text-align:justify;">
  There are basically two ways to secure a single page application: either stateless or stateful authentication. In stateless authentication, the server does not keep track of the application state and no session is opened and maintained. This is common for applications where the server side is a Rest API. Stateless authentication can be done using OAuth or even HTTP basic authentication. In the stateful authentication, the server keeps track of the application state using a session. This done using cookies and HTTP headers. In the next example, we are going to implement stateful authentication to demonstrate how all this works.
</p>

</br>

####  **Example: securing a GWT application using Spring security** 

<p style="text-align:justify">
  In this example, we will secure the gwt-polymer-starter app which we are going to generate using the <a href="https://github.com/gwidgets/gwt-ui-archetypes">gwt-polymer-starter</a> archetype. We will use a maven project with one server side module and one client side module: gwt-spring-security-server, gwt-spring-security-client.
</p>

 **Prerequisites :** 

&#8211; GWT 2.8
  
&#8211; [net.ltgt.gwt.maven](https://github.com/tbroyer/gwt-maven-plugin) plugin for maven
  
&#8211; [Spring Security](http://projects.spring.io/spring-security/) 4.2 dependencies
  
&#8211; [Spring MVC](http://search.maven.org/#artifactdetails%7Corg.springframework%7Cspring-webmvc%7C4.3.4.RELEASE%7Cjar) 4.3.4

Before getting started, let&#8217;s do an inventory of the resources that we want to secure:

&#8211; GwtSpringSecurity.html is the page where our GWT app is loaded
  
&#8211; GwtSpringSecurity.nocache.js which is our GWT script
  
&#8211; in fact we want to secure all the GwtSpringSecurity directory which contains all our GWT genrated scripts.

<p style="text-align:justify;">
  We want to have a login page which, upon successful authentication, would redirect to our application, and in case a non authenticated user tries to access the GwtSpringSecurity.html page, he needs to be redirected to the login. Let&#8217;s configure security.
</p>

Spring security provides an easy mean for configuring security as a Java class by extending [WebSecurityConfigurerAdapter](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/config/annotation/web/configuration/WebSecurityConfigurerAdapter.html):

<pre class="brush: java">@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication().withUser("gwidgets").password("gwidgets").roles("ADMIN");
	}
	
	
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.
		authorizeRequests()
		.antMatchers("/GwtSpringSecurity.html", "/GwtSpringSecurity/**", "/user").authenticated()
		.and().formLogin().defaultSuccessUrl("/GwtSpringSecurity.html")
		.and()
		.logout().logoutUrl("/logout").logoutSuccessUrl("/login")
		.and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
	}

}
</pre>

</br>
  
 **Explanation:** 

<p style="text-align:justify;">
  In this configuration, we configured the resources that need authentication. We also told spring security that we are going to use its default login page so that we can have csrf protection for free, and where to redirect after a successful authentication. We also configured the logout endpoint.
</p>

<p style="text-align:justify;">
  Because our application is a demo, we used in memory authentication to store users details. This configuration can be customized to fit the application need. For example, it can be configured to retrieve user details from a directory or a database.
</p>

<p style="text-align:justify;">
  Finally, we have set our protection against cross-site request forgery (explanation of what csrf is can be found in <a href="https://docs.spring.io/spring-security/site/docs/current/reference/html/csrf.html">spring docs</a>) using <a href="http://docs.spring.io/autorepo/docs/spring-security/4.1.2.RELEASE/apidocs/org/springframework/security/web/csrf/CookieCsrfTokenRepository.html">CookieCsrfTokenRepository</a> because we want to be able to access the csrf token from our Javascript. Using JSPs and Servlets, the csrf token is set from the server side by Spring Security. From a GWT app, there is no way to acess the csrf token, as our app resides in the front end, so the solution is to use a cookie that can be accessed from our Javascript and sent as a header (the convention for the header is X-XSRF-TOKEN) with requests. The reason for calling the .withHttpOnlyFalse(), is that we want our csrf cookie to be accessed from Javascript
</p>

. We will see later on the use of the csrf cookie. 

That&#8217;s pretty much all what we need to configure security for our app. 

 **Displaying the current user on our GWT app :** 

<p style="text-align:justify;">
  Ideally, we would want our GWT app to display the name of the current logged in user. In order to so, we need to add an endpoint to retrieve the current user. Starting from version 3.2, Spring Security introduced a useful annotation that allows to bind the current user to a request mapping: <a href="http://docs.spring.io/spring-security/site/docs/3.2.1.RELEASE/apidocs/org/springframework/security/web/bind/annotation/AuthenticationPrincipal.html">@AuthenticationPrincipal</a>.
</p>

<pre class="brush: java">@Controller
public class AppController {
	@RequestMapping("/user")
	  public ResponseEntity user(@AuthenticationPrincipal User user) {	
	    return new ResponseEntity(user.getUsername(), HttpStatus.OK);
	  }
}
</pre>

From the client side, we are going to add a HTTP call to the /user end point:

<pre class="brush: java">RequestBuilder builder = new RequestBuilder(RequestBuilder.GET, "/user");
		
		try {
			  Request request = builder.sendRequest(null, new RequestCallback() {
			    public void onError(Request request, Throwable exception) {
			      
			    }

			    public void onResponseReceived(Request request, Response response) {
			      if (200 == response.getStatusCode()) {
			    	  currentUser.setInnerText(response.getText());
			      } 
			    }
			  });
			} catch (RequestException e) {
			  
			}

</pre>

</br>
  
 **The logout issue:** 

<p style="text-align:justify;">
  We defined our /logout endpoint that should be called ( both GET and POST are accepted by Spring Security) when we want to leave our application. When we try to log out by calling this endpoint , we get this message on the console :
</p>

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/12/InvalidCsrF.png" alt="InvalidCsrF" width="1134" height="30" class="aligncenter size-full wp-image-525" />](http://www.g-widgets.com/wp-content/uploads/2016/12/InvalidCsrF.png)

Because we did not include our csrf code with our request, Spring rejects it as a protection. Let&#8217;s inspect the cookies in the browser: 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/12/CookiesCsrF.png" alt="CookiesCsrF" width="1200" height="265" class="aligncenter size-full wp-image-526" />](http://www.g-widgets.com/wp-content/uploads/2016/12/CookiesCsrF.png)

In addition to the JSESSIONID which is used to keep track of the session, there is an XSRF-TOKEN cookie which contains the token to be submited with our logout request as a header. Now we need to adjust our request to include this code in a header named X-XSRF-TOKEN. 

<pre class="brush: java">RequestBuilder builder = new RequestBuilder(RequestBuilder.POST, "/logout");
	            	String crsfCookie = Cookies.getCookie("XSRF-TOKEN");
	            	builder.setHeader("X-XSRF-TOKEN", crsfCookie);

</pre>

We have resolved the csrf token issue, but there is still another issue that arises when the /logout endpoint is called: our javascript does not know how to handle a 302 HTTP status which literally means redirect towards the /login page. As a result, we are still on the same page, even after clicking on the logout, as shown here in Chrome console: 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/12/LogoutRedirect.png" alt="LogoutRedirect" width="1289" height="181" class="aligncenter size-full wp-image-527" />](http://www.g-widgets.com/wp-content/uploads/2016/12/LogoutRedirect.png)

<p style="text-align:justify;">
  We have received a 302 status for redirecting, in addition to the login page as text/html, but javascript would not know what to do with such a response unless explicitely specified by the developper. The workaround for this issue is to manually change the url to /login when receiving the 302, something like:
</p>

<pre class="brush: java">Window.Location.replace("/login");
</pre>

</br>
  
 **Final thoughts:** 

<p style="text-align:justify;">
  We have seen how to provide basic security to a GWT application using Spring Security. Compared to other JavaScript frameworks like Angular Js, GWT generates everything from one script, so it would be meaningless trying to check security after each route change because in any case the app script is already (down)loaded in the browser, unlike Angular Js which can have page parts as different .html and .js files.<br /> In this post, we explored stateful authentication which makes use sessions and cookies to keep track of the current state of the application. We have also seen how to workaround the csrf issue that can arise for a GWT app and for single page applications in general. We will explore stateless application in future posts.
</p>

 **Links:** 

source code: <https://github.com/zak905/gwt-spring-security>
  
Intersting video from SpringOne about new features in Spring 4.1: <https://www.youtube.com/watch?v=H94Wbd8ARKM&t=3009s>
  
How to use Spring Security with Angular Js: <https://spring.io/guides/tutorials/spring-security-and-angular-js/>