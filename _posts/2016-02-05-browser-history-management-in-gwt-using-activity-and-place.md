---
id_disqus: 240
title: Browser History Management in GWT using Activity and Place
date: 2016-02-05T15:39:48+00:00
author: blogger
layout: post
permalink: /2016/02/05/browser-history-management-in-gwt-using-activity-and-place/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:   Browser history management is an important aspect of a web application. An optimized history management will allow faster navigation and better responsiveness. The reason why GWT constitues a special case is its use of a single page (called RootPanel) approach (SPA)...

---
<div dir="ltr" style="text-align: left;" trbidi="on">
  <div class="separator" style="clear: both; text-align: center;">
    <a href="http://3.bp.blogspot.com/-rwDefW6oxv8/VrJ6-ANQa-I/AAAAAAAAAu8/ilNBZ-Oo6oY/s1600/history.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" src="https://3.bp.blogspot.com/-rwDefW6oxv8/VrJ6-ANQa-I/AAAAAAAAAu8/ilNBZ-Oo6oY/s1600/history.png" /></a>
  </div>
  
  <p>
    Browser history management is an important aspect of a web application. An optimized history management will allow faster navigation and better responsiveness. The reason why GWT constitues a special case is its use of a single page (called RootPanel) approach ( <a href="https://en.wikipedia.org/wiki/Single-page_application">SPA</a>). The page can be seen as board on which components are added or deleted depending on the current context. Without history management in GWT, the application user will face the following issues:<br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#8211; &nbsp;If the user hits the back button, the browser will navigate to the previous page used by the user before entering the application and not to the previous state of the application.<br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&#8211; If the user wants to bookmark the current state of the application, the bookmark will point to the first page of the application.
  </p>
  
  <p>
    To tackle these issues, GWT introduced history management mechanisms starting from its 2.1 release. <a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/activity/shared/Activity.html">Activity</a> and <a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/place/shared/Place.html">Place</a>&nbsp;are helper&nbsp;classes that allow developpers to manage history by assigning names to application states using # ( <a href="https://en.wikipedia.org/wiki/Fragment_identifier">Fragment Identifier</a>). They work best in concordance with an MVP architecture. In this tutorial, we will go throught how to use Activities and Places to effectively manage history in a GWT application.
  </p>
  
  <p>
    Requirements:<br /> Eclipse<br /> GWT plugin<br /> the application we built last tutorial:&nbsp;<a class="twitter-timeline-link" data-expanded-url="http://goo.gl/1m7HIL" dir="ltr" href="https://t.co/zf4M2SKYNk" rel="nofollow" target="_blank" title="http://goo.gl/1m7HIL"><span class="invisible">http://</span><span class="js-display-url">goo.gl/1m7HIL</span></a>
  </p>
  
  <p>
    Our application has two pages or states: a login and main page.
  </p>
  
  <p>
    First of all, we are going to change our MVP setup. We are going to move our Presenter interface inside our view, and have it implemented by the activity which will play the role of the Presenter as well.
  </p>
  
  <p>
    LoginView.java
  </p>
  
{% highlight java  %}
public class LoginView extends Composite implements IsWidget {
 HorizontalPanel container;
 Label loginLabel;
 Label passwordLabel;
 TextBox loginField;
 PasswordTextBox passwordField;
 Button loginButton;
 private Presenter presenter;

 
 public HasClickHandlers getLoginButton() {
  return loginButton;
 }
 
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
 
 public Presenter getPresenter() {
  return presenter;
 }

 public void setPresenter(Presenter presenter) {
  this.presenter = presenter;
 }

 public interface Presenter{
        public void goTo(Place place);
        public void loginButtonEvent();
 }

}

{% endhighlight %}
  
  <p>
    Next we are going to create the LoginPlace and LoginActivity, which are required for managing history. A Place object holds the application state at a particular point.
  </p>
  
  <p>
    &nbsp;LoginPlace.java<br />
  </p>
  
{% highlight java  %}
public class LoginPlace extends Place {
 String name;
 public LoginPlace(String placeName){ 
  this.name = placeName;
 }
 public String getPlaceName(){ 
  return name;
 }
  public static class Tokenizer implements PlaceTokenizer<LoginPlace> {
         @Override
         public String getToken(LoginPlace place) {
             return place.getPlaceName();
         }
         @Override
         public LoginPlace getPlace(String token) {
             return new LoginPlace(token);
         }
     }
}
{% endhighlight %}
  
  <p>
    As you may notice, the LoginPlace class has an inner static class called Tokenizer which implements the PlaceTokenizer. This last is used for serializing the place name into a token that will be used by the browser to refer to the place. The next step is to define LoginActivity.java. Before doing so, we need to define our client factory which will be used for dependency injection.
  </p>
  
  <p>
    ClientFactory.java<br />
  </p>
  
{% highlight java  %}
public interface ClientFactory {
     LoginView getLoginView();
     MainPageView getMainPageView();
     AppController getAppController();
     EventBus getEventBus();
     PlaceController getPlaceController();
}
{% endhighlight %}
  
  <p>
    ClientFactoryImpl.java<br />
  </p>
  
{% highlight java  %}
public class ClientFactoryImpl implements ClientFactory {
 LoginView login = new LoginView();
 MainPageView mainPage = new MainPageView();
 HandlerManager controllerBus = new HandlerManager(null);
 EventBus eventBus = new SimpleEventBus();
 PlaceController controller = new PlaceController(eventBus);

 @Override
 public LoginView getLoginView() {
  return login;
 }

 @Override
 public MainPageView getMainPageView() {
  return mainPage;
 }


 @Override
 public EventBus getEventBus() {
  return eventBus;
 }

 @Override
 public PlaceController getPlaceController() {
  return controller;
 }

}
{% endhighlight %}
  
  <p>
    We need add this piece of code in our module definition xml file.
  </p>
  
{% highlight xml  %}
<replace-with class="com.opencode.client.ClientFactoryImpl">
    <when-type-is class="com.opencode.client.ClientFactory">
   </when-type-is></replace-with>
{% endhighlight %}
  
  <p>
    Now, we are ready to define our activity :<br /> <br /> LoginActivity.java<br />
  </p>
  
{% highlight java  %}
public class LoginActivity extends AbstractActivity implements LoginView.Presenter {
 
 ClientFactory factory;
 
 String name;
 
 public LoginActivity(LoginPlace loginPlace, ClientFactory clientFactory){
  this.factory = clientFactory;
  this.name = loginPlace.getPlaceName();
 }

 @Override
 public void start(AcceptsOneWidget panel, EventBus eventBus) {
  LoginView view = factory.getLoginView();
        view.setPresenter(this);
  panel.setWidget(view.asWidget());
  bindEvents();
  
 }
 
 public void bindEvents(){
  loginButtonEvent();
 }
 
 

 @Override
 public void loginButtonEvent() {
  factory.getLoginView().getLoginButton().addClickHandler(new ClickHandler(){
   @Override
   public void onClick(ClickEvent event) {
    System.out.println("inside event");
    goTo(new MainPagePlace("MainPage"));
               
   }
  });
 }
 
 @Override
 public void goTo(Place place) {
  factory.getPlaceController().goTo(place);
 }
}
{% endhighlight %}
  
  <p>
    The next step is to define an ActivityMapper which maps each Place to an Activity. In addition, we are going to define a HistoryMapper that handles all the place tokens of our application.
  </p>
  
  <p>
    MyActivityMapper.java<br />
  </p>
  
{% highlight java  %}
public class MyActivityMapper implements ActivityMapper {
 private ClientFactory clientFactory;  
 
 public MyActivityMapper(ClientFactory factory){
  this.clientFactory = factory;
 }
 @Override
 public Activity getActivity(Place place) {
  if(place instanceof LoginPlace){
   return new LoginActivity((LoginPlace) place, clientFactory);
  }else if(place instanceof MainPagePlace){
   return new MainPageActivity((MainPagePlace)place, clientFactory);
  }else if(place instanceof UserSelectPlace){
   return new MainPageActivity((MainPagePlace)place, clientFactory);
  }
  return null;
 }
}
{% endhighlight %}
  
  <p>
    MyHistoryMapper.java<br />
  </p>
  
{% highlight java  %}
@WithTokenizers({LoginPlace.Tokenizer.class, MainPagePlace.Tokenizer.class})
public interface MyHistoryMapper extends PlaceHistoryMapper  {
}
{% endhighlight %}
  
  <p>
    Finally, we need to update our entry point with all the new components:
  </p>
  
  <p>
    MVPexample.java<br />
  </p>
  
{% highlight java  %}
public class MVPexample implements EntryPoint {
 private LoginPlace welcomePlace = new LoginPlace("login");
 private SimplePanel appWidget = new SimplePanel();
 
 public void onModuleLoad() {
  ClientFactory clientFactory = GWT.create(ClientFactory.class);
  PlaceController controller = clientFactory.getPlaceController();
  
  EventBus bus = clientFactory.getEventBus();
        ActivityMapper activityMapper = new MyActivityMapper(clientFactory);
        ActivityManager activityManager = new ActivityManager(activityMapper, bus);
        activityManager.setDisplay(appWidget);

        MyHistoryMapper historyMapper= GWT.create(MyHistoryMapper.class);
        final PlaceHistoryHandler historyHandler = new PlaceHistoryHandler(historyMapper);
        historyHandler.register(controller, bus, welcomePlace);
        
        RootPanel.get().add(appWidget);
        historyHandler.handleCurrentHistory();
 }
}
{% endhighlight %}
  
  <p>
    Result:
  </p>
  
  <div class="separator" style="clear: both; text-align: center;">
    <a href="https://1.bp.blogspot.com/-HMITYaKj_6M/VrSuoxr5sUI/AAAAAAAAAvM/iobznxiqsGk/s1600/historybrowserresult.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="72" src="https://1.bp.blogspot.com/-HMITYaKj_6M/VrSuoxr5sUI/AAAAAAAAAvM/iobznxiqsGk/s400/historybrowserresult.png" width="400" /></a>
  </div>
  
  <p>
    Same thing goes for MainPageView.java.
  </p>
  
  <div class="separator" style="clear: both; text-align: center;">
    <a href="https://1.bp.blogspot.com/-zi-dil5qOeo/VrSwDAWylFI/AAAAAAAAAvY/GbblkNHNjpo/s1600/historybrowserresult2.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="176" src="https://1.bp.blogspot.com/-zi-dil5qOeo/VrSwDAWylFI/AAAAAAAAAvY/GbblkNHNjpo/s400/historybrowserresult2.png" width="400" /></a>
  </div>
  
  <div class="separator" style="clear: both; text-align: center;">
  </div>
  
  <div class="separator" style="clear: both; text-align: left;">
  </div>
  
  <div class="separator" style="clear: both; text-align: left;">
    Full example code available at:&nbsp;<a href="https://github.com/gwidgets/mvpexample">https://github.com/gwidgets/mvpexample</a>
  </div>