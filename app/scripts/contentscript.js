'use strict';

//app code

var camData = []

function flattenData(collection) {
	var parentTitle = 'hello';
	var flatData = [];

	function step(collection) {
		var isAnObject = _.isPlainObject(collection);
		if (isAnObject || _.isArray(collection)) {
			if (collection.spots) {
				parentTitle = collection.name;
			}
			_.forEach(collection, function(item, indexKey) {
				if (item.cameratype) {
					item.title += ' – ' + parentTitle;
					flatData.push(item)
				} else {
					step(item);
				}
			});
		}
	}
	step(collection);
	return flatData;
}

function reqListener() {
	camData = flattenData(JSON.parse(this.responseText));
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open('get', '/global_includes/header/json/process-cams.json', true);
oReq.send();

var searchInputEl = document.getElementById('searchVal');
var searchContainerEl = document.getElementById('search-container');
var linksEl = document.createElement('div');
searchContainerEl.appendChild(linksEl);
var searchOpen = false;
var filteredSpots = [];
var previousSearchTerm = '';

searchInputEl.addEventListener('keyup', function(e) {
	var searchSpace = previousSearchTerm && e.target.value.indexOf(previousSearchTerm) > -1 ? filteredSpots : camData;
	previousSearchTerm = e.target.value;
	// var d1 = new Date();
	var activeEl = document.querySelector('.qfactive')
	if (e.keyCode === 13 && activeEl) {
		location.href = activeEl.getAttribute('href');
	} else {
		filteredSpots = _.filter(searchSpace, function(spot, index, collection) {
			var match = e.target.value && spot.title.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
			var htmlStr = '';
			if (match && !spot.linkEl) {
				spot.linkEl = document.createElement('a')
				spot.linkEl.href = 'http://www.surfline.com/surfdata/report-b.cfm?id=' + spot.id;
				spot.linkEl.className = 'quickfind-link';
				if (+spot.cameratype > 0) {
					htmlStr = '<div class="ld-cam-icon">&nbsp;</div>'
				}
				htmlStr += '<div class="cam-icon-title">' + spot.title + '</div>';
				spot.linkEl.innerHTML += htmlStr;
				linksEl.appendChild(spot.linkEl);
			} else if (!match && spot.linkEl) {
				linksEl.removeChild(spot.linkEl);
				delete spot.linkEl;
			}
			return match;
		})
	}
	// console.log(new Date() - d1);
});

document.getElementById('header-search').addEventListener('submit', function(e) {
	if (document.querySelector('.qfactive')) {
		e.preventDefault();
	}
})

searchContainerEl.addEventListener('mouseenter', function() {
	searchOpen = true;
});

searchContainerEl.addEventListener('mouseleave', function() {
	searchOpen = false;
});

document.addEventListener('keydown', function(e) {
	var activeEl;
	if (searchOpen && (e.keyCode === 38 || e.keyCode === 40)) {
		activeEl = document.querySelector('.qfactive');
		if (activeEl) {
			activeEl.className = 'quickfind-link';
		}
		if (e.keyCode === 38) {
			//UP
			activeEl = activeEl && activeEl.previousSibling ? activeEl.previousSibling : null;
			if (activeEl) {
				activeEl.className = 'quickfind-link qfactive';
			}
		} else if (e.keyCode === 40) {
			//Down
			activeEl = activeEl ? activeEl.nextSibling ? activeEl.nextSibling : activeEl : document.querySelector('.quickfind-link');
			if (activeEl) {
				activeEl.className = 'quickfind-link qfactive';
			}
		}
	}
});

// var _gaq = _gaq || [];
// _gaq.push(['_setAccount', 'UA-55072345-1']);
// _gaq.push(['_trackPageview']);

// (function() {
// 	var ga = document.createElement('script');
// 	ga.type = 'text/javascript';
// 	ga.async = true;
// 	ga.src = 'https://ssl.google-analytics.com/ga.js';
// 	var s = document.getElementsByTagName('script')[0];
// 	s.parentNode.insertBefore(ga, s);
// })();