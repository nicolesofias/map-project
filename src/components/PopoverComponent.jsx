import { Box, Popover, Typography } from '@mui/material'
import React from 'react'

const PopoverComponent = ({anchorEl, open, setOpen, info}) => {
  return (
        <Popover open={open} anchorEl={anchorEl} onClose={() =>  setOpen(false)}>
            {info.name !== "" && <Typography>name: {info.name}</Typography>}
            {info.description !== "" && <Typography>description: {info.description}</Typography>}
            {info.ruler !== "" && <Typography>ruler: {info.ruler}</Typography>}
            {info.established !== "" && <Typography>established: {info.established}</Typography>}
        </Popover>
  )
}

export default PopoverComponent