import { defineComponent, ref, type ExtractPropTypes, type PropType, computed, watch } from 'vue'
import { useElementHover, useDraggable, useVModel, onClickOutside } from '@vueuse/core'

import { Port } from '../../components/port'
import { useCanvasContext } from '../canvas/use-canvas-context'

interface PropsPort {
  position: string
}

const props = {
  as: { type: String as PropType<keyof HTMLElementTagNameMap>, default: 'div' },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  port: { type: Object as PropType<PropsPort>, default: () => ({}) },
  draggable: { type: Boolean, default: true },
  isSelected: { type: Boolean, default: false }
}

export type NodeProps = ExtractPropTypes<typeof props>

export const Node = defineComponent({
  props,

  setup (props, { emit, slots }) {
    const domRef = ref()
    const portsRef = ref()
    const positionStyle = ref('')
    const isPressedPort = ref(false)
    const x = useVModel(props, 'x', emit)
    const y = useVModel(props, 'y', emit)
    const isSelected = useVModel(props, 'isSelected', emit)
    const isHovered = useElementHover(portsRef)
    const context = useCanvasContext()

    const { style: _s } = useDraggable(domRef, {
      initialValue: {
        x: x.value,
        y: y.value
      },

      onEnd (position) {
        x.value = position.x
        y.value = position.y
      }
    })

    watch(_s, (value) => {
      if (!isPressedPort.value) {
        positionStyle.value = value
      }
    }, { immediate: true })

    onClickOutside(domRef, () => { isSelected.value = false })

    const style = computed(() => {
      if (!props.draggable) { return {} }

      const _r: Record<string, string> = {}
      const _arr = positionStyle.value.split(';').filter(Boolean)
      _arr.forEach((item) => {
        const [k, v] = item.split(':').map(str => str.trim())
        _r[k] = v
      })

      _r.left = `${parseInt(_r.left) - context.canvas.bounding.x.value}px`
      _r.top = `${parseInt(_r.top) - context.canvas.bounding.y.value}px`
      return _r
    })

    return () => (
      <props.as ref={domRef} style={{ ...style.value, position: 'absolute', cursor: 'grab' }} onMousedown={() => { isSelected.value = true }}>
        <div>{`x: ${props.x} / y: ${props.y}`}</div>

        {slots.default?.()}

        {isHovered.value}

        <div ref={portsRef} style={{ position: 'absolute', inset: 0, zIndex: 10 }} >
          <Port visible={isHovered.value} style={{ top: 0, left: 0, transform: 'translate(-50%, -50%)' }} onPress={(value) => { isPressedPort.value = value }} />
          <Port visible={isHovered.value} style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }} onPress={(value) => { isPressedPort.value = value }} />
          <Port visible={isHovered.value} style={{ top: 0, right: 0, transform: 'translate(50%, -50%)' }} onPress={(value) => { isPressedPort.value = value }} />
          <Port visible={isHovered.value} style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }} onPress={(value) => { isPressedPort.value = value }} />
          <Port visible={isHovered.value} style={{ bottom: 0, right: 0, transform: 'translate(50%, 50%)' }} onPress={(value) => { isPressedPort.value = value }} />
          <Port visible={isHovered.value} style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }} onPress={(value) => { isPressedPort.value = value }} />
          <Port visible={isHovered.value} style={{ bottom: 0, left: 0, transform: 'translate(-50%, 50%)' }} onPress={(value) => { isPressedPort.value = value }} />
          <Port visible={isHovered.value} style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }} onPress={(value) => { isPressedPort.value = value }} />
        </div>
      </props.as>
    )
  }
})
