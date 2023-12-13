import { useElementBounding, useMouse } from '@vueuse/core'
import { computed, defineComponent, ref } from 'vue'
import { pickChildren } from '../../utils/vue'
import { Node } from '../node'
import { useProvideGraphContext } from './use-graph-context'

export const Graph = defineComponent({
  setup (_, { slots }) {
    const domRef = ref()

    const mouse = useMouse()
    const { x, y, width, height } = useElementBounding(domRef)

    const nodes = computed(() => {
      const [_, n] = pickChildren(slots.default?.(), Node)
      if (!n) { return [] }
      return n
    })

    useProvideGraphContext({ graph: { ref: domRef, bounding: { x, y } } })

    return () => (
      <div ref={domRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {nodes.value}

        <svg width={width.value} height={height.value} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {slots.edges?.({ mouse: { x: mouse.x.value - x.value, y: mouse.y.value - y.value }, x: x.value, y: y.value })}
        </svg>
      </div>
    )
  }
})
