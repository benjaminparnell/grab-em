/* global Mustache */

function urlEncode(obj) {
    var s = '';
    for (var key in obj) {
        s += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
    }
    if (s.length > 0) {
        s = s.substr(0, s.length - 1);
    }
    return s;
}

function shake(inputBox) {
    // Thanks to Brandon Murdoch for this *SWEET* animation
    var i = 0
      , speed = 5
      , position = [-8, -2, 0, 2, 4, 4, 4, 4, 2, 0, -2, -4, -2, -2, -4, -4, -2,
                    0, 2, 4, 4, 4, 4, 2, 0, -8, -2];

    for (var i = 0; i < position.length; ++i) {
        if (position[i] < 0) {
            $(inputBox).animate({
                marginLeft: '-=' + -position[i] + 'px'
            }, speed);
        } else {
            $(inputBox).animate({
                marginLeft: '+=' + position[i] + 'px'
            }, speed);
        }
    }
}

function performSearch() {
    var searchTerm = $('#artist_name').val().trim();
    if (searchTerm.length > 0) {
        var params = {
            term: searchTerm,
            country: 'GB',
            media: 'music',
            entity: 'album',
            // limit: 25,
            callback: 'printResult'
        };
        params = urlEncode(params)
        var url = 'https://itunes.apple.com/search?' + params
          , script = '<script src="' + url + '"><\/script>';
        $('#search_script').empty().append(script);
    } else {
        shake('#artist_name');
    }

}

function printResult(resultJSON) {
    var resultCount = resultJSON.resultCount
      , template = $('#template').html();
    Mustache.parse(template)

    $('#main_body').empty();
    if (resultCount > 0) {
        for (var i = 0; i < resultCount; i++) {
            var artworkURL = resultJSON.results[i].artworkUrl60
              , artworkURLClean = artworkURL.substring(0, artworkURL.length - 12)
              , artistName = resultJSON.results[i].artistName.trim()
              , artistName = (artistName.length > 25 ? artistName.substring(0, 25).trim() + '...' : artistName)
              , collectionName = resultJSON.results[i].collectionName.trim()
              , originalArt = (artworkURLClean.search(/Feature/gi) == -1 ? 0 : 1)
              , collectionName = (collectionName.length > 25 ? collectionName.substring(0, 25).trim() + '...' : collectionName)
              , html = Mustache.render(template, {
                    //artworkUrl100: resultJSON.results[i].artworkUrl100,
                    artworkUrl100: artworkURLClean + '200x200-75.jpg',
                    collectionName: collectionName,
                    artistName: artistName,
                    artworkURLClean: artworkURLClean,
                    originalArt: originalArt,
                    itemNo: i
                });
            $('#main_body').append(html);
        }
        var counter = 0;
        var fadeInterval = setInterval( function() {
            if(counter < resultCount) {
                $('#info_' + counter).fadeIn();
                counter++;
            }
            else
                clearInterval(fadeInterval);
        },100);
    } else {
        var html = "<div id='no_result'>Sorry, no results found for '<strong>" +
          $('#artist_name').val() + "</strong>'</div>";
        $('#main_body').append(html);
    }


}
