# artifact-js
## What is it?
The happy end of the a long tale how to retrieve a dream artifact.

## How it can be useful for me?
If you need to retrieve an artifact from the artifactory by JavaScript? 
Much.

## How it works?
If you have a pro version of the artifactory, you can retrieve artifacts by REST. 
If not, you can use Maven metadata to get information about the latest version and with a little bit of work, you can get the the same result.

## How to configure?
I like simple things. All what you need to configure you can find in `config.json`.

##How to run?
You can run the script from the command line:

> node ./src/artifact

## What next?
If you have a problem, write me.


### Download released artifact

Usage: ``node artifact.release destination artifactURL``

    - destination - path where to save the downloaded artifact
    - artifactURL - URL address to the artifact

URL address should be with or without version of the artifact:

    1. http://artifactory/libs-release-local/wombat/[RELEASE]/wombat-[RELEASE]-js.zip
    2. http://artifactory/libs-release-local/wombat/1.2/wombat-1.2-js.zip

When the URL is used with ``[RELEASE]``, the last version of released artifact will downloaded.