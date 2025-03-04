import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { Button, Typography, Container, Box } from '@mui/material';
import * as d3 from 'd3';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const d3Container = useRef(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw new Error(userError.message);

        if (!user) {
          navigate('/login');
          return;
        }

        setUser(user);

        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        // console.log('Expenses data:', data);

        if (error) {
          console.error('Supabase query error:', error);
          throw new Error(error.message);
        }

        setExpenses(data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

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
      console.log(pie(data));
      pieData.sort((a, b) => b.data.amount - a.data.amount);
      const total = d3.sum(data, (d) => d.amount);
      pieData.forEach((d) => {
        d.percentage = (d.data.amount / total) * 100;
      });

      const width = 600;
      const height = 600;
      const margin = 120;
      const radius = Math.min(width, height) / 2 - margin;

      const svg = d3
        .select(d3Container.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

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

      const arc = d3.arc().innerRadius(0).outerRadius(radius);
      const arcs = svg
        .selectAll('.arc')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'arc');

      // outer arc for positioning labels
      const outerArc = d3
        .arc()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);

      arcs
        .append('path')
        .attr('fill', (d) => {
          return color(d.data.category);
        })
        .attr('d', arc);

      // add amount items
      arcs
        .append('text')
        .attr('transform', (d) => {
          // only position text if the slice is big enough
          const [x, y] = arc.centroid(d);
          return `translate(${x * 0.7}, ${y * 0.7})`;
        })
        .attr('dy', '.25em')
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', 'white')
        // .style('font-weight', 'bold')
        // only show amount if the slice is big enough
        .text((d) => {
          return d.percentage > 5 ? `$${d.data.amount.toFixed(2)}` : '';
        });

      // separate larger and smaller slices foro different label treatments
      const largeSlices = arcs.filter((d) => d.percentage >= 3);
      const smallSlices = arcs.filter((d) => d.percentage < 3);

      // add lines and labels for large slices
      largeSlices
        .append('polyline')
        .attr('points', (d) => {
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          const x = Math.sin(midAngle) * radius;
          const y = -Math.cos(midAngle) * radius;

          const pos = outerArc.centroid(d);
          const x2 = pos[0] * 1.12;
          const y2 = pos[1] * 1.12;

          return [[x, y], pos, [x2, y2]];
        })
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', '1px');

      // category labels
      largeSlices
        .append('text')
        .attr('transform', (d) => {
          const pos = outerArc.centroid(d);
          const x = pos[0] * 1.2;
          const y = pos[1] * 1.2;
          return `translate(${x}, ${y})`;
        })
        .attr('text-anchor', (d) => {
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midangle < Math.PI ? 'start' : 'end';
        })
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text((d) => d.data.category);

      // add legend
      const lengendSpacing = 20;
      const legendRectSize = 15;

      const legend = svg
        .selectAll('.legend')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => {
          return `translate(${width / 2 - 150}, ${-height / 2 + 20 + i * 20})`;
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
        .text(
          (d) =>
            `${d.data.category}: $${d.data.amount.toFixed(
              2
            )} (${d.percentage.toFixed(1)}%)`
        )
        .style('font-size', '12px');
    }
  }, [expenses, d3Container]);

  const handleLogOut = async () => {
    await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    } else {
      console.log('Log out successfully!');
      navigate('/');
    }
  };

  const handleNewExpense = () => {
    navigate('/entryform', { state: { user } });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* <Typography
        variant="h2"
        sx={{ my: 2, width: '100%', textAlign: 'center' }}>
        Welcome Back!
      </Typography> */}

      <Box display="flex" gap={2} mt={2} mb={2} justifyContent="center">
        <Button
          variant="contained"
          onClick={handleNewExpense}
          sx={{ width: '8rem' }}>
          Add Entry
        </Button>
        <Button
          onClick={handleLogOut}
          variant="contained"
          sx={{ width: '8rem' }}>
          Log Out
        </Button>
      </Box>

      {error && (
        <Typography variant="subtitle2" sx={{ color: 'danger.main' }}>
          {error}
        </Typography>
      )}

      {/* D3 visualization container */}
      <Box
        mt={4}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography variant="h5" mb={2}>
          Your Expenses Overview
        </Typography>
        {loading ? (
          <Typography>Loading expenses data...</Typography>
        ) : expenses.length === 0 ? (
          <Typography>
            No expense data available. Add some expenses to see your chart.
          </Typography>
        ) : (
          <div
            ref={d3Container}
            style={{
              width: '100%',
              height: '600px',
              display: 'flex',
              justifyContent: 'center',
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
