import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { Button, Typography, Box } from '@mui/material';
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

        console.log('Expenses data:', data);

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

  // load d3 visualization
  useEffect(() => {
    if (expenses.length > 0 && d3Container.current) {
      const expensesByCategory = d3.rollup(
        expenses,
        (v) => d3.sum(v, (d) => d.amount),
        (d) => d.category
      );

      const chartData = Array.from(expensesByCategory, ([category, total]) => ({
        category,
        total,
      }));

      d3.select(d3Container.current).selectAll('*').remove();

      const margin = { top: 20, right: 30, bottom: 70, left: 60 };
      const width = 500 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      // create SVG
      const svg = d3
        .select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // X scale
      const x = d3
        .scaleBand()
        .domain(d3.range((d) => d.category))
        .range([0, width])
        .padding(0.2);

      // Y scale
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(chartData, (d) => d.total) * 1.1])
        .range([height, 0]);

      // create bars
      svg
        .selectAll('rect')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.category))
        .attr('y', (d) => y(d.total))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - y(d.total))
        .attr('fill', 'steelblue');

      // add x axis
      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

      // add y axis
      svg.append('g').call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `$${d}`)
      );

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 0 - margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text('Expenses by Category');
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
    <div id="dashboard-page">
      <Typography variant="h1">Welcome Back!</Typography>
      <Button
        variant="contained"
        onClick={handleNewExpense}
        sx={{ width: '8rem' }}>
        Add Entry
      </Button>
      <Button
        onClick={handleLogOut}
        variant="contained"
        xs={{
          width: { xs: '100%', sm: 'auto' },
          fontSize: { xs: '0.8rem', sm: '1rem' },
        }}>
        Log Out
      </Button>
      {error && (
        <Typography variant="subtitle2" sx={{ color: 'danger.main' }}>
          {error}
        </Typography>
      )}

      {/* D3 visualization container */}
      <Box mt={4}>
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
          <div ref={d3Container} />
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
