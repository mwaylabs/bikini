/**
 * The-M-Project Build Script
 * Version: 0.1.0
 */

var _ = require('lodash');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var additionalMarkdownFiles = {
        'https://raw.github.com/mwaylabs/The-M-Project-Sample-Apps/master/README.md': 'Sample-Apps.md',
        'https://raw.github.com/mwaylabs/generator-m/master/README.md': 'Generator.md',
        'https://raw.github.com/mwaylabs/The-M-Project-Sample-Apps/master/demoapp/README.md': 'Demo-App.md'
    }

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!\n' +
                '* Project:   The M-Project - Mobile HTML5 Application Framework\n' +
                '* Copyright: (c) <%= grunt.template.today("yyyy") %> M-Way Solutions GmbH.\n' +
                '* Version:   <%= pkg.version %>\n' +
                '* Date:      <%= grunt.template.today() %>\n' +
                '* License:   http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt\n' +
                '*/'
        },
        jsonlint: {
            sample: {
                src: [ 'package.json', 'bower.json' ]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['src/_*.js', 'src/themproject*.js', 'src/ui/themevars.js']
            },
            src: [ 'src/**/*.js' ]
        },
        preprocess: {
            options: {
                context: {
                    BANNER: '<%= meta.banner %>',
                    VERSION: '<%= pkg.version %>'
                }
            },
            dev: {
                files: {
                    '.tmp/bikini.js': 'src/bikini.js'
                }
            },
            dist: {
                files: {
                    'dist/bikini.js': 'src/bikini.js'
                }
            }
        },
        uglify: {
            options: {
                preserveComments: 'some'
            },
            core: {
                src: 'dist/bikini.js',
                dest: 'dist/bikini.min.js',
                options: {
                    sourceMap: 'dist/bikini.map',
                    sourceMappingURL: 'bikini.map',
                    sourceMapPrefix: 1
                }
            }
        },
        watch: {
            js: {
                files: ['src/**/*'],
                tasks: ['build-js'],
                options: {
                    spawn: false
                }
            },
            test: {
                files: ['test/**/*'],
                tasks: ['test'],
                options: {
                    spawn: false
                }
            }
        },
        mocha: {
            options: {
                bail: true,
                reporter: "Spec"
            },
            all: ['test/test.html']
        },
        jsdoc : {
            dist : {
                src: ['doc-template/.tmp/index.md','src/connection/*.js','src/core/*.js','src/data/*.js','src/data/stores/*.js','src/interfaces/*.js','src/ui/*.js','src/ui/layouts/*.js','src/ui/views/*.js','src/utility/*.js'],
                options:{
                    destination: 'doc',
                    template: "doc-template",
                    configure: "doc-template/jsdoc.conf.json",
                    tutorials: "doc-template/additional",
                    private: false
                }
            }
        },
        'curl-dir': {
            customFilepaths: {
                src: (function() {
                    return Object.keys(additionalMarkdownFiles);
                })(),
                router: function (url) {
                    return additionalMarkdownFiles[url];
                },
                dest: 'doc-template/additional'
            }
        },
        clean: {
            md: {
                src: [
                    'doc-template/additional/Sample-Apps.md',
                    'doc-template/additional/Demo-App.md',
                    'doc-template/additional/Generator.md',
                    'doc-template/.tmp/index.md'
                ]
            }
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('build', ['preprocess:dev']);

    grunt.registerTask('dev', ['default', 'watch']);
    grunt.registerTask('test', ['jshint', 'mocha']);
    grunt.registerTask('dist', ['jshint', 'preprocess:dist', 'uglify']);
    grunt.registerTask('precommit', ['travis']);
    grunt.registerTask('travis', ['jsonlint', 'default', 'test']);
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build-doc', ['clean:md','curl-dir', 'rewriteMarkdownFiles', 'jsdoc', 'clean:md']);

};
