# artifact-js
## What is it?
The happy end of the a long tale how to retrieve a dream artifact.

## How it can be useful for me?
If you need to retrieve an artifact from the artifactory by JavaScript? 

## How it works?
If you have a pro version of the artifactory, you can retrieve artifacts by REST. 
If not, you can use Maven metadata to get information about the latest version and with a little bit of work, you can get the the same result.

## How to configure?
I like simple things. All what you need is to pass a few arguments (for details see bellow)

##How to run?
You can run the script from the command line:

> node ./src/artifact.cli

or use it from a code:

``` javascript
var artifact = require("artifact");

artifact.take(destination, descriptor, function (err) {
    if (err) {
        return;
    }
    // do some stuff
}); 
```

## What next?
If you have a problem, write me.


### Download artifact from a command line

Usage: ``node artifact.release --destination --repository -- groupId --artifactId --version``

    - destination - path where to save the downloaded artifact
    - repository - URL address to the artifactory (e.g. http://artifactory/libs-release-local/)
    - groupId - a group identifier of the artifact (e.g. koalix.info)
    - artifactid - a name of the artifact
    - version - version of the artifact (e.g. 1.2 for a release and 1.2-SNAPSHOT for a snapshot)
