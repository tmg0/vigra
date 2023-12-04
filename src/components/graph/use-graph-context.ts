import { inject, provide, ref, type Ref } from 'vue'
import { GRAPH_CONTEXT } from '../../constants'

interface Context {
  graph: {
    ref: Ref<HTMLElement | undefined | null >
    bounding: {
      x: Ref<number>
      y: Ref<number>
    }
  }
}

const defaults: Context = {
  graph: {
    ref: ref(),
    bounding: {
      x: ref(0),
      y: ref(0)
    }
  }
}

export const useProvideContext = (context: Context) => {
  provide(GRAPH_CONTEXT, context)
}

export const useGraphContext = () => {
  return inject<Context>(GRAPH_CONTEXT, defaults)
}
