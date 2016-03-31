"use strict";
var curl = require("./curl"),
	metadata = require("./metadata");

/**
 * Returns path to the maven-metadata.xml
 * @param {string} url
 * @return {string}
 */
function getPathToMavenMetadata(url) {
	var indexOf = url.indexOf("[RELEASE]");

	if (indexOf > -1) {
		return url.substr(0, indexOf) + "maven-metadata.xml";
	}
	return url;
}

/**
 * Resolve release artifact URL.
 * @param {string} url
 * @param {function(Error, (string|null))} callback
 */
function resolveReleaseArtifactUrl(url, callback) {
	var indexOf = url.indexOf("[RELEASE]");

	if (indexOf > -1) {
		metadata.readReleaseVersion(getPathToMavenMetadata(url), function (err, version) {
			if (err) {
				callback(err, null);
				return;
			}

			callback(null, url.replace(new RegExp("\\[RELEASE\\]", "g"), version));
		});
	} else {
		callback(null, url);
	}
}

/**
 * Download a release artifact.
 * @param {string} destination
 * @param {string} url
 * @param {function} callback
 */
function take(destination, url, callback) {
	resolveReleaseArtifactUrl(url, function (err, artifactUrl) {
		if (err) {
			callback(err, null);
			return;
		}

		curl(destination, artifactUrl, callback);
	});
}

module.exports.take = take;

(function () {
	var destination,
		url,
		argv;

	if (!module.parent) {
		argv = process.argv;
		destination = argv[2];
		url = argv[3];

		if (destination && url) {
			take(destination, url, function (err) {
				if (err) {
					console.error(err);
				} else {
					console.log("The artifact has been downloaded.");
				}
			})
		} else {
			console.log(
				"Usage: node artifact.release destination artifactURL\n"+
				"\t destination - path where to save the downloaded artifact\n" +
				"\t artifactURL - URL address to the artifact\n\n" +
				"URL address should be with or without version of the artifact:\n" +
				"\t 1. http://artifactory/libs-release-local/wombat/[RELEASE]/wombat-[RELEASE]-js.zip\n" +
				"\t 2. http://artifactory/libs-release-local/wombat/1.2/wombat-1.2-js.zip\n\n" +
				"When the URL is used with [RELEASE], the last version of released artifact will downloaded.");
		}
	}
}());