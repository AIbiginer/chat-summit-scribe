import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ConversationMindMap = ({ data, onUpdate }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (data && svgRef.current) {
      drawMindMap();
    }
  }, [data]);

  const drawMindMap = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 200;

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height, width - 100]);
    treeLayout(root);

    const g = svg.append("g").attr("transform", "translate(50,0)");

    const link = g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

    const node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("r", 4);

    node.append("text")
      .attr("dy", ".31em")
      .attr("x", d => d.children ? -6 : 6)
      .style("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name);
  };

  return (
    <div className="conversation-mind-map">
      <svg ref={svgRef} width="300" height="200"></svg>
      <button onClick={onUpdate} className="update-button">更新</button>
    </div>
  );
};

export default ConversationMindMap;