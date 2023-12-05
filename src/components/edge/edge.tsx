import { defineComponent, type PropType } from 'vue'

interface Position {
  x: number
  y: number
}

const props = {
  from: { type: Object as PropType<Position>, default: () => ({ x: 0, y: 0 }) },
  to: { type: Object as PropType<Position>, default: () => ({ x: 0, y: 0 }) },
  color: { type: String, default: '#000000' }
}

export const Edge = defineComponent({
  props,

  setup (props) {
    return () => (
      <line x1={props.from.x} x2={props.to.x} y1={props.from.y} y2={props.to.y} stroke={props.color} />
    )
  }
})
