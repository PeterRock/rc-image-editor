/**
 * 绘图 操作相关
 */

/**
 * Mosaic 处理
 */
const MOSAIC_PEN_LEN = 20

const drawRect = (ctx, x, y, width, height, fillStyle, lineWidth, strokeStyle, globalAlpha) => {
    const context = ctx
    context.beginPath()
    context.rect(x, y, width, height)
    context.lineWidth = lineWidth
    context.strokeStyle = strokeStyle
    fillStyle && (context.fillStyle = fillStyle)
    globalAlpha && (context.globalAlpha = globalAlpha)

    context.fill()
    context.stroke()
}
const setColor = (content, x, y, penLen) => {
    const ctx = content
    const imgData = ctx.getImageData(x, y, penLen, penLen).data
    let r = 0
    let g = 0
    let b = 0
    for (let i = 0; i < imgData.length; i += 4) {
        r += imgData[i]
        g += imgData[i + 1]
        b += imgData[i + 2]
    }
    r = Math.round(r / (imgData.length / 4))
    g = Math.round(g / (imgData.length / 4))
    b = Math.round(b / (imgData.length / 4))
    drawRect(ctx, x, y, penLen, penLen, `rgb(${r}, ${g}, ${b})`, 2, `rgb(${r}, ${g}, ${b})`)
}
/**
 * 指定路径绘制马赛克
 * @param {CanvasRenderingContext2D} context Canvas 2d Context
 * @param {int} beginX 起点X坐标
 * @param {*} beginY 起点Y坐标
 * @param {*} rectWidth 延伸宽度
 * @param {*} rectHight 眼神高度
 * @param {*} penLen 画笔大小
 */
const makeMosaicGrid = (context, beginX, beginY, rectWidth, rectHight, penLen = MOSAIC_PEN_LEN) => {
    const row = Math.round(rectWidth / penLen) + 1
    const column = Math.round(rectHight / penLen) + 1
    for (let i = 0; i < row * column; i += 1) {
        const x = (i % row) * penLen + beginX
        const y = parseInt(i / row, 10) * penLen + beginY
        setColor(context, x, y, penLen)
    }
}

/**
 * ---- Canvas操作
 */

/**
 * 文件导出
 */
const saveFile = (data, filename) => {
    const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    saveLink.href = data
    saveLink.download = filename

    const event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    saveLink.dispatchEvent(event)
}
const convertRang = (value, min, max, defaultValue) => {
    const preValue = parseFloat(value)
    if (preValue > min && preValue < max) {
        return preValue
    }
    return defaultValue
}
/**
 * 导出jpg图片到本地
 * @param {HTMLCanvasElement} canvas Canvas
 * @param {int} quality 图片质量（0-1）
 */
const toJpg = (canvas, filename = `${(new Date()).getTime()}.jpg`, quality) => {
    let imgData = canvas.toDataURL('image/jpeg', convertRang(quality, 0, 1, 0.92))
    imgData = imgData.replace('image/jpeg', 'image/octet-stream')
    saveFile(imgData, filename)
}
/**
 * 导出png图片到本地
 * @param {HTMLCanvasElement} canvas Canvas
 * @param {int} quality 图片质量（0-1）
 */
const toPng = (canvas, filename = `${(new Date()).getTime()}.jpg`, quality) => {
    let imgData = canvas.toDataURL('image/png', convertRang(quality, 0, 1, 0.92))
    imgData = imgData.replace('image/png', 'image/octet-stream')
    saveFile(imgData, filename)
}
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
const rotateImageDataR90 = (canvas) => {
    const context = canvas.getContext('2d')
    const iData = context.getImageData(0,0,canvas.width, canvas.height)
    const W = canvas.width
    const H = canvas.height
    const newData = []
    for(let i=0; i< iData.data.length; i+=4){
        const X = i % (W*4)
        const Y = parseInt(i/(W*4))
        const newIndex = H*X+(H-1-Y)*4

        newData[newIndex] = iData.data[i]
        newData[newIndex+1] = iData.data[i+1]
        newData[newIndex+2] = iData.data[i+2]
        newData[newIndex+3] = iData.data[i+3]
    }
    const newImgData = context.createImageData(H, W);

    for (let index = 0; index < iData.data.length; index++) {
        newImgData.data[index] = newData[index]
    }
    return newImgData
}

/**
 * 顺时针旋转canvas
 * @param {HTMLCanvasElement} canvas Canvas
 */
const rotateCanvasR90 = (canvas) => {
    const imageData = rotateImageDataR90(canvas)
    canvas.width = imageData.width
    canvas.height = imageData.height
    const context = canvas.getContext('2d')
    context.putImageData(imageData, 0 ,0)
}

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
const zoom = (element, originWidth, originHeight, zoomLevel, max = 20000, min = 4) => {
    const cWrapper = element
    if (!cWrapper) return
    // 图片缩放比例是相对于原始宽度
    const newWidth = zoomLevel * originWidth
    const newHeight = zoomLevel * originHeight

    // 边界判断
    if (max && Math.min(newWidth, newHeight) > max) {
        window.console.info('图片过大')
        return
    } else if (min && Math.max(newWidth, newHeight) < min) {
        window.console.info('图片过小')
        return
    }

    // 缩放后，根据图片现有位置，处理中心点位置偏移
    const offsetTop = (cWrapper.clientHeight - newHeight) / 2
    const offsetLeft = (cWrapper.clientWidth - newWidth) / 2
    if (cWrapper.style) {
        cWrapper.style.width = `${newWidth}px`
        cWrapper.style.height = `${newHeight}px`
        cWrapper.style.top = `${cWrapper.offsetTop + offsetTop}px`
        cWrapper.style.left = `${cWrapper.offsetLeft + offsetLeft}px`
    } else {
        window.console.warn('Element Has No Style ?')
    }
}

/**
 * 缩放element元素到最合适的比例显示在目标容器中
 * @param {HTMLElement} element 要处理缩放的html元素
 * @param {Number} originWidth 原始内容宽度
 * @param {Number} originHeight 原始内容高度
 * @param {Number} targetWidth 目标容器的宽度
 * @param {Number} targetHeight 目标容器的高度
 * @return {Number} 最终的缩放比例值
 */
const zoomToFit = (element, originWidth, originHeight, targetWidth, targetHeight) => {
    if (!element || !element || !originWidth || !originHeight || !targetWidth || !targetHeight) {
        window.console.warn('Data is not fit')
        return NaN
    }
    // 比较宽度，默认最适合目标容器的大小
    const cWrapper = element
    const minWidth = Math.min(targetWidth, originWidth)
    const minHeight = Math.min(targetHeight, originHeight)
    let destWidth = 0
    let destHeight = 0
    if (originWidth > originHeight) {
        destWidth = minWidth
        destHeight = destWidth / originWidth * originHeight
    } else {
        destHeight = minHeight
        destWidth = destHeight / originHeight * originWidth
    }
    // 设置图片居中显示, 画布容器进行缩放
    cWrapper.style.width = `${destWidth}px`
    cWrapper.style.height = `${destHeight}px`
    cWrapper.style.top = `${(targetHeight - destHeight) / 2}px`
    cWrapper.style.left = `${(targetWidth - destWidth) / 2}px`

    return destWidth / originWidth
}
const rotateElementR90 = (element) => {
    const value = element.style.transform.match(/\d+/)
    let deg = 90
    if (Array.isArray(value)) {
        deg = parseInt(value[0]) + 90
    }
    const rotateStr = `rotate(${deg}deg)`
    element.style.transform = rotateStr
    element.style['-ms-transform'] = rotateStr
}

export const Element = {
    zoom,
    zoomToFit,
    rotateR90: rotateElementR90,
}
export const Canvas = {
    rotateR90: rotateCanvasR90
}
export const Mosaic = {
    makeMosaicGrid,
}
export const Export = {
    toJpg,
    toPng,
}
