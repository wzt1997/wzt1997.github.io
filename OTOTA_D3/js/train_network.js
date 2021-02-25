let svg = d3.select('#mainsvg');
var width = svg.attr('width'), height = svg.attr('height');
let nodes, links;
let circles, lines;
let color;
let simulation;

function dragstarted(d) {
    d3.select(this).raise().attr("stroke", "black");
    simulation.stop();
}
function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    ticked();
}
function dragended(d) {
    d3.select(this).attr("stroke", null);
    simulation.restart();
}
const drag = d3.drag()
.on("start", dragstarted)
.on("drag", dragged)
.on("end", dragended);

const render_init = function(){
    lines = svg.selectAll('line').data(links)
    .enter().append('line')
    .attr('stroke', 'black')
    .attr('opacity', 0.8)
    .attr('stroke-width', .5);

    circles = svg.selectAll('circle').data(nodes)
    .enter().append('circle')
    .attr('r', 5)
    .attr('fill', d => color(d.index))
    .call(drag);
}

function ticked() {
    lines
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);
    circles
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
}

d3.json("./data/socfb-Caltech36.json").then(data => {
    links = data.links;
    nodes = []
    for(let i = 0; i <= data['#nodes']; i++ ){
        nodes.push({"index":i});
    }

    color = d3.scaleDiverging(d3.interpolateRainbow)
    .domain([0, nodes.length-1])

    render_init();

    simulation = d3.forceSimulation(nodes)
    .force('manyBody', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(links).strength(0.1).distance(100))
    //.alphaTarget(0.1)
    .on('tick', ticked);
})