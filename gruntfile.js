

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
    },
    connect: {
      server: {
        options: {
          port: 3001,
          base: 'app'
        }
      }
    },
    watch: {
      files: ['app/js/*.js', 'app/**/*.scss', 'app/**/*.html'],
      tasks: ['jshint', 'sass', 'browserify'],
      options: {
        livereload: true,
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'sass', 'browserify', 'connect', 'watch']);

};