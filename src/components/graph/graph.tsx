import { useElementBounding } from '@vueuse/core'
import { defineComponent, ref } from 'vue'
import { useProvideContext } from './use-graph-context'

export const Graph = defineComponent({
  setup (_, { slots }) {
    const domRef = ref()

    const { x, y } = useElementBounding(domRef)

    useProvideContext({ graph: { bounding: { x, y } } })

    return () => (
      <div ref={domRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {slots.default?.()}

        <svg style={{ position: 'absolute', inset: 0 }} />
      </div>
    )
  }
})
