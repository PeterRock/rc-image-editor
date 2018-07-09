/*! image-editor v1.0.0 by Shizhy */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _jsx = _interopDefault(require('babel-runtime/helpers/jsx'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var React = require('react');
var React__default = _interopDefault(React);
require('./cRleBM.scss');
require('./EiFvR.scss');

var LoadingMask = function (_PureComponent) {
    _inherits(LoadingMask, _PureComponent);

    function LoadingMask() {
        _classCallCheck(this, LoadingMask);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    LoadingMask.prototype.render = function render() {
        var loading = this.props.loading;

        if (loading) {
            return _jsx('div', {
                className: 'loading-mask'
            }, void 0, _jsx('i', {
                className: 'loading-mask__icon-loading'
            }));
        }
        return null;
    };

    return LoadingMask;
}(React.PureComponent);


LoadingMask.defaultProps = {
    loading: true
};

var Toolbar = function (_PureComponent) {
    _inherits(Toolbar, _PureComponent);

    function Toolbar() {
        _classCallCheck(this, Toolbar);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    Toolbar.prototype.render = function render() {
        var children = this.props.children;

        return _jsx("div", {
            className: "imge-toolbar"
        }, void 0, _jsx("div", {
            className: "imge-toolbar__actions"
        }, void 0, children));
    };

    return Toolbar;
}(React.PureComponent);

var RangeSlider = function (props) {
    var min = props.min,
        max = props.max,
        value = props.value,
        onChange = props.onChange;


    return _jsx('div', {
        className: 'imge-range-slider'
    }, void 0, _jsx('input', {
        onChange: onChange,
        type: 'range',
        min: min,
        max: max,
        value: value,
        className: 'imge-range-slider__input'
    }), _jsx('span', {
        className: 'imge-range-slider__text'
    }, void 0, value));
};

RangeSlider.defaultProps = {
    visible: true,
    min: 0,
    max: 10,
    value: 1,
    onChange: null
};

var ItemIcon = function (props) {
    var visible = props.visible,
        active = props.active,
        name = props.name,
        onClick = props.onClick,
        extra = props.extra,
        alt = props.alt,
        title = props.title;

    if (visible) {
        return _jsx('span', {
            className: 'imge-toolbar-icon__item'
        }, void 0, _jsx('span', {
            alt: alt,
            title: title,
            onClick: onClick,
            className: 'imge-toolbar-icon__wrapper' + (active ? ' active' : '')
        }, void 0, _jsx('i', {
            className: 'imge-toolbar__icon ' + name
        })), extra);
    }
    return null;
};

ItemIcon.defaultProps = {
    visible: true,
    active: false,
    name: '',
    onClick: null
};

var Split = function () {
    return _jsx('span', {
        className: 'imge-toolbar__split'
    });
};

var TogglePanel = function (props) {
    return _jsx('div', {
        className: 'imge-toolbar-sub-panel',
        style: { display: props.visible ? 'block' : 'none' }
    }, void 0, props.children);
};

/**
 * 绘图 操作相关
 */

/**
 * Mosaic 处理
 */
var MOSAIC_PEN_LEN = 20;

var drawRect = function (ctx, x, y, width, height, fillStyle, lineWidth, strokeStyle, globalAlpha) {
    var context = ctx;
    context.beginPath();
    context.rect(x, y, width, height);
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    fillStyle && (context.fillStyle = fillStyle);
    globalAlpha && (context.globalAlpha = globalAlpha);

    context.fill();
    context.stroke();
};
var setColor = function (content, x, y, penLen) {
    var ctx = content;
    var imgData = ctx.getImageData(x, y, penLen, penLen).data;
    var r = 0;
    var g = 0;
    var b = 0;
    for (var i = 0; i < imgData.length; i += 4) {
        r += imgData[i];
        g += imgData[i + 1];
        b += imgData[i + 2];
    }
    r = Math.round(r / (imgData.length / 4));
    g = Math.round(g / (imgData.length / 4));
    b = Math.round(b / (imgData.length / 4));
    drawRect(ctx, x, y, penLen, penLen, 'rgb(' + r + ', ' + g + ', ' + b + ')', 2, 'rgb(' + r + ', ' + g + ', ' + b + ')');
};
/**
 * 指定路径绘制马赛克
 * @param {CanvasRenderingContext2D} context Canvas 2d Context
 * @param {int} beginX 起点X坐标
 * @param {*} beginY 起点Y坐标
 * @param {*} rectWidth 延伸宽度
 * @param {*} rectHight 眼神高度
 * @param {*} penLen 画笔大小
 */
var makeMosaicGrid = function (context, beginX, beginY, rectWidth, rectHight) {
    var penLen = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : MOSAIC_PEN_LEN;

    var row = Math.round(rectWidth / penLen) + 1;
    var column = Math.round(rectHight / penLen) + 1;
    for (var i = 0; i < row * column; i += 1) {
        var x = i % row * penLen + beginX;
        var y = parseInt(i / row, 10) * penLen + beginY;
        setColor(context, x, y, penLen);
    }
};

/**
 * ---- Canvas操作
 */

/**
 * 文件导出
 */
var saveFile = function (data, filename) {
    var saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    saveLink.href = data;
    saveLink.download = filename;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    saveLink.dispatchEvent(event);
};
var convertRang = function (value, min, max, defaultValue) {
    var preValue = parseFloat(value);
    if (preValue > min && preValue < max) {
        return preValue;
    }
    return defaultValue;
};
/**
 * 导出jpg图片到本地
 * @param {HTMLCanvasElement} canvas Canvas
 * @param {int} quality 图片质量（0-1）
 */
var toJpg = function (canvas) {
    var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().getTime() + '.jpg';
    var quality = arguments[2];

    var imgData = canvas.toDataURL('image/jpeg', convertRang(quality, 0, 1, 0.92));
    imgData = imgData.replace('image/jpeg', 'image/octet-stream');
    saveFile(imgData, filename);
};
/**
 * 导出png图片到本地
 * @param {HTMLCanvasElement} canvas Canvas
 * @param {int} quality 图片质量（0-1）
 */
var toPng = function (canvas) {
    var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().getTime() + '.jpg';
    var quality = arguments[2];

    var imgData = canvas.toDataURL('image/png', convertRang(quality, 0, 1, 0.92));
    imgData = imgData.replace('image/png', 'image/octet-stream');
    saveFile(imgData, filename);
};
/**
 * canvas图像内容向右侧旋转90º
 * --- 目前该方法是利用Image旋转，是存在性能问题的
 *
 * @param {HTMLCanvasElement} canvas Canvas对象
 * @param {Function} callback 旋转结束之后的回掉函数
 */

/**
 * 顺时针旋转 Canvas 的ImageData 90度
 * @param {HTMLCanvasElement} canvas Canvas
 */
var rotateImageDataR90 = function (canvas) {
    var context = canvas.getContext('2d');
    var iData = context.getImageData(0, 0, canvas.width, canvas.height);
    var W = canvas.width;
    var H = canvas.height;
    var newData = [];
    for (var i = 0; i < iData.data.length; i += 4) {
        var X = i % (W * 4);
        var Y = parseInt(i / (W * 4));
        var newIndex = H * X + (H - 1 - Y) * 4;

        newData[newIndex] = iData.data[i];
        newData[newIndex + 1] = iData.data[i + 1];
        newData[newIndex + 2] = iData.data[i + 2];
        newData[newIndex + 3] = iData.data[i + 3];
    }
    var newImgData = context.createImageData(H, W);

    for (var index = 0; index < iData.data.length; index++) {
        newImgData.data[index] = newData[index];
    }
    return newImgData;
};

/**
 * 顺时针旋转canvas
 * @param {HTMLCanvasElement} canvas Canvas
 */
var rotateCanvasR90 = function (canvas) {
    var imageData = rotateImageDataR90(canvas);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    var context = canvas.getContext('2d');
    context.putImageData(imageData, 0, 0);
};

/**
 * ---- Element Html元素操作
 */

/**
 * 缩放元素
 * @param {HTMLElement} wrapper 要操作的元素节点
 * @param {Number} originWidth 原始宽度
 * @param {Number} originHeight 原始高度
 * @param {Number} zoomLevel 放大倍数
 * @param {Number} max 放大后最小边的最大值
 * @param {Number} min 缩小后最大边的最小值
 */
var zoom = function (element, originWidth, originHeight, zoomLevel) {
    var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20000;
    var min = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;

    var cWrapper = element;
    if (!cWrapper) return;
    // 图片缩放比例是相对于原始宽度
    var newWidth = zoomLevel * originWidth;
    var newHeight = zoomLevel * originHeight;

    // 边界判断
    if (max && Math.min(newWidth, newHeight) > max) {
        window.console.info('图片过大');
        return;
    } else if (min && Math.max(newWidth, newHeight) < min) {
        window.console.info('图片过小');
        return;
    }

    // 缩放后，根据图片现有位置，处理中心点位置偏移
    var offsetTop = (cWrapper.clientHeight - newHeight) / 2;
    var offsetLeft = (cWrapper.clientWidth - newWidth) / 2;
    if (cWrapper.style) {
        cWrapper.style.width = newWidth + 'px';
        cWrapper.style.height = newHeight + 'px';
        cWrapper.style.top = cWrapper.offsetTop + offsetTop + 'px';
        cWrapper.style.left = cWrapper.offsetLeft + offsetLeft + 'px';
    } else {
        window.console.warn('Element Has No Style ?');
    }
};

/**
 * 缩放element元素到最合适的比例显示在目标容器中
 * @param {HTMLElement} element 要处理缩放的html元素
 * @param {Number} originWidth 原始内容宽度
 * @param {Number} originHeight 原始内容高度
 * @param {Number} targetWidth 目标容器的宽度
 * @param {Number} targetHeight 目标容器的高度
 * @return {Number} 最终的缩放比例值
 */
var zoomToFit = function (element, originWidth, originHeight, targetWidth, targetHeight) {
    if (!element || !element || !originWidth || !originHeight || !targetWidth || !targetHeight) {
        window.console.warn('Data is not fit');
        return NaN;
    }
    // 比较宽度，默认最适合目标容器的大小
    var cWrapper = element;
    var minWidth = Math.min(targetWidth, originWidth);
    var minHeight = Math.min(targetHeight, originHeight);
    var destWidth = 0;
    var destHeight = 0;
    if (originWidth > originHeight) {
        destWidth = minWidth;
        destHeight = destWidth / originWidth * originHeight;
    } else {
        destHeight = minHeight;
        destWidth = destHeight / originHeight * originWidth;
    }
    // 设置图片居中显示, 画布容器进行缩放
    cWrapper.style.width = destWidth + 'px';
    cWrapper.style.height = destHeight + 'px';
    cWrapper.style.top = (targetHeight - destHeight) / 2 + 'px';
    cWrapper.style.left = (targetWidth - destWidth) / 2 + 'px';

    return destWidth / originWidth;
};
var rotateElementR90 = function (element) {
    var value = element.style.transform.match(/\d+/);
    var deg = 90;
    if (Array.isArray(value)) {
        deg = parseInt(value[0]) + 90;
    }
    var rotateStr = 'rotate(' + deg + 'deg)';
    element.style.transform = rotateStr;
    element.style['-ms-transform'] = rotateStr;
};

var Element = {
    zoom: zoom,
    zoomToFit: zoomToFit,
    rotateR90: rotateElementR90
};
var Canvas = {
    rotateR90: rotateCanvasR90
};
var Mosaic = {
    makeMosaicGrid: makeMosaicGrid
};
var Export = {
    toJpg: toJpg,
    toPng: toPng
};

var ImageEditor = function (_Component) {
    _inherits(ImageEditor, _Component);

    function ImageEditor(props) {
        _classCallCheck(this, ImageEditor);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.onModalClose = function () {
            var editable = _this.state.editable;

            if (editable && window.confirm('确认关闭吗？') || !editable) {
                var onClose = _this.props.onClose;

                // 处理关闭后相关操作

                _this.resetToolbar({ editable: false });
                _this.toggleMoveable(false);
                _this.imageOrigin = null;

                onClose && onClose();
            }
        };

        _this.onCanvasEditorMouseDown = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.dragMoving = true;
            _this.dragStartX = event.clientX - _this.canvasWrapper.offsetLeft;
            _this.dragStartY = event.clientY - _this.canvasWrapper.offsetTop;
        };

        _this.onCanvasEditorMouseMove = function (event) {
            if (_this.dragMoving) {
                _this.canvasWrapper.style.left = event.clientX - _this.dragStartX + 'px';
                _this.canvasWrapper.style.top = event.clientY - _this.dragStartY + 'px';
            }
        };

        _this.onCanvasEditorMouseUp = function () {
            _this.dragMoving = false;
            _this.dragStartX = 0;
            _this.dragStartY = 0;
        };

        _this.onMosaicMouseDown = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.mosaicMaking = true;
            _this.mosaicStartX = event.offsetX;
            _this.mosaicStartY = event.offsetY;
        };

        _this.onMosaicMouseMove = function (event) {
            if (_this.mosaicMaking) {
                var penSize = _this.state.penSize;

                var zoomLevel = _this.canvasWrapper.clientWidth / _this.canvas.width;
                var startX = _this.mosaicStartX / zoomLevel;
                var startY = _this.mosaicStartY / zoomLevel;
                var endX = event.offsetX / zoomLevel;
                var endY = event.offsetY / zoomLevel;
                Mosaic.makeMosaicGrid(_this.canvas.getContext('2d'), startX, startY, endX - startX, endY - startY, penSize);
                _this.mosaicStartX = event.offsetX;
                _this.mosaicStartY = event.offsetY;
            }
        };

        _this.onMosaicMouseUp = function () {
            _this.mosaicMaking = false;
        };

        _this.onImageLoad = function () {
            if (!_this.imageOrigin || !_this.canvas) return;
            var img = _this.imageOrigin;
            _this.canvas.width = img.width;
            _this.canvas.height = img.height;
            var context = _this.canvas.getContext('2d');
            context.drawImage(img, 0, 0, img.width, img.height);
            _this.zoomToFit();
            _this.setState({ loading: false });
            _this.toggleMoveable(true);
        };

        _this.loadData = function (data) {
            if (!data) {
                console.log('image Data is empty');return;
            }
            _this.setState({ loading: true });

            _this.imageOrigin = new Image();
            _this.imageOrigin.crossOrigin = 'anonymous';
            _this.imageOrigin.src = data;
            _this.imageOrigin.onload = _this.onImageLoad;
        };

        _this.makeEditable = function () {
            _this.setState({
                editable: true
            });
        };

        _this.makeMosaic = function () {
            var isMosaic = _this.state.isMosaic;

            _this.canvas.onmousedown = isMosaic ? null : _this.onMosaicMouseDown;
            _this.canvas.onmousemove = isMosaic ? null : _this.onMosaicMouseMove;
            _this.canvas.onmouseup = isMosaic ? null : _this.onMosaicMouseUp;
            _this.canvas.onmouseleave = isMosaic ? null : _this.onMosaicMouseUp;
            _this.resetToolbar({ isMosaic: !isMosaic });
        };

        _this.toggleMoveable = function (moveable) {
            if (_this.editor) {
                var op = moveable ? 'addEventListener' : 'removeEventListener';
                _this.editor[op]('mousedown', _this.onCanvasEditorMouseDown);
                _this.editor[op]('mousemove', _this.onCanvasEditorMouseMove);
                _this.editor[op]('mouseup', _this.onCanvasEditorMouseUp);
                _this.editor[op]('mouseleave', _this.onCanvasEditorMouseUp);
                _this.setState({ moveable: moveable });
            }
        };

        _this.zoomIn = function () {
            console.log('放大');
            var zoomLevel = _this.state.zoomLevel;

            _this.zoomTo(zoomLevel * 1.2);
        };

        _this.zoomOut = function () {
            console.log('缩小');
            var zoomLevel = _this.state.zoomLevel;

            _this.zoomTo(zoomLevel * 0.8);
        };

        _this.zoomToFit = function () {
            var zoomLevel = Element.zoomToFit(_this.canvasWrapper, _this.canvas.width, _this.canvas.height, _this.editor.clientWidth, _this.editor.clientHeight);
            _this.setState({ zoomLevel: zoomLevel });
        };

        _this.zoomTo = function (zoomLevel) {
            Element.zoom(_this.canvasWrapper, _this.canvas.width, _this.canvas.height, zoomLevel);
            _this.setState({ zoomLevel: zoomLevel });
        };

        _this.rotateCanvasDom = function () {
            Element.rotateR90(_this.canvas);
        };

        _this.rotateImage = function () {
            var rotating = _this.state.rotating;

            if (rotating) {
                return;
            }
            _this.setState({ rotating: true });

            Canvas.rotateR90(_this.canvas);
            // 旋转之后处理画布的大小
            var newWidth = _this.canvasWrapper.clientHeight;
            var newHeight = _this.canvasWrapper.clientWidth;
            var cwOffsetLeft = _this.canvasWrapper.offsetLeft;
            var cwOffsetTop = _this.canvasWrapper.offsetTop;
            _this.canvasWrapper.style.width = newWidth + 'px';
            _this.canvasWrapper.style.height = newHeight + 'px';
            _this.canvasWrapper.style.top = cwOffsetTop + (newWidth - newHeight) / 2 + 'px';
            _this.canvasWrapper.style.left = cwOffsetLeft + (newHeight - newWidth) / 2 + 'px';

            _this.setState({ rotating: false });
        };

        _this.restore = function () {
            _this.imageOrigin.src = _this.props.data;
        };

        _this.resetToolbar = function (value) {
            _this.setState(Object.assign({
                isMosaic: false
            }, value));
        };

        _this.save = function () {
            var onSaveDataURL = _this.props.onSaveDataURL;

            if (typeof onSaveDataURL === 'function') {
                onSaveDataURL(_this.canvas && _this.canvas.toDataURL());
            }
            _this.setState({
                editable: false
            });
        };

        _this.downloadJpg = function () {
            Export.toJpg(_this.canvas);
        };

        _this.onPenSizeChange = function (event) {
            _this.setState({
                penSize: event.target.value
            });
        };

        _this.state = {
            visible: !!props.visible,
            loading: true,
            zoomLevel: 1,
            editable: false,
            penSize: 20
        };
        _this.imageOrigin = null;

        // 画板拖动相关
        _this.dragStartX = 0;
        _this.dragStartY = 0;
        return _this;
    }

    ImageEditor.prototype.componentDidMount = function componentDidMount() {
        this.props.data && this.loadData(this.props.data);
    };

    ImageEditor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('visible' in nextProps) {
            if (this.state.visible !== nextProps.visible) {
                this.setState({
                    visible: nextProps.visible
                });
                // 当props切换时候，只有当 visible 显示时候，data的变化才有意义
                if (nextProps.visible && 'data' in nextProps) {
                    this.loadData(nextProps.data);
                }
            }
        }
    };

    ImageEditor.prototype.componentWillUnmount = function componentWillUnmount() {
        this.toggleMoveable(false);
    };

    // 画布容器拖动事件 -------

    // ------- 画布容器拖动事件

    // 打码操作事件 -------

    // ------- 打码操作事件

    // ------- 图片加载

    // ------- 图片加载


    // Toolbar 操作事件


    // 右旋转90度

    // 撤销

    // 重设编辑条按钮状态


    ImageEditor.prototype.render = function render() {
        var _this2 = this;

        var _state = this.state,
            visible = _state.visible,
            loading = _state.loading,
            editable = _state.editable,
            isMosaic = _state.isMosaic,
            moveable = _state.moveable,
            penSize = _state.penSize;

        if (!visible) {
            return null;
        }

        return _jsx('div', {
            className: 'image-editor'
        }, void 0, _jsx('div', {
            className: 'imge-wrapper'
        }, void 0, _jsx(Toolbar, {}, void 0, _jsx(ItemIcon, {
            onClick: this.zoomIn,
            name: 'icon-zoom-in',
            title: '\u653E\u5927'
        }), _jsx(ItemIcon, {
            onClick: this.zoomOut,
            name: 'icon-zoom-out',
            title: '\u7F29\u5C0F'
        }), _jsx(ItemIcon, {
            onClick: this.zoomToFit,
            name: 'icon-zoom-fit',
            title: '\u9002\u5408\u7A97\u53E3'
        }), _jsx(ItemIcon, {
            visible: !editable,
            onClick: this.rotateCanvasDom,
            name: 'icon-rotate-right',
            title: '\u65CB\u8F6C\u753B\u5E03'
        }), _jsx(Split, {}), _jsx(ItemIcon, {
            visible: editable,
            onClick: this.restore,
            name: 'icon-restore',
            title: '\u6E05\u9664\u6240\u6709\u66F4\u6539'
        }), _jsx(ItemIcon, {
            active: isMosaic,
            visible: editable,
            name: 'icon-mosaic',
            onClick: this.makeMosaic,
            title: '\u9A6C\u8D5B\u514B',
            extra: _jsx(TogglePanel, {
                visible: isMosaic
            }, void 0, _jsx(RangeSlider, {
                onChange: this.onPenSizeChange,
                min: 10,
                max: 200,
                value: penSize
            }))
        }), _jsx(ItemIcon, {
            visible: editable,
            onClick: this.downloadJpg,
            name: 'icon-download',
            title: '\u5BFC\u51FAJpg\u56FE\u7247'
        }), _jsx(ItemIcon, {
            visible: editable,
            onClick: this.rotateImage,
            name: 'icon-rotate-right',
            title: '\u65CB\u8F6C\u56FE\u7247(\u4FEE\u6539)'
        }), _jsx(ItemIcon, {
            visible: !editable,
            onClick: this.makeEditable,
            name: 'icon-edit',
            title: '\u7F16\u8F91\u56FE\u7247'
        }), _jsx(ItemIcon, {
            visible: editable,
            onClick: this.save,
            name: 'icon-check',
            title: '\u4FDD\u5B58'
        }), _jsx(Split, {}), _jsx('span', {
            onClick: this.onModalClose
        }, void 0, _jsx(ItemIcon, {
            name: 'icon-close',
            title: '\u5173\u95ED'
        }))), React__default.createElement(
            'div',
            { className: 'imge-container', ref: function ref(_ref3) {
                    _this2.editor = _ref3;
                } },
            _jsx(LoadingMask, {
                loading: loading
            }),
            React__default.createElement(
                'div',
                {
                    ref: function ref(_ref2) {
                        _this2.canvasWrapper = _ref2;
                    },
                    className: 'canvas-wrapper'
                },
                React__default.createElement(
                    'canvas',
                    { ref: function ref(_ref) {
                            _this2.canvas = _ref;
                        } },
                    '\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301canvas'
                )
            )
        )));
    };

    return ImageEditor;
}(React.Component);

ImageEditor.defaultProps = {
    onClose: null,
    onSaveDataURL: null,
    data: null
};

module.exports = ImageEditor;
//# sourceMappingURL=index.js.map
