"use strict";

var xml2js = require("xml2js"),
	curljs = require("curl-js");

/**
 * @typedef {object} ArtifactDescriptor
 *
 * @property {string} repository
 * @property {string} groupId
 * @property {string} artifactId
 * @property {string} version
 * @property {string} classifier
 */

/**
 * Normalize group id.
 * @param {string} value
 * @return {string}
 */
function normalizeGroupId(value) {
	return value.indexOf(".") > -1 ? value.replace(new RegExp("\\.", "g"), "/") : value;
}

/**
 * Normalize path.
 * @param {string} path
 * @return {string}
 */
function normalizePathSeparator(path) {
	return path.charAt(path.length) === "/" ? path : path + "/";
}

/**
 * Returns true when the version is for a snapshot; false for a release.
 * @param {string} version
 * @return {boolean}
 */
function isSnapshot(version) {
	return version.indexOf("SNAPSHOT") > -1;
}

/**
 * Download and parse Maven metadata.
 * @param {string} metadataPath
 * @param {function(Error, object)} callback
 */
function downloadAndParseMetadata(metadataPath, callback) {
	curljs.curlToString(metadataPath, function (err, metadata) {
		if (err) {
			callback(err, null);
			return;
		}
		new xml2js.Parser().parseString(metadata, callback);
	});
}

/**
 * Resolve path to an artifact.
 * @param {ArtifactDescriptor} descriptor
 * @return {string}
 */
function resolveArtifactPath(descriptor) {
	return normalizePathSeparator(descriptor.repository) +
		normalizePathSeparator(normalizeGroupId(descriptor.groupId)) +
		normalizePathSeparator(descriptor.artifactId) +
		normalizePathSeparator(descriptor.version);
}

/**
 * Resolve path to a release version of an artifact.
 * @param {ArtifactDescriptor} descriptor
 * @return {string}
 */
function resolveReleaseArtifactPath(descriptor) {
	var classifier = descriptor.classifier ? "-" + descriptor.classifier : "";

	// At this moment we have no regards for a classifier and an extension
	return resolveArtifactPath(descriptor) + descriptor.artifactId + "-" + descriptor.version + classifier + ".zip";
}

/**
 * Resolve path to a snapshot metadata.
 * @param {ArtifactDescriptor} descriptor
 * @return {string}
 */
function resolveSnapshotMetadataPath(descriptor) {
	return resolveArtifactPath(descriptor) + "maven-metadata.xml";
}

/**
 * Return name of a snapshot artifact.
 * @param {string} artifactId
 * @param {string} version
 * @param {string} classifier
 * @param {string} latestSnapshot
 * @return {string}
 */
function resolveSnapshotArtifactName(artifactId, version, classifier, latestSnapshot) {
	var pathClassifier = classifier ? "-" + classifier : "";

	return version.indexOf("-") !== -1 ? artifactId + "-" + latestSnapshot + pathClassifier + ".zip" : null;
}

/**
 * Return latest snapshot.
 * @param {object} metadata
 * @return {string|null}
 */
function findLatestSnapshot(metadata) {
	var snapshotVersion = metadata.versioning[0].snapshotVersions[0].snapshotVersion,
		length = snapshotVersion.length,
		extension,
		i;

	for (i = 0; i < length; i++) {
		extension = snapshotVersion[i].extension;

		if (extension !== "pom") {
			return snapshotVersion[i].value[0];
		}
	}
	return null;
}

/**
 * Resolve path to a snapshot version of an artifact.
 * @param {ArtifactDescriptor} descriptor
 * @param {function(Error, (string|null))} callback
 */
function resolveSnapshotArtifactPath(descriptor, callback) {
	downloadAndParseMetadata(resolveSnapshotMetadataPath(descriptor), function (err, result) {
		var snapShotArtifactPath = null,
			latestSnapshot;

		if (err) {
			callback(err, null);
			return;
		}
		latestSnapshot = findLatestSnapshot(result.metadata);

		if (latestSnapshot) {
			snapShotArtifactPath = resolveArtifactPath(descriptor) +
				resolveSnapshotArtifactName(descriptor.artifactId, descriptor.version, descriptor.classifier, latestSnapshot);
		}
		callback(null, snapShotArtifactPath);
	});
}

/**
 * Take an artifact.
 * @param {string} destination
 * @param {ArtifactDescriptor} descriptor
 * @param {function(Error=)} callback
 */
function take(destination, descriptor, callback) {
	if (isSnapshot(descriptor.version)) {
		resolveSnapshotArtifactPath(descriptor, function (err, url) {
			if (err) {
				callback(err, null);
				return;
			}
			curljs.curl(destination, url, callback);
		});
	} else {
		curljs.curl(destination, resolveReleaseArtifactPath(descriptor), callback);
	}
}

module.exports.take = take;
