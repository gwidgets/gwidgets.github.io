---
id: 83
title: Customized CellTable Header in GWT
date: 2015-11-19T20:26:54+00:00
author: blogger
layout: post
guid: http://localhost/wordpress2/?p=83
permalink: /2015/11/19/gwt-celltable-header/
comments: true
dsq_needs_sync:
  - "1"
tags:
  - GWT
excerpt:  GWT CellTable provides almost all what a developper wants from a table; paging, sorting, data binding,..etc. However, customizing the header/footer is not provided out of the box, and there is only few resources online that describes how...

---
<div dir="ltr" style="text-align: left;" trbidi="on">
  
  <div class="separator" style="clear: both; text-align: center;">
    <a href="http://4.bp.blogspot.com/-OamVSqr1Gsg/ViaHpCIRMfI/AAAAAAAAAm8/q8fOpKRFJQg/s1600/gwt52.jpg" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="183" src="http://4.bp.blogspot.com/-OamVSqr1Gsg/ViaHpCIRMfI/AAAAAAAAAm8/q8fOpKRFJQg/s320/gwt52.jpg" width="320" /></a>
  </div>
  
  <p>
  </p>
  
  <p style="text-align:justify;">
    GWT <a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/user/cellview/client/CellTable.html">CellTable</a> provides almost all what a developper wants from a table: paging, sorting, data binding,..etc. However, customizing the header/footer is not provided out of the box, and there is only few resources online that describes how. In this tutorial, we will go through how to customize the CellTable header with components such as buttons and textfields, and also how to change the span of header cells. same thing applies to footers.
  </p>
  
  
  <div>
    First of all, lets create a Cell table with some sample data. We are going to use a DTO such as:
  </div>
  


{% highlight java  %}
public class Period {
	
	private String date;
	
	private String remarks;
	
	
	public Period(String date, String remarks){
		this.setDate(date);
		this.setRemarks(remarks);
	}


	/**
	 * @return the date
	 */
	public String getDate() {
		return date;
	}


	/**
	 * @param date the date to set
	 */
	public void setDate(String date) {
		this.date = date;
	}


	/**
	 * @return the remarks
	 */
	public String getRemarks() {
		return remarks;
	}


	/**
	 * @param remarks the remarks to set
	 */
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

}
{% endhighlight %}
    
    <p>
      We can then create our table in the entry point class:
    </p>
    
    <p>
    </p>
    
    {% highlight java  %}
		public class MainPage implements EntryPoint {
			
		
			/**
			 * This is the entry point method.
			 */
			public void onModuleLoad() {
				 final CellTable<Period> table = new CellTable<Period>();
				    
				    List<Period> periods = new ArrayList<Period>();
				    periods.add(new Period("2006 / 04 / 06 ", "Hiring 3 developpers"));
				    periods.add(new Period("2011 / 08 / 05", "Project Kick off"));
				    periods.add(new Period("2010 / 02 / 04",  "1st milestone due"));
				    periods.add(new Period("2014 / 11 / 17",  "Three test"));
				    periods.add(new Period("2015 / 12 / 26", "another test"));
				    
				    TextColumn<Period> commentsColumn = new TextColumn<Period>(){
						@Override
						public String getValue(Period object) {
							return object.getRemarks();
						}
				    };
				    
				    TextColumn<Period> datesColumn = new TextColumn<Period>(){
						@Override
						public String getValue(Period object) {
							return object.getDate().toString();
						}
				    };
				    
				    table.addColumn(commentsColumn, "Comments");
				    table.addColumn(datesColumn, "Dates");
				    
				    table.setRowData(periods);
				    
				    RootPanel.get("celltable").add(table);
			}
		{% endhighlight %}
    
    <p>
      Our table now looks like:
    </p>
    
    <div class="separator" style="clear: both; text-align: center;">
      <a href="http://2.bp.blogspot.com/-3saqp9K_BFM/ViZ2EIvgXKI/AAAAAAAAAmg/fTwTrKYZJZE/s1600/CellTable.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" src="http://2.bp.blogspot.com/-3saqp9K_BFM/ViZ2EIvgXKI/AAAAAAAAAmg/fTwTrKYZJZE/s1600/CellTable.png" /></a>
    </div>
    
  <p style="text-align:justify;">
      Suppose we need to customize the header ( thead in HTML terms) by adding two rows: the first spans over two cells and has a button, and the second one has two cells one with a textfield and the other one with a list. To customize a CellTable header, we need to extend the abstract class &nbsp;<a href="http://www.gwtproject.org/javadoc/latest/com/google/gwt/user/cellview/client/AbstractHeaderOrFooterBuilder.html">AbstractHeaderOrFooterBuilder</a>
  </p>
    
  {% highlight java  %}
	public class MyCustomHeaderBuilder extends AbstractHeaderOrFooterBuilder<Period> {
	
	    public MyCustomHeaderBuilder(AbstractCellTable<Period> table,
				boolean isFooter) {
			super(table, isFooter);
			// TODO Auto-generated constructor stub
		}
	
	    @Override
	    public boolean buildHeaderOrFooterImpl() {
			TableRowBuilder row = startRow();
			TableCellBuilder th = row.startTH().colSpan(2);
			DivBuilder div = th.startDiv();
			
			Button button = new Button("Option");
			TextBox field = new TextBox();
			ListBox list = new ListBox();
			list.addItem("item 1");
			list.addItem("item 2");
			list.addItem("item 3");
			 
			button.getElement().setId("headerButton");
			 div.html(SafeHtmlUtils.fromTrustedString("Period "+ button.getElement()));
			 
			 div.end();
			 th.endTH();
			 row.endTR();
			 
			 row.startTR();
			 th = row.startTH();
				div = th.startDiv();
				 
				 div.html(SafeHtmlUtils.fromTrustedString("Comment" + field.getElement()));
				 
				 div.end();
				 th.endTH();
			 
			 th = row.startTH();
				div = th.startDiv();
				
				 div.html(SafeHtmlUtils.fromTrustedString("Date " + list.getElement()));
				 
				 div.end();
				 th.endTH();
			 row.endTR();
			
	      return true;
	    }
	  }
	{% endhighlight %}
    
    <p>
      Finally, we need to set our new header builder in the cell table we created:
    </p>
    
{% highlight java  %}
	table.setHeaderBuilder(new MyCustomHeaderBuilder(table, false));
{% endhighlight %}

    
<p>
  Result:
</p>
    
<div class="separator" style="clear: both; text-align: center;">
      <a href="http://1.bp.blogspot.com/-ZbjdBtQch-c/ViZ5YPvWdCI/AAAAAAAAAms/KAuuPrxA7To/s1600/CellTable2.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="260" src="http://1.bp.blogspot.com/-ZbjdBtQch-c/ViZ5YPvWdCI/AAAAAAAAAms/KAuuPrxA7To/s320/CellTable2.png" width="320" /></a>
</div>