import { useFocus, useVModel } from '@vueuse/core'
import { defineComponent, ref, type PropType, watch } from 'vue'

interface Position {
  x: number
  y: number
}

const props = {
  from: { type: Object as PropType<Position>, default: () => ({ x: 0, y: 0 }) },
  to: { type: Object as PropType<Position>, default: () => ({ x: 0, y: 0 }) },
  color: { type: String, default: '#000000' },
  isSelected: { type: Boolean, default: false }
}

export const Edge = defineComponent({
  name: 'Edge',

  props,

  setup (props, { emit }) {
    const domRef = ref()
    const isSelected = useVModel(props, 'isSelected', emit)
    const { focused } = useFocus(domRef)

    watch(focused, (value) => {
      isSelected.value = value
      emit(value ? 'focus' : 'blur')
    })

    return () => (
      <line ref={domRef} x1={props.from.x} x2={props.to.x} y1={props.from.y} y2={props.to.y} stroke={props.color} style={{ cursor: 'pointer' }} tabindex="0" />
    )
  }
})
