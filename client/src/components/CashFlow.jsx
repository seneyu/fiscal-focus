import React, { useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
// import { gql, useQuery } from '@apollo/client';
// const GET_BUDGET_PROGRESS = gql``;

const CashFlow = ({ date, expenses }) => {
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const total = () => {
      let sum = 0;
      expenses.forEach((entry, i) => {
        sum += entry.amount;
      });
      setTotalSpending(sum);
    };

    total();
  }, [expenses]);

  return (
    <div>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ padding: '2rem', flex: 1 }}>
          <Typography sx={{ typography: 'h4', color: 'success.light' }}>
            ${totalIncome}
          </Typography>
          <Typography sx={{ typography: 'subtitle1' }}>Total Income</Typography>
        </Card>
        <Card sx={{ padding: '2rem', flex: 1 }}>
          <Typography sx={{ typography: 'h4', color: 'error.light' }}>
            ${totalSpending}
          </Typography>
          <Typography sx={{ typography: 'subtitle1' }}>
            Total Spending
          </Typography>
        </Card>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Card sx={{ padding: '2rem' }}>
          <Typography sx={{ typography: 'subtitle2' }}>CASH FLOW</Typography>
          <Typography sx={{ typography: 'h6' }}>{date}</Typography>
        </Card>
      </Box>
    </div>
  );
};

export default CashFlow;
