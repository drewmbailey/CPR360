jQuery(function($){
  console.log('document ready');

  //FANCYBOX
  $(".fancybox").fancybox({
    padding: 0,
    helpers: {
      overlay: {
        locked: false
      }
    }
  });
  
  // ACCORDION
  var icons = {
    header: "iconClosed",    // custom icon class
    activeHeader: "iconOpen" // custom icon class
  };

  $( "#accordion" ).accordion({heightStyle: "content", 
    icons: icons, 
    collapsible: true
  });

  $( "#resources" ).accordion({heightStyle: "content", 
    heightStyle: "content",
    active: false, 
    collapsible: true,
    active: 1,
    icons: icons
   });

  $( "#comments" ).accordion({header: "h2",
    heightStyle: "content",
    active: false, 
    collapsible: true,
    active: 1,
    icons: icons
   });

  //MAKE HASHTAG IN URL OPEN VIDEO
  $(function(){
     var hash = location.hash;
     var anchor = $('a[href$="'+hash+'"]');
     if (anchor.length > 0){
        anchor.click();
     }
  });

  // CHANGE VIDEO BY CLICKING THUMBNAIL LINK
  $('.vid_button').on('click', function(){
    console.log('video clicked');
    console.log('this = ' + $(this).html());   

    $('#accordion .vid_button').removeClass('active');
    $(this).addClass('active');

    var URL = $(this).attr('data-link');
    var htm = '<iframe id="player" frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="390" src="https://www.youtube.com/embed/' + URL + '?enablejsapi=1&wmode=transparent"></iframe>';
    var SetURL = 'http://gdata.youtube.com/feeds/api/videos/' + URL + '?v=2&alt=json';

    console.log('URL = ' + URL);
    console.log('SetURL = ' + SetURL);
    getYouTubeInfo();

    $('#player').html(htm);
    return false;
  });

  // LOAD MOST RECENT VIDEO ON PAGE LOAD
  $('#mostRecent').trigger('click');
  
  // YOUTUBE COMMENTS
  function getYouTubeInfo() {

    var youtubeID = $('a.vid_button.active').attr('data-link');
    console.log('youtubeID = ' + youtubeID);

    $.ajax({
      url: 'http://gdata.youtube.com/feeds/api/videos/' + youtubeID + '?v=2&alt=json',
      dataType: 'jsonp',
      success: function (data) {
        console.log('success');
        $('#comments div').empty();
        parseresults(data);
      },
      failure: function (data) {
        console.log('error');
      }
    });

    //SHARE LINK
    $("#shareButton").on("click", function(){
      console.log("button clicked");
      //$("#sharePopup").css("display", "inline");
      $("#sharePopup").show();
    });

    $(document).on("click", function(e) {
      if (e.target.id != "shareButton" && !$("#shareButton").find(e.target).length) {
        $("#sharePopup").hide();
      }
    });

    var shareList =
      '<ul>' 
        + '<li><a href="http://twitter.com/home?status=' + location + "#" + youtubeID + '" target="_blank"><div class="shareItems" id="twitterButton"></div></a></li>'
        + '<li><a href="mailto:?Subject=Check%20out%20CPR360!&body=I%20thought%20you%20might%20find%20this%20interesting:%20' + location + "#" + youtubeID + '"><div class="shareItems" id="mailButton"></div></a></li>'
        + '<li><a href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=http://youtu.be/' + youtubeID + '&p[images][0]=&p[title]=&p[summary]="  target="_blank"><div class="shareItems" id="facebookButton"></div></a></li>'
        + '<li><a href="http://www.linkedin.com/shareArticle?mini=true&url=http://zoll.com/cpr360/index.html&title=CPR360&summary=I%20thought%20you%20might%20like%20this%20video&source=CPR360"><div class="shareItems" id="linkedinButton"></div></a></li>'
        + '<li><a href="http://www.tumblr.com/search/cpr360"  target="_blank"><div class="shareItems" id="tumblrButton"></div></a></li>'
        + '<li><a href="https://plus.google.com/share?url=http://youtu.be/' + youtubeID + '"  target="_blank"><div class="shareItems" id="gplusButton"></div></a></li>'
      + '</ul>';

    $("#sharePopup").html(shareList); 
    console.log(shareList);
  }

  // PARSE COMMENTS
  function parseresults(data) {
    var title = data.entry.title.$t;
    var description = data.entry.media$group.media$description.$t;
    var viewcount = data.entry.yt$statistics.viewCount;
    var author = data.entry.author[0].name.$t;


    $('#title h2').html(title);
    $('#description').html('<b>Description</b>: ' + description);
    //$('#extrainfo').html('<b>Author</b>: ' + author + '<br/><b>Views</b>: ' + viewcount);
    getComments(data.entry.gd$comments.gd$feedLink.href + '&max-results=50&alt=json', 1);
  }

  // GET COMMENTS
  function getComments(commentsURL, startIndex) {
    $.ajax({
      url: commentsURL + '&start-index=' + startIndex,
      dataType: 'jsonp',
      success: function (data) {
      $.each(data.feed.entry, function(key, val) {
        $('#comments div').append('<img src=https://i.ytimg.com/i/k3fMQ3kNXYg/s48-c-k-no/1.jpg>' + '<h4>' + val.author[0].name.$t + '</h4>' + '<p>' + val.content.$t + '</p>');
      });
      if ($(data.feed.entry).size() == 50) { getComments(commentsURL, startIndex + 50); }
      }
    });
  }

});