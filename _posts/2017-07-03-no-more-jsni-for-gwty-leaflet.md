---
id_disqus: 668
title: No more JSNI for gwty-leaflet
date: 2017-07-03T09:13:50+00:00
author: blogger
layout: post
permalink: /2017/07/03/no-more-jsni-for-gwty-leaflet/
comments: true
dsq_needs_sync:
  - "1"
excerpt: gwty-leaflet is mainly using Jsinterop for interfacing with LeafletJs. However, we have been using a little JSNI for defining Event objects, and the reason behind that was to benefit from the .cast() method for casting from the parent Event object to other types of child objects...

---
[gwty-leaflet](https://github.com/gwidgets/gwty-leaflet) is mainly using Jsinterop for interfacing with LeafletJs. However, we have been using a little JSNI for defining Event objects, and the reason behind that was to benefit from the .cast() method for casting from the parent [Event](https://github.com/gwidgets/gwty-leaflet/blob/master/src/main/java/com/gwidgets/api/leaflet/events/Event.java) object to other types of child objects. Now JSNI is no longer used, and gwty-leaflet is 100 % Jsinterop, thanks to the work of [olivergg](https://github.com/olivergg). This github issue provides more details about the work done: <https://github.com/gwidgets/gwty-leaflet/issues/7>. The next step for gwty-leaflet is to replace the used HTML elements under .elemental package with Google&#8217;s [Elemental 2](https://github.com/google/elemental2).