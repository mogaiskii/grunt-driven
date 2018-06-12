module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
    rig: 'grunt-rigger',
  });
  // Config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: {
          'build/css/main.css': 'src/css/main.scss',
        },
      },
    },
    postcss: {
      options: {
        map: false,
        syntax: require('postcss-scss'),
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}),
          require('cssnano')(),
        ],
      },
      dist: {
        src: 'build/css/main.css',
        dest: 'build/css/main.css',
      },
    },
    browserify: {
      main: {
        src: 'src/js/main.js',
        dest: 'build/js/main.js',
        options: {
          browserifyOptions: { debug: true },
          transform: [['babelify', { 'presets': ['es2015'] }]],
          plugin: [['minifyify', { map: true }]],
        },
      },
    },
    rig: {
      compile: {
        files: {
          'build/index.html': ['src/index.html'],
        },
      },
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true, // lets access to below options
          cwd: 'src/',
          src: ['img/**/*.{png,jpg,gif}'],
          dest: 'build/',
        }],
      },
    },
    copy: {
      main: {
        files: [{
          expand: true,
          src: ['public/**', '!.keep'],
          dest: 'build/',
        }],
      },
    },
    clean: {
      contents: ['build/*'],
    },
    watch: {
      options: {
        livereload: 9090,
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['js'],
        options: { spawn: false },
      },
      css: {
        files: ['src/css/**/*.scss'],
        tasks: ['css'],
        options: { spawn: false },
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['html'],
        options: { spawn: false },
      },
      image: {
        files: ['src/img/**/*.{png,jpg,gif}'],
        tasks: ['image'],
        options: { spawn: false },
      },
      public: {
        files: ['public/**'],
        tasks: ['public'],
        options: { spawn: false },
      },
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ['build/**'],
        },
        options: {
          watchTask: true,
          server: './build',
          logPrefix: 'frontEd',
        },
      },
    },
  });

  grunt.registerTask('css', ['sass', 'postcss']);
  grunt.registerTask('js', ['browserify']);
  grunt.registerTask('html', ['rig']);
  grunt.registerTask('image', ['imagemin']);
  grunt.registerTask('public', ['copy']);
  // grunt.registerTask('clean', ['clean']);

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('serve', ['browserSync']);

  grunt.registerTask('build', ['css', 'js', 'html', 'image', 'public']);

  grunt.registerTask('default', ['build', 'serve', 'watch']);
};
