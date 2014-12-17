// Travis CI task.

grunt.initConfig({
    qunit: {
        files: ['test/composite.html']
    }
});

grunt.registerTask('travis', 'qunit');