import { defineComponent, ref } from 'vue'
import { useElementHover } from '@vueuse/core'

export const Port = defineComponent({
  setup () {
    const domRef = ref()
    const isHovered = useElementHover(domRef)

    return () => (
      <div
        ref={domRef}
        style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          border: '1px solid',
          cursor: 'pointer',
          transitionDuration: '300ms',
          transition: 'all',
          borderColor: isHovered.value ? '#000' : '#d9d9d9'
        }}
      />
    )
  }
})
