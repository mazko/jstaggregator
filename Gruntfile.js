// Travis CI task.

module.exports = function(grunt) {
	grunt.initConfig({
	    qunit: {
	        files: ['test/composite.html']
	    }
	});

	grunt.registerTask('travis', 'qunit');
}