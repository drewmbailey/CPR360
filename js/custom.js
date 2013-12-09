jQuery(function($){
  console.log('document ready');
// ACCORDION 
  $( '#accordion' ).accordion({autoHeight: 'content' });
  
  // CHANGE VIDEO BY CLICKING THUMBNAIL LINK
  $('.vid_button').on('click', function(){
    // e.preventDefault();
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
      // url: SetURL,
      dataType: 'jsonp',
      success: function (data) {
        console.log('success');
        parseresults(data);
      },
      failure: function (data) {
        console.log('error');
      }
    });
  }

  // PARSE COMMENTS
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

  // GET COMMENTS
  function getComments(commentsURL, startIndex) {
    $.ajax({
      url: commentsURL + '&start-index=' + startIndex,
      dataType: 'jsonp',
      success: function (data) {
      $.each(data.feed.entry, function(key, val) {
        $('#comments').append('<h4>' + val.author[0].name.$t + '</h4>' + '<p>' + val.content.$t + '</p>');
      });
      if ($(data.feed.entry).size() == 50) { getComments(commentsURL, startIndex + 50); }
      }
    });
  }
  
});