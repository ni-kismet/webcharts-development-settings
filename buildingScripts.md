## Goals
To have a single place specifying the files
To propagate dev changes much faster to all repos

## Background
This was on the TODO list for too long. Too much time was spent debugging why something was not working right after creating a new file which was not added to all file lists. The browser supported list changed a few times in the list mounts and this required manually updating each repo.

## files.json
Each repo is expected to have at the root level a file called **files.json** having similar structure with the below example. The **groups** section must be used to describe groups of files which can be used by multiple tools (karma, gulp, etc.). The group name is important because that's the way the tools can refer to the file lists.

```js
{
    "groups": {
        "cssFiles": [
            "styles/webchartsLight.css",
            "tests/test.css"
        ],
        "externalDependencies": [
            "node_modules/jquery/dist/jquery.min.js",
        ],
        "externalTestUtils": ["node_modules/webcharts-development-settings/testsUtils/*.js"],
        "externalMaps": [
            {"pattern": "node_modules/@jqwidgets/jqx-element/source-minified/jqxelement.js.map", "included": false, "served": true}
        ],
        "devElementInfrastructure": [
            "ni-element-infrastructure/jquery.i18n.properties.min.js",
            "ni-element-infrastructure/globalize.js"
        ],
        "sources": [
            "dist/es5-minified/webcharts.min.js"
        ],
        "devSources": [
            "sources/DataPipeline/niDataPipeline.js"
        ]
        "lint": ["sources/**/*.js", "tests/**/*.js"],
        "coverage": ["sources/**/*.js"]
    },
    "karma": {
        "files": ["cssFiles", "externalDependencies", "externalTestUtils", "externalMaps", "elementInfrastructure", "sources", "elementRegistration", "tests"],
        "devFiles": ["cssFiles", "externalDependencies", "externalTestUtils", "externalMaps", "devElementInfrastructure", "devSources", "devElementRegistration", "tests"],
        "coverageFiles": ["cssFiles", "externalDependencies", "externalTestUtils", "externalMaps", "devElementInfrastructure", "devSources", "devElementRegistration", "tests"],
        "benchmarkFiles": ["cssFiles", "externalDependencies", "externalTestUtils", "externalMaps", "devElementInfrastructure", "devSources", "devElementRegistration", "benchmarks"],
        "lint": ["lint"],
        "coverage": ["coverage"]
    },
    "examples": ["externalDependencies", "elementInfrastructure", "sources", "elementRegistration"],
    "gulp": {
        "build": [
            {
                "input": ["devElementInfrastructure"],
                "output": "element.min.js"
            },
            {
                "input": ["devSources"],
                "output": "webcharts.min.js"
            },
            {
                "input": ["devElementRegistration"],
                "output": "element_registration.min.js"
            }
        ]
    },
    "docs": {
        "docs2generate": [
            ["docs/API.md", "sources/API_doc.js"]
        ],
        "docsCSS2generate": [
            ["docs/styling.md", "styles/webchartsLight.css"]
        ]
    }
}
```

## Tools
### karma
This change adds a script **getSettings** that can be used to generate the default karma settings based on the command line arguments and other arguments passed by the user's repo. The user's repo still has its own **karma.config.js** files which is calling **getSettings**:
```js
var settings = getSettings(config, files);
config.set(settings);
```
In this case the **settings** object can be adjusted by each repo. It is also possible to make all user's repos reuse the same **karma.config.js** present in webcharts-development-settings. Ideas?

### gulp
Gulp is used for building only. The **gulpfile.js** was moved entirely to webcharts-develpment-settings. The gulp related dependencies are moved to the dependency list of this package as well.

### ljs
The script invoking the ljs tool was moved entirely here. All the required parameters (input and output files) are red automatically by the **update_docs.js** script. The ljs dependency was moved as well to webcharts-development-settings.

### examples
The script loading the required files for examples was not moved yet here. Moving it here means that the examples will be available only for the people which install the packages for development => the examples will not work anymore from the npm packages anymore. I'm not sure about moving the script here. Maybe it should remain in each repo and included in the npm packages as well.

## Conclusion
After writing this down, I realized the **files.json** is more like a grunt config file. I guess, on large scale projects, grunt is useful to administrate the development settings or tools. However, for webcharts it's too late to start experimenting with grunt.

A lot of testing is required, and for this, I recommend releasing a preview version of webcharts-development-settings and trying it on webcharts and webcharts-legends as well.
