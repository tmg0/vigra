<script setup lang="ts">
import { ref } from 'vue'
import { Canvas, Node } from 'v-graf'
import { nanoid } from 'nanoid'

interface Position {
  x: number
  y: number
}

interface GrafNode {
  key: string
  position: Position
}

const selectedKey = ref<Record<string, boolean>>({})
const nodes = ref<GrafNode[]>([])

const onAdd = () => {
  const key = nanoid()
  selectedKey.value[key] = false
  nodes.value.push({ key, position: { x: 10, y: 10 } })
}
</script>

<template>
  <div class="w-screen h-screen p-6">
    <Canvas class="border" :style="{ height: '50%' }">
      <Node
        v-for="node in nodes"
        :key="node.key"
        v-model:x="node.position.x"
        v-model:y="node.position.y"
        v-model:is-selected="selectedKey[node.key]"
        class="p-4 border bg-white"
        :class="{ 'ring-offset-2 ring': selectedKey[node.key] }"
        @click="selectedKey[node.key] = true"
      >
        {{ `node_${node.key}` }}
      </Node>
    </Canvas>

    <button @click="onAdd">
      add node
    </button>

    {{ nodes }}
  </div>
</template>
