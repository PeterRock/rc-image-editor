import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoadingMask from './LoadingMask'
import Toolbar from './Toolbar'
import { Canvas, Mosaic, Export, Element } from './utils'
import './index.scss'

const ToolbarItem = Toolbar.Item
const ToolbarSplit = Toolbar.Split
const IconButton = props => (<i className={`imge-toolbar__icon ${props.name}`} />)

class ImageEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: !!props.visible,
            loading: true,
            zoomLevel: 1,
            editable: false,
        }
        this.imageOrigin = null

        // 画板拖动相关
        this.dragStartX = 0
        this.dragStartY = 0
    }

    componentDidMount() {
        this.props.data && this.loadData(this.props.data)
    }

    componentWillReceiveProps(nextProps) {
        if ('visible' in nextProps) {
            if (this.state.visible !== nextProps.visible) {
                this.setState({
                    visible: nextProps.visible,
                })
                // 当props切换时候，只有当 visible 显示时候，data的变化才有意义
                if (nextProps.visible && 'data' in nextProps) {
                    this.loadData(nextProps.data)
                }
            }
        }
    }

    componentWillUnmount() {
        this.toggleMoveable(false)
    }

    onModalClose = () => {
        const { editable } = this.state
        if ((editable && window.confirm('确认关闭吗？')) || !editable) {
            const { onClose } = this.props
            this.resetToolbar({ editable: false })
            onClose && onClose()
            // 销毁相关资源
            this.imageOrigin = null
        }
    }

    // 画布容器拖动事件 -------
    onCanvasEditorMouseDown = (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.dragMoving = true
        this.dragStartX = event.clientX - this.canvasWrapper.offsetLeft
        this.dragStartY = event.clientY - this.canvasWrapper.offsetTop
    }
    onCanvasEditorMouseMove = (event) => {
        if (this.dragMoving) {
            this.canvasWrapper.style.left = `${event.clientX - this.dragStartX}px`
            this.canvasWrapper.style.top = `${event.clientY - this.dragStartY}px`
        }
    }
    onCanvasEditorMouseUp = () => {
        this.dragMoving = false
        this.dragStartX = 0
        this.dragStartY = 0
    }
    // ------- 画布容器拖动事件

    // 打码操作事件 -------
    onMosaicMouseDown = (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.mosaicMaking = true
        this.mosaicStartX = event.offsetX
        this.mosaicStartY = event.offsetY
    }

    onMosaicMouseMove = (event) => {
        if (this.mosaicMaking) {
            const zoomLevel = this.canvasWrapper.clientWidth / this.canvas.width
            const startX = (this.mosaicStartX / zoomLevel)
            const startY = (this.mosaicStartY / zoomLevel)
            const endX = (event.offsetX / zoomLevel)
            const endY = (event.offsetY / zoomLevel)
            Mosaic.makeMosaicGrid(this.canvas.getContext('2d'), startX, startY, endX - startX, endY - startY)
            this.mosaicStartX = event.offsetX
            this.mosaicStartY = event.offsetY
        }
    }
    onMosaicMouseUp = () => {
        this.mosaicMaking = false
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
    makeMoveable = () => {
        this.toggleMoveable(true)
    }
    makeEditable = () => {
        this.setState({
            editable: true,
        })
    }
    makeMosaic = () => {
        const { isMosaic } = this.state
        this.canvas.onmousedown = isMosaic ? null : this.onMosaicMouseDown
        this.canvas.onmousemove = isMosaic ? null : this.onMosaicMouseMove
        this.canvas.onmouseup = isMosaic ? null : this.onMosaicMouseUp
        this.canvas.onmouseleave = isMosaic ? null : this.onMosaicMouseUp
        this.resetToolbar({ isMosaic: !isMosaic })
    }
    toggleMoveable = (moveable) => {
        if (this.editor) {
            const op = moveable ? 'addEventListener' : 'removeEventListener'
            this.editor[op]('mousedown', this.onCanvasEditorMouseDown)
            this.editor[op]('mousemove', this.onCanvasEditorMouseMove)
            this.editor[op]('mouseup', this.onCanvasEditorMouseUp)
            this.editor[op]('mouseleave', this.onCanvasEditorMouseUp)
            this.setState({ moveable })
        }
    }

    zoomIn = () => {
        console.log('放大')
        const { zoomLevel } = this.state
        this.zoomTo(zoomLevel * 1.2)
    }
    zoomOut = () => {
        console.log('缩小')
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
    rotateCanvas = () => {
        const { rotating } = this.state
        if (rotating) { return }
        this.setState({ rotating: true })

        Canvas.rotateR90(this.canvas, () => {
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
        })
    }
    // 重设编辑条按钮状态
    resetToolbar = (value) => {
        this.setState({
            isMosaic: false,
            ...value,
        })
    }
    save = () => {
        const { onSaveDataURL } = this.props
        if (typeof onSaveDataURL === 'function') {
            onSaveDataURL(this.canvas && this.canvas.toDataURL())
        }
        this.setState({
            editable: false,
        })
    }
    downloadJpg = () => {
        Export.toJpg(this.canvas)
    }

    render() {
        const {
            visible, loading, editable,
            rotating, isMosaic, moveable,
        } = this.state
        if (!visible) { return null }

        return (
            <div className="image-editor">
                <div ref={(ref) => { this.editor = ref }} className="imge-wrapper">
                    <Toolbar>
                        <ToolbarItem active={moveable} onClick={this.makeMoveable}><IconButton name="icon-drag" /></ToolbarItem>
                        <ToolbarItem onClick={this.zoomIn}><IconButton name="icon-zoom-in" /></ToolbarItem>
                        <ToolbarItem onClick={this.zoomOut}><IconButton name="icon-zoom-out" /></ToolbarItem>
                        <ToolbarItem onClick={this.zoomToFit}><IconButton name="icon-zoom-fit" /></ToolbarItem>
                        <ToolbarItem onClick={this.rotateCanvas}><IconButton name={rotating ? 'icon-loading' : 'icon-rotate-right'} /></ToolbarItem>
                        <ToolbarSplit />
                        <ToolbarItem active={isMosaic} visible={editable} onClick={this.makeMosaic}><IconButton name="icon-mosaic" /></ToolbarItem>
                        <ToolbarItem visible={editable} onClick={this.downloadJpg}><IconButton name="icon-download" /></ToolbarItem>
                        <ToolbarItem visible={!editable} onClick={this.makeEditable}><IconButton name="icon-edit" /></ToolbarItem>
                        <ToolbarItem visible={editable} onClick={this.save}><IconButton name="icon-check" /></ToolbarItem>
                        <ToolbarSplit />
                        <ToolbarItem onClick={this.onModalClose}><IconButton name="icon-close" /></ToolbarItem>
                    </Toolbar>
                    <div className="imge-container">
                        <LoadingMask loading={loading} />
                        <div
                            ref={(ref) => { this.canvasWrapper = ref }}
                            className="canvas-wrapper"
                        >
                            <canvas ref={(ref) => { this.canvas = ref }}>您的浏览器不支持canvas</canvas>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
ImageEditor.propTypes = {
    onClose: PropTypes.func,
    onSaveDataURL: PropTypes.func,
    data: PropTypes.string,
}
ImageEditor.defaultProps = {
    onClose: null,
    onSaveDataURL: null,
    data: null,
}

export default ImageEditor
