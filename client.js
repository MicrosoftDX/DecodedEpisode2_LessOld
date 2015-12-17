var selectedPackage = null;
var Ajax = {
    request: function (url, method, headers, data, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                // the request is complete, parse data and call callback
                var response = JSON.parse(xhr.responseText);
                success(response);
            }
            else if (xhr.readyState === XMLHttpRequest.DONE) {
                failure();
            }
        };
        xhr.open(method, url, true);
        for (var header in headers) {
            xhr.setRequestHeader(header, headers[header]);
        }
        xhr.send();
    },
};
function renderContributors(contributors) {
    document.getElementById("contributors_container").style.display = "block";
    document.querySelectorAll("#contributors_title span")[0].innerHTML = selectedPackage;
    var container = document.querySelectorAll("#contributors tbody")[0];
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
    for (var index = 0; index < contributors.length; index++) {
        var contributor = contributors[index];
        var tableRow = document.createElement("tr");
        tableRow.innerHTML = "<td><img src='" + contributor.avatar_url + "' /></td>" +
            "<td>" + contributor.login + "</td>" +
            "<td>" + contributor.contributions + "</td>";
        container.appendChild(tableRow);
    }
}
function renderRepos(repos) {
    var container = document.querySelectorAll("#repos tbody")[0];
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
    for (var index = 0; index < repos.length; index++) {
        var repo = repos[index];
        var btnClass = "btn-default";
        if (repo.favorite) {
            btnClass = "btn-success";
        }
        var tableRow = document.createElement("tr");
        tableRow.innerHTML = '<td><a data-repo="' + repo.name + '" href="#" class="favorite btn ' + btnClass + '"><span class="glyphicon glyphicon-star"></span></a></td>' +
            "<td><a class='repo' href='#'>" + repo.name + "</a></td>";
        container.appendChild(tableRow);
    }
    var repoElements = document.getElementsByClassName("repo");
    for (var index = 0; index < repoElements.length; index++) {
        repoElements[index].addEventListener("click", function (e) {
            selectedPackage = e.target.innerHTML;
            Ajax.request("/contributors/" + selectedPackage, "GET", null, null, renderContributors, null);
        });
    }
    var favorites = document.getElementsByClassName("favorite");
    for (var index = 0; index < favorites.length; index++) {
        favorites[index].addEventListener("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var button = e.target;
            if (button.tagName != "A") {
                button = button.parentNode;
            }
            var isFavorite = button.classList.contains("btn-default");
            if (isFavorite) {
                button.classList.remove("btn-default");
                button.classList.add("btn-success");
            }
            else {
                button.classList.remove("btn-success");
                button.classList.add("btn-default");
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", function () {
    Ajax.request("/repos", "GET", null, null, renderRepos, null);
});
