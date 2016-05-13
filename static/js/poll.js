/*jslint browser: true*/

function Interface() {
    'use strict';

    var xhr = new XMLHttpRequest(),
        url = "/getcandidates",
        data = {};

    function setData() {

    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            setData();
        }
    };

    xhr.open("GET", url, true);
    xhr.send();

}