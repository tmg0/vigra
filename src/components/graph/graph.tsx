import { useElementBounding, useMouse } from '@vueuse/core'
import { computed, defineComponent, ref } from 'vue'
import { pickChildren } from '../../utils/vue'
import { Node } from '../node'
import { Edge } from '../edge'
import { useProvideGraphContext } from './use-graph-context'

export const Graph = defineComponent({
  setup (_, { slots }) {
    const domRef = ref()

    const _mouse = useMouse()
    const { x, y, width, height } = useElementBounding(domRef)

    const mouse = computed(() => ({
      x: _mouse.x.value - x.value,
      y: _mouse.y.value - y.value
    }))

    const nodes = computed(() => {
      const [_, n] = pickChildren(slots.default?.(), Node)
      if (!n) { return [] }
      return n
    })

    const edges = computed(() => {
      const [_, e] = pickChildren(slots.default?.(), Edge)
      if (!e) { return [] }
      return e.map(({ props }) => <Edge to={{ x: mouse.value.x, y: mouse.value.y }} {...props} />)
    })

    useProvideGraphContext({ graph: { ref: domRef, bounding: { x, y } } })

    return () => (
      <div ref={domRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {nodes.value}

        <svg width={width.value} height={height.value} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {edges.value}
        </svg>
      </div>
    )
  }
})
