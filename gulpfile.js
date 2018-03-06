var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    obfuscate = require('gulp-obfuscate'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),    //压缩图片
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    revCollector = require('gulp-rev-collector'),
    runSequence = require('run-sequence'),
    livereload = require('gulp-livereload'),
    stripCssComments = require('gulp-strip-css-comments'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require('gulp.spritesmith'),//install -save gulp.spritesmith
    merge = require('merge-stream'),
    buffer = require('vinyl-buffer'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;
   
   //清理动作
    gulp.task("clean", function(){ 
        return gulp.src(['public/dist/'],{read:false})
        .pipe(clean());
    }); 
    //js语法检查
    gulp.task('jshint', function () {
        return gulp.src('public/javascripts/**/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });  
    //压缩js
    gulp.task('minifyjs', function() {
        return gulp.src('public/javascripts/**/*.js')   
            .pipe(plumber())
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())  //压缩
            .pipe(gulp.dest('public/dist/javascripts'));
    });
    //压缩js，并生成对应的js引用路径版本号文件
    gulp.task('minifyjsRev', function() {
        return gulp.src('public/javascripts/**/*.js')   
            .pipe(plumber())
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())  //压缩
            .pipe(rev()) //自动生成版本号
            .pipe(gulp.dest('public/dist/javascripts'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('public/dist/rev/js'));  //生成对应的js引用路径版本号文件
    });

    //合并雪碧图
    gulp.task('imagesprite', function() {
        var spriteData = gulp.src('public/icon/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));
        var imgStream = spriteData.img
            .pipe(plumber())
            .pipe(buffer())
            .pipe(imagemin({ 
                optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）  
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片  
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染  
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化 
            })) 
            .pipe(gulp.dest('public/dist/icon/')); 

        var cssStream = spriteData.css
            .pipe(minifycss()) 
            .pipe(gulp.dest('public/dist/icon/'));
        return merge(imgStream, cssStream);
    });
    //合并雪碧图，生成对应的icon图标和sprite.css引用路径版本号文件
    gulp.task('imagespriteRev', function() {
        var spriteData = gulp.src('public/icon/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));
        var imgStream = spriteData.img
            .pipe(plumber())
            .pipe(buffer())
            .pipe(imagemin({ 
                optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）  
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片  
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染  
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化 
            }))
            .pipe(rev()) //自动生成版本号
            .pipe(gulp.dest('public/dist/icon/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('public/dist/rev/icon'));  //生成对应的icon图标引用路径版本号文件

        var cssStream = spriteData.css
            .pipe(minifycss())
            .pipe(rev()) //自动生成版本号
            .pipe(gulp.dest('public/dist/icon/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('public/dist/rev/sprite'));  //生成对应的sprite.css引用路径版本号文件
        return merge(imgStream, cssStream);
    }); 
    //压缩图片
    gulp.task('imagesmin', function() {
        return gulp.src('public/images/**/*.{png,jpg,gif}')
        .pipe(plumber())
        .pipe(cache(imagemin({ 
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）  
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片  
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染  
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化 
        }))) 
        .pipe(gulp.dest('public/dist/images/'));
    });

    //压缩图片，并生成对应的image引用路径版本号文件
    gulp.task('imagesminRev', function() {
        return gulp.src('public/images/**/*.{png,jpg,gif}')
        .pipe(plumber())
        .pipe(cache(imagemin({ 
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）  
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片  
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染  
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化 
        })))
        .pipe(rev())
        .pipe(gulp.dest('public/dist/images/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/dist/rev/images/')); //生成对应的image引用路径版本号文件
    }); 
       
    //压缩CSS
    gulp.task('cssmin', function() {
        return gulp.src('public/stylesheets/**/*.css')
        .pipe(plumber())
        .pipe(concat('style.min.css')) //合并
        .pipe(minifycss()) 
        .pipe(gulp.dest('public/dist/stylesheets'));
    });

    //压缩CSS，并生成对应的css引用路径版本号文件
    gulp.task('cssminRev', function() {
        return gulp.src('public/stylesheets/**/*.css')
        .pipe(plumber())
        .pipe(concat('style.min.css')) //合并
        .pipe(minifycss())
        .pipe(rev()) //自动生成版本号
        .pipe(gulp.dest('public/dist/stylesheets'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/dist/rev/css')); //生成对应的css引用路径版本号文件
    });

    //修改html文件对应的js,css文件引用路径
    gulp.task('revHtml',function(){
        return gulp.src(['public/dist/rev/**/*.json','views/**/*.html'])
        .pipe(revCollector({
            replaceReved:true
        }))
        .pipe(gulp.dest('views'));
    });

    //修改style.css文件中对应的iamge引用路径
    gulp.task('revImageCss', function(){
      return gulp.src(['public/dist/rev/images/*.json', 'public/dist/stylesheets/*.css'])
        .pipe(revCollector({
            replaceReved:true
        }))
        .pipe(gulp.dest('public/dist/stylesheets'))
        .pipe(reload({ stream:true }));  
    });

    //修改sprite.css文件中对应的icon图标引用路径
    gulp.task('revSpriteCss', function(){
      return gulp.src(['public/dist/rev/icon/*.json', 'public/dist/icon/*.css'])
        .pipe(revCollector({
            replaceReved:true
        }))
        .pipe(gulp.dest('public/dist/icon'))
        .pipe(reload({ stream:true }));  
    });
 
    //默认命令，在cmd中输入gulp后，执行的就是这个任务(压缩js需要在检查js之后操作)
    gulp.task('default',['clean'],function() {
        //gulp.start('scss-monitor'), 
        gulp.start('minifyjs'),
        gulp.start('imagesprite'),
        gulp.start('imagesmin'),
        gulp.start('cssmin'),
        gulp.start('watch')
　　});


    //用于发布时，生成版本号
    gulp.task('revVersionNum',function() {
        //按照指定顺序，依次执行任务
        runSequence(
            "clean",
            "minifyjsRev",
            "imagespriteRev",
            "imagesminRev",
            "cssminRev",
            "revHtml",
            "revImageCss",
            "revSpriteCss"
        );
　　}); 

    //监听文件，文件改变，执行对应任务
    gulp.task('watch',['clean'],function(){
         gulp.watch('public/stylesheets/**/*.css',['cssmin']);
         gulp.watch('public/javascripts/**/*.js',['jshint','minifyjs']);
         gulp.watch('public/images/**/*.{png,jpg,gif}',['imagesmin']);
         gulp.watch('public/icon/**/*.{png,jpg,gif,ico}',['imagesprite']);
    });