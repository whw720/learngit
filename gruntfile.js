
module.exports = function(grunt) {

  var tempdir = './.temp';
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	version: grunt.file.readJSON('version.json'),
    clean: [tempdir],
    uglify: {
      options: {
        banner: '/*\n' + 
                'This file is part of <%= pkg.name + " " + version.major + "." + version.minor + "." + version.build%>\n' +
                'Copyright (c) 1998-<%= grunt.template.today("yyyy")%> DFsoft Inc\n' + 
                'Contact: http://www.dfsoft.com.cn\n' + 
                'Build date: <%= grunt.template.today("yyyy-mm-dd")%>\n' + 
                '*/\n',
        compress: {
            unused: false
        },
        mangle: true
      }, build: {
          files: [{
            expand: true,
            src: ['**/*.js', '!**/*-test.js', '!**/gruntfile.js', '!**/extjs/**/*.js', '!node_modules/**'],
            dest: tempdir,
            ext: '.js'
          }]
        }
    },
    compress: {
      options: {
        archive: '<%= pkg.name%>-v<%= version.major + "." + version.minor + "." + version.build %>.zip'
      },
      zip: {
        files: [
          {src: ['bin/**/learngit', 'bin/**/learngit.cmd']},
          {expand: true, cwd: tempdir, src: ['**']},
          {expand: true, src: ['**/*.key', 'controllers/**/*.json','config/*.json', 'public/**', '!public/**/*.js', 'views/**', '**/extjs/**/*', 'node_modules/**', '!node_modules/grunt*/**', 'node_modules/ursa/**', 'lib/**/*.pub', 'version.json']},
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', ['clean', 'uglify', 'compress', 'clean']);
};