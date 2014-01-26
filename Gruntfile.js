module.exports = function (grunt) {
	var matchdep = require('matchdep')

	matchdep.filter('grunt-*').forEach(grunt.loadNpmTasks)

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jade: {
			production: {
				options: {
					pretty: false,
				},
				files: [{
					expand: true,
					cwd: 'app/views',
					src: '**/*.jade',
					dest: 'webroot/',
					ext: '.html',
				}],
			},
		},
		concat: {
			production: {
				src: [
					'app/assets/js/header.js',
					'app/assets/js/utils.js',
					'app/assets/js/resources/*.js',
					'app/assets/js/main.js',
				],
				dest: 'app/assets/js/merged.js',
			},
		},
		uglify: {
			production: {
				files: {
					'webroot/static/js/main.js': 'app/assets/js/merged.js',
				},
			},
		},
		stylus: {
			production: {
				options: {
					debug: false,
					compress: true,
					'include css': true,
					use: [
						require('nib'),
					],
					'import': [
						'nib',
					],
				},
				files: [{
					'webroot/static/css/main.css': [
						'app/assets/styl/main.styl',
					],
					'webroot/static/css/1.css': [
						'app/assets/styl/1.styl',
					],
				}],
			},
		},
		sync: {
			all: {
				files: [{
					cwd: 'app/assets',
					src: '{font,img,etc}/**',
					dest: 'webroot/static/',
				}],
			},
		},
	})

	grunt.registerTask('production', [
		'jade:production',
		'concat:production',
		'uglify:production',
		'stylus:production',
		'sync',
	])
}
