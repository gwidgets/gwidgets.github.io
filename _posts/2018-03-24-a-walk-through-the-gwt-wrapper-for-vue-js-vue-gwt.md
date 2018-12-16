---
id_disqus: 782
title: 'A walk through the GWT wrapper for Vue.js: vue-gwt'
date: 2018-03-24T10:30:25+00:00
author: blogger
layout: post
permalink: /2018/03/24/a-walk-through-the-gwt-wrapper-for-vue-js-vue-gwt/
comments: true
tags:
  - GWT
excerpt:  Vue.js is one of the most popular JavaScript frameworks, along with Angular and React. It leverages modern techniques for building front end applications, and can come handy in maintaining apps that require considerable amount of JavaScript and CSS...
---
####  **Introduction:** 

<p style="text-align: justify">
  Vue.js is one of the most popular JavaScript frameworks, along with Angular and React. It leverages modern techniques for building front end applications, and can come handy in maintaining apps that require considerable amount of JavaScript and CSS. The perks of Vue.js are numerous, and can be found in their <a href="https://vuejs.org/v2/guide/" target="_blank">documentation</a>. In this post, we would like to focus on the GWT wrapper <a href="https://github.com/Axellience/vue-gwt/issues/19">vue-gwt</a> which was born recently with the increasing popularity of Vue.js. It is one of the most active projects in the GWT ecosystem. In addition to the nice Vue.js features, vue-gwt brings the robustness of Java to Vue.js, and introduces compile time checks for many things like variable initialization and types. One of the main aspects that caught our attention while testing Vue.js are its simplicity and smooth learning curve. With a minimal knowledge of JavaScript frameworks, the developer can immediately approach the framework. It is recommended that the developer gets familiarized with Vue.js first before starting to develop with its GWT adaptation. For the rest of the post, we will compare the following Vue.js demo application: <a href="https://github.com/zak905/vuejs-demo">https://github.com/zak905/vuejs-demo</a> with its GWT version: <a href="https://github.com/zak905/vuejs-gwt-demo" target="_blank">https://github.com/zak905/vuejs-gwt-demo</a>.
</p>

####  **Vue.js meets GWT:** 

The demo application is an expenses entry application with two main components: a form for entering expenses, and a table for displaying expenses. The App component looks like: 

<div style="display: flex;">
  <div style="width: 45%; overflow: auto;">
    JavaScript Version 
    
{% highlight html  %}
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <label for="vat"> VAT in %</label>
      <input id="vat" type="number" v-model="vatRate">
    </div>
     <ExpenseForm :currencies="currencies" :vatRate="vatRate" :expenses="expenses" />
     <div class="divider"></div>
     <ExpenseList :currencies="currencies" :expenses="expenses"/>
  </div>
</template>

<script>
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseList from './components/ExpenseList.vue'

export default {
  name: 'app',
  components: {
    ExpenseForm,
    ExpenseList
  },
   data: () => ({
     vatRate: 20,
    expenses: [],
    currencies: [{name: "EUR", symbol: "&euro;"}, {name: "USD", symbol: "$"}, {name: "GBP", symbol: "&pound;"}],
  }),
  
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.divider {
  height: 30px;
}
</style>
{% endhighlight %}

  </div>
  
  <div style="width: 10%">
  </div>
  
  <div style="width: 45%;overflow: auto;">
    GWT version: 
    
    <p>
      AppComponent.html
    </p>
    
{% highlight html  %}
<div id="app">
    <img style="width: 10%" src="./assets/logo.png">
    <div>
        <label for="vat"> VAT in %</label>
        <input id="vat" type="number" v-model="vatRate">
    </div>
    <expense-form :currencies="currencies" :vatRate="vatRate" :expenses="expenses" > </expense-form>
    <div class="divider"></div>
    <expense-list :currencies="currencies" :expenses="expenses" :vatRate="vatRate"> </expense-list>
</div>
{% endhighlight %}
    
    <p>
      AppComponent.java
    </p>
    
   {% highlight java  %}
@Component(components = {ExpenseFormComponent.class, ExpenseListComponent.class})
public class AppComponent extends VueComponent  {
    @JsProperty
    double vatRate = 20;

    @JsProperty
    List<Expense> expenses = new ArrayList<>();


    @JsProperty
    List<Currency> currencies = Arrays.asList(new Currency("EUR", "&euro;"),
                                              new Currency("USD", "$"),
                                              new Currency("GBP", "&pound;"));
}
   {% endhighlight %}
  </div>
</div>

  As the style tag is not supported into `*.html` yet (watch <a href="https://github.com/Axellience/vue-gwt/issues/19" target="_blank">this</a> issue for updates), all the styles should be included in a separate `*.css` for the GWT version. For the component tag names, Vue.js supports the full name, and does the tranformations itself, while in vue-gwt the convention is that the component should end with `Component` for the `.java/.html` and if the component is included as a child of any other component it should be included as a kebab-case with the word `Component` being removed. Example: `ExpenseFormComponent` is included as a child of AppComponent as `expense-form`.

The ExpenseForm component looks like: 

<div style="display: flex;">
  <div style="width: 45%; overflow: auto;">
    JavaScript version
    
{% highlight html %}
<template>
  <div class="expense-form">
    <label for="amount">Amount: </label>
    <input type="number" id="amount" v-model="amount"/>
    <label for="amountVAT">VAT: </label>
    <input type="number" id="amountVAT" v-model="amountVAT" disabled/>
    <label for="currency">Currency: </label>
    <select id="currency" v-model="currency">
      <option v-for="currency in currencies"> {{ currency.name }} </option>  
    </select>
    <label for="date"  >Date: </label>
    <input type="date" id="date" value="2018/03/06" v-model="date"/>
    <label for="reason">Reason: </label>
    <textarea id="reason" v-model="reason" />
    <button id="append" v-on:click="submitExpense"> Add Expense </button>
  </div>
</template>

<script>
export default {
  name: 'ExpenseForm',
  methods: {
    submitExpense: function(event) {
        this.expenses.push({"amount": this.amount, "date": this.date, "reason": this.reason, "vatRate": this.vatRate, "vat": this.amountVAT, "currency": this.currency});
    }
  },
  data: () => {
      return {
      amount: 0,
      date: '',
      reason: '',
      currency: ''
      }
  },
  props: {
    currencies: Array,
    expenses: Array,
    vatRate: Number,
  },
    computed: {
      amountVAT: function() {return parseFloat(this.vatRate / 100 * this.amount).toFixed(2)}
    }
}
</script>

//..styles etc,..
{% endhighlight %}

  </div>
  
  <div style="width: 10%">
  </div>
  
  <div style="width: 45%; overflow: auto;">
    GWT version<br /> ExpenseForm.html</p> 
    
{% highlight html  %}
<vue-gwt:import class="com.gwidgets.client.dto.Currency"/>
<div class="expense-form">
    <label for="amount">Amount: </label>
    <input type="number" id="amount" v-model="amount"/>
    <label for="amountVAT">VAT: </label>
    <input type="number" id="amountVAT" v-model="amountVAT" disabled/>
        <label for="currency">Currency: </label>
    <select id="currency" v-model="currency">
            <option v-for="Currency currency in currencies"> {% raw %} {{ currency.getName() }} {% endraw %}</option>
        </select>
    <label for="date"  >Date: </label>
    <input type="date" id="date" value="2018/03/06" v-model="date"/>
    <label for="reason">Reason: </label>
    <textarea id="reason" v-model="reason" />
    <button id="append" v-on:click="submitExpense"> Add Expense </button>
</div>
{% endhighlight %}
    
    <p>
      ExpenseForm.java
    </p>
    
    {% highlight java  %}
@Component
public class ExpenseFormComponent extends VueComponent {
    @JsProperty
    double amount =  0;
    @JsProperty
    String date = "";
    @JsProperty
    String reason="";
    @JsProperty
    String currency="";

    @Prop
    @JsProperty
    double vatRate;

    @Prop
    @JsProperty
    List<Expense> expenses;

    @Prop
    @JsProperty
    List<Currency> currencies;

    @JsMethod
    public void submitExpense() {
        expenses.add(new Expense(amount, date, reason, getAmountVAT(), vatRate, currency));
    }

    @Computed
    public double getAmountVAT() {
        return vatRate / 100 * amount;
    }
}
{% endhighlight %}
  </div>
</div>

The main difference between the two versions is the type enforcement in:

{% highlight html  %}
       <select id="currency" v-model="currency">
            <option v-for="Currency currency in currencies"> {% raw %} {{ currency.getName() }} {% endraw %} </option>
        </select>
{% endhighlight %}

which requires a special import tag:  `<vue-gwt:import class="com.gwidgets.client.dto.Currency"/>`
The ExpenseList component looks like: 

<div style="display: flex;">
  <div style="width: 45%; overflow: auto;">
    JavaScript version</p> 
    
{% highlight html  %}
  <template>
    <div class="expense-list">
        <table class="expense-table">
            <thead>
                <th>Amount</th>
                <th>Date</th>
                <th>VAT rate %</th>
                <th>VAT</th>
                <th>Reason</th>
            </thead>
            <tbody>
                <tr v-for="expense in expenses">
                    <td>{% raw %} {{ expense.amount + getCurrencySymbol(expense.currency, currencies)}} {% endraw %}</td>
                    <td>{{ expense.date }}</td>
                    <td>{{ expense.vatRate }}</td>
                    <td>{% raw %} {{ expense.vat + getCurrencySymbol(expense.currency, currencies)}} {% endraw %}</td>
                    <td>{{ expense.reason }}</td>
                </tr>

            </tbody>
        </table>
    </div>
  </template>

  <script>
  export default {
    name: 'ExpenseList',
    props: {
      currencies: Array,
      expenses: Array,
    },
    methods: {
        getCurrencySymbol: (currencyName, currencies) => {
              for (let i = 0; i < currencies.length; i++ ) {
              if (currencyName === currencies[i].name)
                return currencies[i].symbol;
            }  
            return "$"
            }
    }
  }
  </script>
{% endhighlight %}
  </div>
  
  <div style="width: 10%">
  </div>
  
  <div style="width: 45%; overflow: auto;">
    GWT version:<br /> ExpenseListComponent.html</p> 
    
{% highlight html  %}
<vue-gwt:import class="com.gwidgets.client.dto.Expense"/>
<div class="expense-list">
    <table class="expense-table">
        <thead>
        <th>Amount</th>
        <th>Date</th>
        <th>VAT rate %</th>
        <th>VAT</th>
        <th>Reason</th>
        </thead>
        <tbody>
        <tr v-for="Expense expense in expenses">
            <td>{% raw %} {{ expense.amount + getCurrencySymbol(expense.currency)}} {% endraw %}</td>
            <td>{{ expense.date }}</td>
            <td>{{ expense.vatRate }}</td>
            <td>{% raw %} {{ expense.amountVAT + getCurrencySymbol(expense.currency)}} {% endraw %}</td>
            <td>{{ expense.reason }}</td>
        </tr>
        </tbody>
    </table>
</div>
{% endhighlight %}
    
    <p>
      ExpenseListComponent.java
    </p>
    
{% highlight java  %}
@Component
public class ExpenseListComponent extends VueComponent {
    @Prop
    @JsProperty
    double vatRate;

    @Prop
    @JsProperty
    List<Expense> expenses;

    @Prop
    @JsProperty
    List<Currency> currencies;

    @JsMethod
    public String getCurrencySymbol(String currencyName) {
        return currencies.stream()
                         .filter(currency -> currency.getName().equals(currencyName))
                         .findFirst()
                         .map(Currency::getSymbol)
                         .orElse("$");
    }
}
{% endhighlight %}
  </div>
</div>

  
Once again the GWT version requires the  `Expense` type to be specified.
  

####  **What do you get with GWT on the top of Vue.js:** 

  At first sight, the code in the .java seems a lot cleaner and better structured. Moreover, vue-gwt adds many checks that can enforce the integrity of data and help avoid going into production with a broken app. One thing that is checked by vue-gwt at compile time is variables intialization. Suppose you are rendenring some lists or tables, and you forgot create the variable in the `v-for`. For example let&#8217;s remove `currencies` field from `AppComponent.java`. With vue-gwt, you will get a compile time error and you will not be able to build the application:


<pre>[17,8] In AppComponent.html at line 7: Couldn't find variable/method "currencies". Make sure you didn't forget the @JsProperty/@JsMethod annotation.
</pre>

  In the JavaScript version, the app can be built and served even with missing `currencies` in data. There is a message displayed in the browser console in the development mode; but off course, it maybe too late if the app is already deployed. In a small application like this, the effect may be minimal, but the repercussions may not be pleasant for a large application.

  Another benefit of using vue-gwt is taking advantage of new Java 8 APIs like optionals, streams...etc. Since the 2.8.0 version, features like streams and lambda expression are supported in GWT, and this may be a saver while working on complex transformations and data processing. For example, in the ExpenseListComponent we made use of the stream API to filter the currencies object:

{% highlight java  %}
    @JsMethod
    public String getCurrencySymbol(String currencyName) {
        return currencies.stream()
                         .filter(currency -> currency.getName().equals(currencyName))
                         .findFirst()
                         .map(Currency::getSymbol)
                         .orElse("$");
    }
{% endhighlight %}

  To be fair, there is also a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Streams_API" target="_blank">Stream API</a> in JavaScript, but it is not yet supported by all the browsers.

Finally, vue-gwt enforces type checks in templates as mentionned earlier: `<tr v-for="Expense expense in expenses">`, which can make the application even more robust and resistant to changes introduced to data objects. 

####  **Wrap up:** 

  Vue.js is a prominent JavaScript framework, and with vue-gwt, the developer gets even more on the top of it. vue-gwt introduces a new way of developing applications in GWT, by using `.html` templates and their corresponding `.java` classes, and the result is a robust Vue.js application with a Java codebase. On the other hand, using vue-gwt in dev-mode requires setting up the IDE for to automatically building/processing annotations, which can be considered as the annoying part of getting started, but it needs only to be done once. Also, vue-gwt is its 7th beta release, so it may still have some bugs, but it is under active development and it is moving steadily towards a stable release. GWT has met Vue.js, and it seems like GWT loves Vue.Js.