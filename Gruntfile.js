/**
 * The-M-Project Build Script
 * Version: 0.1.0
 */

var _ = require('lodash');

var path = require('path');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var additionalMarkdownFiles = {};

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!\n' +
                '* Project:   Bikini - Everything a model needs\n' +
                '* Copyright: (c) <%= grunt.template.today("yyyy") %> M-Way Solutions GmbH.\n' +
                '* Version:   <%= pkg.version %>\n' +
                '* Date:      <%= grunt.template.today() %>\n' +
                '* License:   https://raw.githubusercontent.com/mwaylabs/bikini/master/MIT-LICENSE.txt\n' +
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
                ignores: ['src/_*.js', 'src/bikini*.js' ]
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
                    'test/.tmp/bikini.js': 'src/bikini.js'
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
                compress: {
                  drop_console: true
                },
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
                tasks: ['preprocess:dist'],
                options: {
                    spawn: false
                }
            },
            test: {
                files: ['test/**/*'],
                tasks: ['build', 'mocha'],
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
        jsdoc: {
            dist: {
                src: ['dist/bikini.js'],
                options: {
                    destination: 'doc',
                    private: false
                }
            }
        },
        typedoc: {
            build: {
                options: {
                    module: 'commonjs',
                    target: 'ES5',
                    out: 'doc/',
                    name: 'Relution LiveData'
                },
                src: 'src/**/*.ts'
            }
        },
        'curl-dir': {
            customFilepaths: {
                src: (function () {
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
        },
        express: {
            test: {
                options: {
                    script: './server/server.js'
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'doc'
            },
            src: ['**']
        }
    });


    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('build', ['preprocess:dev']);

    grunt.registerTask('dev', ['default', 'watch']);
    grunt.registerTask('test', ['jshint', 'build', /*'express:test',*/ 'mocha']);
    grunt.registerTask('dist', ['jshint', 'preprocess:dist', 'uglify', 'build-doc']);
    grunt.registerTask('precommit', ['travis']);
    grunt.registerTask('travis', ['jsonlint', 'default', 'test']);
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build-doc', ['clean:md', 'curl-dir', 'rewriteMarkdownFiles', 'typedoc', 'clean:md', 'gh-pages']);

};
