module.exports = (grunt) ->

    # Constants

    MAIN_FILES =  'src/*.js'
    MAIN_FILE =  'dest/JM.js'
    MAIN_MIN_FILE = 'dest/JM.min.js'

    # Project configuration
    grunt.initConfig
        concat:
            combine:
                options:
                    separator: ';'
                files: [{
                    src: MAIN_FILES
                    dest: MAIN_FILE
                }]

        uglify:
            compress:
                options:
                    report: 'min'
                files: [{
                    src: MAIN_FILES
                    dest: MAIN_MIN_FILE
                }]

    # Dependencies
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-concat'

    grunt.registerTask 'default', [
        'uglify'
        'concat'
    ]
