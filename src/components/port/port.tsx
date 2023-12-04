import { defineComponent, ref, type ExtractPropTypes, watch, type PropType } from 'vue'
import { useElementHover, useMousePressed } from '@vueuse/core'

const props = {
  visible: { type: Boolean, default: false },
  position: { type: String },
  onPress: { type: Function as PropType<(value: boolean) => void> }
}

export type PortProps = ExtractPropTypes<typeof props>

export const Port = defineComponent({
  props,

  setup (props) {
    const domRef = ref()
    const { pressed } = useMousePressed({ target: domRef })
    const isHovered = useElementHover(domRef)

    watch(pressed, (value) => {
      props.onPress?.(value)
    })

    return () => (
      <div
        ref={domRef}
        style={{
          display: props.visible || pressed.value ? 'block' : 'none',
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          border: '1px solid',
          cursor: 'pointer',
          transitionDuration: '300ms',
          transition: 'all',
          background: '#fff',
          borderColor: isHovered.value || pressed.value ? '#000' : '#d9d9d9'
        }}
      />
    )
  }
})
