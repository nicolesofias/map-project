import { Box, Popover, Typography } from '@mui/material'
import React from 'react'

const PopoverComponent = ({anchorEl, open, setOpen, info, setProperties}) => {
    const handleClose = () => {
        setProperties({
            name: info.name,
            description: info.description,
            ruler: info.ruler,
            established: info.established
        })
        setOpen(false);
    }
  return (
        <Popover open={open} anchorEl={anchorEl} onClose={handleClose}>
            {info.name !== "" && <Typography>name: {info.name}</Typography>}
            {info.description !== "" && <Typography>description: {info.description}</Typography>}
            {info.ruler !== "" && <Typography>ruler: {info.ruler}</Typography>}
            {info.established !== "" && <Typography>established: {info.established}</Typography>}
        </Popover>
  )
}

export default PopoverComponent