---
id: 575
title: gwty-leaflet 0.5-rc1 is released
date: 2017-02-08T17:29:37+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=575
permalink: /2017/02/08/gwty-leaflet-0-5-rc1-is-released/
comments: true
dsq_needs_sync:
  - "1"
excerpt:  We have released gwty-leaflet 0.5-rc1 with a key feature; compatibility with Leaflet 1.0. Leaflet 1.0 is considered the fastest, most stable and polished Leaflet release ever...

---
We have released gwty-leaflet 0.5-rc1 with a key feature: compatibility with Leaflet 1.0. Leaflet 1.0 is considered the fastest, most stable and polished Leaflet release ever.
  
Other changes in the gwty-leaflet&#8217;s new version are some bug fixes in addition to new CRS and Projection constants. The bug fixes include fixing a typing issue that caused some methods (zoomIn(), zoomOut(), transform(),&#8230;) to return unexpected results. From now on, gwty-leaflet switched from the Generic [Number](https://docs.oracle.com/javase/7/docs/api/java/lang/Number.html) class to either double or int.
  
If there are no reported major bugs in a couple of weeks, the rc1 version will become the 0.5 or the GA version.
  
Another important announcement is that since Leaflet release cycle is getting shorter (2 to 4 weeks), with small incremental changes for each release, gwty-leaflet will keep up with only major releases. After the 0.5 version, we are starting to work on the 1.0 version which will include some goodies for manipulating maps and GeoJson. Hoping you enjoy Leaflet with a GWT flavor, please let us know if you encounter any bugs.