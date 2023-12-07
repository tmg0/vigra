# v-graf

A dom based graph generator for vue. (bacause of dom it has serious performance problem ...)

## Install

```
pnpm add v-graf
```

## Usage

Import

```
import { Graph, Node, Edge } from 'v-graf'

```

Use in vue template

```
<Graph>
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
      <div class="p-4 text-xs border bg-white" :class="{ 'ring-offset-2 ring': selectedKey[node.key] }">
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
  </template>

  <template #edges="{ mouse }">
    <Edge v-if="from.node && from.port && isPressed" :from="portRecords[from.node][from.port]" :to="mouse" color="#00000066" />

    <Edge
      v-for="edge in edges"
      :key="edge.key"
      v-model:is-selected="selectedKey[edge.key]"
      :from="portRecords[edge.from.node][edge.from.port]"
      :to="portRecords[edge.to.node][edge.to.port]"
    />
  </template>
</Graph>
```