import { defineComponent, ref, type ExtractPropTypes, type PropType, computed } from 'vue'
import { useElementHover, useDraggable, useVModel, onClickOutside } from '@vueuse/core'
import { Port } from '../../components/port'
import { useGraphContext } from '../graph/use-graph-context'

interface PropsPort {
  position: string[]
}

const props = {
  as: { type: String as PropType<keyof HTMLElementTagNameMap>, default: 'div' },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  zIndex: { type: Number, default: 0 },
  port: { type: Object as PropType<PropsPort>, default: () => ({ position: ['tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l'] }) },
  draggable: { type: Boolean, default: true },
  isSelected: { type: Boolean, default: false }
}

export type NodeProps = ExtractPropTypes<typeof props>

export const Node = defineComponent({
  props,

  setup (props, { emit, slots }) {
    const domRef = ref()
    const handle = ref()
    const x = useVModel(props, 'x', emit)
    const y = useVModel(props, 'y', emit)
    const isSelected = useVModel(props, 'isSelected', emit)
    const isHovered = useElementHover(domRef)
    const context = useGraphContext()

    const { x: _x, y: _y } = useDraggable(domRef, {
      handle,

      initialValue: {
        x: x.value,
        y: y.value
      },

      containerElement: context.graph.ref.value,

      onEnd (position) {
        x.value = position.x
        y.value = position.y
      }
    })

    onClickOutside(domRef, () => { isSelected.value = false })

    const zIndex = computed(() => (props.zIndex + 1) * 10)

    const style = computed(() => {
      const constantStyle = { position: 'absolute', cursor: 'grab' }
      const dynamicStyle = { left: `${_x.value}px`, top: `${_y.value}px`, zIndex: zIndex.value }
      return { ...constantStyle, ...dynamicStyle }
    })

    const onPressPort = (_: string, bounding: { x: number, y: number }) => {
      console.log(bounding)
    }

    return () => (
      <props.as ref={domRef} style={{ ...style.value }} onMousedown={() => { isSelected.value = true }}>
        <div ref={handle}>{slots.default?.()}</div>

        {
          props.port.position.map((p) => {
            return <Port visible={isHovered.value} zIndex={zIndex.value + 1} position={p} onMousedown={(value) => { onPressPort(p, value) }} />
          })
        }
      </props.as>
    )
  }
})
