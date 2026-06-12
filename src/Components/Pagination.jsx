import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      <span className="text-muted small">
        Showing {meta.from} to {meta.to} of {meta.total} products
      </span>
      
      <ButtonGroup>

        <Button
          variant='outline-white'  
          className='pink-outline  bg-white p-3'
          disabled={meta.current_page === 1}
          onClick={() => onPageChange(meta.current_page - 1)}
        >
          &laquo;
        </Button>

        <Button variant='white' className='border bg-white p-3' disabled>
          {meta.current_page} / {meta.last_page}
        </Button>

        <Button
          variant='outline-white'  
          className='pink-outline  bg-white p-3' 
          disabled={meta.current_page === meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
        >
          &raquo;
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Pagination;