import React, { useEffect, useRef } from 'react';
import { Typography, Box, Card } from '@mui/material';
import * as d3 from 'd3';

const ExpenseDetailsChart = ({
  date,
  expenses,
  loading,
  showLegend = true,
}) => {
  const d3Container = useRef(null);

  // load d3 visualization expenses object is retrieved
  useEffect(() => {
    if (expenses.length > 0 && d3Container.current) {
      // clear any existing svg before drawing a new one
      d3.select(d3Container.current).selectAll('*').remove();

      const expensesByCategory = d3.rollup(
        expenses,
        (v) => d3.sum(v, (d) => d.amount),
        (d) => d.category
      );

      const data = Array.from(expensesByCategory, ([category, amount]) => ({
        category,
        amount,
      }));

      const pie = d3.pie().value((d) => d.amount);
      const pieData = pie(data);
      pieData.sort((a, b) => b.data.amount - a.data.amount);
      const total = d3.sum(data, (d) => d.amount);
      pieData.forEach((d) => {
        d.percentage = (d.data.amount / total) * 100;
      });

      const width = 700;
      const height = 400;
      const margin = 40;
      const radius = Math.min(height - margin * 2, width / 2 - margin * 3) / 2;

      const svg = d3
        .select(d3Container.current)
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('preserveAspectRatio', 'xMidYMid meet');

      const color = d3
        .scaleOrdinal()
        .domain([
          'rent',
          'home',
          'utilities',
          'groceries',
          'social',
          'dining',
          'shopping',
          'travel',
          'healthcare',
          'education',
          'gifts',
          'subscriptions',
          'other',
        ])
        .range(d3.schemeCategory10);

      const donutGroup = svg
        .append('g')
        .attr('transform', `translate(${width / 4}, ${height / 2})`);

      // only show legend when requested
      if (showLegend) {
        const legendGroup = svg
          .append('g')
          .attr('transform', `translate(${width * 0.55}, ${height / 2 - 120})`);

        // add legend
        const legendRectSize = 10;
        const legendSpacing = 24;

        const legendItemsPerColumn = 8;
        const legend = legendGroup
          .selectAll('.legend')
          .data(pieData)
          .enter()
          .append('g')
          .attr('class', 'legend')
          .attr('transform', (d, i) => {
            const column = Math.floor(i / legendItemsPerColumn);
            const row = i % legendItemsPerColumn;
            return `translate(${column * 150}, ${row * legendSpacing})`;
          });

        legend
          .append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .attr('fill', (d) => color(d.data.category))
          .style('stroke', (d) => color(d.data.category));

        legend
          .append('text')
          .attr('x', legendRectSize + 5)
          .attr('y', legendRectSize - 3)
          .text((d) => {
            let category =
              d.data.category[0].toUpperCase() +
              d.data.category.slice(1, d.data.category.length);
            return `${category} (${d.percentage.toFixed(1)}%)`;
          })
          .style('font-size', '0.7rem');
      }

      const arc = d3
        .arc()
        .innerRadius(radius * 0.75)
        .outerRadius(radius);

      // draw arcs in donutGroup
      const arcs = donutGroup
        .selectAll('.arc')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'arc');

      // add paths (pie slices)
      const paths = arcs
        .append('path')
        .attr('fill', (d) => {
          return color(d.data.category);
        })
        .attr('d', arc);

      // add spending total and text in center of donut chart
      donutGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .style('font-size', '1.2rem')
        .style('fill', '#333')
        .text(
          `$${total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        );

      donutGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.4em')
        .style('font-size', '1rem')
        .style('fill', 'black')
        .text('Total');

      // define tooltip
      const tooltip = d3
        .select(d3Container.current)
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', '1px solid #ddd')
        .style('border-radius', '4px')
        .style('padding', '5px')
        .style('box-shadow', '0px 0px 6px rgba(0, 0, 0, 0.2)')
        .style('font-size', '12px');

      // attach mouse event handlers to pie slices
      paths
        .on('mouseover', function (event, d) {
          tooltip.style(
            'visibility',
            'visible'
          ).html(`<strong>${d.data.category}</strong><br>
            Amount: $${d.data.amount.toFixed(2)}<br>
            Percentage: ${d.percentage.toFixed(1)}%`);
        })
        .on('mousemove', function (event) {
          tooltip
            .style('top', event.pageY + 10 + 'px')
            .style('left', event.pageX + 20 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).transition().duration(500).attr('d', arc);

          tooltip.style('visibility', 'hidden');
        });
    }
  }, [expenses, loading, showLegend]);

  if (loading) {
    return <Typography>Loading expenses...</Typography>;
  }

  if (!expenses || expenses.length === 0) {
    return <Typography>No expenses to display</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ width: '100%', padding: '2rem' }}>
        <Typography sx={{ typography: 'subtitle2' }}>
          SPENDING BY CATEGORY
        </Typography>
        <Typography sx={{ typography: 'h6' }}>{date}</Typography>
        {loading ? (
          <Typography>Loading expenses data...</Typography>
        ) : expenses.length === 0 ? (
          <Typography>
            No expense data available. Add some expenses to see your chart.
          </Typography>
        ) : (
          <div style={{ width: '100%', height: 'auto', minHeight: 400 }}>
            <div ref={d3Container} style={{ width: '100%' }} />
          </div>
        )}
      </Card>
    </Box>
  );
};

export default ExpenseDetailsChart;
