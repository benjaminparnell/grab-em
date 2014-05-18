'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            haml: {
                files: ['*.haml'],
                tasks: ['haml:dev'],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: ['css/*.sass'],
                tasks: ['sass:dev', 'csscomb:dev'], // task cascading! whoop!
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['js/script.js'],
                tasks: ['concat:dev', 'uglify:dev']
            }
        },
        haml: {
            dev: {
                files: {
                    'index.html': 'index.haml'
                },
                options: {
                    style: 'expanded'
                }
            },
            dist: {
                files: {
                    'index.html': 'index.haml'
                },
                options: {
                    style: 'expanded'
                }
            }
        },
        sass: {
            dev: {
                files: {
                    'css/style-unsorted.css': 'css/style.sass'
                },
                options: {
                    trace: true,
                    style: 'expanded'
                }
            },
            dist: {
                files: {
                    'css/style-unsorted.css': 'css/style.sass'
                },
                options: {
                    style: 'compressed'
                }
            }
        },
        csscomb: {
            dev: {
                files: {
                    'css/style.css': ['css/style-unsorted.css'],
                },
                options: {
                    config: 'csscomb.json'
                }
            },
            dist: {
                files: {
                    'css/style.css': ['css/style-unsorted.css'],
                },
                options: {
                    config: 'csscomb.json'
                }
            }
        },
        concat: {
            dev: {
                src: ['js/*.js'],
                dest: 'js/bundle.js',
            },
            dist: {
                src: ['js/*.js'],
                dest: 'js/bundle.js',
            }
        },
        uglify: {
            dev: {
                options: {
                    mangle: true
                },
                files: {
                    'js/bundle.min.js': ['js/bundle.js']
                }
            },
            dist: {

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-haml');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['haml', 'sass', 'csscomb', 'concat', 'uglify:dev'])
};