"use strict";
var xml2js = require("xml2js"),
	curlString = require("./curl.string");

/**
 * Parse XML and returns the
 * @param {string} data
 * @param {function(Error, object)} callback
 */
function parseXml(data, callback) {
	var parser = new xml2js.Parser();

	parser.parseString(data, callback);
}

/**
 * Read last available release version.
 * @param {string} repository
 * @param {function(Error. (string|null)} callback
 */
function readReleaseVersion(repository, callback) {
	curlString(repository, function (err, data) {
		if (err) {
			callback(err, null);
			return;
		}

		parseXml(data, function (error, result) {
			if (error) {
				callback(error, null);
				return;
			}

			callback(null, result.metadata.versioning[0].release[0]);
		});
	});
}

module.exports.readReleaseVersion = readReleaseVersion;
