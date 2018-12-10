jQuery(".readmore").click(function(event){
    jQuery(event.target).parent().next(".more").show();
    jQuery(event.target).hide();
    return false;
});

jQuery(".readless").click(function(event){
  jQuery(event.target).parent().closest(".more").hide();
    jQuery(event.target).parent().prev().find(".readmore").show();
  return false;
});