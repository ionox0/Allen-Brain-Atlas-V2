

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'app/js/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['app/js/*.js', 'app/**/*.scss', 'app/**/*.html'],
      tasks: ['jshint', 'sass', 'browserify'],
      options: {
        livereload: true,
      },
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'app/styles/main.css': 'app/styles/main.scss'
        }
      }
    },
    browserify: {
      dist: {
        src: ['app/js/main.js'],
        dest: 'app/dist/bundle.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'sass', 'browserify', 'watch']);

};