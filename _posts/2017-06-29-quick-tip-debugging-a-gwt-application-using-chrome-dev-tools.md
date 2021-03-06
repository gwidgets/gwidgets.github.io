---
id_disqus: 653
title: 'Quick Tip: Debugging a GWT application using Chrome Dev tools'
date: 2017-06-29T17:28:33+00:00
author: blogger
layout: post
permalink: /2017/06/29/quick-tip-debugging-a-gwt-application-using-chrome-dev-tools/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  Debugging is an important aspect of software development. Having the right tools can save a lot of time and headaches. Before GWT Super Dev mode, the classic Dev mode allowed to use JVM debugging...
---
<p style="text-align:justify">
  Debugging is an important aspect of software development. Having the right tools can save a lot of time and headaches. Before GWT Super Dev mode, the classic Dev mode allowed to use JVM debugging. Developers could set break points within their IDE and use debug mode to track bugs and errors. Now with the Super dev mode, things are different. The whole application is compiled and run within the browser, so using JVM debugging is not possible anymore. The question that comes to mind is: is it possible to debug Java in the browser ? luckily the answer is yes.<br /> In principle, browsers can only run and debug javascript. To overcome this shortcoming, source maps were introduced. Source maps serve as a blue print for mapping from a source to a target language. Source maps can be used for a variety of languages and even to map between minified and unminified javascript. In this post, we are going to use source maps and Chrome dev tools to debug our application error. We will use the <a href="https://github.com/gwidgets/gwt-polymer-starter-kit">polymer-starter-kit</a>, which suffers from a run time error, as an example. The error is the following:
</p>

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/06/ErrorPsK.png" alt="ErrorPsK" width="1344" height="230" class="aligncenter size-full wp-image-655" />](https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/06/ErrorPsK.png)

This error does not break the app, but it is important to know what causes it.

####  **Without source maps:** 

If we try going to the sources without enabling source maps, we would not be enable to tell where the error is happening in our source code. 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/06/ErrorPsKJs.png" alt="ErrorPsKJs" width="1138" height="377" class="aligncenter size-full wp-image-657" />](http://www.g-widgets.com/wp-content/uploads/2017/06/ErrorPsKJs.png)

####  **Enabling source maps:** 

<p style="text-align:justify">
  To overcome this, we need to activate source maps. Source maps can be activated on Chrome by going to settings -> Sources -> Enable JavaScript source maps. Normally source maps are generated by default by the GWT compiler. In case they are not, setting the following property in the .gwt.xml can active them:
</p>

{% highlight xml %}
<set-property name="compiler.useSourceMaps" value="true" /> 
{% endhighlight %}

After enabling breakpoints we can see that the error now points to the .java file and not the .js file: 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/06/ErrorPsKJava.png" alt="ErrorPsKJava" width="1344" height="267" class="aligncenter size-full wp-image-656" />](http://www.g-widgets.com/wp-content/uploads/2017/06/ErrorPsKJava.png)

####  **Setting a break point:** 

<p style="text-align:justify">
  Now that we see where the error happens, we can set a breakpoint to inspect the state of the application. The breakpoint can be simply set by clicking on the line number in the editor.
</p>

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/06/ErrorPskBreak.png" alt="ErrorPskBreak" width="1341" height="484" class="aligncenter size-full wp-image-658" />](http://www.g-widgets.com/wp-content/uploads/2017/06/ErrorPskBreak.png)

#### **Tracking the error:** 

Finally, we can refresh the application. The application will stop when it reaches the breakpoint. We can then inspect the call stack and the variables values. 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2017/06/ErrorPskCallStack.png" alt="ErrorPskCallStack" width="1343" height="458" class="aligncenter size-full wp-image-659" />](http://www.g-widgets.com/wp-content/uploads/2017/06/ErrorPskCallStack.png)

Now that we know were the error happens exactly in our code. We can check if we misused a statement. In this case, removing this line, which was useless, was enough.

####  **Using Chrome workspace (Optional)** 

Chrome workspaces allows mapping files loaded by the browser to files on disk and making changes directly to files from Chrome. This can be useful if you do not need IDE assistance, and do not want go back and forth from the browser to the IDE. To make use of Chrome workspace, you can right click on and empty spot on the Sources Tab on the left and click on &#8220;add folder to workspace&#8221;. Then, you can right click on the opened file, and click on &#8220;map to file system resource&#8221;. More on that can found at: <https://developers.google.com/web/tools/setup/setup-workflow>

####  **Wrap-up:** 

<p style="text-align:justify">
  Debugging GWT apps in the browser using source maps can save a lot of time, and help track errors properly. Chrome Dev tool offers a powerful debugging tool that can help increase productivity and quickly resolve bugs. More advanced debugging features are offered by the Chrome Dev tool such as debugging HTTP requests and DOM changes, if you would like to explore those, you can go to Google&#8217;s user guide: <a href="https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints">https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints</a>
</p>

 **Worth watching :** [DevTools: State of the Union 2017 (Google I/O &#8217;17)](https://www.youtube.com/watch?v=PjjlwAvV8Jg&t=272s&index=116&list=WL)