<script setup lang="ts">
import { computed, ref } from 'vue'
import { Edge, Graph, Node, Port } from 'v-graf'
import { nanoid } from 'nanoid'

interface Position {
  x: number
  y: number
}

interface GrafPort {
  key: string
  position: string
  x: number
  y: number
}

interface GrafNode {
  key: string
  position: Position
  ports: GrafPort[]
}

interface GrafEdgeItem {
  node: string
  port: string
}

interface GrafEdge {
  key: string
  from: GrafEdgeItem
  to: GrafEdgeItem
}

const NODE_PORTS = ['tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l']

const selectedKey = ref<Record<string, boolean>>({})
const nodes = ref<GrafNode[]>([])
const edges = ref<GrafEdge[]>([])
const isHovered = ref<Record<string, boolean>>({})
const isPressed = ref(false)
const isPortHovered = ref(false)
const from = ref<Partial<GrafEdge['from']>>({})
const to = ref<Partial<GrafEdge['to']>>({})

const portRecords = computed(() => {
  const r: Record<string, Record<string, GrafPort>> = {}
  nodes.value.forEach((node) => {
    const p: Record<string, GrafPort> = {}
    node.ports.forEach((port) => {
      p[port.key] = port
    })
    r[node.key] = p
  })
  return r
})

const onAdd = () => {
  const key = nanoid()
  selectedKey.value[key] = false
  nodes.value.push({
    key,
    position: { x: 0, y: 0 },
    ports: NODE_PORTS.map(position => ({
      key: nanoid(),
      x: 0,
      y: 0,
      position
    }))
  })
}

const onPressPort = (node: string, port: string) => {
  from.value = { node, port }
  isPressed.value = true
}

const onEnterPort = (node: string, port: string) => {
  if (!isPressed.value) { return }
  to.value = { node, port }
  if (from.value !== to.value) {
    isPortHovered.value = true
  }
}

const onLink = (key: string) => {
  if (isPortHovered.value && from.value && to.value && key === to.value.port) {
    edges.value.push({ key: nanoid(), from: from.value as GrafEdgeItem, to: to.value as GrafEdgeItem })
  }
  isPressed.value = false
}
</script>

<template>
  <div class="w-screen h-screen p-6 flex flex-col gap-6 items-start">
    <Graph class="border bg-black/5" :style="{ height: '75%' }">
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
        <div class="p-4 text-xs border select-none bg-white" :class="{ 'ring-offset-2 ring': selectedKey[node.key] }">
          <div>{{ `node_${node.key}` }}</div>
          <div>{{ `x: ${node.position.x} / y: ${node.position.y}` }}</div>
        </div>

        <template #ports="{ zIndex }">
          <Port
            v-for="port in node.ports"
            :key="port.key"
            v-model:x="port.x"
            v-model:y="port.y"
            :visible="isHovered[node.key]"
            :z-index="zIndex"
            :position="port.position"
            @mousedown="onPressPort(node.key, port.key)"
            @mouseup="onLink(port.key)"
            @mouseenter="onEnterPort(node.key, port.key)"
          />
        </template>
      </Node>

      <Edge v-if="from.node && from.port && isPressed" :from="portRecords[from.node][from.port]" color="#00000066" />

      <Edge
        v-for="edge in edges"
        :key="edge.key"
        v-model:is-selected="selectedKey[edge.key]"
        :from="portRecords[edge.from.node][edge.from.port]"
        :to="portRecords[edge.to.node][edge.to.port]"
      />
    </Graph>

    <button @click="onAdd">
      add node
    </button>

    <div>
      {{ !!(from.node && from.port && isPressed) }}
      {{ edges }}
    </div>
  </div>
</template>
