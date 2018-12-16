---
id_disqus: 796
title: Developing Web Components in Scala.js
date: 2018-05-02T10:31:09+00:00
author: blogger
layout: post
permalink: /2018/05/02/developing-web-components-in-scala-js/
comments: true
tags:
  - Scala.js
  - Web Components
excerpt: Scala.js is a compiler that allows producing JavaScript from Scala. It focuses on simplicity and the elimination of borders between the source and the destination language so that developers can write JavaScript-like code while benefiting from all the features of Scala...
---
## Introduction

Scala.js is a compiler that allows producing JavaScript from Scala. It focuses on simplicity and the elimination of borders between the source and the destination language so that developers can write JavaScript-like code while benefiting from all the features of Scala. Scala.js seems to be quickly evolving, and is almost near the 1.0 release, which is the first production ready version. It is also catching up with the changing JavaScript syntax and APIs. For example, one interesting feature of Scala.js is the support of [ES6](https://en.wikipedia.org/wiki/ECMAScript) syntax which introduces things like classes and modules in JavaScript. ES6 syntax is required when developing [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) based on the standard JavaScript APIs, and by supporting ES6, Scala.js offers the possibility to write reusable web components with nothing but standard JavaScript APIs. In this post, we will provide an example of writing web components in Scala.js, and how to combine web components to form a web application.

## Components oriented approach

Following the modern front development paradigms, it is recommended to follow a components oriented approach or architecture when developing web applications for better modularity and separation of concerns. According to [Dan Shapiro](https://medium.com/@dan.shapiro1210/understanding-component-based-architecture-3ff48ec0c238), components can be seen as a small feature that makes up a piece of the user interface. Components constitue the core functionality of several JavaScript frameworks like Angular and React. By using such frameworks, the developer can have a powerful set of tools at hand, however; this can create a lock-in and can lead to several issues in case breaking changes are introduced into the frameworks. Using the standard web component APIs can have its benefits in the way that the application has no dependencies and is somehow lightweight and easily adaptable to changes. In this example, we would like to develop an expense management application that allows adding, listing, and deleting expenses. As this is a demonstration, we want the application to use the browser&#8217;s [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for storing the data. We can imagine the structure of our application as follows:

{% highlight html  %}
<app-element>
<header-bar></header-bar>
<side-nav ></side-nav>
<main-area >
    <add-section></add-section>
    <list-section></list-section>
    <delete-section></delete-section>
</main-area>
</app-element>
{% endhighlight %}

Accordingly, we are going to develop the above components and glue them together to make up our application.

![app](https://s3-eu-west-1.amazonaws.com/gwidgets/coa.png)

## Implementation

  * The setup:

In addition to the basic Scala.js setup described in the [documentation](https://www.scala-js.org/tutorial/basic/), we are going to need to configure the Scala.js linker to produce ES6 (ECMAScript2015) JavaScript, so we need to add the following to the `build.sbt`:

{% highlight scala %}
scalaJSLinkerConfig ~= { _.withOutputMode(OutputMode.ECMAScript2015) }
{% endhighlight %}

Additionally, we need to enable Scala.js defined types (aka non native javascript types), to be exported to JavaScript by default by adding the following to the Scala build file:

{% highlight scala %}
scalacOptions += "-P:scalajs:sjsDefinedByDefault"
{% endhighlight %}

  * The missing pieces:

Working with web components require some APIs that are not present by default in [`scalajs-dom`](https://github.com/scala-js/scala-js-dom), so we will need to write facade types for those before getting started. The first one is the [`CustomElementsRegistry`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) object present in the global `Window` :

{% highlight scala %}
@js.native
@JSGlobal
class Window extends dom.Window {
   val customElements: CustomElementsRegistry = js.native
}
{% endhighlight %}

CustomElementsRegistry definition:

{% highlight scala %}
  @js.native
  trait CustomElementsRegistry extends js.Any {
    def define(name: String, definition: Any ) : Unit = js.native
  }
{% endhighlight %}

In this way we can register our custom elements by executing `window.customElements.define("add-section", js.constructorOf[AddSectionElement])`, pretty much in the same way as described in the JavaScript [documentation](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)

Template and Shadow Dom are integral parts of the core specifications of web components and are important tools for developing web components. We are going to create the necessary objects and methods for enabling those as they are also missing from `scalajs-dom`.

{% highlight scala %}
@js.native
@JSGlobal
class HTMLTemplateElement extends HTMLElement {

  val content: HTMLElement = js.native
}
{% endhighlight %}

and as the HTMLElement object misses the `attachShadow` method, we are going to extend it to add it:

{% highlight scala %}
@js.native
@JSGlobal
class HTMLElement extends org.scalajs.dom.raw.HTMLElement {
   def attachShadow(options: js.Any) : org.scalajs.dom.raw.HTMLElement = js.native
}
{% endhighlight %}

We have now filled the missing gaps and we can start developing our components.

  * The components:

It is more convenient to use templates and [slots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots) instead of creating elements programatically.

The `app-element` component connects between the side navigation `side-nav` bar element and the `main-area`. It needs to detect changes when a link is clicked on the side bar and route to the corresponding section. The custom elements specification defines [lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks) that are executed when a particular event occurs. For example, we use here `connectedCallback` to define the logic used by the component to route from a section to another. `connectedCallback` is invoked when the element is connected to DOM. The general guidelines (e.g [Google&#8217;s guide to Custom Elements](https://developers.google.com/web/fundamentals/web-components/customelements)) recommend to put all the setup code and logic inside the `connectedCallback`. Our `app-element` component looks like:

template

{% highlight html  %}
<template id="app-element-template">
<slot name="header-bar"></slot>
<slot name="side-nav"></slot>
<slot name="main-area"></slot>
</template>
{% endhighlight %}

AppElement.scala

{% highlight scala %}
class AppElement extends HTMLElement {


  var template: HTMLTemplateElement = dom.document.getElementById("app-element-template").asInstanceOf[HTMLTemplateElement]
  var shadow = this.attachShadow(JSON.parse("{\"mode\": \"open\"}"));
  shadow.appendChild(template.content.cloneNode(true));


  def connectedCallback(): Unit  = {
      initRouter()


    var sections = getMainArea().getAllSections()

    for (i <- 0 until sections.length) {
      var section = sections.item(i).asInstanceOf[MainAreaSectionElement]
      getSideNav().addLink(section.getName())
    }
    updateUI()
  }

  private def getSideNav(): SideNavElement = {
    return this.querySelector("side-nav").asInstanceOf[SideNavElement]
  }

  private def getMainArea(): MainAreaElement = {
    return this.querySelector("main-area").asInstanceOf[MainAreaElement]
  }


  def initRouter(): Unit = {

    dom.window.addEventListener("hashchange", (event: Event)  => {

      val hash = dom.window.location.hash.replace("#", "")
      getMainArea().select(hash)

    }, false)
  }

  def updateUI(): Unit = {
    val hash = dom.window.location.hash.replace("#", "")
    if ( !hash.isEmpty) {
      getMainArea().select(hash)
    } else {
      getMainArea().selectFirst()
    }
  }
}
{% endhighlight %}

Finally, for the component to work properly, it needs to be registered:

{% highlight scala %}
window.customElements.define("app-element", js.constructorOf[AppElement])
{% endhighlight %}

  * Components reuse:

Since Scala supports object oriented features like inheritence and polymorphism, our web components can use object orientation for better code usage and even more modularity. For example, the `list-section` and the `delete-section` both render a table with the current expenses. The difference between the two is that the `delete-section` needs to add a checkbox before each row to allow the user to select which expense to delete. Accordingly, we can make the `delete-section` inherit from the `list-section` element.

template

  {% highlight html  %}
    <template id="main-area-section-template">
      <!-- styles where omitted for better readabiltiy -->
      <section> 
          <div class="container">

          </div>
      </section>
  </template>
  {% endhighlight %}

ListSectionElement.scala

{% highlight scala %}
  class ListSectionElement extends MainAreaSectionElement {

    var dataTable: HTMLTableElement = null;
    setName("List")

    def connectedCallback(): Unit  = {
      renderTable()
    }

    def renderTable(): Unit = {

      dataTable = dom.document.createElement("table").asInstanceOf[HTMLTableElement]
      dataTable.classList.add("data-table")
      val tableHeader = dom.document.createElement("thead").asInstanceOf[HTMLElement]
      val idHeaderCell = dom.document.createElement("th").asInstanceOf[HTMLElement]
      idHeaderCell.textContent = "id"
      val amountHeaderCell = dom.document.createElement("th").asInstanceOf[HTMLElement]
      amountHeaderCell.textContent = "amount"
      val dateHeaderCell = dom.document.createElement("th").asInstanceOf[HTMLElement]
      dateHeaderCell.textContent = "date"
      val reasonHeaderCell = dom.document.createElement("th").asInstanceOf[HTMLElement]
      reasonHeaderCell.textContent = "reason"

      val tableHeaderRow = dom.document.createElement("tr").asInstanceOf[HTMLTableRowElement]

      tableHeaderRow.appendChild(idHeaderCell)
      tableHeaderRow.appendChild(amountHeaderCell)
      tableHeaderRow.appendChild(dateHeaderCell)
      tableHeaderRow.appendChild(reasonHeaderCell)

      tableHeader.appendChild(tableHeaderRow)
      dataTable.appendChild(tableHeader)

      for (i <- 0 until dom.window.localStorage.length ) {
        val key = dom.window.localStorage.key(i)
        val expenseJsonOption = Option(dom.window.localStorage.getItem(key))
        if (expenseJsonOption.isDefined) {
        val expense = decode[Expense](expenseJsonOption.get).toSeq.last
            val row = dom.document.createElement("tr").asInstanceOf[HTMLTableRowElement]
            val idCell = dom.document.createElement("td").asInstanceOf[HTMLTableDataCellElement]
            idCell.textContent = expense.id
            val amountCell = dom.document.createElement("td").asInstanceOf[HTMLTableDataCellElement]
            amountCell.textContent = expense.amount
            val dateCell = dom.document.createElement("td").asInstanceOf[HTMLTableDataCellElement]
            dateCell.textContent = expense.date
            val reasonCell = dom.document.createElement("td").asInstanceOf[HTMLTableDataCellElement]
            reasonCell.textContent = expense.reason
            row.appendChild(idCell)
            row.appendChild(amountCell)
            row.appendChild(dateCell)
            row.appendChild(reasonCell)
            dataTable.appendChild(row)
        }
      }
      getContainer().appendChild(dataTable)
    }

    def refreshUI(): Unit = {
      clear()
      renderTable()
    }
  }
{% endhighlight %}

DeleteSectionElement.scala:

{% highlight scala %}
class DeleteSectionElement extends ListSectionElement {

  setName("Delete")

  override def connectedCallback(): Unit  = {
       this.renderTable()
  }

  override def renderTable(): Unit = {
    super.renderTable()
    val rows = dataTable.querySelectorAll("tr")

    val headerRow = dataTable.querySelector("thead > tr").asInstanceOf[HTMLTableRowElement]
    val emptyHeaderCell = dom.document.createElement("th")
    headerRow.insertBefore(emptyHeaderCell, headerRow.firstChild)

    for (i <- 1 until rows.length) {
      val row = rows.item(i)
      val deleteCell = dom.document.createElement("td").asInstanceOf[HTMLTableDataCellElement]
      val deleteCheckBox = dom.document.createElement("input").asInstanceOf[HTMLInputElement]
      deleteCheckBox.`type` = "checkbox"
      deleteCheckBox.id = row.firstChild.textContent
      deleteCell.appendChild(deleteCheckBox)
      row.insertBefore(deleteCell, row.firstChild)
    }

    val deleteButton = dom.document.createElement("button").asInstanceOf[HTMLButtonElement]
    deleteButton.textContent = "Delete selection"
    deleteButton.classList.add("action-button")

    deleteButton.addEventListener("click", (event:Event) => {
      val rows = dataTable.querySelectorAll("tr")
      for (i <- 1 until rows.length) {
        val row = rows.item(i)
        val input = row.asInstanceOf[HTMLTableRowElement].querySelector("td > input").asInstanceOf[HTMLInputElement]
        if (input.checked) {
          dom.window.localStorage.removeItem(input.id)
        }
      }
      dom.document.dispatchEvent(new wrappers.Event("deleteExpense"))
    })

    getContainer().appendChild(deleteButton)
  }

  override def refreshUI(): Unit = {
    clear()
    renderTable()
  }
}
{% endhighlight %}

we can notice that `DeleteSectionElement` not only uses the same table used by its parent `ListSectionElement`, but also makes use of the render method and overrides it. Since `AddSectionElement` (implementation can be found in the source code), `ListSectionElement`, and `DeleteSectionElement` all constitute sections of the `main-area` and share the same template and the same initialization code, we can create a parent element for all of them to factorize the common initialization code and methods:

{% highlight scala %}
abstract class MainAreaSectionElement extends HTMLElement {
  var template: HTMLTemplateElement = dom.document.getElementById("main-area-section-template").asInstanceOf[HTMLTemplateElement]
  var shadow = this.attachShadow(JSON.parse("{\"mode\": \"open\"}"))
  shadow.appendChild(template.content.cloneNode(true))

  def getContainer(): Element = {
    return this.shadow.querySelector(".container")
  }

  def setName(name: String): Unit = {
    this.setAttribute("name", name)
  }

  def getName(): String = {
    this.getAttribute("name")
  }

  def clear(): Unit = {
    var firstChild = getContainer().firstChild
    while(firstChild != null) {
      getContainer().removeChild(firstChild)
      firstChild = getContainer().firstChild
    }
  }

}
{% endhighlight %}

We have made `MainAreaSectionElement` abstract to prevent its initiaization and force elements to inherit from it. The `clear`, `getContainer`, `setName`, `getName`, `clear` are used/overrided by all the child elements.

We have seen how object orientation helped us effectively design and implement all `*-section` elements which is something the would not have been possible with the plain JavaScript implementation.

  * Components communication:

Components can communicate into different ways like custom events and by invoking each others methods. For example, when adding a new expense we need to tell the `list-section` and the `delete-section` to re-render because a new element was added. Same goes for when deleting an expense. To do so, we have created custom events called `addExpense` and `deleteExpense` that we dispatch each time these events occur:

{% highlight scala %}
dom.document.dispatchEvent(new wrappers.Event("deleteExpense"))
{% endhighlight %}

At the level of the `main-area` element, we listen to the events and take the appropriate actions:

{% highlight scala %}
    dom.document.addEventListener("deleteExpense", (event: Event) => {
      getListSection().refreshUI()
      getDeleteSection().refreshUI()
    })
{% endhighlight %}

Another way of communication between components is by invoking each others methods. For example, the `app-element` listens to hash link changes and asks the `main-area` to select the desired section :

{% highlight scala %}
    dom.window.addEventListener("hashchange", (event: Event)  => {
      val hash = dom.window.location.hash.replace("#", "")
      getMainArea().select(hash)

    }, false)
{% endhighlight %}

  * Cross-Browser compatibility:

Not all browser support web components by default (Only Chrome and Opera by default). A web component polyfill needs to be added in case the app is to be run on other browsers. More details can be found in the github repository page: <https://github.com/WebComponents/webcomponentsjs>

## Wrap up

By supporting ES6, Scala.js opens a wide range of possiblities: using web components is one of them. The possibility of using web components makes Scala.js an attractive alternative for developing web applications while staying in the confort of the Scala language and benefiting from the support of IDEs.

source code: <https://github.com/gwidgets/scalajs-webcomponents-demo>
  
Running app: <https://gwidgets.github.io/scalajswebcomponents>