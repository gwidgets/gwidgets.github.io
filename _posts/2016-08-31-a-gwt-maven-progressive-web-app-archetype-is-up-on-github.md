---
id_disqus: 403
title: A GWT maven progressive web app archetype is up on Github
date: 2016-08-31T20:37:55+00:00
author: blogger
layout: post
permalink: /2016/08/31/a-gwt-maven-progressive-web-app-archetype-is-up-on-github/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  Because developing a progressive web app tutorial from scratch can be mind-boggling, we created a GWT progressive web application structure with; an app shell for fast painting, service workers for offline usage, and a manifest file for installation to home screen. The archetype uses some Polymer elements...
---
<p style="text-align:justify">
  Because developing a progressive web app tutorial from scratch can be mind-boggling, we created a GWT progressive web application structure with: an app shell for fast painting, service workers for offline usage, and a manifest file for installation to home screen. The archetype uses some Polymer elements because they are responsive out of the box. The application relies on JsInterop for registering the service worker. The service worker is, however, provided as an external js script because they can not be mixed with the application javascript (it causes errors). More details on the archetype can be found on the project&#8217;s page on Github: <a href="https://github.com/gwidgets/gwt-ui-archetypes">https://github.com/gwidgets/gwt-ui-archetypes </a>
</p>

A demo app can be found here: <https://pwa-template.herokuapp.com/>