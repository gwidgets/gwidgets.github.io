---
id_disqus: 742
title: Introduction to using Vaadin in Spring Boot
date: 2018-05-05T10:05:44+00:00
author: blogger
layout: post
permalink: /2018/05/05/introduction-to-using-vaadin-in-spring-boot/
comments: true
tags:
  - Spring
  - Vaadin
excerpt: Vaadin's way of doing things rely on server-side rendering, so it can be integrated naturally into frameworks like Spring. Vaadin's has been lying around for a while now, and provides...
---

## Introduction

Vaadin&#8217;s way of doing things rely on server-side rendering, so it can be integrated naturally into frameworks like Spring. Vaadin&#8217;s [Spring integration](https://vaadin.com/docs/v8/framework/advanced/advanced-spring.html) has been lying around for a while now, and provides tools for configuring and managing Vaadin within the Spring container, and if you are looking to use Vaadin with Spring Boot then you are in luck, because the Vaadin folks has already done the work of creating starters that autoconfigure pretty much everything so that you can get a simple UI up and running in matter of seconds. In this post, we will take a brief look on how to work with Vaadin in Spring boot.

## Set up

The best way to create a Spring boot application is by using [Spring Initializr](https://start.spring.io/). We are going to check Vaadin along with other standard Spring starters like Web and Security and click on "Generate Project".

![alt](https://s3-eu-west-1.amazonaws.com/gwidgets/vaadin_initialzr.png)

To create a view at the root of the context path, it is enough to create a class that extends [`UI`](https://vaadin.com/api/com/vaadin/ui/UI.html) and to annotate it with [`@SpringUI`](https://vaadin.com/api/vaadin-spring/).

{% highlight java  %}
@SpringUI
public class Main extends UI {

    @Override
    protected void init(VaadinRequest vaadinRequest) {
        setContent(new Label("Hello"));
    }
}
{% endhighlight %}

If the path to be used is different than the root, the path property can be used: `@SpringUI(path="/app")`.

## UIs and Views:

Vaadin&#8217;s concept of user interfaces is similar to the concept of SPAs (Single Page Applications). A `UI` class is considered as the root container of several views. A view can be seen as a particular state of a UI. An application can have several `UI` classes, but it is recommended to have one `UI` with several views because it is more efficient. With the help of the [`Navigator`](https://vaadin.com/api/com/vaadin/navigator/Navigator.html), the routing can be configured from a view to another without leaving the page or the `UI`. To create a `View`, we simply need to implement the view interface and annotate it with `@SpringView` or if the scope (We will talk about view scopes in the future) is not really important, any Spring injection annotation would work :

{% highlight java  %}
@SpringView
public class Add extends Composite implements View {
    @PostConstruct
    public void init() {
        setCompositionRoot(new Label("I am a view"));
    }
}
{% endhighlight %}

We have used here the `init()` method with the `@PostConstruct` to make sure that Spring has finished injecting any fields (if there is any). It also possible to use the constructor in case there is no injected fields.

## Example

Vaadin is a fully fledged framework, and has wide range of [components](https://demo.vaadin.com/sampler/#databinding/data-provider) that the developer can choose from (layouts, charts, grids..). It also offers the possibility to create custom components. As an example, we want to create a car collection app that allows entering and listing car models:

The Add view:

{% highlight java  %}
@SpringView
public class Add extends Composite implements View {

    @Autowired
    CarRepository repository;

    @Autowired
    DataProvider dataProvider;

    @PostConstruct
    public void init() {
        FormLayout formLayout = new FormLayout();
        Label title = new Label("Add new Car");
        TextField brandInput = new TextField("Brand: ");
        TextField modelInput = new TextField("Model: ");
        TextField pictureLinkInput = new TextField("Picture Link: ");
        Button button = new Button("Add", clickEvent -> {
            repository.save(new Car(brandInput.getValue(), modelInput.getValue(), pictureLinkInput.getValue()));
            Notification.show("saved");
        });
        formLayout.addComponent(title);
        formLayout.addComponent(brandInput);
        formLayout.addComponent(modelInput);
        formLayout.addComponent(pictureLinkInput);
        formLayout.addComponent(button);
        setCompositionRoot(formLayout);
    }
}
{% endhighlight %}

The list view:

{% highlight java  %}
@SpringView
public class List extends Composite implements View {

    @Autowired
    CarRepository repository;

    @Autowired
    DataProvider dataProvider;

    @PostConstruct
    public void init() {
        Grid&lt;Car&gt; carGrid = new Grid&lt;&gt;();
        carGrid.setWidth("100%");
        carGrid.setHeight("100%");
        carGrid.setDataProvider(dataProvider);
        carGrid.addColumn(Car::getId).setCaption("Id");
        carGrid.addColumn(Car::getBrand).setCaption("Brand");
        carGrid.addColumn(Car::getModel).setCaption("Model");
        carGrid.addColumn((ValueProvider&lt;Car, Object&gt;) car -&gt; 
        new ExternalResource(car.getPictureLink())).setCaption("Picture")
        .setRenderer(new ImageRenderer()).setResizable(true);
        setCompositionRoot(carGrid);
        setSizeFull();
    }
}
{% endhighlight %}

The Main UI:

{% highlight java  %}
@SpringUI(path="app")
@StyleSheet({"http://localhost:8080/styles.css"})
public class Main extends UI {

    @Autowired
    Add addView;

    @Autowired
    List listView;

    @Override
    protected void init(VaadinRequest vaadinRequest) {
        HorizontalLayout rootLayout = new HorizontalLayout();
        rootLayout.setSizeFull();
        HorizontalLayout mainarea = new HorizontalLayout();
        mainarea.setWidth("80%");
        Navigator navigator = new Navigator(this, mainarea);
        navigator.addView("", addView);
        navigator.addView("add", addView);
        navigator.addView("list", listView);


        CssLayout sideNav = new CssLayout();
        sideNav.setSizeFull();
        sideNav.addStyleName("sidenav");
        sideNav.setId("sideNav");
        sideNav.setWidth("20%");

        Button link1 = new Button("Add", e -> navigator.navigateTo("add"));
        link1.addStyleNames(BUTTON_LINK, MENU_ITEM);
        Button link2 = new Button("List", e -> navigator.navigateTo("list"));
        link2.addStyleNames(BUTTON_LINK, MENU_ITEM);
        sideNav.addComponent(link1);
        sideNav.addComponent(link2);
        rootLayout.addComponent(sideNav);
        rootLayout.addComponent(mainarea);
        setContent(rootLayout);
    }
}
{% endhighlight %}

We have created two views: one form for adding cars and a grid for displaying them. The UI class wires up the two views using the `navigator`. The UI is composed of two parts: a side navigation bar with links to views and the main area which is the variable part. We have configured the `navigator` to dispatch views only in the main area, and configured the routes to each view:

{% highlight java  %}
        Navigator navigator = new Navigator(this, mainarea);
        navigator.addView("", addView);
        navigator.addView("add", addView);
        navigator.addView("list", listView);
{% endhighlight %}

it is important to have a default `""` empty route because usually the route is not set on start up. As Vaadin uses its own themes and stylesheets, the `@StyleSheet` annotation comes handy in case custom styles are to be introduced. Our views and UIs are wired up to the Spring container, so it is possible to inject any Spring bean. For example, we injected the `CarRepository` which is a [`JpaRepository`](https://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html) for performing database operations on `Car` entities.

## Security

Vaadin uses its own CSRF tokens, so the Spring CSRF mechanism should be disabled for the app to work properly, if Spring Security is used. A minimal security configuration can look like:

{% highlight java  %}
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/app**").authenticated().and().formLogin().and().csrf().disable();
    }
}
{% endhighlight %}

## Wrap up

Vaadin can be seen as an alternative for rapidly creating UIs with a Spring Boot backend. Vaadin may be easy to set up at first, but it appears that the learning curve is not that smooth when complexity increases. Another drawback that may be noticed when working with Vaadin (not only with Spring) is having to restart the whole app (Spring Container takes a while to start usually) every time a change is made, which leads to the necessity of setting up `HotSwap` or similar tools for hot reloading the code without having the restart application.

Source code: <https://github.com/zak905/vaadin-spring-boot>