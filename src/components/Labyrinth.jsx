import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { treeData, capabilities } from '../data/capabilities'

function Labyrinth() {
  const svgRef = useRef(null)
  const [selectedCapability, setSelectedCapability] = useState(null)

  useEffect(() => {
    if (!svgRef.current) return

    const width = 800
    const height = 600
    const margin = { top: 20, right: 120, bottom: 20, left: 120 }

    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const root = d3.hierarchy(treeData)
    const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right])
    
    treeLayout(root)

    // Links
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr("fill", "none")
      .attr("stroke", "#e94560")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)

    // Nodes
    const nodes = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (d.data.capability) {
          const cap = capabilities.find(c => c.id === d.data.capability)
          setSelectedCapability(cap)
        }
      })

    // Node circles with mirror effect
    nodes.append("circle")
      .attr("r", d => d.data.capability ? 25 : 20)
      .attr("fill", d => d.data.capability ? "#533483" : "#1a1a2e")
      .attr("stroke", "#e94560")
      .attr("stroke-width", 3)
      .attr("class", "transition-all duration-300 hover:fill-primary")

    // Mirror reflection effect
    nodes.append("circle")
      .attr("r", d => d.data.capability ? 20 : 15)
      .attr("fill", "url(#mirrorGradient)")
      .attr("opacity", 0.5)

    // Labels
    nodes.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -30 : 30)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "500")

    // Gradient definition
    const defs = svg.append("defs")
    const gradient = defs.append("linearGradient")
      .attr("id", "mirrorGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#e94560").attr("stop-opacity", 0.3)
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#533483").attr("stop-opacity", 0.1)

  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-accent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🪞 Labyrinth of Infinite Mirrors</h1>
          <p className="text-gray-300">Click on mirror nodes to discover AI capabilities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-dark/50 rounded-2xl p-6 border border-white/10 overflow-x-auto">
            <svg ref={svgRef} className="w-full"></svg>
          </div>

          <div className="bg-dark/50 rounded-2xl p-6 border border-white/10">
            {selectedCapability ? (
              <div className="space-y-4">
                <div className="text-4xl text-center">{selectedCapability.icon}</div>
                <h2 className="text-2xl font-bold text-primary">{selectedCapability.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-secondary/30 rounded-full text-sm">{selectedCapability.category}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedCapability.level === 'Novice' ? 'bg-green-500/30' :
                    selectedCapability.level === 'Competent' ? 'bg-yellow-500/30' : 'bg-red-500/30'
                  }`}>{selectedCapability.level}</span>
                </div>
                <p className="text-gray-300">{selectedCapability.description}</p>
                <button 
                  onClick={() => setSelectedCapability(null)}
                  className="w-full py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
                >
                  Close Mirror
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <div className="text-6xl mb-4">🪞</div>
                <p>Click a mirror node to reveal its capability</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Labyrinth
