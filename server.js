const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

const merchants = require('./globals.js');

const moment = require('moment');
const Horseman = require('node-horseman');

const waitTime = 12000;

var server = 'Server timeout...';

app.get('/', function(req, res) {
	var page = '';
	page += '<h1>VocoLife Auto Populator</h1><br />';
	page += 'Use the command /help for help.<br />';
	res.send(page);
});

app.get('/list', function(req, res) {
	var page = '';
	for (var merchant in merchants){
		page += '<strong>' + merchants[merchant].shop + ':</strong> <br />';
		page += '/' + merchants[merchant].shop + '<br />';
		if(merchants[merchant].locations.length > 0){
			for(var i = 0; i < merchants[merchant].locations.length; i++){
				page += '&nbsp;&nbsp;&nbsp;/' + merchants[merchant].locations[i] + '<br />';
				if(merchants[merchant].courses !== undefined){
					merchants[merchant].courses[i].forEach(function (course){
						if(course !== ''){
							page += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/' + course + '<br />';
						}
					});
				}
			}
		}else if(merchants[merchant].courses.length > 0){
			merchants[merchant].courses.forEach(function (course){
				page += '&nbsp;&nbsp;&nbsp;/' + course + '<br />';
			});
		}
	}
	res.send(page);
});

app.get('/help', function(req, res) {
	var page = '';
	page += 'To retrieve times for a merchant, use the command format: <br />';
	page += '/:shop/:location/:course <br />';
	page += '<br /> Use /list to see all possible shop, location and course combinations: <br />';
	page += '/list';
	res.send(page);
});

app.get('/:shop', function(req, res) {
	var shop = req.params.shop;
	executeCommand(shop, '', '', function (){
		res.send(server);
		server = 'Server timeout...';
	});
});

app.get('/:shop/:location', function(req, res) {
	var shop = req.params.shop;
	var location = req.params.location;
	executeCommand(shop, location, '', function (){
		res.send(server);
	});
});

app.get('/:shop/:course', function(req, res) {
	var shop = req.params.shop;
	var course = req.params.course;
	executeCommand(shop, '', course, function (){
		res.send(server);
		server = 'Server timeout...';
	});
});

app.get('/:shop/:location/:course', function(req, res) {
	var shop = req.params.shop;
	var location = req.params.location;
	var course = req.params.course;
	executeCommand(shop, location, course, function (){
		res.send(server);
		server = 'Server timeout...';
	});
});

app.listen(PORT, function() {
	console.log('Server started on port ' + PORT + '...');
});

function executeCommand(shop, location, course, callback){
	if(shop !== ''){
		for (var merchant in merchants){
			if(shop === merchants[merchant].shop){
				shop = merchant;
				console.log(merchant);
				if(location !== ''){
					for(var i = 0; i < merchants[merchant].locations.length; i++){
						console.log(merchants[merchant].locations[i]);
						if(location === merchants[merchant].locations[i]){
							location = i;
							if(course !== undefined){
								for(var j = 0; j < merchants[merchant].courses[i].length; j++){
									console.log('\t' + merchants[merchant].courses[i][j]);
									if(course === merchants[merchant].courses[i][j]){
										course = j;
									}
								}
							}
						}
					}
				}else if(course !== ''){
					for(var i = 0; i < merchants[merchant].courses.length; i++){
						console.log(merchants[merchant].courses[i]);
						if(course === merchants[merchant].courses[i]){
							course = i;
						}
					}
				}

				retrieveTimes(shop, location, course, callback);
			}
		}
	}
}

function retrieveTimes(shop, location, course, callback){
	var horseman = new Horseman();

	var schedule = [];

	var timesSelector = '';
	if(merchants[shop].selectors[1].constructor === Array){
		timesSelector = merchants[shop].selectors[1][0] + merchants[shop].courses[location][course] + merchants[shop].selectors[1][1];
	}else{
		timesSelector = merchants[shop].selectors[1];
	}

	var url = '';
	if(merchants[shop].variants.length > 0){
		if(merchants[shop].url.constructor === Array){
			url = merchants[shop].url[0] + merchants[shop].variants[location] + merchants[shop].url[1];
		}else{
			url = merchants[shop].url + merchants[shop].variants[location];
		}
	}else{
		url = merchants[shop].url;
	}

	console.log(merchants[shop].selectors[0]);
	console.log(timesSelector);

	horseman
		.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
	 	.open(url)
	  	.waitForSelector(merchants[shop].selectors[0] + ', ' + timesSelector)
	  	.catch(function(error){
	  		var errorMessage = '';
	  		errorMessage += "Insufficient or incorrect identifiers given.<br />";
			errorMessage += "Use the command voco-auto-populator/list for a list of shops and courses:<br />";
			errorMessage += 'voco-auto-populator/list';
			server = errorMessage;
	  	})
	  	.text(merchants[shop].selectors[0] + ', ' + timesSelector)
	  	.log()
	  	.then((text) => {
	  		var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	  		var day = parseInt(moment().format('e'));
	  		var next = day + 1;

	  		if(next > 6){
	  			next = 0;
	  		}

	  		var unrefined = text.split(days[next]);
	  		console.log(unrefined);
	  		var refined = unrefined[0].split(days[day]);
	  		var raw = refined[1].replace(/\s+/g, '');
	  		var rawA = raw.replace(/AM/gi, "AM,");
	  		rawA = rawA.replace(/PM/gi, "PM,");
			var times = rawA.split(",");
			times.pop();
			times.unshift(days[day]);
	  		schedule.push(times);
	  		console.log(times);

	  		var interval = 0;
	  		while(interval < 6){
	  			day++;
	  			if(day > 6){
	  				day = 0;
	  			}
	  			next = day + 1;
	  			if(next > 6){
	  				next = 0;
	  			}

	  			unrefined = unrefined[1].split(days[next]);
	  			console.log(unrefined);
	  		 	refined = unrefined[0];
	  		 	console.log(refined);
	  			raw = refined.replace(/\s+/g, '');
	  			var rawA = raw.replace(/AM/gi, "AM,");
	  			rawA = rawA.replace(/PM/gi, "PM,");
				times = rawA.split(",");
				console.log(times);
				times.pop();
				times.unshift(days[day]);
	  			schedule.push(times);
	  			console.log(times);

	  			interval++;
	  		}
	  		console.log(schedule);
	  		server = schedule;
	  		callback();
	  	})
		.close();
}
