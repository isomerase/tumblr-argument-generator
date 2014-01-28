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
					'app/assets/js/resources/adverbs.js',
					'app/assets/js/resources/alignments.js',
					'app/assets/js/resources/privileged.js',
					'app/assets/js/resources/concepts.js',
					'app/assets/js/resources/conclusions.js',
					'app/assets/js/resources/emoji.js',
					'app/assets/js/resources/genders.js',
					'app/assets/js/resources/images.js',
					'app/assets/js/resources/insults.js',
					'app/assets/js/resources/intros.js',
					'app/assets/js/resources/kins.js',
					'app/assets/js/resources/marginalized.js',
					'app/assets/js/resources/personalities.js',
					'app/assets/js/resources/phobias.js',
					'app/assets/js/resources/politics.js',
					'app/assets/js/resources/presentations.js',
					'app/assets/js/resources/pronouns.js',
					'app/assets/js/resources/revolutions.js',
					'app/assets/js/resources/statements.js',
					'app/assets/js/resources/titles.js',
					'app/assets/js/resources/triggers.js',
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
