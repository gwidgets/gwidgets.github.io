---
id: 475
title: 'gwty-leaflet: features and upcoming changes'
date: 2016-11-29T20:12:50+00:00
author: blogger
layout: post
guid: http://www.g-widgets.com/?p=475
permalink: /2016/11/29/gwty-leaflet-features-and-upcoming-changes/
comments: true
dsq_needs_sync:
  - "1"
excerpt:  As the 1.0 version of leaflet has came out recently, gwty-leaflet is undergoing API changes to adapt to the changes in leaflet. The change set between 0.7 and 1.0 is pretty significant, so the changes are introduced gradually into the 0.5-SNAPSHOT version...
---
As the 1.0 version of leaflet has came out recently, gwty-leaflet is undergoing API changes to adapt to the changes in leaflet. The change set between 0.7 and 1.0 is [pretty significant](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md), so the changes are introduced gradually into the 0.5-SNAPSHOT version. The 0.4 version of gwty-leaflet has been moved to a different branch that will be maintained in parallel: <https://github.com/gwidgets/gwty-leaflet/tree/v0.4>.

Concerning the new features, a dynamic script loading feature has been added to leaflet, to allow loading leaflet resource files (leaflet.js, and leaflet.css) from GWT code, in the same fashion as Polymer. The LeafletResources.whenready() method uses a callback to insert the code for map creation and manipulation that will executed when resources are ready. Here is an example below: 

[<img src="https://s3-eu-west-1.amazonaws.com/gwidgets/uploads/2016/11/ResoucesLeaflet.png" alt="ResoucesLeaflet" width="896" height="263" class="aligncenter size-full wp-image-477" />](http://www.g-widgets.com/wp-content/uploads/2016/11/ResoucesLeaflet.png)