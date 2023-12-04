import { useElementBounding } from '@vueuse/core'
import { defineComponent, ref } from 'vue'
import { useProvideContext } from './use-graph-context'

export const Graph = defineComponent({
  setup (_, { slots }) {
    const domRef = ref()

    const { x, y, width, height } = useElementBounding(domRef)

    useProvideContext({ graph: { ref: domRef, bounding: { x, y } } })

    return () => (
      <div ref={domRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {slots.nodes?.()}

        <svg width={width.value} height={height.value} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {slots.edges?.()}
        </svg>
      </div>
    )
  }
})
