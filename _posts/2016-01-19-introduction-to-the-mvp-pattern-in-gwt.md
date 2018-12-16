---
id_disqus: 235
title: 'Introduction to the MVP pattern: a GWT example'
date: 2016-01-19T19:50:47+00:00
author: blogger
layout: post
permalink: /2016/01/19/introduction-to-the-mvp-pattern-in-gwt/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:   The MVP ( Model &#8211; View &#8211; Presenter) pattern can be seen as as an evolution or advanced form of the MVC (Model-View-Controller) pattern. It may not be easy to grasp from a programmatical point view at the begining, but the theory is pretty clear. To provide a better explanation of the MVP pattern, let&#8217;s compare it and contrast it with MVC...

---
<div dir="ltr" style="text-align: left;" trbidi="on">
  <div class="separator" style="clear: both; text-align: center;">
    <a href="http://1.bp.blogspot.com/-8751o9FiHdE/Vp1V7xzOz7I/AAAAAAAAAtk/GAfrW9lvT2U/s1600/mvp.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="171" src="http://1.bp.blogspot.com/-8751o9FiHdE/Vp1V7xzOz7I/AAAAAAAAAtk/GAfrW9lvT2U/s320/mvp.png" width="320" /></a>
  </div>
  
  <p>
    The MVP ( Model &#8211; View &#8211; Presenter) pattern can be seen as as an evolution or advanced form of the MVC (Model-View-Controller) pattern. It may not be easy to grasp from a programmatical point view at the begining, but the theory is pretty clear. To provide a better explanation of the MVP pattern, let&#8217;s compare it and contrast it with MVC.<br /> MVC allows decoupling the user interface components from the model. It uses the controller to switch from a view to another and to respond to events such as changing context, posting a form,..etc. However, The view can directly invoke functionalities from the model such as checking a value from the database or making a calculation. &nbsp;the view in MVP does not. &nbsp;MVP takes away the intelligence from the View and adds it to the controller which makes a Presenter. The view is completely passive and every interaction of the view with the model is done through the Presenter. Many argue that the main reason for using MVP over MVC is testability. By removing intelligence or business logic from the view, we reduce risk associated with not testing the view. Usually, unit tests are only applied to business logic and the model. So, MVP seems to be convenient for UI oriented applications such as the ones that are based on GWT.<br /> In this tutorial, we will go through an example of basic MVP pattern in a GWT application. Our application has two views: a login page and a main page. Upon successful login, the user is directed to the main page, &nbsp;and on logout the user goes back to the login page.
  </p>
  
  <p>
    Requirements: Eclipse, GWT plugin.
  </p>
  
  <p>
    The application structure looks something like:
  </p>
  
  <div class="separator" style="clear: both; text-align: center;">
    <a href="http://1.bp.blogspot.com/-Im0IojRrsUw/Vp1Z4cLn4SI/AAAAAAAAAtw/_Zoo5oBlndY/s1600/MVP-structure.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="320" src="http://1.bp.blogspot.com/-Im0IojRrsUw/Vp1Z4cLn4SI/AAAAAAAAAtw/_Zoo5oBlndY/s320/MVP-structure.png" width="199" /></a>
  </div>
  
  <p>
    Let&#8217;s start by implementing our views.
  </p>
  
  <p>
    LoginView.java
  </p>
  
  <p>
  </p>
  
{% highlight java  %}

public class LoginView implements HasWidgets{
 HorizontalPanel container;
 Label loginLabel;
 Label passwordLabel;
 TextBox loginField;
 PasswordTextBox passwordField;
 Button loginButton;

 
 public LoginView(){
  container = new HorizontalPanel();
  loginField = new TextBox();
  loginButton = new Button("Login");
  passwordField = new PasswordTextBox();
  loginLabel = new Label("Login");
  passwordLabel = new Label("Password");
  
  container.add(loginLabel);
  container.add(loginField);
  container.add(passwordLabel);
  container.add(passwordField);
  container.add(loginButton);
 }

 @Override
 public Widget asWidget() {
  return container;
 }

 @Override
 public void add(Widget w) {
  container.add(w);
 }

 @Override
 public void clear() {
  container.clear();
 }

 @Override
 public Iterator&lt;widget&gt; iterator() {
  return container.iterator();
 }

 @Override
 public boolean remove(Widget w) {
  return container.remove(w);
 }
}
{% endhighlight %}
  
  <p>
    MainPageView.java
  </p>
  

{% highlight java  %}
public class MainPageView implements HasWidgets {

 VerticalPanel container;
 HorizontalPanel leftPanel;
 HorizontalPanel rightPanel;
 Button logout;

 @Override
 public HasClickHandlers getLogoutButton() {
  return logout;
 }
 
 public MainPageView(){
  leftPanel = new HorizontalPanel();
  rightPanel = new HorizontalPanel();
  container = new VerticalPanel();
  logout = new Button("Logout");
  container.add(logout);
  container.add(leftPanel);
  container.add(rightPanel);
 }

 @Override
 public Widget asWidget() {
  return container;
 }
 

 @Override
 public void add(Widget w) {
  container.add(w);
 }

 @Override
 public void clear() {
  container.clear();
 }

 @Override
 public Iterator&lt;widget&gt; iterator() {
  return container.iterator();
 }

 @Override
 public boolean remove(Widget w) {
  return container.remove(w);
 }

 @Override
 public Button getButton() {
  return logout;
 }
}
{% endhighlight %}

  <p>
    Notice that the views are only UI components and do no contain any business logic.
  </p>
  
  <p>
    Next, we need to build our presenters which will control the behavior and interactions of our views.<br /> &nbsp;LoginPresenter.java
  </p>

{% highlight java  %}
public class LoginPresenter {
 public interface Display{
  HasClickHandlers getLoginButton();
  Widget asWidget();
  LoginView getViewInstance();
 }
 //event bus used to register events
 final HandlerManager eventBus;
 final Display view;
 
 public LoginPresenter(Display view, HandlerManager eventBus){
  this.eventBus = eventBus;
  this.view = view;
 }
 
 
 public void bindEvents(){
  view.getLoginButton().addClickHandler(new ClickHandler(){
   @Override
   public void onClick(ClickEvent event) {
    // trigger event using eventBus
    eventBus.fireEvent(new LoginEvent());
               
   }
  });
 }
 
 
 public void go(final HasWidgets container){
       bindEvents();
       container.clear();
       container.add(view.getViewInstance().asWidget());
 }
 
     public Display getView(){
       return view;
     }

}
{% endhighlight %}
  
  <p>
    MainPagePresenter.java
  </p>
  
{% highlight java  %}

public class MainPagePresenter {
 public interface Display{
  HasClickHandlers getLogoutButton(); 
  Widget asWidget();
  MainPageView getViewInstance();
  Button getButton();
 }
 
 final Display display;
 final HandlerManager eventBus;
 
 public MainPagePresenter(Display display, HandlerManager eventBus){
  this.display = display;
  this.eventBus = eventBus;
 }
 
 public void init(){
  display.getLogoutButton().addClickHandler(new ClickHandler(){
   @Override
   public void onClick(ClickEvent event) {
    // use the event bus to trigger the event
    eventBus.fireEvent(new LogoutEvent());
   }
  });
 }
 
 public void go(final HasWidgets container){
  init();
  container.clear();
  container.add(display.asWidget());
  
 }
 
 
 public Display getView(){
  
  return display;
 }
 
}
{% endhighlight %}
  
  <p>
    Notice that both presenters have an interface called Display. This interface needs to be implemented by the view to allow the Presenter to access components of the view. This interface serves as the communication layer between the Presenter and the View. We are going to make each view implements the Display interface of its presenter :
  </p>
  
  <p>
  </p>
  
{% highlight java  %}
public class LoginView implements HasWidgets, LoginPresenter.Display {
    //...other methods
 @Override
 public HasClickHandlers getLoginButton() {
                //return button to implement its events in the Presenter
  return loginButton;
 }

         @Override
 public LoginView getViewInstance() {
  return this;
 }

         @Override
 public Widget asWidget() {
  return container;
 }

}
{% endhighlight %}
  
{% highlight java  %}
public class MainPageView implements HasWidgets, MainPagePresenter.Display {
        //...other methods
 @Override
 public  MainPageView getViewInstance(){
  
  if(instance == null)
   return new MainPageView();
  else
   return instance;
 }

   @Override
 public HasClickHandlers getLogoutButton() {
  return logout;
 }

}
{% endhighlight %}
  
  <p>
    Finally, we need to implement the AppController, which is the application supervisor. It handles all events, and context changes. The AppController is also used to instantiate the application.
  </p>
  
  <p>
  </p>
  
{% highlight java  %}
public class AppController {
 HandlerManager eventBus;
 LoginPresenter loginPage;
 HasWidgets container;
 
 public AppController(HandlerManager manager){
  this.eventBus = manager;
  loginPage = new LoginPresenter(new LoginView(), eventBus);
  bindEvents();
 }
 public void bindEvents(){
  eventBus.addHandler(LoginEvent.TYPE, new LoginEventHandler(){
   @Override
   public void onLogin(LoginEvent event) {
    // TODO Auto-generated method stub
    //if login successful 
    MainPagePresenter mainpage = new MainPagePresenter(new MainPageView(), eventBus);
    container = mainpage.getView().getViewInstance();
    mainpage.go(RootPanel.get());
   }
  });
  
  eventBus.addHandler(LogoutEvent.TYPE, new LogoutEventHandler(){
   @Override
   public void onLogout(LogoutEvent event) {
    loginPage.go(RootPanel.get());
   }
  });
 }
 public void goTo(HasWidgets page){
  this.container = page;
  loginPage.go(page);
 }

}
{% endhighlight %}
  
  <p>
    We can now run our app in the EntryPoint class:
  </p>
  
  <p>
  </p>
  
{% highlight java  %}
public class MVPexample implements EntryPoint {
 public void onModuleLoad() {
  HandlerManager eventBus = new HandlerManager(null);
  AppController app = new AppController(eventBus);
  app.goTo(RootPanel.get());
 }
}

{% endhighlight %}


  
  <div class="separator" style="clear: both; text-align: center;">
    <a href="http://2.bp.blogspot.com/-p8Kdb2ORUKo/Vp6IwSvuYII/AAAAAAAAAuA/XGs7nFcjo-M/s1600/Login.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="41" src="http://2.bp.blogspot.com/-p8Kdb2ORUKo/Vp6IwSvuYII/AAAAAAAAAuA/XGs7nFcjo-M/s400/Login.png" width="400" /></a>
  </div>
  
  <p>
    Interesting Readings about MVP:<br /> <a href="http://www.codeproject.com/Articles/288928/Differences-between-MVC-and-MVP-for-Beginners">&nbsp;http://www.codeproject.com/Articles/288928/Differences-between-MVC-and-MVP-for-Beginners</a>
  </p>
  
  <p>
    <a href="http://martinfowler.com/eaaDev/PassiveScreen.html">http://martinfowler.com/eaaDev/PassiveScreen.html&nbsp;</a>
  </p>
  
  <p>
    &nbsp;Full example at:&nbsp;<a href="https://github.com/gwidgets/mvpexample.git">https://github.com/gwidgets/mvpexample.git</a>