<script setup lang="ts">
import { ref } from 'vue'
import { Graph, Node } from 'v-graf'
import { nanoid } from 'nanoid'

interface Position {
  x: number
  y: number
}

interface GrafNode {
  key: string
  position: Position
}

interface GrafEdge {
  from: Position
  to: Position
}

const selectedKey = ref<Record<string, boolean>>({})
const nodes = ref<GrafNode[]>([])
const edges = ref<GrafEdge[]>([])

const onAdd = () => {
  const key = nanoid()
  selectedKey.value[key] = false
  nodes.value.push({ key, position: { x: 0, y: 0 } })
}
</script>

<template>
  <div class="w-screen h-screen p-6 flex flex-col gap-6 items-start">
    <Graph class="border bg-black/5" :style="{ height: '75%' }">
      <template #nodes>
        <Node
          v-for="(node, index) in nodes"
          :key="node.key"
          v-model:x="node.position.x"
          v-model:y="node.position.y"
          v-model:is-selected="selectedKey[node.key]"
          :z-index="index"
          class="p-4 border bg-white"
          :class="{ 'ring-offset-2 ring': selectedKey[node.key] }"
          @click="selectedKey[node.key] = true"
        >
          <div>{{ `node_${node.key}` }}</div>
          <div>{{ `x: ${node.position.x} / y: ${node.position.y}` }}</div>
        </Node>
      </template>
    </Graph>

    <button @click="onAdd">
      add node
    </button>

    <div>
      {{ nodes }}
    </div>
  </div>
</template>
