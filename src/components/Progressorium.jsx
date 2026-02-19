import React, { useState } from 'react'
import { capabilities } from '../data/capabilities'

function Progressorium() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [completedNodes, setCompletedNodes] = useState([])

  const skillTree = [
    { id: 1, x: 50, y: 10, cap: capabilities[0], connections: [2, 3] },
    { id: 2, x: 25, y: 35, cap: capabilities[1], connections: [4] },
    { id: 3, x: 75, y: 35, cap: capabilities[2], connections: [5] },
    { id: 4, x: 15, y: 60, cap: capabilities[3], connections: [6] },
    { id: 5, x: 50, y: 60, cap: capabilities[4], connections: [6, 7] },
    { id: 6, x: 85, y: 60, cap: capabilities[5], connections: [7] },
    { id: 7, x: 30, y: 85, cap: capabilities[7], connections: [8] },
    { id: 8, x: 70, y: 85, cap: capabilities[10], connections: [] },
  ]

  const handleNodeClick = (node) => {
    setSelectedNode(node)
    if (!completedNodes.includes(node.id)) {
      setCompletedNodes([...completedNodes, node.id])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-amber-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-100 mb-4">⚙️ The Clockwork Progressorium</h1>
          <p className="text-amber-200/70">Tend your garden of gear-plants. Click nodes to grow your skills.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black/30 rounded-2xl p-8 border border-amber-500/20">
            <svg viewBox="0 0 100 100" className="w-full h-96">
              {/* Connection lines */}
              {skillTree.map(node => (
                node.connections.map(targetId => {
                  const target = skillTree.find(n => n.id === targetId)
                  const isActive = completedNodes.includes(node.id) && completedNodes.includes(targetId)
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isActive ? "#f59e0b" : "#451a03"}
                      strokeWidth="0.5"
                      strokeDasharray={isActive ? "0" : "2,2"}
                    />
                  )
                })
              ))}

              {/* Gear nodes */}
              {skillTree.map(node => {
                const isCompleted = completedNodes.includes(node.id)
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(node)}
                  >
                    {/* Outer gear ring */}
                    <circle
                      r="6"
                      fill={isCompleted ? "#f59e0b" : "#451a03"}
                      stroke="#d97706"
                      strokeWidth="0.5"
                      className={isCompleted ? "animate-spin" : ""}
                      style={{ animationDuration: '10s' }}
                    />
                    {/* Gear teeth */}
                    {[...Array(8)].map((_, i) => (
                      <rect
                        key={i}
                        x="-0.5"
                        y="-7"
                        width="1"
                        height="2"
                        fill={isCompleted ? "#fbbf24" : "#78350f"}
                        transform={`rotate(${i * 45})`}
                      />
                    ))}
                    {/* Inner circle */}
                    <circle
                      r="3"
                      fill={isCompleted ? "#fef3c7" : "#1a1a1a"}
                    />
                    {/* Icon */}
                    <text
                      y="1"
                      textAnchor="middle"
                      fontSize="3"
                      fill={isCompleted ? "#92400e" : "#78350f"}
                    >
                      {node.cap.icon}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="space-y-4">
            {selectedNode ? (
              <div className="bg-black/40 rounded-2xl p-6 border border-amber-500/30">
                <div className="text-4xl text-center mb-4">{selectedNode.cap.icon}</div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">{selectedNode.cap.name}</h3>
                <p className="text-amber-100/70 mb-4">{selectedNode.cap.description}</p>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-900/50 rounded-full text-sm text-amber-200">{selectedNode.cap.category}</span>
                  <span className="px-3 py-1 bg-amber-700/50 rounded-full text-sm text-amber-100">{selectedNode.cap.level}</span>
                </div>
                {completedNodes.includes(selectedNode.id) && (
                  <div className="text-center text-green-400 text-sm">✓ Gear Activated</div>
                )}
              </div>
            ) : (
              <div className="bg-black/40 rounded-2xl p-6 border border-amber-500/30 text-center text-amber-200/50">
                <div className="text-6xl mb-4">⚙️</div>
                <p>Click a gear to inspect and activate it</p>
              </div>
            )}

            <div className="bg-black/40 rounded-2xl p-6 border border-amber-500/30">
              <h3 className="text-lg font-bold text-amber-300 mb-4">Machine Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-200/70">Active Gears</span>
                  <span className="text-amber-400">{completedNodes.length} / {skillTree.length}</span>
                </div>
                <div className="w-full bg-amber-950 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-600 to-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${(completedNodes.length / skillTree.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-amber-200/50 text-center">
                  {completedNodes.length === skillTree.length ? "Machine Fully Operational! 🎉" : "Continue tending your garden..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progressorium
