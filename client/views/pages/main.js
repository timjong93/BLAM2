import '/imports/ui/plugins/common/common.min.js';
import '/imports/ui/custom.min.js';
import '/imports/ui/settings.js';
import '/imports/ui/gleek.js';

Template.main.rendered = function(){

    // Add gray color for background in blank layout
    // $('body').addClass('gray-bg');

        // Fix height of layout when resize, scroll and load
    // $(window).bind("load resize scroll", function() {
    //     if(!$("body").hasClass('body-small')) {

    //         var navbarHeight = $('nav.navbar-default').height();
    //         var wrapperHeight = $('#page-wrapper').height();

    //         if(navbarHeight > wrapperHeight){
    //             $('#page-wrapper').css("min-height", navbarHeight + "px");
    //         }

    //         if(navbarHeight < wrapperHeight){
    //             $('#page-wrapper').css("min-height", $(window).height()  + "px");
    //         }

    //         if ($('body').hasClass('fixed-nav')) {
    //             if (navbarHeight > wrapperHeight) {
    //                 $('#page-wrapper').css("min-height", navbarHeight  + "px");
    //             } else {
    //                 $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
    //             }
    //         }
    //     }
    // });


    // SKIN OPTIONS
    // Uncomment this if you want to have different skin option:
    // Available skin: (skin-1 or skin-3, skin-2 deprecated)
    // $('body').addClass('skin-4');

    $('.scrollRow').perfectScrollbar();

}