"use strict";

var request = require("request");

/**
 * Downloads a file from internet.
 * @param {string} source
 * @param {function(Error, (string|null))} callback
 */
function curl(source, callback) {
	var req = request.get(source),
		content = "",
		statusCode,
		success;

	req.on("error", callback);
	req.on("data", function (data) {
		if (success) {
			content += data.toString();
		}
	});
	req.on("end", function () {
		if (success) {
			callback(null, content);
		} else {
			callback(new Error("An error has occurred while downloading '" + source + "' Status code: " + statusCode), null);
		}
	});
	req.on("response", function (response) {
		statusCode = response.statusCode;
		success = statusCode === 200 || statusCode === 201;
	});
}

module.exports = curl;
