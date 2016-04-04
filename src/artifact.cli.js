"use strict";

var artifact = require("./artifact"),
	commandLineArgs = require("command-line-args");

/**
 * Define command line arguments.
 * @return {object}
 */
function createCommandLineArgs() {
	return commandLineArgs([
		{name: "repository", type: String},
		{name: "groupId", type: String},
		{name: "artifactId", type: String},
		{name: "version", type: String},
		{name: "destination", type: String},
	]);
}

/**
 * Read argument. Returns an argument or throws an error when the argument is not defined.
 * @param {object} options
 * @param {string} argument
 * @return {string}
 * @throw {Error}
 */
function readArgument(options, argument) {
	var arg = options[argument];

	if (arg !== null && arg !== undefined && arg !== "") {
		return arg;
	}
	throw new Error("Expected argument '" + argument + "' missing.");
}


/**
 * Get an artifact descriptor.
 * @param {object} options
 * @param {string} argument
 * @return {ArtifactDescriptor}
 * @throw {Error}
 */
function getDescriptor(options) {
	return {
		repository: readArgument(options, "repository"),
		groupId: readArgument(options, "groupId"),
		artifactId: readArgument(options, "artifactId"),
		version: readArgument(options, "version"),
	};
}

(function () {
	var cli = createCommandLineArgs(),
		options = cli.parse(),
		descriptor,
		destination;

	try {
		descriptor = getDescriptor(options);
		destination = readArgument(options, "destination");

		artifact.take(destination, descriptor, function (err) {
			if (err) {
				console.error(err);
			}
		});
	} catch (e) {
		console.error(e.message);
		console.log(cli.getUsage());
	}
}());