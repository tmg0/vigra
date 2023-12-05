import { defineComponent, ref, type ExtractPropTypes, computed, watch } from 'vue'
import { useElementBounding, useElementHover, useMousePressed } from '@vueuse/core'
import { useGraphContext } from '../graph/use-graph-context'

const props = {
  visible: { type: Boolean, default: false },
  position: { type: String },
  zIndex: { type: Number, default: 0 }
}

export type PortProps = ExtractPropTypes<typeof props>

export const Port = defineComponent({
  props,

  setup (props, { emit }) {
    const domRef = ref()
    const { x: _x, y: _y } = useElementBounding(domRef)
    const isHovered = useElementHover(domRef)
    const { pressed } = useMousePressed({ target: domRef })
    const context = useGraphContext()

    const x = computed(() => _x.value - context.graph.bounding.x.value)
    const y = computed(() => _y.value - context.graph.bounding.y.value)

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
