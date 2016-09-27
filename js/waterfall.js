/* jshint asi:true */
//先等图片都加载完成
//再执行布局函数
/**
 * 执行主函数
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
(function() {

    /**
     * 内容JSON
     */
    var demoContent = [{
        demo_link: 'https://chenjy1225.github.io/ChenjyDemo/graffiti/3D-Graffiti.html',
        img_link: 'http://ww4.sinaimg.cn/mw690/c584f169gw1f729v4i7agj20p20h4wgt.jpg',
        code_link: 'https://github.com/Chenjy1225/ChenjyDemo/tree/gh-pages/graffiti',
        title: '3D模型涂鸦',
        core_tech: 'three.js',
        description: '使用three.js。仿照了网站 <a href ="http://www.mohou.com/tools/3dtuya.html">http://www.mohou.com/tools/3dtuya.html</a>3D涂鸦效果的功能效果。'
    },{
    	demo_link: 'https://chenjy1225.github.io/ChenjyDemo/VirtualFactory/VirtualFactory.html',
        img_link: 'http://ww3.sinaimg.cn/mw690/c584f169gw1f7ajv6vvphj20zn0exad7.jpg',
        code_link: 'https://github.com/Chenjy1225/ChenjyDemo/tree/gh-pages/VirtualFactory',
        title: '3D虚拟工厂',
        core_tech: 'three.js',
        description: '使用three.js。简单的模型了工厂流水线的运行情况'
    },{
    	demo_link: 'https://chenjy1225.github.io/ChenjyDemo/Factory/public.html',
        img_link: 'http://ww4.sinaimg.cn/mw690/c584f169gw1f7d2crbv28j20ro0gnacf.jpg',
        code_link: 'https://github.com/Chenjy1225/ChenjyDemo/tree/gh-pages/Factory',
        title: '工厂装配',
        core_tech: 'Unity3d',
        description: '使用Unity3d。简单的模型了工厂装配过程的demo'
    },{
    	demo_link: 'https://chenjy1225.github.io/ChenjyDemo/FirstLockControl/FirstLockControl.html',
        img_link: 'http://ww3.sinaimg.cn/mw690/c584f169gw1f7dw9jpzazj20nv0d6wev.jpg',
        code_link: 'https://github.com/Chenjy1225/ChenjyDemo/tree/gh-pages/FirstLockControl',
        title: '第一人称控件（基于Physijs）',
        core_tech: 'three.js physijs',
        description: '使用three.js制作的第一人称控件（锁屏）'
    },{
        demo_link: 'https://chenjy1225.github.io/ChenjyDemo/Ruler3D/Ruler3D.html',
        img_link: 'http://ww2.sinaimg.cn/mw690/c584f169gw1f88ktdy8rnj20vi0h3gqq.jpg',
        code_link: 'https://github.com/Chenjy1225/ChenjyDemo/blob/gh-pages/Ruler3D/Ruler3D.html',
        title: '基准坐标标识器',
        core_tech: 'three.js',
        description: '使用three.js制作的基准坐标标识器'
    }];

    contentInit(demoContent) //内容初始化
    waitImgsLoad() //等待图片加载，并执行布局初始化
}());



/**
 * 内容初始化
 * @return {[type]} [description]
 */
function contentInit(content) {
    // var htmlArr = [];
    // for (var i = 0; i < content.length; i++) {
    //     htmlArr.push('<div class="grid-item">')
    //     htmlArr.push('<a class="a-img" href="'+content[i].demo_link+'">')
    //     htmlArr.push('<img src="'+content[i].img_link+'">')
    //     htmlArr.push('</a>')
    //     htmlArr.push('<h3 class="demo-title">')
    //     htmlArr.push('<a href="'+content[i].demo_link+'">'+content[i].title+'</a>')
    //     htmlArr.push('</h3>')
    //     htmlArr.push('<p>主要技术：'+content[i].core_tech+'</p>')
    //     htmlArr.push('<p>'+content[i].description)
    //     htmlArr.push('<a href="'+content[i].code_link+'">源代码 <i class="fa fa-code" aria-hidden="true"></i></a>')
    //     htmlArr.push('</p>')
    //     htmlArr.push('</div>')
    // }
    // var htmlStr = htmlArr.join('')
    var htmlStr = ''
    for (var i = 0; i < content.length; i++) {
        htmlStr +=
            '<div class="grid-item">' +
            '   <a class="a-img" href="' + content[i].demo_link + '">' +
            '       <img src="' + content[i].img_link + '">' +
            '   </a>' +
            '   <h3 class="demo-title">' +
            '       <a href="' + content[i].demo_link + '">' + content[i].title + '</a>' +
            '   </h3>' +
            '   <p>主要技术：' + content[i].core_tech + '</p>' +
            '   <p>' + content[i].description +
            '       <a href="' + content[i].code_link + '">源代码 <i class="fa fa-code" aria-hidden="true"></i></a>' +
            '   </p>' +
            '</div>'
    }
    var grid = document.querySelector('.grid')
    grid.insertAdjacentHTML('afterbegin', htmlStr)
}

/**
 * 等待图片加载
 * @return {[type]} [description]
 */
function waitImgsLoad() {
    var imgs = document.querySelectorAll('.grid img')
    var totalImgs = imgs.length
    var count = 0
        //console.log(imgs)
    for (var i = 0; i < totalImgs; i++) {
        if (imgs[i].complete) {
            //console.log('complete');
            count++
        } else {
            imgs[i].onload = function() {
                // alert('onload')
                count++
                //console.log('onload' + count)
                if (count == totalImgs) {
                    //console.log('onload---bbbbbbbb')
                    initGrid()
                }
            }
        }
    }
    if (count == totalImgs) {
        //console.log('---bbbbbbbb')
        initGrid()
    }
}

/**
 * 初始化栅格布局
 * @return {[type]} [description]
 */
function initGrid() {
    var msnry = new Masonry('.grid', {
        // options
        itemSelector: '.grid-item',
        columnWidth: 250,
        isFitWidth: true,
        gutter: 20,
    })
}
