"use strict";

var fs = require("fs"),
	fsx = require("fs-extra"),
	path = require("path"),
	request = require("request"),
	stream = require("stream");

/**
 * Downloads a file from internet.
 * @param {string} destination
 * @param {string} source
 * @param {function(Error=)} callback
 */
function curl(destination, source, callback) {
	var req = request.get(source),
		readStream,
		writeStream;

	req.on("error", callback);
	req.on("response", function (response) {
		var statusCode = response.statusCode;

		if (statusCode === 200 || statusCode === 201) {
			fsx.ensureDir(path.dirname(destination), function (err) {
				if (err) {
					callback(err);
					return;
				}

				writeStream = readStream.pipe(fs.createWriteStream(destination));
				writeStream.on("close", callback);
				writeStream.on("error", callback);
			});
		} else {
			callback(new Error("An error has occurred while fetching: '" + source + "'. Status code: " + statusCode));
		}
	});
	//noinspection Eslint
	readStream = req.pipe(stream.PassThrough());
}

module.exports = curl;
