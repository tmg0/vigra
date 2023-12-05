import { inject, provide, ref, type Ref } from 'vue'
import { NODE_CONTEXT } from '../../constants'

interface Context {
  node: {
    ref: Ref<HTMLElement | undefined | null >
    bounding: {
      x: Ref<number>
      y: Ref<number>
      width: Ref<number>
      height: Ref<number>
    }
  }
}

const defaults: Context = {
  node: {
    ref: ref(),
    bounding: {
      x: ref(0),
      y: ref(0),
      width: ref(0),
      height: ref(0)
    }
  }
}

export const useProvideNodeContext = (context: Context) => {
  provide(NODE_CONTEXT, context)
}

export const useNodeContext = () => {
  return inject<Context>(NODE_CONTEXT, defaults)
}
