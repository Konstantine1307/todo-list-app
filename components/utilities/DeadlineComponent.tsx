// components/DeadlineComponent.tsx
import React from 'react';

function formatDeadline(date: Date | string | number): string {
  const formattedDate = new Date(date);

  const day = formattedDate.getDate().toString().padStart(2, '0');
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = formattedDate.getFullYear().toString();

  const hour = formattedDate.getHours().toString().padStart(2, '0');
  const minute = formattedDate.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year}, ${hour}:${minute}`;
}

interface DeadlineComponentProps {
  deadline: Date | string | number;
}

const DeadlineComponent: React.FC<DeadlineComponentProps> = ({ deadline }) => {
  return <span>{formatDeadline(deadline)}</span>;
};

export default DeadlineComponent;
