import { Box, Popover, Typography } from '@mui/material'
import React from 'react'

const PopoverComponent = ({anchorEl, open, setOpen, info, setProperties}) => {

    const handleClose = () => {
        setOpen(false);
        setProperties({
            name: "",
            description: "",
            ruler: "",
            established: ""
        })
    }
  return (
        <Popover open={open} anchorEl={anchorEl} onClose={handleClose}>
            {Object.keys(info).map((key) => (
                 info[key] !== "" && <Typography key={key}>{key}: {info[key]}</Typography>
            ))
            }
        </Popover>
  )
}

export default PopoverComponent