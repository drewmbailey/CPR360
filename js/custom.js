// ACCORDION 
  $(function() {
    $( "#accordion" ).accordion({autoHeight: "content" });
  });

//  CHANGE VIDEO BY CLICKING THUMBNAIL LINK
  $(document).ready(function(){
   
    $('.vid_button').click( function(e){
      e.preventDefault();
      var URL = $(this).attr('href');
      var htm = '<iframe id="player" frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="390" src="https://www.youtube.com/embed/' + URL + '?enablejsapi=1"></iframe>';
     
    $('#player').html(htm);
      return false;
    });
  });

//  LOAD MOST RECENT VIDEO ON PAGE LOAD
  $(document).ready(function(){
    $("#mostRecent").click()
  });

// YOUTUBE COMMENTS
  function getYouTubeInfo() {
    $.ajax({
      url: "http://gdata.youtube.com/feeds/api/videos/DMPKLJhT8uQ?v=2&alt=json",
      dataType: "jsonp",
      success: function (data) { parseresults(data); }
    });
  }

  function parseresults(data) {
    var title = data.entry.title.$t;
    var description = data.entry.media$group.media$description.$t;
    var viewcount = data.entry.yt$statistics.viewCount;
    var author = data.entry.author[0].name.$t;
    $('#title').html(title);
    $('#description').html('<b>Description</b>: ' + description);
    //$('#extrainfo').html('<b>Author</b>: ' + author + '<br/><b>Views</b>: ' + viewcount);
    getComments(data.entry.gd$comments.gd$feedLink.href + '&max-results=50&alt=json', 1);
  }

  function getComments(commentsURL, startIndex) {
    $.ajax({
      url: commentsURL + '&start-index=' + startIndex,
      dataType: "jsonp",
      success: function (data) {
      $.each(data.feed.entry, function(key, val) {
        $('#comments').append('<h4>' + val.author[0].name.$t + '</h4>' + '<p>' + val.content.$t + '</p>');
      });
      if ($(data.feed.entry).size() == 50) { getComments(commentsURL, startIndex + 50); }
      }
    });
  }

  $(document).ready(function () {
    getYouTubeInfo();
  });