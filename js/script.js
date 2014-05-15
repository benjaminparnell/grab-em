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
            // limit: 20,
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
              , artistName = resultJSON.results[i].artistName
              , artistName = (artistName.length > 30 ? artistName.substring(0, 30) + '...' : artistName)
              , collectionName = resultJSON.results[i].collectionName
              , collectionName = (collectionName.length > 30 ? collectionName.substring(0, 30) + '...' : collectionName)
              , html = Mustache.render(template, {
                    artworkUrl100: resultJSON.results[i].artworkUrl100,
                    collectionName: collectionName,
                    artistName: artistName,
                    artworkURLClean: artworkURLClean,
                    itemNo: i
                });
            $('#main_body').append(html);
        }
        for(var i = 0; i < resultCount; i++)
            $('#info_' + i).fadeIn();
    } else {
        var html = "<div id='no_result'>Sorry, no results found for '<strong>" +
          $('#artist_name').val() + "</strong>'</div>";
        $('#main_body').append(html);
    }


}
