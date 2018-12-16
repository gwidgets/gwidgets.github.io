---
id_disqus: 836
title: Introduction to scalatags in Scala.js
date: 2018-05-27T18:34:38+00:00
author: blogger
layout: post
permalink: /2018/05/27/introduction-to-scalatags-in-scala-js/
comments: true
tags:
  - Scala.js
excerpt: scalatags is a Scala library that allows generating dom parts or snippets in a functional style. In the same spirit as Elemento for GWT, scalatags's goal is to interact with the dom using...
---

## Introduction

[scalatags](http://www.lihaoyi.com/scalatags/#GettingStarted) is a Scala library that allows generating dom parts or snippets in a functional style. In the same spirit as [Elemento](https://github.com/hal/elemento) for GWT, `scalatags`&#8216;s goal is to interact with the dom using clean and understandable code while keep it to the minimum. In this post, we are going to go through some examples of usage of `scalatags` based on the web component&#8217;s [project](https://github.com/gwidgets/scalajs-webcomponents-demo).

## Setup

To set up `scalatags` in a Scala.js project, the following dependency need to be added to the `build.sbt`:

{% highlight scala  %}
libraryDependencies += "com.lihaoyi" %%% "scalatags" % "0.6.7"
 {% endhighlight %}

or

{% highlight scala  %}
libraryDependencies ++= Seq(
  "com.lihaoyi"       %%% "scalatags" % "0.6.7"
)
 {% endhighlight %}

## Working with the DOM

Thanks to the [contribution](https://github.com/gwidgets/scalajs-webcomponents-demo/pull/1) of [scalway](https://github.com/scalway), the web component&#8217;s example have been improved using `scalatags`, so the creational statements are now cleaner and more concise.

<div style="display: flex">
  <div style="overflow: scroll; width: 45%;">
    <p>
      <strong> With scalatags</strong>
    </p>
    
{% highlight scala  %}
  val amountInput = input(*.tpe := "number", *.id := "amountInput").render
    val dateInput = input(*.tpe := "date", *.id := "dateInput").render
    val reasonInput = textarea(*.id := "reasonInput").render
    val amountLabel = label("Amount: ", *.`for` := "amountInput").render
    val dateLabel = label(*.`for` := "dateInput", "Date: ").render
    val reasonLabel = label(*.`for` := "reasonInput", "Reason: ").render

    val submitButton = button("Add", *.cls := "action-button",
      *.onclick := { () =>
        val id = UUID.randomUUID().toString
        val expense = new Expense(id, getExpenseAmount(), getExpenseDate(), getExpenseReason())
        var expenseAsJson = expense.asJson
        println(expenseAsJson)
        dom.window.localStorage.setItem(expense.id, expenseAsJson.toString())
        dom.document.dispatchEvent(new wrappers.Event("addExpense"))
      }
    ).render
{% endhighlight %}
  </div>
  
  <div style="width: 5%">
  </div>
  
  <div style="overflow: scroll; width: 45%;">
    <p>
      <strong> Without scalatags</strong>
    </p>
    
  {% highlight scala  %}
    val amountInput = dom.document.createElement("input").asInstanceOf[HTMLInputElement]
        amountInput.`type` = "number"
        amountInput.id = "amountInput"
        val dateInput = dom.document.createElement("input").asInstanceOf[HTMLInputElement]
        dateInput.`type` = "date"
        dateInput.id = "dateInput"
        val reasonInput = dom.document.createElement("textarea").asInstanceOf[HTMLTextAreaElement]
        reasonInput.id = "reasonInput"

        val amountLabel = dom.document.createElement("label").asInstanceOf[HTMLLabelElement]
        amountLabel.htmlFor = "amountInput"
        amountLabel.textContent = "Amount: "
        val dateLabel = dom.document.createElement("label").asInstanceOf[HTMLLabelElement]
        dateLabel.htmlFor = "dateInput"
        dateLabel.textContent = "Date: "
        val reasonLabel = dom.document.createElement("label").asInstanceOf[HTMLLabelElement]
        reasonLabel.htmlFor = "reasonInput"
        reasonLabel.textContent = "Reason: "

        val submitButton = dom.document.createElement("button").asInstanceOf[HTMLButtonElement]
        submitButton.textContent = "Add"
        submitButton.classList.add("action-button")

        submitButton.addEventListener("click", (event: Event) => {
          val id = UUID.randomUUID().toString
          val expense = new Expense(id, getExpenseAmount(), getExpenseDate(), getExpenseReason())
          var expenseAsJson = expense.asJson
          println(expenseAsJson)
          dom.window.localStorage.setItem(expense.id, expenseAsJson.toString())
          dom.document.dispatchEvent(new wrappers.Event("addExpense"))
        })


        getContainer().appendChild(amountLabel)
        getContainer().appendChild(amountInput)
        getContainer().appendChild(dateLabel)
        getContainer().appendChild(dateInput)
        getContainer().appendChild(reasonLabel)
        getContainer().appendChild(reasonInput)
        getContainer().appendChild(submitButton)
  {% endhighlight %}
  </div>
</div>

We can see that `scalatags` has helped in reducing boilerplate.

<div style="display: flex">
  <div style="overflow: scroll; width: 45%;">
    <p>
      <strong> With scalatags</strong>
    </p>
    
      {% highlight scala  %}
        val data = (0 until dom.window.localStorage.length).map { i =>
              val key = dom.window.localStorage.key(i)
              Option(dom.window.localStorage.getItem(key))
            }.collect {
              case Some(e) => decode[Expense](e).toSeq.last
            }

            dataTable = table(*.cls := "data-table",
              thead(tr(th("id"), th("amount"), th("date"), th("reason"))),
              data.map { expense =>
                tr(
                  td(expense.id),
                  td(expense.amount),
                  td(expense.date),
                  td(expense.reason)
                )
              }
            ).render

            getContainer().appendChild(dataTable)
    {% endhighlight %}
  </div>
  
  <div style="width: 5%">
  </div>
  
  <div style="overflow: scroll; width: 45%;">
    <p>
      <strong> Without scalatags</strong>
    </p>
    
    {% highlight scala  %}
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

        for (i <- 0 until dom.window.localStorage.length) {
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
{% endhighlight %}
  </div>
</div>

Coupled with Scala streams, the creation of the expenses table is cleaner and meaningful.

More examples can be found in this [pull request](https://github.com/gwidgets/scalajs-webcomponents-demo/pull/1).

## Conclusion

`scalatags` can become an indispensable tool for creating and interacting with dom elements in Scala.js especially for large scale applications. `scalatags` can help make the codebase more maintainable by reducing the boilerplate code and improving readability.