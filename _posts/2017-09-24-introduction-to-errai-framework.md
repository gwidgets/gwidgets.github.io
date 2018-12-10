---
id: 695
title: Introduction to Errai Framework
date: 2017-09-24T13:50:59+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=695
permalink: /2017/09/24/introduction-to-errai-framework/
comments: true
dsq_needs_sync:
  - "1"
excerpt:  Errai is a framework developed and maintained by Red Hat in an attempt to combine the good aspects of the GWT and JEE worlds. According to Red Hat, Errai is a GWT-based framework for building rich web applications using next-generation web technologies...
  
---
<p style="text-align:justify">
  Errai is a framework developed and maintained by Red Hat in an attempt to combine the good aspects of the GWT and JEE worlds. According to <a href="http://docs.jboss.org/errai/latest/errai/reference/html_single/">Red Hat</a>, Errai is a GWT-based framework for building rich web applications using next-generation web technologies. Behind this simple statement there is a radically different way of developing with GWT, and in the following post we will see why.
</p>


####  **How to set up a project:** 

The official documentation suggests two different ways to setup a project:

  1. Using the demo project: 
A hacky way to start a new project is to clone the errai-tutorial: `git clone git@github.com:errai/errai-tutorial.git` and adapt it to your project needs. Actually there is also an [archetype](git@github.com:errai/archetypes.git) at <https://github.com/errai/archetypes>, but it is deprecated as of now.

  1. Using the Errai Forge Addon:
[JBoss Forge](https://forge.jboss.org/) could be described as a sort of CLI for scaffolding projects. It is extensible with <span style="font-style: italic;">add-ons</span> (there are a LOT of them) so that it may be used to create almost any type of project from scratch : Spring, JEE, Vaadin, GWT, and so on.

{% highlight shell %}
      forge --install org.jboss.errai.forge:errai-forge-addon,4.0.2.Final 
      forge
      project-new --named errai-tutorial --topLevelPackage com.gwidgets.errai.tutorial --version
          1.0.0-SNAPSHOT --finalName "Errai Tutorial" --type war --buildSystem Maven
      errai-setup --version-select 4.0.2.Final --logical-module-name com.gwidgets.errai.tutorial --module-name ErraiTutorial
{% endhighlight %}

After that applying the commands, we should have an empty scaffold of an Errai project called &#8220;errai-tutorial&#8221;.

####  **Tutorial Project:** 

<p style="text-align:justify">
  This tutorial is based on the project here: <a href="https://github.com/gitgabrio/errai-tutorial">https://github.com/gitgabrio/errai-tutorial</a>. We will follow a step by step approach, in which each step corresponds to a branch. To move from one step to another,<br /> the branch needs to be checked out. <span style="font-weight: bold;">In this project, we made use of some classes taken from the official Errai Tutorial.</span>
</p>

####  **Overall architecture:** 

<p style="text-align:justify">
  Errai framework is strongly geared towards using JBoss Application Server, currently WildFly version 10. With the default configuration, at the first run, Maven will download the WildFly zip distribution in the local repository; then, during the build, it will uncompress it in the project&#8217; build directory (<span style="font-style: italic;">target</span>). The application will run inside an instance of this WildFly server, so to configure it you have to provide the WildFly properties as JVM arguments to the GWT plugin:
</p>

{% highlight xml  %}
 <properties>
    <errai.dev.context>${project.artifactId}</errai.dev.context> 
    <as.version>10.0.0.Final</as.version>
   <errai.jboss.home>${project.build.directory}/wildfly-${as.version}</errai.jboss.home>
    <listening.address>127.0.0.1</listening.address>
    </properties>

    <plugin>
     <groupId>org.codehaus.mojo</groupId>
     <artifactId>gwt-maven-plugin</artifactId>
     <version>${gwt.version}</version>
     <executions>
      <execution>
       <goals>
       <goal>
        compile
        </goal>
       </goals>
      </execution>
     </executions>
     <configuration>
     <logLevel>INFO</logLevel>
     <noServer>false</noServer>
 <extraJvmArgs>-Xmx3096m
    -XX:CompileThreshold=7000 -Derrai.jboss.home=${errai.jboss.home}
    -Derrai.dev.context=${errai.dev.context}
    -Djboss.bind.address=${listening.address}
  </extraJvmArgs>
    
<server>org.jboss.errai.cdi.server.gwt.EmbeddedWildFlyLauncher</server>
<!--other configuration properties -->
</configuration>
{% endhighlight %}

####  **A walk through Errai Features:** 

  Errai offers different functionalities that could be enabled with the so-called <span style="font-style: italic;">features</span>. Features are just maven jars added to the pom. You could add them manually but, since some feature requires more than one single jar, it is better to copy the ones in the provided tutorial or, even better, add them with Forge, using the following command (inside the Forge console):

<pre class="brush:shell">errai-add-features --feature-select [name of the feature] </pre>

  - Errai-messaging:
<pre class="brush:shell">git checkout messaging </pre>

  This feature enables the ErraiBus. ErraiBus is the backbone of the messaging system used to exchange messages from/to endpoints. Endpoints may be instantiated at client or server side and the framework makes almost no difference between them: messages may go from/to any of them. Multiple listeners of a given <span style="font-style: italic;">subject</span> may receive the messages addressed to that subject. Endpoints registers themselves to listen to a given <span style="font-style: italic;">subject</span> passing a callback to the `MessageBus`.


For example, in the tutorial project there are a couple of endpoints in the `ReceiverMessagePanel` class: 

{% highlight java  %}
public static final String CLIENT_SUBJECT = "ClientSubject";
 public static final String VARIABLE_SUBJECT = "VariableSubject";

private void subscriptions() {
        subscribe(CLIENT_SUBJECT);
        subscribe(VARIABLE_SUBJECT);
    }

    private void subscribe(String subject) {
        bus.subscribe(subject, message -> {
            String messageText = message.get(String.class, "text");
            logger.debug("Received " + messageText + " on " + subject);
            showReceived(subject, messageText);
        });
    }
{% endhighlight %}

  Whenever a message is sent to the CLIENT_SUBJECT or VARIABLE_SUBJECT, the callback will be invoked. Messages are represented by JSON-formatted String and are sent through an instance of the `RequestDispatcher`. To send a message, the framework provides a utility class, `MessageBuilder` that, with a fluent style, allows to create the message and send it to the given subject. There are multiple options, but the simplest one is the following:

{% highlight java  %}
                 MessageBuilder
                .createMessage()
                .toSubject(HelloServerService.SERVER_SUBJECT)
                .signalling()
                .with("text", requestTextBox.getText())
                .noErrorHandling()
                .sendNowWith(dispatcher)
{% endhighlight %}

  With this, we are sending a message, which will have a field text with a given String value, to the `HelloServerService.SERVER_SUBJECT`. The message is sent immediately with the given `RequestDispatcher`

 - errai-cdi-integration:

<p style="text-align:justify">
  Errai CDI contains the implementation of the JSR-299 Contexts and Dependency Injection specification. It is also &#8211; by itself &#8211; an extension of the Errai-IOC feature, so adding CDI will automatically add IOC. For this feature to work properly you must add an &#8220;ErrayApp.properties&#8221; file at the root of every directory containing classes whose existence should be known by Errai. Moreover, we will enable the CDIServiceLocator inside the web.xml:
</p>

{% highlight xml %}
<servlet>
    <servlet-name>ErraiServlet</servlet-name>
    <servlet-class>org.jboss.errai.bus.server.servlet.DefaultBlockingServlet</servlet-class>
    <init-param>
      <param-name>service-locator</param-name>
      <param-value>org.jboss.errai.cdi.server.CDIServiceLocator</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
  </servlet>
{% endhighlight %}

<p style="text-align:justify">
  This feature does not implement all the JSR-299 specification, but it adds the possibility to produce and consume Events, so that the beans may interact while being completely decoupled. Usage of Events is demonstrated by ContactStorageServiceImpl and ReceiverEventPanel. Ignoring everything else, for the moment being, let&#8217;s focus on the Event creation:
</p>

{% highlight java  %}
@Stateless
@Service
public class ContactStorageServiceImpl implements ContactStorageService  {

    @Inject
    @Operation(CREATE)
    private Event<ContactOperation> created;

  // other fields and methods

public Response create(final ContactOperation contactOperation) {
        // This event is delivered to call connected clients.
        created.fire(contactOperation);
    }
}
{% endhighlight %}

  Inside this class, the `Event<ContactOperation>` (specific for the CREATE operation type) has been injected; inside the create method Event.fire is called, and this will push the given event inside the context.

ReceiverEventPanel:

{% highlight java  %}
public void onRemoteCreated(final @Observes @Operation(Operation.OperationType.CREATE) ContactOperation contactOperation) {}
{% endhighlight %}

The `@Observes` annotation causes the `onRemoteCreated` method to be called when an `Event<ContactOperation>` (with the operation type CREATE) is fired.

  - errai-data-binding :

<pre> git checkout persistence </pre>

  With the data-binding it is possible to automatically populate fields in the user interface with the data of a specific DTO class.To enable that, such class should be annotated with `@Bindable` and should have standard getter/setter for its properties. `@Templated`-annotated ui beans (see later) will have their fields automatically synchronized with values of these classes. In our example, the Contact class will have such annotation, so that we could have all the stack (from client-side representation to server-side persistence) implemented in one single class:

{% highlight java  %}
@Bindable
@Portable
@Entity
@NamedQueries({
  @NamedQuery(name = Contact.ALL_CONTACTS_QUERY, query = "SELECT c FROM Contact c ORDER BY c.id")
})
public class Contact {}
{% endhighlight %}

  - errai-navigation :
<p style="text-align:justify">
  This feature allows the creation of applications with multiple bookmarkable pages. Classes may be annotated with `@Page` to indicate their role and path, like ContactListPage below, which is marked as the default page of the application:
</p>

{% highlight java  %}
@Page(role = DefaultPage.class, path = "/contacts")
@Templated(value = "contact-page.html#contact-list", stylesheet = "contact-page.css")
public class ContactListPage {}
{% endhighlight %}

Only `@Templated`-annotated classes, or classes implementing (directly or indirectly) IsWidget can have the `@Page` annotation. Other annotations are used to invoke methods at specific page-events:

`@PageShown` is invoked when object is attached to the NavigationPanel.

`@PageHiding` is invoked when object is removed from the NavigationPanel.

Navigation between pages may be implemented using the `org.jboss.errai.ui.nav.client.local.Navigation` class, that offers some methods for that, like:

`Navigation.goTo([PAGE_NAME])`

####  **Wrap-up:** 

<p style="text-align:justify">
  Surely Errai offers a great deals of tools to develop a full JEE application on top of GWT. Beside all the User Interface enhancements, what is really interesting is the &#8220;blurring&#8221; of the boundaries between the client-side and the server-side of the code, especially for the messaging system.Using MessageBus or Events could really help a lot in building decoupled code that, in the end, would ease the application development and maintenance. On the other hand, this come with a price, and the price is the binding with an Application Server (WildFly is provided out-of-the-box in the examples, but any other one should be work). Working with Application Servers imply an overhead in terms of architecture and complexity, and there is a cost/benefit ratio that should be taken in account. We may consider the Errai framework as the JEE counterpart of a Spring+GWT application so, at the end of the day, it all resolve to the same old question: are you a JEE or a Spring developer?
</p>