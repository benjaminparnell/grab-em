function urlEncode(obj) {
    var s = '';
    for (var key in obj) {
        s += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
    }
    if (s.length > 0) {
        s = s.substr(0, s.length - 1);
    }

    return (s);
}

function Shake(input_box) {
    // Thanks to Brandon Murdoch for this *SWEET* animation
    var i = 0;
    var speed = 5;
    var position = new Array(-8, -2, 0, 2, 4, 4, 4, 4, 2, 0, -2, -
        4, -2, -2, -4, -4, -2, 0, 2, 4, 4, 4, 4, 2, 0, -8, -2, 99);

    while (position[i] != 99) {
        if (position[i] < 0)
            $(input_box).animate({
                marginLeft: '-=' + -position[i] + 'px'
            }, speed);
        else
            $(input_box).animate({
                marginLeft: '+=' + position[i] + 'px'
            }, speed);
        i++;
    }
}

function performSearch() {
    var search_term = $('#artist_name').val().trim();
    if (search_term.length > 0) {
        var params = {
            term: search_term,
            country: 'GB',
            media: 'music',
            entity: 'album',
            limit: 20,
            callback: 'printResult'
        };
        var params = urlEncode(params);

        var url = 'https://itunes.apple.com/search?' + params;
        var script = '<script src="' + url + '"><\/script>';
        $('#search_script').empty().append(script);
    }
    else
        Shake('#artist_name');

}

function printResult(resultJSON) {
    var resultCount = resultJSON.resultCount;

    $('#main_body').empty();
    if (resultCount > 0) {
        for (var i = 0; i < resultCount; i++) {
            var artworkURL = resultJSON.results[i].artworkUrl60;
            var artworkURLClean = artworkURL.substring(0, artworkURL.length - 12);
            var artistName = resultJSON.results[i].artistName;
            artistName = (artistName.length > 30 ? artistName.substring(0, 30) + '...' : artistName);

            var html = "<div class='result_item'><div class='album_art'><img src='" + resultJSON.results[i].artworkUrl100 + "' alt='" + resultJSON.results[i].collectionName + "' /></div><div class='album_info'><h2>" + resultJSON.results[i].collectionName + "</h2><h3>" + artistName + "</h3></div><div class='size_buttons'>Album art: <a class='album_art_button small' target='new' href='" + artworkURLClean + '400x400-75.jpg' + "'></a><a class='album_art_button medium' target='new' href='" + artworkURLClean + '600x600-75.jpg' + "'></a><a class='album_art_button large' target='new' href='" + artworkURLClean + '1200x1200-75.jpg' + "'></a></div></div>";
            $('#main_body').append(html);
        }
    } else {
        var html = "<div id='no_result'>Sorry, no results found for '<strong>" + $('#artist_name').val() + "</strong>'</div>";
        $('#main_body').append(html);
    }

}
