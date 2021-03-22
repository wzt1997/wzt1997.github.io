const svg=d3.select('body').append('svg')
    .attr('width', config.SVGWidth)
    .attr('height', config.SVGHeight);
const innerWidth = config.SVGWidth  - config.Padding.left - config.Padding.right;
const innerHeight = config.SVGHeight - config.Padding.top - config.Padding.bottom - 50;
const intervalTime=config.IntervalTime;


const g = svg.append('g')
    .attr('transform', `translate(${config.Padding.left},${config.Padding.top})`);
const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`);
const yAxisG = g.append('g');
const xValue = d => d.confirmed;
const yValue = d => d.country;
xScale = d3.scaleLinear();
yScale = d3.scaleBand();
xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 100);

var selectedCountry = "US"
var previousCountry = ""
var dates = []

// const xAxis = d3.axisBottom()
//     .scale(xScale);
//
// const yAxis = d3.axisLeft()
//     .scale(yScale);


const renderAxis = function(dataE){

    xScale = d3.scaleLinear()
        .domain([0, d3.max(dataE, function(d){return d.confirmed})])
        .range([0,innerWidth]);
    yScale = d3.scaleBand()
        .domain(dataE.map(function(d){return d.country}))
        .range([0,innerHeight])
        .padding(0.1);

    xAxis = d3.axisBottom(xScale).ticks(config.XTicks)
        .tickPadding(20)
        .tickFormat(d => d)
        .tickSize(innerHeight+20);
    yAxis = d3.axisLeft(yScale);

    svg.select('g.xAxis')
        .transition().duration(2990 * intervalTime).ease(d3.easeLinear)
        .call(xAxis);


}

function getColorClass(d) {
    var tmp=0;
    for (let index = 0; index < d.country.length; index++)
        tmp = tmp + d.country.charCodeAt(index);
    return config.ColorClass[tmp%config.ColorClass.length];
}


const render = function(dataEntry) {

    var rect = g.selectAll(".rect")
        .data(dataEntry,d=>d.country)


    var rectEnter = rect.enter().insert("g", ".axis")
        .attr("class", "rect")

        .attr("transform", function (d) {
            return "translate(0," + yScale(yValue(d)) + ")";
        });
    rectEnter.append("g")
        .attr("class", function (d) {
            return getColorClass(d);
        })

    rectEnter.append("rect")
        .attr("id",d => d.country)
        .attr("width", d => xScale(xValue(d)))
        .attr("fill-opacity", 0)
        .attr("height", 26).attr("y", 50)
        .transition("a")
        .attr("class", d => getColorClass(d))
        .delay(500 * intervalTime)
        .duration(2490 * intervalTime)
        .attr("y", -30)
        .attr("width", d => xScale(xValue(d)))
        .attr("fill-opacity", 1);

    rectEnter.append("text")
        .attr("id","countryText")
        .attr("y", 50)
        .attr("fill-opacity", 0)
        .transition("2")
        .delay(500 * intervalTime)
        .duration(2490 * intervalTime)
        .attr("fill-opacity", 1)
        .attr("y", 0)
        .attr("class", function (d) {
            return "label " + getColorClass(d)
        })
        .attr("x", -5)
        .attr("y", -10)
        .attr("text-anchor", "end")
        .text(d => d.country)

    rectEnter.append("text")
        .attr("x", d => xScale(xValue(d)))
        .attr("y", 50)
        .attr("fill-opacity", 0)
        .text(d => d.confirmed)
        .transition()
        .delay(500 * intervalTime)
        .duration(2490 * intervalTime)
        .attr("fill-opacity", 1).attr("y", 0)
        .attr("class", function (d) {
            return "value " + getColorClass(d)
        })
        .tween("text", function (d) {
            var self=this;                      // why?
            var i = d3.interpolate(self.textContent, Number(d.confirmed));
            return function (t) {
                self.textContent = Math.round(i(t));
            };
        })
        .attr("x", d => xScale(xValue(d)) + 10)
        .attr("y", -8);



        // Update Items
        var rectUpdate = rect.transition().duration(2990 * intervalTime).ease(d3.easeLinear);

        rectUpdate.select("rect")
            .attr("width", d => xScale(xValue(d)))

        rectUpdate.select(".rectInfo")
            .attr("x", d => xScale(xValue(d)) - 10)
    .attr("fill-opacity", 1)
            .attr("stroke-width",  "1px")

        rectUpdate.select(".value")
            .tween("text", function (d) {
                var self=this;
                var i = d3.interpolate(self.textContent, Number(d.confirmed));
                return function (t) {
                    self.textContent = Math.round(i(t));
                };
            })
            .duration(2990 * intervalTime)
            .attr("x", d => xScale(xValue(d)) + 10)


        // Exit Items
        var rectExit = rect.exit()
            .attr("fill-opacity", 1)
            .transition().duration(2500 * intervalTime)

        rectExit
            .attr("transform", "translate(0," + innerHeight + ")")
            .remove()
            .attr("fill-opacity", 0);

        rectExit.select("rect")
            .attr("fill-opacity", 0)
        rectExit.select(".value")
            .attr("fill-opacity", 0)
        rectExit.select(".rectInfo")
            .attr("fill-opacity", 0)
            .attr("stroke-width", "0px");

        rect.data(dataEntry, d => d.country)
    .transition()
            .delay(500 * intervalTime)
            .duration(2490 * intervalTime)
            .attr("transform", function (d) {
                return "translate(0," + yScale(yValue(d)) + ")";
            });

        // Add Listener
            var listen = g.selectAll(".rect")
            .on("click",function(d,i){
                selectedCountry = i.country
            });
}

const renderDateTitle = function(c) {
    // svg.selectAll("date-title").remove()
    dateTitle = g.select('text.date-title')
        // .classed('date-title', true)
        .transition().duration(2990 * intervalTime).ease(d3.easeLinear)
        .text(dates[c])
        .attr('x', config.SVGWidth - config.Padding.right-config.Padding.left)
        .attr('y', config.SVGHeight - config.Padding.bottom-config.Padding.top - 140)
        .attr('fill', 'rgb(128, 128, 128)')
        .attr('font-size', 37)
        .attr('stroke',"white")
        .attr('text-anchor', 'end')
}

const renderLineChart = function(data){
    if (previousCountry != selectedCountry){
        previousCountry = selectedCountry

        var lineData = []
        var curdates = []
        var showDates = []

        data = data.filter( d=> {
            return d['Country'] == selectedCountry
        });
        for (let i=1; i< 361; i++) {
            lineData[i-1] = data[0][i.toString()]
            curdates[i-1] = dates[i]
            if ((i-1) % 30 == 0){
                showDates[(i-1) / 30] = dates[i]
            }

        }
        console.log(lineData)
        console.log(curdates)
        console.log(showDates)

        // if ().selectAll("svg").count > 1){
        //     d3.select("body").selectAll("svg")[1].select("g").select("lineChart").remove();
        // }
        d3.select("#lineChart").remove()
        var	chart2 = d3.select("body")
            .append("svg")
            .attr("id","lineChart")
            .attr("width", config.SVGLineWidth)
            .attr("height", config.SVGHeight)
            .append("g")
            .classed('lineChart', true)
            .attr("transform", "translate(" + config.Padding.left + "," + 0 + ")")


        var trans = function(item,i){
            if(i % 2 === 0){
                return '1.25em';
            }else{
                return '2.75em';
            }
        }

        chart2.append('text')
            .classed('country-title', true)
            .text(selectedCountry)
            .attr('x', config.SVGLineWidth-config.Padding.left-config.Padding.right-40)
            .attr('y', innerHeight-2*config.Padding.top-config.Padding.bottom)
            .attr('fill', 'rgb(128, 128, 128)')
            .attr('font-size', 37)
            .attr('stroke',"white")
            .attr('text-anchor', 'end')


        xlineScale = d3.scaleBand()
            .domain(curdates)
            .range([0,config.SVGLineWidth-config.Padding.left-config.Padding.right])

        ylineScale = d3.scaleLinear()
            .domain([d3.max(lineData),0])
            .range([0,innerHeight]);

        let xLineAxis = d3.axisBottom(xlineScale)
            .tickSize(-innerHeight)
            .tickValues(showDates) //控制坐标轴上的刻度个数

        let yLineAxis = d3.axisLeft(ylineScale)
            .tickSize(-config.SVGLineWidth+config.Padding.left+config.Padding.right)

        chart2.append('g')
            .classed('xLineAxis', true)
            .attr('transform', `translate(${0},${innerHeight-config.Padding.bottom})`)
            .call(xLineAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,10)rotate(-45)")
            .attr("dy",'0.45em')
            .attr("dx",'-1.50em')
        chart2.append('g')
            .classed('yLineAxis', true)
            .attr('transform', `translate(${0},${0})`)
            .call(yLineAxis)

        chart2.append('g')
            .classed('line',true)
            .datum(lineData)
            .join('g')
            .append('path')
            .attr("d",
                d3.line().x((d,i)=>xlineScale(curdates[i]))
            .y((d=>ylineScale(d)))

    ).attr('fill','none')
            .attr('stroke',"white")
            .attr('stroke-width',2)
            .attr('transform', `translate(${0},${0})`)


    }
}

d3.csv('revised_confirmed_Global.csv').then(data => {
    data = data.filter( d=> {
        return d['Country'] != 'Others'
    });
    var confirmed = [];
    var total = [];
    data.forEach(function(o) {
        var existing = total.filter(function(i) { return i.Country == o.Country  })[0];
        if (!existing) {
            for (let i = 1; i <= config.days; i++) {
                o[i] = +(o[i])
            }
            total.push(o)
        }
        else {
            for(let i=1; i<=config.days; i++) {
                existing[i] = +(existing[i]);
                existing[i] += +(o[i]);
            }
        }

    });

    for (let i=1; i<=config.days; i++) {
        confirmed[i] = total.map(d => {
            return {
                "country": d.Country,
                "confirmed": d[i.toString()]
            }
        });
    };

    curDate = new Date("2020-01-22")
    for (let i = 1; i<= config.days;i++){
        dates[i] = curDate.toLocaleDateString();
        curDate = curDate.setDate(curDate.getDate()+1)
        curDate = new Date(curDate)

    }

    let c = 1;
    var dataEntry = confirmed[c].sort((x, y) => y.confirmed - x.confirmed).slice(0,config.MaxNumber);

    xScale = d3.scaleLinear()
        .domain([0, d3.max(dataEntry, function(d){return d.confirmed})])
        .range([0,innerWidth]);
    yScale = d3.scaleBand()
        .domain(dataEntry.map(function(d){return d.country}))
        .range([0,innerHeight])
        .padding(0.1);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // g.append('g').call(yAxis)
    //     .classed('yAxis', true);
    g.append('g').call(xAxis)
        .classed('xAxis', true)
        .attr('transform',`translate(0,-40)`);

    g.append('text')
        .classed('date-title', true)
        .text(dates[1])
        .attr('x', config.SVGWidth - config.Padding.right-config.Padding.left+20)
        .attr('y', config.SVGHeight - config.Padding.bottom-config.Padding.top - 140)
        .attr('fill', 'rgb(128, 128, 128)')
        .attr('font-size', 37)
        .attr('stroke',"white")
        .attr('text-anchor', 'end')

        date = []
        for (let i=1; i<=config.days; i++) {
            date[i] = i
        };

    var lineData = []
    var linedates = []

    lData = data.filter( d=> {
        return d['Country'] == selectedCountry
    });

    for (let i=1; i< config.days; i++) {
        lineData[i-1] = lData[0][i.toString()]
        linedates[i-1] = i-1

    }


    let intervalId = setInterval(() => {
        if (c >= confirmed.length){
        clearInterval(intervalId);
    }else{
        renderAxis(dataEntry);
        render(dataEntry);
        renderDateTitle(c);
        renderLineChart(data);
        c = c + 1;
    console.log(selectedCountry)
        dataEntry = confirmed[c].sort((x, y) => y.confirmed - x.confirmed).slice(0,config.MaxNumber);
    }
    },3000 * intervalTime)
// renderLineChart(confirmed);
// renderLineChart(data);



})