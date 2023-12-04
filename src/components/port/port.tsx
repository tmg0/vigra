import { defineComponent, ref, type ExtractPropTypes, type PropType, computed } from 'vue'
import { useElementBounding, useElementHover } from '@vueuse/core'
import { useGraphContext } from '../graph/use-graph-context'

interface Bounding {
  x: number
  y: number
}

const props = {
  visible: { type: Boolean, default: false },
  position: { type: String },
  zIndex: { type: Number, default: 0 },
  onMousedown: { type: Function as PropType<(value: Bounding) => void> }
}

export type PortProps = ExtractPropTypes<typeof props>

export const Port = defineComponent({
  props,

  setup (props) {
    const domRef = ref()
    const isPressed = ref(false)
    const { x: _x, y: _y } = useElementBounding(domRef)
    const isHovered = useElementHover(domRef)
    const context = useGraphContext()

    const x = computed(() => _x.value - context.graph.bounding.x.value)
    const y = computed(() => _y.value - context.graph.bounding.y.value)

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

    const onMousedown = () => {
      isPressed.value = true
      props.onMousedown?.({ x: x.value, y: y.value })
    }

    return () => (
      <div
        ref={domRef}
        style={{
          display: props.visible || isPressed.value ? 'block' : 'none',
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          border: '1px solid',
          cursor: 'pointer',
          transitionDuration: '300ms',
          transition: 'all',
          background: '#fff',
          borderColor: isHovered.value || isPressed.value ? '#000' : '#d9d9d9',
          ...style.value
        }}
        onMousedown={() => { onMousedown() }}
        onMouseup={() => { isPressed.value = false }}
      />
    )
  }
})
