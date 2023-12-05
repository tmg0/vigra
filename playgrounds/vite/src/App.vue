<script setup lang="ts">
import { ref } from 'vue'
import { Graph, Node, Port } from 'v-graf'
import { nanoid } from 'nanoid'

interface Position {
  x: number
  y: number
}

interface GrafPort {
  key: string
  position: string
}

interface GrafNode {
  key: string
  position: Position
  ports: GrafPort[]
}

interface GrafEdge {
  from: string
  to: string
}

const NODE_PORTS = ['tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l']

const selectedKey = ref<Record<string, boolean>>({})
const nodes = ref<GrafNode[]>([])
const edges = ref<GrafEdge[]>([])
const isHovered = ref<Record<string, boolean>>({})
const isPressed = ref(false)
const isPortHovered = ref(false)
const from = ref<Position & { key?: string }>({ x: 0, y: 0 })
const to = ref<Position & { key?: string }>({ x: 0, y: 0 })

const onAdd = () => {
  const key = nanoid()
  selectedKey.value[key] = false
  nodes.value.push({
    key,
    position: { x: 0, y: 0 },
    ports: NODE_PORTS.map(position => ({
      key: nanoid(),
      position
    }))
  })
}

const onPressPort = (key: string, bounding: Position) => {
  from.value = { key, ...bounding }
  isPressed.value = true
}

const onEnterPort = (key: string, bounding: Position) => {
  if (!isPressed.value) { return }
  to.value = { key, ...bounding }
  if (from.value.key !== to.value.key) {
    isPortHovered.value = true
  }
}

const onLink = (key: string) => {
  if (isPortHovered.value && from.value.key && to.value.key && key === to.value.key) {
    edges.value.push({ from: from.value.key, to: to.value.key })
  }
  isPressed.value = false
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
          @mouseenter="isHovered[node.key] = true"
          @mouseleave="isHovered[node.key] = false"
        >
          <div class="p-4 border bg-white" :class="{ 'ring-offset-2 ring': selectedKey[node.key] }">
            <div>{{ `node_${node.key}` }}</div>
            <div>{{ `x: ${node.position.x} / y: ${node.position.y}` }}</div>
          </div>

          <template #ports="{ zIndex }">
            <Port
              v-for="port in node.ports"
              :key="port.key"
              :visible="isHovered[node.key]"
              :z-index="zIndex"
              :position="port.position"
              @mousedown="(value: Position) => onPressPort(port.key, value)"
              @mouseup="onLink(port.key)"
              @mouseenter="(value: Position) => onEnterPort(port.key, value)"
            />
          </template>
        </Node>
      </template>
    </Graph>

    <button @click="onAdd">
      add node
    </button>

    <div>
      {{ edges }}
    </div>
  </div>
</template>
