jQuery(function($){
  console.log('document ready');
  // ACCORDION 
  $( "#accordion" ).accordion({heightstyle: "content" });
  
  // CHANGE VIDEO BY CLICKING THUMBNAIL LINK
  $('.vid_button').on('click', function(){
    console.log('video clicked');
    console.log('this = ' + $(this).html());

    $('#accordion .vid_button').removeClass('active');
    $(this).addClass('active');

    var URL = $(this).attr('data-link');
    var htm = '<iframe id="player" frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="390" src="https://www.youtube.com/embed/' + URL + '?enablejsapi=1"></iframe>';
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
        + '<li><a href="http://twitter.com/home?status=http://youtu.be/' + youtubeID + '" target="_blank"><div class="shareItems" id="twitterButton"></div></a></li>'
        + '<li><a href=""  target="_blank"><div class="shareItems" id="vimeoButton"></div></a></li>'
        + '<li><a href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=http://youtu.be/' + youtubeID + '&p[images][0]=&p[title]=&p[summary]="  target="_blank"><div class="shareItems" id="facebookButton"></div></a></li>'
        + '<li><a href="http://www.linkedin.com/shareArticle?mini=true&url=http://youtu.be/' + youtubeID + '&title=&summary=&source="  target="_blank"><div class="shareItems" id="linkedinButton"></div></a></li>'
        + '<li><a href="https://www.tumblr.com/login?share_redirect_to=%2Fshare%2Flink%3Furl%3Dhttp%253A%252F%252Fyoutu.be%252F' + youtubeID + '"  target="_blank"><div class="shareItems" id="tumblrButton"></div></a></li>'
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
        $('#comments div').append('<h4>' + val.author[0].name.$t + '</h4>' + '<p>' + val.content.$t + '</p>');
      });
      if ($(data.feed.entry).size() == 50) { getComments(commentsURL, startIndex + 50); }
      }
    });
  }

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
      + '<li><a href="http://twitter.com/home?status=http://youtu.be/' + youtubeID + '"><div class="shareItems" id="twitterButton"></div></a></li>'
      + '<li><a href=""><div class="shareItems" id="vimeoButton"></div></a></li>'
      + '<li><a href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=http://youtu.be/-oTndxsUdnk&p[images][0]=&p[title]=&p[summary]="><div class="shareItems" id="facebookButton"></div></a></li>'
      + '<li><a href="http://www.linkedin.com/shareArticle?mini=true&url=http://youtu.be/DMPKLJhT8uQ&title=&summary=&source="><div class="shareItems" id="linkedinButton"></div></a></li>'
      + '<li><a href="https://www.tumblr.com/login?share_redirect_to=%2Fshare%2Flink%3Furl%3Dhttp%253A%252F%252Fyoutu.be%252FDMPKLJhT8uQ"><div class="shareItems" id="tumblrButton"></div></a></li>'
      + '<li><a href="https://plus.google.com/share?url=http://youtu.be/-oTndxsUdnk"><div class="shareItems" id="gplusButton"></div></a></li>'
    + '</ul>';

  $("#sharePopup").html(shareList); 
  console.log(shareList)

});