import { defineComponent, ref, type ExtractPropTypes, type PropType, computed } from 'vue'
import { useElementHover, useDraggable } from '@vueuse/core'

import { Port } from '../../components/port'

interface PropsPort {
  position: string
}

const props = {
  as: { type: String as PropType<keyof HTMLElementTagNameMap>, default: 'div' },
  port: { type: Object as PropType<PropsPort>, default: () => ({}) }
}

export type NodeProps = ExtractPropTypes<typeof props>

export const Node = defineComponent({
  props,

  setup (props, { slots }) {
    const domRef = ref()
    const portsRef = ref()
    const { style: _s } = useDraggable(domRef)
    const isHovered = useElementHover(portsRef)

    const style = computed(() => {
      const _r: Record<string, string> = {}
      const _arr = _s.value.split(';').filter(Boolean)
      _arr.forEach((item) => {
        const [k, v] = item.split(':').map(str => str.trim())
        _r[k] = v
      })
      return _r
    })

    return () => (
      <props.as ref={domRef} style={{ ...style.value, position: 'absolute', cursor: 'grab' }}>
        {slots.default?.()}

        {isHovered.value}

        <div ref={portsRef} style={{ position: 'absolute', inset: 0, zIndex: 10 }} >
          <Port style={{ display: isHovered.value ? 'block' : 'none', position: 'absolute', top: 0, left: 0, transform: 'translate(-50%, -50%)' }} />
          <Port style={{ display: isHovered.value ? 'block' : 'none', position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)' }} />
          <Port style={{ display: isHovered.value ? 'block' : 'none', position: 'absolute', top: 0, right: 0, transform: 'translate(50%, -50%)' }} />
          <Port style={{ display: isHovered.value ? 'block' : 'none', position: 'absolute', top: '50%', right: 0, transform: 'translate(50%, -50%)' }} />
          <Port style={{ display: isHovered.value ? 'block' : 'none', position: 'absolute', bottom: 0, right: 0, transform: 'translate(50%, 50%)' }} />
          <Port style={{ display: isHovered.value ? 'block' : 'none', position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }} />
          <Port style={{ display: isHovered.value ? 'block' : 'none', position: 'absolute', bottom: 0, left: 0, transform: 'translate(-50%, 50%)' }} />
          <Port style={{ display: isHovered.value ? 'block' : 'none', position: 'absolute', top: '50%', left: 0, transform: 'translate(-50%, -50%)' }} />
        </div>
      </props.as>
    )
  }
})
