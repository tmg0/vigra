import { defineComponent, ref, type ExtractPropTypes, computed, watch } from 'vue'
import { useElementHover, useMousePressed, useVModel } from '@vueuse/core'
import { useNodeContext } from '../node/use-node-context'

const props = {
  visible: { type: Boolean, default: false },
  position: { type: String },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  zIndex: { type: Number, default: 0 }
}

export type PortProps = ExtractPropTypes<typeof props>

export const Port = defineComponent({
  props,

  setup (props, { emit }) {
    const domRef = ref()
    const propsX = useVModel(props, 'x', emit)
    const propsY = useVModel(props, 'y', emit)
    const isHovered = useElementHover(domRef)
    const { pressed } = useMousePressed({ target: domRef })
    const context = useNodeContext()

    const asix = computed(() => {
      if (props.position === 'tl') { return [context.node.bounding.x.value, context.node.bounding.y.value] }
      if (props.position === 't') { return [context.node.bounding.x.value + context.node.bounding.width.value / 2, context.node.bounding.y.value] }
      if (props.position === 'tr') { return [context.node.bounding.x.value + context.node.bounding.width.value, context.node.bounding.y.value] }
      if (props.position === 'r') { return [context.node.bounding.x.value + context.node.bounding.width.value, context.node.bounding.y.value + context.node.bounding.height.value / 2] }
      if (props.position === 'br') { return [context.node.bounding.x.value + context.node.bounding.width.value, context.node.bounding.y.value + context.node.bounding.height.value] }
      if (props.position === 'b') { return [context.node.bounding.x.value + context.node.bounding.width.value / 2, context.node.bounding.y.value + context.node.bounding.height.value] }
      if (props.position === 'bl') { return [context.node.bounding.x.value, context.node.bounding.y.value + context.node.bounding.height.value] }
      if (props.position === 'l') { return [context.node.bounding.x.value, context.node.bounding.y.value + context.node.bounding.height.value / 2] }

      return [context.node.bounding.x.value + context.node.bounding.width.value / 2, context.node.bounding.y.value + context.node.bounding.height.value / 2]
    })

    const x = computed(() => asix.value[0])
    const y = computed(() => asix.value[1])

    watch(asix, (value) => {
      propsX.value = value[0]
      propsY.value = value[1]
    }, { immediate: true })

    watch(isHovered, (value) => {
      emit(value ? 'mouseenter' : 'mouseleave', { x: x.value, y: y.value })
    })

    watch(pressed, (value) => {
      emit(value ? 'mousedown' : 'mouseup', { x: x.value, y: y.value })
    })

    const style = computed(() => {
      if (props.position === 'tl') { return { top: 0, left: 0, transform: 'translate(-50%, -50%)' } }
      if (props.position === 't') { return { top: 0, left: '50%', transform: 'translate(-50%, -50%)' } }
      if (props.position === 'tr') { return { top: 0, right: 0, transform: 'translate(50%, -50%)' } }
      if (props.position === 'r') { return { top: '50%', right: 0, transform: 'translate(50%, -50%)' } }
      if (props.position === 'br') { return { bottom: 0, right: 0, transform: 'translate(50%, 50%)' } }
      if (props.position === 'b') { return { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' } }
      if (props.position === 'bl') { return { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' } }
      if (props.position === 'l') { return { top: '50%', left: 0, transform: 'translate(-50%, -50%)' } }

      return {}
    })

    return () => (
      <div
        ref={domRef}
        style={{
          display: props.visible || pressed.value ? 'block' : 'none',
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          border: '1px solid',
          cursor: 'pointer',
          transitionDuration: '300ms',
          transition: 'all',
          background: '#fff',
          borderColor: isHovered.value || pressed.value ? '#000' : '#d9d9d9',
          ...style.value
        }}
      />
    )
  }
})
