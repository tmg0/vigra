import { inject, provide, ref, type Ref } from 'vue'
import { CANVAS_CONTEXT } from '../../constants'

interface Context {
  canvas: {
    bounding: {
      x: Ref<number>
      y: Ref<number>
    }
  }
}

const defaults: Context = {
  canvas: {
    bounding: {
      x: ref(0),
      y: ref(0)
    }
  }
}

export const useProvideContext = (context: Context) => {
  provide(CANVAS_CONTEXT, context)
}

export const useCanvasContext = () => {
  return inject<Context>(CANVAS_CONTEXT, defaults)
}
