/**
 * Zoom 1.1.3
 * By luoqiang, 2015/07/2
 */

(function($) {
  var displayWidth = document.documentElement.clientWidth, //页面窗口宽度
    displayHeight = document.documentElement.clientHeight //页面窗口高度
    $this = null, //主元素
    currentIndex = 0, //当前图片的索引
    imgNum = 0, //图片当前的指数
    imgTotal = 0, //图片的总数
    isMove = 0, //是否在移动
    isSlip = 0, //是否在滑动
    cfg = {}; //参数;
  function parseArgs(arg, dft) {
    for (var key in dft) {
      if (typeof arg[key] == 'undefined') {
        arg[key] = dft[key];
      }
    }
    return arg;
  }

  function nextImg() {
    var l = cfg.imgData,
      k = currentIndex,
      j;
    if (k >= l.length - 1) {
      j = 0
    } else {
      j = k + 1
    }
    imgNum++;
    if (imgNum == parseInt(imgTotal + 1)) {
      imgNum = 1
    }
    var $center = $("#center"),
      $next = $("#next");
    cfg.before.call(this, k, $center);
    $center.css("-webkit-transform", "translate3d(-" + displayWidth + "px,0,0)").attr("pos", "-" + displayWidth);
    $("#prev").remove();
    $center.attr("id", "prev")
    $next.css("-webkit-transform", "translate3d(0,0,0)").attr("pos", "0").attr("id", "center");
    currentIndex = j;
    var m = $("<div class='imgItem loading' id='next' pos=" + displayWidth + " style='-webkit-transform:translate3d(" + displayWidth + "px,0,0);'></div>");
    if (j + 1 > l.length - 1) {
      m.html('<img  src="' + l[0] + '" onload="javascript:this.parentNode.className=\'imgItem\';"  />')

    } else {
      m.html('<img  src="' + l[j + 1] + '" onload="javascript:this.parentNode.className=\'imgItem\';"  />')
    }
    $("#ImgContainer").append(m);
    restore()
    BindEv()
    $("#box-num").html((imgNum + 1 > imgTotal ? 1 : currentIndex + 1) + " / " + imgTotal)
    cfg.after.call(this, j, $("#center"));

  }

  function prevImg() {
    var l = cfg.imgData,
      j = currentIndex,
      k;
    if (j == 0) {
      k = l.length - 1
    } else {
      k = j - 1
    }
    imgNum--;
    if (imgNum == 0) {
      imgNum = imgTotal
    }
    var $center = $("#center"),
      $prev = $("#prev");
    restore()
    cfg.before.call(this, k, $center);
    $center.css("-webkit-transform", "translate3d(" + displayWidth + "px,0,0)").attr("pos", displayWidth);
    $("#next").remove();
    $center.attr("id", "next");
    $prev.css("-webkit-transform", "translate3d(0,0,0)").attr("pos", "0").attr("id", "center");
    currentIndex = k;
    var m = $("<div class='imgItem loading' id='prev' pos=-" + displayWidth + " style='-webkit-transform:translate3d(-" + displayWidth + "px,0,0);'></div>");
    if (k - 1 < 0) {
      m.html('<img  src="' + l[l.length - 1] + '" onload="javascript:this.parentNode.className=\'imgItem\';" />');
    } else {
      m.html('<img  src="' + l[k - 1] + '" onload="javascript:this.parentNode.className=\'imgItem\';"  />');
    }
    $("#ImgContainer").prepend(m);
    BindEv()
    $("#box-num").html((imgNum + 1 > imgTotal ? 1 : currentIndex + 1) + " / " + imgTotal)
    cfg.after.call(this, j, $("#center"));
  }

  function getDistance(l, k) {
    var j = k.pageX - l.pageX,
      m = k.pageY - l.pageY;
    return Math.sqrt((j * j) + (m * m))
  }

  function getScale(k, j) {
    if (k.length >= 2 && j.length >= 2) {
      return getDistance(j[0], j[1]) / getDistance(k[0], k[1])
    }
    return 1
  }

  function restore() {
    // scale = 1;
    // marTop = 0;
    // marLeft = 0;
    $("#center img,#prev img,#next img").attr("style", "")
  }

  function itemReset() {
      $("#center").css("-webkit-transform", "translate3d(0,0, 0)");
      $("#prev").css("-webkit-transform", "translate3d(-" + displayWidth + "px,0, 0)").attr("pos",-displayWidth);
      $("#next").css("-webkit-transform", "translate3d(" + displayWidth + "px,0, 0)").attr("pos",displayWidth)
     }
    //缩放 和 图片翻页 双击放大
  function BindEv() {
    var $centerImg = $("#center>img"),
      doubleTaps = 0, //是否已经双击放大,
      scale = 1, //放大比例
      maxSize = cfg.maxScale, //最大的缩放比例
      minSize = cfg.minScale, //最小缩放比例
      marTop = 0, //顶部距离
      marLeft = 0, //左边距离
      initScale = 1 //初始化比例
    ;
    $centerImg.on("webkitTransitionEnd", function(p) {
      $(this).removeClass("view-img-zoom-animate")
    });
    if (cfg.doubleZoom) {
      $centerImg.off('doubleTap').doubleTap(function() {
        if (doubleTaps == 1 || isSlip == 1) return
        doubleTaps = 1
        $centerImg.addClass("view-img-zoom-animate")
        if (scale > 1) {
          $centerImg.css({
            top: "0",
            left: "0",
            "-webkit-transform": "scale(1,1)"
          })
          scale = doubleTaps = initScale = 1;
        } else {
          $(this).css({
            top: "0",
            left: "0",
            "-webkit-transform": "scale(" + maxSize + "," + maxSize + ")"
          });
          scale = initScale = maxSize
        }
        marTop = 0
        marLeft = 0
        setTimeout(function() {
          doubleTaps = 0
        }, 200);
      })
    }
    var q = 0,
      p = 0,
      mTop = 0,
      mLeft = 0,
      scaleStart = {};
    var l = parseInt($("#center img").width()),
      s = parseInt($("#center img").height()),
      j = $(window).width(),
      k = $(window).height();

    $centerImg.off('touchstart').on('touchstart', function(t) {
      if (t.touches.length == 2) {
        scaleStart.touches = [{
          pageX: t.touches[0].pageX,
          pageY: t.touches[0].pageY
        }, {
          pageX: t.touches[1].pageX,
          pageY: t.touches[1].pageY
        }];
        isSlip = 1;
      } else {
        if (isSlip == 1) return
        q = t.touches[0].pageX;
        p = t.touches[0].pageY
      }



    })

    $centerImg.off("touchmove").on("touchmove", function(x) {
      var nextPos = parseInt($this.find("#next").attr("pos")),
          prevPos = parseInt($this.find("#prev").attr("pos"));

      if (x.touches.length == 2) {
        //try{

        var sc = getScale(scaleStart.touches, x.touches);
        if (sc != 1) {
          isSlip = 1;
          isMove = 0;
          if ((nextPos > 0 && nextPos < displayWidth) || (prevPos < 0 && prevPos > -displayWidth) || (doubleTaps == 1)) {
            alert(prevPos)
            itemReset()
            return
          }

          scale = initScale * sc;
          if (scale > maxSize) {
            scale = maxSize
          } else {
            if (scale < minSize) {
              scale = minSize
            }
          }
          $centerImg.css({
            "-webkit-transform": "scale(" + scale + "," + scale + ")"
          })
        }
        // }catch(ex){
        //   alert(ex)
        // }
        return false
      }

      if (isSlip == 1 || (scale == 1) || (nextPos > 0 && nextPos < displayWidth) || (prevPos < 0 && prevPos > -displayWidth) || (doubleTaps == 1)) {
        return
      }
      isMove = 1;
      var w = x.touches[0].pageX,
        u = x.touches[0].pageY;
      mTop = parseInt(marTop + u - p);
      mLeft = parseInt(marLeft + w - q);
      $(this).css({
        top: mTop + "px",
        left: mLeft + "px"
      })
    });
    $centerImg.off("touchend").on("touchend", function(u) {

      if (isSlip == 1) {
        if (scale == 1) {
          var posN = parseInt($this.find("#next").attr("pos")),
            posP = parseInt($this.find("#prev").attr("pos"));
          if (posN > 20 && posN < displayWidth) {
            nextImg()
          }
          if (posP < -20 && posP > -displayWidth) {
            prevImg()
          }
        }
        if (scale < 1.2) {
          $centerImg.addClass("view-img-zoom-animate");
          $centerImg.css({
            top: "0",
            left: "0"
          })
        }
        initScale = scale;
        marTop = 0;
        marLeft = 0;
        scaleStart = {};
        setTimeout(function() {
          isSlip = 0
        }, 100)
        return
      }


      //缩放比例后操作
      if (isSlip == 1 || (scale == 1) || (doubleTaps == 1)) {
        return
      }
      marTop = mTop;
      marLeft = mLeft;
      //图片在放大之后 图片移动右边移动之后如果大于了 设定的比例值就会进入下一页  
      if (marLeft > ((scale * l - j) / 2 + j * 0.3)) {
        scale = 1;
        isMove = 0;
        prevImg()

        //console.log("上一个图片");
        return
      } else {
        //图片在放大之后 图片移动右边拉出之后 进行还原 类似left=0  
        if (marLeft > (scale * l - j) / 2) {
          marLeft = (scale * l - j) / 2
        }
      }
      //和上面一样  只不过判断的左边移动
      if (marLeft < (-(scale * l - j) / 2 - j * 0.3)) {
        scale = 1;
        isMove = 0;
        nextImg()
          //console.log("下一个图片");
        return
      } else {
        if (marLeft < -(scale * l - j) / 2) {
          marLeft = -(scale * l - j) / 2
        }
      }

      var t = false;
      //判断图片顶部底部是否拉出
      //首先判断图片的大小是否已经超出了屏幕的尺寸
      if (scale * s > k) {
        //顶部拉出处理
        if (marTop > ((scale * s - k) / 2)) {
          marTop = (scale * s - k) / 2;
          t = true
        }
        //底部拉出处理
        if (marTop < (-(scale * s - k) / 2)) {
          marTop = -(scale * s - k) / 2;
          t = true
        }
      } else {
        marTop = 0;
        t = true
      }
      t && $(this).addClass("view-img-zoom-animate");
      $(this).css({
        top: marTop + "px",
        left: marLeft + "px"
      });
      setTimeout(function() {
        isMove = 0
      }, 100)
    })
  }
  $.fn.ImgView = function(options) {

    //默认设置
    if (options.imgData == undefined || options.imgData.length <= 0 || $(this).attr('open') == 'true') return

    var _default = {
      'imgData': null, //基础数据
      'doubleZoom': false, //是否支持双击放大
      'zoom': true, //是否缩放
      'pageShow': true, //页码显示
      'switchBtn': false, //上一页下一页按钮
      'minScale': 1, //最小缩放比例
      'maxScale': 1, //最大缩放比例
      'startIndex':0,//开始从那一张图片滑动
      'before': new Function,
      'after': new Function
    };

    cfg = parseArgs(options || {}, _default);
    currentIndex=cfg.startIndex-1<0||cfg.startIndex-1>cfg.imgData.length-1? 0 :cfg.startIndex-1;
    var n = cfg.imgData,
        l = "",
        k = currentIndex;
    $this = $(this)

    /*******页面架构*******/
    $ImgContainer = $("<div id='ImgContainer' style='height:" + $(window).height() + "px'></div>")
    var m = k - 1,
      j = k + 1;
    imgTotal = n.length;
    if (k == 0) {
      m = n.length - 1
    }
    l = '<div id="prev" class="imgItem loading" pos="-' + displayWidth + '" style="-webkit-transform:translate3d(-' + displayWidth + 'px,0,0);"><img  src="' + n[m] + '"  onload="javascript:this.parentNode.className=\'imgItem\';"  /></div>';
    l += '<div id="center" class="imgItem loading" pos="0" style="-webkit-transform:translate3d(0,0,0);"><img src="' + n[k] + '" onload="javascript:this.parentNode.className=\'imgItem\';"  /></div>';
    if (k == n.length - 1) {
      j = 0
    }
    l += '<div id="next" class="imgItem loading" pos="' + displayWidth + '" style="-webkit-transform:translate3d(' + displayWidth + 'px,0,0);"><img src="' + n[j] + '"  onload="javascript:this.parentNode.className=\'imgItem\';" /></div>';
    $ImgContainer.html(l);
    $this.append('<div id="tools" style="-webkit-transition: all 0.2s ease-out;"><a href="javascript:void(0)" id="btn-back" class="btn-back"><em></em>返回</a><span id="box-num" style="display:' + (cfg.pageShow ? "block" : "none") + '">' + (currentIndex == 0 ? '1' : imgNum) + ' / ' + imgTotal + '</span></div>')
    cfg.switchBtn && $this.append('<div id="btn-prev" class="btn-dir no-delay" style="-webkit-transition: all 0.2s ease-out;"><span class="btn-bg span-prev"></span></div><div id="btn-next" class="btn-dir no-delay" style="-webkit-transition: all 0.2s ease-out;"><span class="btn-bg span-next"></span></div>')
    $this.append($ImgContainer)

    $this.css('display', 'block').attr('open', 'true')
      /*******End页面架构*******/
      /*******事件绑定*********/

    $this.on("touchmove", function(l) {
      l.preventDefault()
    }).on('tap', '#btn-back', function() {
      $this.css('display', 'none').attr('open', 'false').html('')
    }).on('click', '#btn-prev', function(e) {
      prevImg()
      e.stopPropagation()
    }).on('click', '#btn-next', function(e) {
      nextImg()
      e.stopPropagation()
    });

    var toggleBar = function() {
      var j = document.body;
      if (j.className == "hide-bar") {
        j.className = ""
      } else {
        j.className = "hide-bar"
      }
    }

    setTimeout(function() {
      toggleBar()
      $(document).off("click").on("click", toggleBar);
    }, 3000)


    /*******End事件绑定*********/

    cfg.zoom && BindEv()
    var touchInitPos = 0,
      deltaX1 = 0,
      startPos = 0,
      startPosPrev = 0,
      startPosNext = 0,
      deltaX2 = 0,
      totalDist = 0,
      totalDist2 = 0,
      hasPrev = !!$("#prev"),
      hasNext = !!$("#next");
    /************图片翻页**************/
    $this.on('touchstart', '#ImgContainer', function(t) {
      if (isSlip == 1) return
      touchInitPos = t.touches[0].pageX;
      deltaX1 = touchInitPos;
      startPos = 0;
      startPosPrev = -displayWidth;
      startPosNext = displayWidth;
      if (hasNext) {
        $("#next").addClass("touchmove")
      }
      $("#center").addClass("touchmove");
      if (hasPrev) {
        $("#prev").addClass("touchmove")
      }
    })

    $this.on('touchmove', '#ImgContainer', function(x) {
      if (isSlip == 1 || (isMove == 1) || x.touches.length !== 1) return
      var j = x.touches[0].pageX;
      deltaX2 = j - deltaX1;
      totalDist = startPos + j - touchInitPos;
      var m = totalDist + "px,0";
      $("#center").css("-webkit-transform", "translate3d(" + m + ", 0)");
      startPos = totalDist;
      if (totalDist < 0) {
        if (hasNext) {
          scale = 1;
          totalDist2 = startPosNext + j - touchInitPos;
          var k = totalDist2 + "px,0";
          $("#next").attr("pos", totalDist2);
          $("#next").css("-webkit-transform", "translate3d(" + k + ", 0)");
          startPosNext = totalDist2
        }
      } else {
        if (hasPrev) {
          scale = 1;
          totalDist2 = startPosPrev + j - touchInitPos;
          var k = totalDist2 + "px,0";
          $("#prev").attr("pos", totalDist2);
          $("#prev").css("-webkit-transform", "translate3d(" + k + ", 0)");
          startPosPrev = totalDist2
        }
      }
      touchInitPos = j
      return false
    })
    $this.on('touchend', '#ImgContainer', function() {

        if (deltaX2 < -15) {
          nextImg()
        } else {
          if (deltaX2 > 15) {
            prevImg()
          } else {
            itemReset()
          }
        }
        totalDist = 0;
        deltaX2 = 0;
        if (hasPrev) {
          $("#prev").removeClass("touchmove")
        }
        $("#center").removeClass("touchmove");
        if (hasNext) {
          $("#next").removeClass("touchmove")
        }
      })
      /************End图片翻页**************/
  }

})(Zepto)