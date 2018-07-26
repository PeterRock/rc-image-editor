import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import LoadingMask from './LoadingMask'
import Toolbar, {
    RangeSlider, ItemIcon, Split, TogglePanel,
} from './Toolbar'
import {
    Canvas, Mosaic, Export, Element, Event, Util,
} from './utils'
import './index.scss'

class ImageEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: !!props.visible,
            loading: true,
            zoomLevel: 1,
            isEditing: false,
            penSize: 20,
        }
        this.imageOrigin = null

        // 事件处理相关
        this.listenMoving = false
        this.mosaicMaking = false
        this.startPoint = { x: 0, y: 0 } // 点击的开始点
        this.startPoints2 = null // 开始触摸时的两个点
        this.penStartPoint = { x: 0, y: 0 } // 画笔起点
    }

    componentDidMount() {
        const { data } = this.props
        if (data) this.loadData(data)
    }

    componentWillReceiveProps(nextProps) {
        if ('visible' in nextProps) {
            if (this.state.visible !== nextProps.visible) {
                this.setState({
                    visible: nextProps.visible,
                })
                this.dealScroll(nextProps.visible)

                // 当props切换时候，只有当 visible 显示时候，data的变化才有意义
                if (nextProps.visible && 'data' in nextProps) {
                    this.loadData(nextProps.data)
                }
            }
        }
    }

    componentWillUnmount() {
        this.dealScroll(false)
        this.toggleMoveable(false)
    }

    onModalClose = () => {
        const { isEditing } = this.state
        if ((isEditing && window.confirm('确认关闭吗？')) || !isEditing) {
            const { onClose } = this.props

            // 处理关闭后相关操作
            this.resetToolbar({ isEditing: false })
            this.toggleMoveable(false)
            this.dealScroll(false)
            this.imageOrigin = null

            onClose && onClose()
        }
    }


    // 画布容器拖动事件 -------
    canvasWrapperMoveTo = (offsetX, offsetY) => {
        const distX = this.canvasWrapper.offsetLeft + offsetX
        const distY = this.canvasWrapper.offsetTop + offsetY
        this.canvasWrapper.style.left = `${distX}px`
        this.canvasWrapper.style.top = `${distY}px`
    }

    onCanvasEditorMouseDown = (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.listenMoving = true
        this.startPoint = Event.getClickPoint(event)
        // 开始触摸的两个点和触摸时候的原始缩放比例
        this.startPoints2 = Event.getTouchPoints2(event)
        const { zoomLevel } = this.state
        this.zoomLevelStart = zoomLevel
    }

    onCanvasEditorMouseMove = (event) => {
        if (this.listenMoving) {
            // 处理是双指缩放问题还是单点移动
            const currentPoints = Event.getTouchPoints2(event)
            if (this.startPoints2 && currentPoints) {
                // 双指缩放, 根据开始两点的间距和现在两点间距比，乘以原始缩放比例得到新的缩放比例
                const { zoomLevelStart } = this
                const { offsetX: distanceX, offsetY: distanceY } = Event.getPointOffset(this.startPoints2[0], this.startPoints2[1])
                const distanceStart = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                const { offsetX, offsetY } = Event.getPointOffset(currentPoints[0], currentPoints[1])
                const distanceNow = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
                this.zoomTo(zoomLevelStart * distanceNow / distanceStart)
            } else {
                const currentPoint = Event.getClickPoint(event)
                const { offsetX, offsetY } = Event.getPointOffset(this.startPoint, currentPoint)
                this.startPoint = currentPoint
                this.canvasWrapperMoveTo(offsetX, offsetY)
            }
        }
    }

    onCanvasEditorMouseUp = () => {
        this.listenMoving = false
        this.startPoint = { x: 0, y: 0 }
        this.startPoints2 = null
    }
    // ------- 画布容器拖动事件

    // 打码操作事件 -------
    onMosaicMouseDown = (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.mosaicMaking = true
        this.penStartPoint = Event.getClickPoint(event)
    }

    onMosaicMouseMove = (event) => {
        if (this.mosaicMaking) {
            const { penSize } = this.state
            const { clientWidth, offsetLeft, offsetTop } = this.canvasWrapper
            const zoomLevel = clientWidth / this.canvas.width

            const { x, y } = this.penStartPoint
            const currentPoint = Event.getClickPoint(event)
            const { offsetX, offsetY } = Event.getPointOffset(this.penStartPoint, currentPoint)
            // 处理边缘溢出的情况
            const drawX = (x - offsetLeft) - penSize / 2
            const drawY = (y - offsetTop) - penSize / 2

            Mosaic.makeMosaicGrid(
                this.canvas.getContext('2d'),
                drawX / zoomLevel,
                drawY / zoomLevel,
                offsetX / zoomLevel,
                offsetY / zoomLevel,
                penSize,
            )
            this.penStartPoint = currentPoint
        }
    }

    onMosaicMouseUp = () => {
        this.mosaicMaking = false
        this.penStartPoint = null
    }
    // ------- 打码操作事件

    // ------- 图片加载
    onImageLoad = () => {
        if (!this.imageOrigin || !this.canvas) return
        const img = this.imageOrigin
        this.canvas.width = img.width
        this.canvas.height = img.height
        const context = this.canvas.getContext('2d')
        context.drawImage(img, 0, 0, img.width, img.height)
        this.zoomToFit()
        this.setState({ loading: false })
        this.toggleMoveable(true)
    }

    loadData = (data) => {
        if (!data) { console.log('image Data is empty'); return }
        this.setState({ loading: true })

        this.imageOrigin = new Image()
        this.imageOrigin.crossOrigin = 'anonymous'
        this.imageOrigin.src = data
        this.imageOrigin.onload = this.onImageLoad
    }
    // ------- 图片加载


    // Toolbar 操作事件
    startEditing = () => {
        Element.rotateRestore(this.canvas)
        this.setState({
            isEditing: true,
        })
    }

    makeMosaic = () => {
        const { isMosaic } = this.state
        this.canvas.onmousedown = isMosaic ? null : this.onMosaicMouseDown
        this.canvas.onmousemove = isMosaic ? null : this.onMosaicMouseMove
        this.canvas.onmouseup = isMosaic ? null : this.onMosaicMouseUp
        this.canvas.onmouseleave = isMosaic ? null : this.onMosaicMouseUp
        this.canvas.ontouchstart = isMosaic ? null : this.onMosaicMouseDown
        this.canvas.ontouchmove = isMosaic ? null : this.onMosaicMouseMove
        this.canvas.ontouchend = isMosaic ? null : this.onMosaicMouseUp
        this.canvas.ontouchcancel = isMosaic ? null : this.onMosaicMouseUp
        this.resetToolbar({ isMosaic: !isMosaic })
    }

    toggleMoveable = (moveable) => {
        if (this.editor) {
            const op = moveable ? 'addEventListener' : 'removeEventListener'
            this.editor[op]('mousedown', this.onCanvasEditorMouseDown)
            this.editor[op]('mousemove', this.onCanvasEditorMouseMove)
            this.editor[op]('mouseup', this.onCanvasEditorMouseUp)
            this.editor[op]('mouseleave', this.onCanvasEditorMouseUp)

            this.editor[op]('touchstart', this.onCanvasEditorMouseDown)
            this.editor[op]('touchmove', this.onCanvasEditorMouseMove)
            this.editor[op]('touchend', this.onCanvasEditorMouseUp)
            this.editor[op]('touchcancel', this.onCanvasEditorMouseUp)
            this.setState({ moveable })
        }
    }

    zoomIn = () => {
        const { zoomLevel } = this.state
        this.zoomTo(zoomLevel * 1.2)
    }

    zoomOut = () => {
        const { zoomLevel } = this.state
        this.zoomTo(zoomLevel * 0.8)
    }

    zoomToFit = () => {
        const zoomLevel = Element.zoomToFit(
            this.canvasWrapper,
            this.canvas.width,
            this.canvas.height,
            this.editor.clientWidth,
            this.editor.clientHeight,
        )
        this.setState({ zoomLevel })
    }

    zoomTo = (zoomLevel) => {
        Element.zoom(this.canvasWrapper, this.canvas.width, this.canvas.height, zoomLevel)
        this.setState({ zoomLevel })
    }

    // 右旋转90度
    rotateCanvasDom = () => {
        Element.rotateR90(this.canvas)
    }

    rotateImage = () => {
        const { rotating } = this.state
        if (rotating) { return }
        this.setState({ rotating: true })

        Canvas.rotateR90(this.canvas)
        // 旋转之后处理画布的大小
        const newWidth = this.canvasWrapper.clientHeight
        const newHeight = this.canvasWrapper.clientWidth
        const cwOffsetLeft = this.canvasWrapper.offsetLeft
        const cwOffsetTop = this.canvasWrapper.offsetTop
        this.canvasWrapper.style.width = `${newWidth}px`
        this.canvasWrapper.style.height = `${newHeight}px`
        this.canvasWrapper.style.top = `${cwOffsetTop + (newWidth - newHeight) / 2}px`
        this.canvasWrapper.style.left = `${cwOffsetLeft + (newHeight - newWidth) / 2}px`

        this.setState({ rotating: false })
    }

    // 撤销
    restore = () => {
        const { data } = this.props
        this.imageOrigin.src = data
    }

    // 重设编辑条按钮状态
    resetToolbar = (value) => {
        this.setState({
            isMosaic: false,
            ...value,
        })
    }

    save = () => {
        const { onSave } = this.props
        if (typeof onSave === 'function') {
            onSave(this.canvas ? this.canvas.toDataURL() : null)
        }
        this.setState({
            isEditing: false,
        })
    }

    downloadJpg = () => {
        Export.toJpg(this.canvas)
    }

    onPenSizeChange = (event) => {
        this.setState({
            penSize: event.target.value,
        })
    }

    dealScroll = (visible) => {
        if (visible) {
            document.body.style.height = '100%'
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.height = ''
            document.body.style.overflow = ''
        }
    }

    render() {
        const {
            visible, loading, isEditing, isMosaic, moveable,
            penSize,
        } = this.state
        const { toolbar, editable } = this.props
        const {
            mosaic, restore, downloadJpg, rotate,
        } = toolbar || {}
        this.dealScroll(visible)
        const isMobile = Util.isMobile()
        if (!visible) { return null }

        return (
            <div className="image-editor">
                <div className="imge-wrapper">
                    <Toolbar>
                        <ItemIcon visible={!isMobile} onClick={this.zoomIn} name="icon-zoom-in" title="放大" />
                        <ItemIcon visible={!isMobile} onClick={this.zoomOut} name="icon-zoom-out" title="缩小" />
                        <ItemIcon onClick={this.zoomToFit} name="icon-zoom-fit" title="适合窗口" />
                        <ItemIcon visible={!isEditing} onClick={this.rotateCanvasDom} name="icon-rotate-right" title="旋转画布" />
                        <Split />
                        {editable && (
                            <Fragment>
                                {isEditing && (
                                    <Fragment>
                                        <ItemIcon visible={restore} onClick={this.restore} name="icon-restore" title="清除所有更改" />
                                        <ItemIcon
                                            visible={mosaic}
                                            active={isMosaic}
                                            name="icon-mosaic"
                                            onClick={this.makeMosaic}
                                            title="马赛克"
                                            extra={(
                                                <TogglePanel visible={isMosaic}>
                                                    <RangeSlider onChange={this.onPenSizeChange} min={10} max={200} value={penSize} />
                                                </TogglePanel>
                                            )}
                                        />
                                        <ItemIcon visible={downloadJpg} onClick={this.downloadJpg} name="icon-download" title="导出Jpg图片" />
                                        <ItemIcon visible={rotate} onClick={this.rotateImage} name="icon-rotate-right" title="旋转图片(修改)" />
                                    </Fragment>)
                                }
                                <ItemIcon visible={!isEditing} onClick={this.startEditing} name="icon-edit" title="编辑图片" />
                                <ItemIcon visible={isEditing} onClick={this.save} name="icon-check" title="保存" />
                                <Split />
                            </Fragment>
                        )}
                        <span role="button" tabIndex={0} onClick={this.onModalClose} onKeyUp={this.onModalClose}>
                            <ItemIcon name="icon-close" title="关闭" />
                        </span>
                    </Toolbar>
                    <div className="imge-container" ref={(ref) => { this.editor = ref }}>
                        <LoadingMask loading={loading} />
                        <div
                            ref={(ref) => { this.canvasWrapper = ref }}
                            className="canvas-wrapper"
                        >
                            <canvas ref={(ref) => { this.canvas = ref }}>
您的浏览器不支持canvas
                            </canvas>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
ImageEditor.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    data: PropTypes.string,
    editable: PropTypes.bool,
    toolbar: PropTypes.shape(
        {
            mosaic: PropTypes.bool,
            restore: PropTypes.bool,
            downloadJpg: PropTypes.bool,
            rotate: PropTypes.bool,
        },
    ),
}
ImageEditor.defaultProps = {
    visible: false,
    onClose: null,
    onSave: null,
    data: null,
    editable: true,
    toolbar: {
        mosaic: true,
        restore: true,
        downloadJpg: false,
        rotate: true,
    },
}

export default ImageEditor
