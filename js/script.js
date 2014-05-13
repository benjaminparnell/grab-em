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

function performSearch() {
    var params = {
        term: $('#artist_name').val(),
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

function printResult(resultJSON) {
    var resultCount = resultJSON.resultCount;

    $('#main_body').empty();
    for (var i = 0; i < resultCount; i++) {
        artworkURL = resultJSON.results[i].artworkUrl60;
        artworkURLClean = artworkURL.substring(0, artworkURL.length - 12);
        var html = "<div class='result_item'><div class='album_art'><img src='" + resultJSON.results[i].artworkUrl100 + "' alt='" + resultJSON.results[i].collectionName + "' /></div><div class='album_info'><h2>" + resultJSON.results[i].collectionName + "</h2><h3>" + resultJSON.results[i].artistName + "</h3></div><div class='size_buttons'><a class='album_art_button small' target='new' href='" + artworkURLClean + '400x400-75.jpg' + "'></a><a class='album_art_button medium' target='new' href='" + artworkURLClean + '700x700-75.jpg' + "'></a><a class='album_art_button large' target='new' href='" + artworkURLClean + '1200x1200-75.jpg' + "'></a></div></div>";
        $('#main_body').append(html);
    }

}