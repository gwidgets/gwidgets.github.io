---
id_disqus: 405
title: Version 0.4 of gwty-leaflet is available
date: 2016-09-04T12:05:05+00:00
author: blogger
layout: post
permalink: /2016/09/04/version-0-4-of-gwty-leaflet-is-available/
comments: true
dsq_needs_sync:
  - "1"
excerpt:  We introduced a new change in the options object, so we bumped [gwty-leaflet](https://github.com/gwidgets/gwty-leaflet) to version 0.4-SNAPSHOT straight from 0.3-SNAPSHOT ( 0.3 did not get a release)...

---
We introduced a new change in the options object, so we bumped [gwty-leaflet](https://github.com/gwidgets/gwty-leaflet) to version 0.4-SNAPSHOT straight from 0.3-SNAPSHOT ( 0.3 did not get a release). For the version 0.4, we introduced options builders ( the builder pattern) for guiding the developer to easily see what are the required fields for creating options. Options objects are now immutable native Javascript objects that can only be created using their builders.
  
The version 0.4 also updated the GWT version from 2.8.0-rc1 to 2.8.0-rc2. More details can be found on the Github page.
  
The [demo project](https://github.com/gwidgets/gwty-leaflet-starter-guide) was also updated to accommodate the new version changes.