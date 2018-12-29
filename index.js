var login = require("facebook-chat-api");
var toHex = require("colornames");
var request = require('request');

// Create simple echo bot
// Enter username and password here
login({email: "", password: ""}, function callback (err, api) {
    if(err) return console.error(err);

    api.setOptions({selfListen: true});
    api.listen(function callback(err, message) {

        if (message.type == 'message') {

            var body = message.body;
            var words = body.split(' ');
            var colorHex;

            for (var i = 0; i < words.length; i++) {
                if (toHex(words[i]) != undefined) {
                    colorHex = toHex(words[i]);
                }
            }

            if (colorHex != undefined) {
                api.changeThreadColor(colorHex, message.threadID, function callback(err) {
                    if(err) return console.error(err);
                });
            }

            var regex = /\w{4}\d{3}/
            var course;
            for (var i = 0; i < words.length; i++) {
                if (words[i].match(regex)) {
                    course = words[i];
                }
            }

            if (course != undefined) {
                
                request('http://api.umd.io/v0/courses/' + course, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body) // Show the HTML for the Google homepage.
                    }

                    var jsonResponse = JSON.parse(body);
                    console.log(jsonResponse.description);

                    api.sendMessage(jsonResponse.description, message.threadID);
                });

            }

        }


    });
});